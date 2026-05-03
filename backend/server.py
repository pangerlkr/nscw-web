from dotenv import load_dotenv
load_dotenv()

import os
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Literal
from bson import ObjectId

from fastapi import FastAPI, HTTPException, Depends, Request, Response, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient

# ---------- Config ----------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = "HS256"
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="NSCW CMS API")

# CORS: allow frontend origin + preview URL. Accept both localhost and the external preview URL.
allowed_origins = [FRONTEND_URL, "http://localhost:3000"]
# Also accept all preview URLs via regex to cover the emergent preview hostnames
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.preview\.emergentagent\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin role required")
    return user


def require_editor_or_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") not in ("admin", "editor"):
        raise HTTPException(status_code=403, detail="Editor or admin role required")
    return user


# ---------- Models ----------
class LoginBody(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str
    role: Literal["admin", "editor"]


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[Literal["admin", "editor"]] = None
    password: Optional[str] = None


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    created_at: Optional[datetime] = None


def user_to_out(u: dict) -> dict:
    return {
        "id": u["_id"],
        "email": u["email"],
        "name": u.get("name", ""),
        "role": u.get("role", "editor"),
        "created_at": u.get("created_at"),
    }


# ---------- Content Models ----------
class HomepageContent(BaseModel):
    hero_eyebrow: str = "State Commission for Women"
    hero_heading_line_1: str = "Empowering Women,"
    hero_heading_line_2: str = "Advancing Nagaland"
    hero_subheading: str = "Documenting progress, defending rights, and curating the future of equity across the hills of our vibrant state."
    hero_image_url: str = "https://picsum.photos/seed/nagaland-hero/1920/1080"
    hero_cta_primary: str = "Start Journey"
    hero_cta_primary_link: str = "/about"
    hero_cta_secondary: str = "View Annual Reports"
    hero_cta_secondary_link: str = "/reports"

    mandate_eyebrow: str = "Institutional Mandate"
    mandate_heading: str = "A Legacy of Protection and Systemic Advocacy."
    mandate_body_1: str = "The Nagaland State Commission for Women serves as the statutory guardian of women's rights, established to monitor, investigate, and advocate for the social and legal elevation of every woman in our state."
    mandate_body_2: str = "Our work transcends mere documentation; we curate the narrative of progress by bridging the gap between customary heritage and modern constitutional rights."
    mandate_quote: str = "Empowerment is not a destination, but a curated journey of resilience that begins with the acknowledgement of every woman's worth."
    mandate_quote_author: str = "Office of the Chairperson"

    pillar_1_title: str = "Legal Protection"
    pillar_1_body: str = "Direct legal intervention and monitoring of constitutional safeguards for women's security."
    pillar_1_icon: str = "verified_user"
    pillar_1_link: str = "/legal-framework"

    pillar_2_title: str = "District Support"
    pillar_2_body: str = "Comprehensive One Stop Centres (OSCs) active in major district headquarters for crisis response."
    pillar_2_icon: str = "location_city"
    pillar_2_link: str = "/support"

    pillar_3_title: str = "Annual Records"
    pillar_3_body: str = "Meticulous documentation and analysis of institutional performance and the state of gender equality."
    pillar_3_icon: str = "analytics"
    pillar_3_link: str = "/reports"

    cta_eyebrow: str = "Ready to Engage?"
    cta_heading: str = "Your safety is our priority."
    cta_body: str = "Access the Grievance Portal to report systemic issues or seek help through our legal advocacy network."
    cta_button_text: str = "Submit a Grievance"
    cta_button_link: str = "/grievance"


class AboutContent(BaseModel):
    eyebrow: str = "Our Mission"
    heading: str = "Guardians of Equity, Architects of Change"
    body: str = "The Nagaland State Commission for Women (NSCW) is a statutory body constituted by the Government of Nagaland to safeguard and promote the rights and interests of women across the state."
    vision: str = "A Nagaland where every woman is empowered with dignity, safety, and equal opportunity."
    mission: str = "To protect, advocate, and advance the rights of women through legal frameworks, institutional support, and community engagement."


class ChroniclePost(BaseModel):
    id: Optional[str] = None
    title: str
    slug: str
    excerpt: str = ""
    body: str
    cover_image_url: str = ""
    category: str = "Update"
    published: bool = True
    published_at: Optional[datetime] = None


class ReportItem(BaseModel):
    id: Optional[str] = None
    title: str
    year: int
    description: str = ""
    pdf_url: str
    published: bool = True


class DirectoryEntry(BaseModel):
    id: Optional[str] = None
    district: str
    center_name: str
    address: str = ""
    phone: str = ""
    email: str = ""
    contact_person: str = ""


class TeamMember(BaseModel):
    id: Optional[str] = None
    name: str
    title: str
    bio: str = ""
    photo_url: str = ""
    order: int = 0


class GrievanceIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    district: Optional[str] = None
    subject: str
    message: str


# ---------- Startup ----------
@app.on_event("startup")
async def startup():
    # indexes
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.chronicle_posts.create_index("slug", unique=True)
    await db.grievances.create_index([("created_at", -1)])

    # seed admin + editor
    async def ensure_user(email, password, name, role):
        existing = await db.users.find_one({"email": email})
        if existing is None:
            await db.users.insert_one({
                "_id": str(uuid.uuid4()),
                "email": email,
                "password_hash": hash_password(password),
                "name": name,
                "role": role,
                "created_at": datetime.now(timezone.utc),
            })
        elif not verify_password(password, existing["password_hash"]):
            await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})

    await ensure_user(
        os.environ.get("ADMIN_EMAIL", "admin@nscw.nagaland.gov.in"),
        os.environ.get("ADMIN_PASSWORD", "Nscw@2026"),
        "NSCW Admin",
        "admin",
    )
    await ensure_user(
        os.environ.get("EDITOR_EMAIL", "editor@nscw.nagaland.gov.in"),
        os.environ.get("EDITOR_PASSWORD", "Editor@2026"),
        "NSCW Editor",
        "editor",
    )

    # seed default homepage + about content
    if not await db.site_content.find_one({"_id": "homepage"}):
        await db.site_content.insert_one({"_id": "homepage", **HomepageContent().model_dump()})
    if not await db.site_content.find_one({"_id": "about"}):
        await db.site_content.insert_one({"_id": "about", **AboutContent().model_dump()})

    # seed chronicle samples
    if await db.chronicle_posts.count_documents({}) == 0:
        now = datetime.now(timezone.utc)
        samples = [
            {
                "_id": str(uuid.uuid4()),
                "title": "NSCW Launches District-Wide Awareness Campaign",
                "slug": "district-wide-awareness-campaign",
                "excerpt": "A state-spanning initiative reaches all 16 districts, empowering women with legal literacy and support channels.",
                "body": "The Nagaland State Commission for Women launched an ambitious awareness campaign reaching every district in the state. The initiative focuses on legal literacy, One Stop Centre accessibility, and grievance redressal mechanisms.",
                "cover_image_url": "https://picsum.photos/seed/nscw-1/1200/800",
                "category": "Initiative",
                "published": True,
                "published_at": now,
            },
            {
                "_id": str(uuid.uuid4()),
                "title": "Annual Report 2024-25 Released",
                "slug": "annual-report-2024-25",
                "excerpt": "A detailed chronicle of institutional progress, interventions, and the state of gender equity across Nagaland.",
                "body": "NSCW has released its comprehensive Annual Report for 2024-25, documenting over 1,200 interventions, 45 legal consultations, and systemic improvements to the Grievance Portal.",
                "cover_image_url": "https://picsum.photos/seed/nscw-2/1200/800",
                "category": "Report",
                "published": True,
                "published_at": now - timedelta(days=12),
            },
            {
                "_id": str(uuid.uuid4()),
                "title": "Memorandum of Understanding with Legal Services Authority",
                "slug": "mou-legal-services-authority",
                "excerpt": "A new partnership expands pro-bono legal support for women across Nagaland.",
                "body": "NSCW signed an MoU with the Nagaland State Legal Services Authority to expand free legal aid, counselling, and representation for women-centric cases.",
                "cover_image_url": "https://picsum.photos/seed/nscw-3/1200/800",
                "category": "Partnership",
                "published": True,
                "published_at": now - timedelta(days=30),
            },
        ]
        await db.chronicle_posts.insert_many(samples)

    if await db.reports.count_documents({}) == 0:
        await db.reports.insert_many([
            {"_id": str(uuid.uuid4()), "title": "Annual Report 2024-25", "year": 2025, "description": "Comprehensive institutional chronicle covering initiatives, grievance resolutions and policy advocacy.", "pdf_url": "/NL-NSCW-Act.pdf", "published": True},
            {"_id": str(uuid.uuid4()), "title": "Annual Report 2023-24", "year": 2024, "description": "Legacy record of interventions and systemic reforms.", "pdf_url": "/NL-NSCW-Act.pdf", "published": True},
        ])

    if await db.directory.count_documents({}) == 0:
        await db.directory.insert_many([
            {"_id": str(uuid.uuid4()), "district": "Kohima", "center_name": "One Stop Centre Kohima", "address": "Near Civil Hospital, Kohima", "phone": "+91-370-2222222", "email": "osc.kohima@nscw.in", "contact_person": "Centre Administrator"},
            {"_id": str(uuid.uuid4()), "district": "Dimapur", "center_name": "One Stop Centre Dimapur", "address": "District HQ Complex, Dimapur", "phone": "+91-3862-232323", "email": "osc.dimapur@nscw.in", "contact_person": "Centre Administrator"},
            {"_id": str(uuid.uuid4()), "district": "Mokokchung", "center_name": "One Stop Centre Mokokchung", "address": "Town Main Road, Mokokchung", "phone": "+91-369-2226611", "email": "osc.mokokchung@nscw.in", "contact_person": "Centre Administrator"},
            {"_id": str(uuid.uuid4()), "district": "Tuensang", "center_name": "One Stop Centre Tuensang", "address": "District HQ, Tuensang", "phone": "+91-3861-220099", "email": "osc.tuensang@nscw.in", "contact_person": "Centre Administrator"},
        ])

    if await db.team.count_documents({}) == 0:
        await db.team.insert_many([
            {"_id": str(uuid.uuid4()), "name": "Smt. Kekhrienuo Mor", "title": "Chairperson", "bio": "Presiding over the Commission with a vision of equity and empowerment.", "photo_url": "/images/Kekhrienuo-Mor.jpg", "order": 1},
            {"_id": str(uuid.uuid4()), "name": "Smt. Akokla Longchar", "title": "Member", "bio": "Dedicated member contributing to the Commission's advocacy work.", "photo_url": "/images/Akokla-Longchar.jpg", "order": 2},
            {"_id": str(uuid.uuid4()), "name": "Secretary, NSCW", "title": "Secretary", "bio": "Administrative head coordinating institutional operations.", "photo_url": "/images/Secretary.jpeg", "order": 3},
        ])


