"""NSCW CMS backend test suite.

Covers: auth (login/logout/me/brute-force lockout), users (admin only),
public + protected content (homepage/about), chronicle/reports/directory/team CRUD,
grievances submit/list/patch/delete, /stats.
"""
import os
import time
import uuid
import requests
import pytest
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dc1a1e03-a0ad-4916-a6d6-314eef90970d.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@nscw.nagaland.gov.in"
ADMIN_PASSWORD = "Nscw@2026"
EDITOR_EMAIL = "editor@nscw.nagaland.gov.in"
EDITOR_PASSWORD = "Editor@2026"


def _reset_lockouts():
    try:
        mc = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
        mc["nscw_cms"]["login_attempts"].delete_many({})
        mc.close()
    except Exception:
        pass


@pytest.fixture(scope="session", autouse=True)
def _clean_lockouts():
    _reset_lockouts()
    yield
    _reset_lockouts()


def _login(email, password):
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": email, "password": password}, timeout=15)
    return s, r


@pytest.fixture(scope="session")
def admin_session():
    _reset_lockouts()
    s, r = _login(ADMIN_EMAIL, ADMIN_PASSWORD)
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return s


@pytest.fixture(scope="session")
def editor_session():
    _reset_lockouts()
    s, r = _login(EDITOR_EMAIL, EDITOR_PASSWORD)
    if r.status_code != 200:
        pytest.skip(f"Editor login failed: {r.status_code} {r.text}")
    return s


# ---------------- Auth ----------------
class TestAuth:
    def test_root_ok(self):
        r = requests.get(f"{API}/", timeout=10)
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_login_admin_success_and_cookies(self):
        _reset_lockouts()
        s, r = _login(ADMIN_EMAIL, ADMIN_PASSWORD)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["user"]["email"] == ADMIN_EMAIL
        assert body["user"]["role"] == "admin"
        # cookies set
        cookie_names = {c.name for c in s.cookies}
        assert "access_token" in cookie_names
        assert "refresh_token" in cookie_names

    def test_login_invalid_password_returns_401(self):
        _reset_lockouts()
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WrongPass!1"}, timeout=10)
        assert r.status_code == 401

    def test_me_returns_user_with_cookie(self, admin_session):
        r = admin_session.get(f"{API}/auth/me", timeout=10)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_without_cookie_returns_401(self):
        r = requests.get(f"{API}/auth/me", timeout=10)
        assert r.status_code == 401

    def test_brute_force_lockout(self):
        _reset_lockouts()
        bogus_email = f"bogus_{uuid.uuid4().hex[:6]}@example.com"
        last = None
        for _ in range(6):
            last = requests.post(f"{API}/auth/login", json={"email": bogus_email, "password": "x"}, timeout=10)
        assert last.status_code in (401, 429)
        # next attempt must be locked
        r = requests.post(f"{API}/auth/login", json={"email": bogus_email, "password": "x"}, timeout=10)
        assert r.status_code == 429
        _reset_lockouts()

    def test_logout_clears_cookies(self):
        _reset_lockouts()
        s, r = _login(ADMIN_EMAIL, ADMIN_PASSWORD)
        assert r.status_code == 200
        r2 = s.post(f"{API}/auth/logout", timeout=10)
        assert r2.status_code == 200
        # access_token cookie should be cleared / unauthenticated now
        r3 = s.get(f"{API}/auth/me", timeout=10)
        assert r3.status_code == 401


# ---------------- Users ----------------
class TestUsers:
    def test_editor_cannot_list_users(self, editor_session):
        r = editor_session.get(f"{API}/users", timeout=10)
        assert r.status_code == 403

    def test_admin_can_list_users(self, admin_session):
        r = admin_session.get(f"{API}/users", timeout=10)
        assert r.status_code == 200
        emails = [u["email"] for u in r.json()]
        assert ADMIN_EMAIL in emails
        assert EDITOR_EMAIL in emails

    def test_admin_create_update_delete_user(self, admin_session):
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        r = admin_session.post(f"{API}/users", json={
            "email": email, "password": "TestPass1!", "name": "TEST_User", "role": "editor"
        }, timeout=10)
        assert r.status_code == 200, r.text
        uid = r.json()["id"]
        assert r.json()["email"] == email
        # update
        r2 = admin_session.patch(f"{API}/users/{uid}", json={"name": "TEST_Updated"}, timeout=10)
        assert r2.status_code == 200
        assert r2.json()["name"] == "TEST_Updated"
        # delete
        r3 = admin_session.delete(f"{API}/users/{uid}", timeout=10)
        assert r3.status_code == 200
        # verify removed
        r4 = admin_session.delete(f"{API}/users/{uid}", timeout=10)
        assert r4.status_code == 404

    def test_admin_cannot_delete_self(self, admin_session):
        me = admin_session.get(f"{API}/auth/me", timeout=10).json()
        r = admin_session.delete(f"{API}/users/{me['id']}", timeout=10)
        assert r.status_code == 400