# ---------- Auth routes ----------
@api.post("/auth/login")
async def login(body: LoginBody, request: Request, response: Response):
    email = body.email.lower()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"

    # brute-force check
    attempts = await db.login_attempts.find_one({"_id": identifier})
    if attempts and attempts.get("count", 0) >= 5 and attempts.get("locked_until") and attempts["locked_until"] > datetime.now(timezone.utc):
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again later.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        # increment attempts
        await db.login_attempts.update_one(
            {"_id": identifier},
            {
                "$inc": {"count": 1},
                "$set": {"locked_until": datetime.now(timezone.utc) + timedelta(minutes=15)},
            },
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # success: clear attempts
    await db.login_attempts.delete_one({"_id": identifier})
    access = create_access_token(user["_id"], user["email"], user["role"])
    refresh = create_refresh_token(user["_id"])
    set_auth_cookies(response, access, refresh)
    return {"user": user_to_out(user), "access_token": access}


@api.post("/auth/logout")
async def logout(response: Response, user: dict = Depends(get_current_user)):
    clear_auth_cookies(response)
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user_to_out(user)


@api.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(user["_id"], user["email"], user["role"])
        response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
        return {"ok": True}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# ---------- Users (admin only) ----------
@api.get("/users")
async def list_users(user: dict = Depends(require_admin)):
    users = await db.users.find({}, {"password_hash": 0}).to_list(length=200)
    return [user_to_out(u) for u in users]


@api.post("/users")
async def create_user(body: UserCreate, user: dict = Depends(require_admin)):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    doc = {
        "_id": str(uuid.uuid4()),
        "email": email,
        "password_hash": hash_password(body.password),
        "name": body.name,
        "role": body.role,
        "created_at": datetime.now(timezone.utc),
    }
    await db.users.insert_one(doc)
    return user_to_out(doc)


@api.patch("/users/{user_id}")
async def update_user(user_id: str, body: UserUpdate, user: dict = Depends(require_admin)):
    update = {}
    if body.name is not None:
        update["name"] = body.name
    if body.role is not None:
        update["role"] = body.role
    if body.password:
        update["password_hash"] = hash_password(body.password)
    if not update:
        raise HTTPException(status_code=400, detail="Nothing to update")
    result = await db.users.find_one_and_update({"_id": user_id}, {"$set": update}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return user_to_out(result)


@api.delete("/users/{user_id}")
async def delete_user(user_id: str, user: dict = Depends(require_admin)):
    if user_id == user["_id"]:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    result = await db.users.delete_one({"_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}


# ---------- Public content routes ----------
@api.get("/content/homepage")
async def get_homepage():
    doc = await db.site_content.find_one({"_id": "homepage"}, {"_id": 0})
    return doc or HomepageContent().model_dump()


@api.put("/content/homepage")
async def update_homepage(body: HomepageContent, user: dict = Depends(require_editor_or_admin)):
    await db.site_content.update_one({"_id": "homepage"}, {"$set": body.model_dump()}, upsert=True)
    return body.model_dump()


@api.get("/content/about")
async def get_about():
    doc = await db.site_content.find_one({"_id": "about"}, {"_id": 0})
    return doc or AboutContent().model_dump()


@api.put("/content/about")
async def update_about(body: AboutContent, user: dict = Depends(require_editor_or_admin)):
    await db.site_content.update_one({"_id": "about"}, {"$set": body.model_dump()}, upsert=True)
    return body.model_dump()


# ---------- Chronicle posts ----------
def _post_out(p: dict) -> dict:
    return {
        "id": p["_id"],
        "title": p["title"],
        "slug": p["slug"],
        "excerpt": p.get("excerpt", ""),
        "body": p.get("body", ""),
        "cover_image_url": p.get("cover_image_url", ""),
        "category": p.get("category", "Update"),
        "published": p.get("published", True),
        "published_at": p.get("published_at"),
    }


@api.get("/chronicle")
async def list_chronicle(published_only: bool = False):
    q = {"published": True} if published_only else {}
    posts = await db.chronicle_posts.find(q).sort("published_at", -1).to_list(length=200)
    return [_post_out(p) for p in posts]


@api.get("/chronicle/{slug}")
async def get_chronicle(slug: str):
    p = await db.chronicle_posts.find_one({"slug": slug})
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    return _post_out(p)


@api.post("/chronicle")
async def create_chronicle(body: ChroniclePost, user: dict = Depends(require_editor_or_admin)):
    slug = body.slug.strip().lower().replace(" ", "-")
    if await db.chronicle_posts.find_one({"slug": slug}):
        raise HTTPException(status_code=400, detail="Slug already exists")
    doc = {
        "_id": str(uuid.uuid4()),
        "title": body.title,
        "slug": slug,
        "excerpt": body.excerpt,
        "body": body.body,
        "cover_image_url": body.cover_image_url,
        "category": body.category,
        "published": body.published,
        "published_at": body.published_at or datetime.now(timezone.utc),
    }
    await db.chronicle_posts.insert_one(doc)
    return _post_out(doc)


@api.put("/chronicle/{post_id}")
async def update_chronicle(post_id: str, body: ChroniclePost, user: dict = Depends(require_editor_or_admin)):
    update = body.model_dump(exclude={"id"})
    update["slug"] = update["slug"].strip().lower().replace(" ", "-")
    result = await db.chronicle_posts.find_one_and_update({"_id": post_id}, {"$set": update}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="Post not found")
    return _post_out(result)


@api.delete("/chronicle/{post_id}")
async def delete_chronicle(post_id: str, user: dict = Depends(require_editor_or_admin)):
    r = await db.chronicle_posts.delete_one({"_id": post_id})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"ok": True}


# ---------- Reports ----------
def _report_out(r: dict) -> dict:
    return {
        "id": r["_id"],
        "title": r["title"],
        "year": r["year"],
        "description": r.get("description", ""),
        "pdf_url": r["pdf_url"],
        "published": r.get("published", True),
    }


@api.get("/reports")
async def list_reports(published_only: bool = False):
    q = {"published": True} if published_only else {}
    items = await db.reports.find(q).sort("year", -1).to_list(length=200)
    return [_report_out(r) for r in items]


@api.post("/reports")
async def create_report(body: ReportItem, user: dict = Depends(require_editor_or_admin)):
    doc = {
        "_id": str(uuid.uuid4()),
        "title": body.title,
        "year": body.year,
        "description": body.description,
        "pdf_url": body.pdf_url,
        "published": body.published,
    }
    await db.reports.insert_one(doc)
    return _report_out(doc)


@api.put("/reports/{report_id}")
async def update_report(report_id: str, body: ReportItem, user: dict = Depends(require_editor_or_admin)):
    update = body.model_dump(exclude={"id"})
    result = await db.reports.find_one_and_update({"_id": report_id}, {"$set": update}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="Report not found")
    return _report_out(result)


@api.delete("/reports/{report_id}")
async def delete_report(report_id: str, user: dict = Depends(require_editor_or_admin)):
    r = await db.reports.delete_one({"_id": report_id})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"ok": True}


# ---------- Directory ----------
def _dir_out(d: dict) -> dict:
    return {
        "id": d["_id"],
        "district": d["district"],
        "center_name": d["center_name"],
        "address": d.get("address", ""),
        "phone": d.get("phone", ""),
        "email": d.get("email", ""),
        "contact_person": d.get("contact_person", ""),
    }


@api.get("/directory")
async def list_directory():
    items = await db.directory.find({}).sort("district", 1).to_list(length=200)
    return [_dir_out(d) for d in items]


@api.post("/directory")
async def create_directory(body: DirectoryEntry, user: dict = Depends(require_editor_or_admin)):
    doc = {"_id": str(uuid.uuid4()), **body.model_dump(exclude={"id"})}
    await db.directory.insert_one(doc)
    return _dir_out(doc)


@api.put("/directory/{entry_id}")
async def update_directory(entry_id: str, body: DirectoryEntry, user: dict = Depends(require_editor_or_admin)):
    update = body.model_dump(exclude={"id"})
    result = await db.directory.find_one_and_update({"_id": entry_id}, {"$set": update}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="Entry not found")
    return _dir_out(result)


@api.delete("/directory/{entry_id}")
async def delete_directory(entry_id: str, user: dict = Depends(require_editor_or_admin)):
    r = await db.directory.delete_one({"_id": entry_id})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"ok": True}


# ---------- Team ----------
def _team_out(t: dict) -> dict:
    return {
        "id": t["_id"],
        "name": t["name"],
        "title": t["title"],
        "bio": t.get("bio", ""),
        "photo_url": t.get("photo_url", ""),
        "order": t.get("order", 0),
    }


@api.get("/team")
async def list_team():
    items = await db.team.find({}).sort("order", 1).to_list(length=200)
    return [_team_out(t) for t in items]


@api.post("/team")
async def create_team(body: TeamMember, user: dict = Depends(require_editor_or_admin)):
    doc = {"_id": str(uuid.uuid4()), **body.model_dump(exclude={"id"})}
    await db.team.insert_one(doc)
    return _team_out(doc)


@api.put("/team/{member_id}")
async def update_team(member_id: str, body: TeamMember, user: dict = Depends(require_editor_or_admin)):
    update = body.model_dump(exclude={"id"})
    result = await db.team.find_one_and_update({"_id": member_id}, {"$set": update}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="Member not found")
    return _team_out(result)


@api.delete("/team/{member_id}")
async def delete_team(member_id: str, user: dict = Depends(require_editor_or_admin)):
    r = await db.team.delete_one({"_id": member_id})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"ok": True}


# ---------- Grievances ----------
def _griev_out(g: dict) -> dict:
    return {
        "id": g["_id"],
        "name": g["name"],
        "email": g["email"],
        "phone": g.get("phone"),
        "district": g.get("district"),
        "subject": g["subject"],
        "message": g["message"],
        "status": g.get("status", "new"),
        "created_at": g.get("created_at"),
    }


@api.post("/grievances")
async def submit_grievance(body: GrievanceIn):
    doc = {
        "_id": str(uuid.uuid4()),
        **body.model_dump(),
        "status": "new",
        "created_at": datetime.now(timezone.utc),
    }
    await db.grievances.insert_one(doc)
    return {"ok": True, "id": doc["_id"]}


@api.get("/grievances")
async def list_grievances(user: dict = Depends(require_editor_or_admin)):
    items = await db.grievances.find({}).sort("created_at", -1).to_list(length=500)
    return [_griev_out(g) for g in items]


@api.patch("/grievances/{grievance_id}")
async def update_grievance_status(grievance_id: str, status: str, user: dict = Depends(require_editor_or_admin)):
    allowed = {"new", "in_review", "resolved", "dismissed"}
    if status not in allowed:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.grievances.find_one_and_update({"_id": grievance_id}, {"$set": {"status": status}}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="Grievance not found")
    return _griev_out(result)


@api.delete("/grievances/{grievance_id}")
async def delete_grievance(grievance_id: str, user: dict = Depends(require_admin)):
    r = await db.grievances.delete_one({"_id": grievance_id})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Grievance not found")
    return {"ok": True}


# ---------- Dashboard stats ----------
@api.get("/stats")
async def stats(user: dict = Depends(require_editor_or_admin)):
    return {
        "chronicle_posts": await db.chronicle_posts.count_documents({}),
        "reports": await db.reports.count_documents({}),
        "directory_entries": await db.directory.count_documents({}),
        "team_members": await db.team.count_documents({}),
        "grievances_total": await db.grievances.count_documents({}),
        "grievances_new": await db.grievances.count_documents({"status": "new"}),
        "users": await db.users.count_documents({}),
    }


@api.get("/")
async def root():
    return {"name": "NSCW CMS API", "ok": True}


app.include_router(api)