# ---------------- Content (homepage / about) ----------------
class TestContent:
    def test_public_homepage(self):
        r = requests.get(f"{API}/content/homepage", timeout=10)
        assert r.status_code == 200
        assert "hero_heading_line_1" in r.json()

    def test_public_about(self):
        r = requests.get(f"{API}/content/about", timeout=10)
        assert r.status_code == 200
        assert "heading" in r.json()

    def test_editor_can_update_homepage(self, editor_session):
        cur = requests.get(f"{API}/content/homepage", timeout=10).json()
        cur["hero_eyebrow"] = "TEST_State Commission for Women"
        r = editor_session.put(f"{API}/content/homepage", json=cur, timeout=15)
        assert r.status_code == 200, r.text
        # verify persistence
        r2 = requests.get(f"{API}/content/homepage", timeout=10)
        assert r2.json()["hero_eyebrow"] == "TEST_State Commission for Women"
        # restore
        cur["hero_eyebrow"] = "State Commission for Women"
        editor_session.put(f"{API}/content/homepage", json=cur, timeout=15)

    def test_editor_can_update_about(self, editor_session):
        cur = requests.get(f"{API}/content/about", timeout=10).json()
        original = cur["heading"]
        cur["heading"] = "TEST_Heading"
        r = editor_session.put(f"{API}/content/about", json=cur, timeout=10)
        assert r.status_code == 200
        assert requests.get(f"{API}/content/about", timeout=10).json()["heading"] == "TEST_Heading"
        cur["heading"] = original
        editor_session.put(f"{API}/content/about", json=cur, timeout=10)

    def test_unauth_cannot_update_homepage(self):
        r = requests.put(f"{API}/content/homepage", json={}, timeout=10)
        assert r.status_code in (401, 422)


# ---------------- Chronicle ----------------
class TestChronicle:
    def test_list_chronicle(self):
        r = requests.get(f"{API}/chronicle", timeout=10)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_chronicle_full_crud(self, editor_session):
        slug = f"test-post-{uuid.uuid4().hex[:6]}"
        body = {
            "title": "TEST_Post", "slug": slug, "excerpt": "x", "body": "Test body.",
            "cover_image_url": "", "category": "Update", "published": True
        }
        r = editor_session.post(f"{API}/chronicle", json=body, timeout=10)
        assert r.status_code == 200, r.text
        pid = r.json()["id"]
        assert r.json()["slug"] == slug
        # slug uniqueness
        dup = editor_session.post(f"{API}/chronicle", json=body, timeout=10)
        assert dup.status_code == 400
        # verify GET by slug
        gr = requests.get(f"{API}/chronicle/{slug}", timeout=10)
        assert gr.status_code == 200
        # update
        body["title"] = "TEST_Post_Updated"
        ur = editor_session.put(f"{API}/chronicle/{pid}", json=body, timeout=10)
        assert ur.status_code == 200
        assert ur.json()["title"] == "TEST_Post_Updated"
        # delete
        dr = editor_session.delete(f"{API}/chronicle/{pid}", timeout=10)
        assert dr.status_code == 200


# ---------------- Reports ----------------
class TestReports:
    def test_list_reports(self):
        r = requests.get(f"{API}/reports", timeout=10)
        assert r.status_code == 200

    def test_reports_crud(self, editor_session):
        body = {"title": "TEST_Report", "year": 2026, "description": "d", "pdf_url": "/x.pdf", "published": True}
        r = editor_session.post(f"{API}/reports", json=body, timeout=10)
        assert r.status_code == 200
        rid = r.json()["id"]
        body["title"] = "TEST_Report_Updated"
        u = editor_session.put(f"{API}/reports/{rid}", json=body, timeout=10)
        assert u.status_code == 200
        assert u.json()["title"] == "TEST_Report_Updated"
        d = editor_session.delete(f"{API}/reports/{rid}", timeout=10)
        assert d.status_code == 200


# ---------------- Directory ----------------
class TestDirectory:
    def test_list_directory(self):
        r = requests.get(f"{API}/directory", timeout=10)
        assert r.status_code == 200

    def test_directory_crud(self, editor_session):
        body = {"district": "TEST_District", "center_name": "TEST_OSC", "address": "a", "phone": "1", "email": "t@x.in", "contact_person": "p"}
        r = editor_session.post(f"{API}/directory", json=body, timeout=10)
        assert r.status_code == 200
        eid = r.json()["id"]
        body["address"] = "updated"
        u = editor_session.put(f"{API}/directory/{eid}", json=body, timeout=10)
        assert u.status_code == 200
        assert u.json()["address"] == "updated"
        d = editor_session.delete(f"{API}/directory/{eid}", timeout=10)
        assert d.status_code == 200


# ---------------- Team ----------------
class TestTeam:
    def test_list_team(self):
        r = requests.get(f"{API}/team", timeout=10)
        assert r.status_code == 200

    def test_team_crud(self, editor_session):
        body = {"name": "TEST_Member", "title": "Member", "bio": "b", "photo_url": "", "order": 99}
        r = editor_session.post(f"{API}/team", json=body, timeout=10)
        assert r.status_code == 200
        mid = r.json()["id"]
        body["title"] = "Senior Member"
        u = editor_session.put(f"{API}/team/{mid}", json=body, timeout=10)
        assert u.status_code == 200
        assert u.json()["title"] == "Senior Member"
        d = editor_session.delete(f"{API}/team/{mid}", timeout=10)
        assert d.status_code == 200


# ---------------- Grievances ----------------
class TestGrievances:
    @pytest.fixture(scope="class")
    def submitted_id(self):
        body = {"name": "TEST_User", "email": "test@example.com", "phone": "1", "district": "Kohima",
                "subject": "TEST_Subject", "message": "Test message"}
        r = requests.post(f"{API}/grievances", json=body, timeout=10)
        assert r.status_code == 200, r.text
        return r.json()["id"]

    def test_public_submit(self, submitted_id):
        assert submitted_id

    def test_list_requires_auth(self):
        r = requests.get(f"{API}/grievances", timeout=10)
        assert r.status_code == 401

    def test_editor_can_list(self, editor_session, submitted_id):
        r = editor_session.get(f"{API}/grievances", timeout=10)
        assert r.status_code == 200
        ids = [g["id"] for g in r.json()]
        assert submitted_id in ids

    def test_patch_status(self, editor_session, submitted_id):
        r = editor_session.patch(f"{API}/grievances/{submitted_id}", params={"status": "resolved"}, timeout=10)
        assert r.status_code == 200
        assert r.json()["status"] == "resolved"

    def test_invalid_status_400(self, editor_session, submitted_id):
        r = editor_session.patch(f"{API}/grievances/{submitted_id}", params={"status": "bogus"}, timeout=10)
        assert r.status_code == 400

    def test_editor_cannot_delete(self, editor_session, submitted_id):
        r = editor_session.delete(f"{API}/grievances/{submitted_id}", timeout=10)
        assert r.status_code == 403

    def test_admin_can_delete(self, admin_session, submitted_id):
        r = admin_session.delete(f"{API}/grievances/{submitted_id}", timeout=10)
        assert r.status_code == 200


# ---------------- Stats ----------------
class TestStats:
    def test_stats_unauth_401(self):
        r = requests.get(f"{API}/stats", timeout=10)
        assert r.status_code == 401

    def test_stats_editor(self, editor_session):
        r = editor_session.get(f"{API}/stats", timeout=10)
        assert r.status_code == 200
        d = r.json()
        for k in ("chronicle_posts", "reports", "directory_entries", "team_members",
                  "grievances_total", "grievances_new", "users"):
            assert k in d
