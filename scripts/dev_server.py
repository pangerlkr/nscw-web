import http.server
import socketserver
import os
import sys

# Default PORT is 8080, can be overridden by first argument
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

# Mapping of Clean URL Slug -> Real HTML File
route_map = {
    "/": "Home.html",
    "/about": "About.html",
    "/legal-framework": "Legal_Framework.html",
    "/updates": "The_Chronicle.html",
    "/connect": "Connect.html",
    "/support": "Support.html",
    "/privacy": "Privacy.html",
    "/reports": "Reports.html",
    "/grievance": "Grievance.html"
}

# Mapping of Real File -> Clean Slug (for 301 upgrades) home special case handled separately
file_to_slug = {v: k for k, v in route_map.items()}

class NSCWCleanURLServer(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Console logging
        sys.stderr.write("%s - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format%args))

    def do_GET(self):
        # 1. Handle Clean URL Slug -> HTML file mapping (Internal Rewrite)
        parts = self.path.split('?')
        clean_path = parts[0].rstrip('/')
        if clean_path == "":
            clean_path = "/"
        
        # 2. Redirect .html requests to clean URLs (301)
        if clean_path.endswith('.html'):
            filename = os.path.basename(clean_path)
            if filename in file_to_slug:
                new_slug = file_to_slug[filename]
                if len(parts) > 1:
                    new_slug += "?" + parts[1]
                
                print(f"301 Redirecting: {self.path} -> {new_slug}")
                self.send_response(301)
                self.send_header('Location', new_slug)
                self.end_headers()
                return

        # 3. Handle Clean URL Slug -> HTML file mapping (Internal Rewrite)
        if clean_path in route_map:
            target_file = route_map[clean_path]
            print(f"Serving Clean URL: {self.path} via {target_file}")
            
            try:
                with open(target_file, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(content)
                return
            except FileNotFoundError:
                # If the mapped file is missing, fall through to 404
                pass

        # 4. Check if it's a physical file (CSS, JS, Images, etc.)
        if os.path.exists(self.translate_path(self.path)) and not os.path.isdir(self.translate_path(self.path)):
            super().do_GET()
            return

        # 5. Fallback: Serve custom 404.html
        print(f"404 Not Found: {self.path} -> Serving 404.html")
        try:
            with open("404.html", 'rb') as f:
                content = f.read()
            self.send_response(404)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404, "404 Page Not Found")

    def do_HEAD(self):
        super().do_HEAD()

if __name__ == "__main__":
    # Change working directory to public/
    if os.path.exists("public"):
        os.chdir("public")
    
    # Create the server
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), NSCWCleanURLServer) as httpd:
            print("\n" + "="*50)
            print(f"NSCW Web Platform Dev Server (Clean URLs)")
            print(f"Local URL: http://localhost:{PORT}")
            print("="*50)
            print("Configured Routes:")
            for slug, file in route_map.items():
                print(f"  {slug.ljust(18)} -> {file}")
            print("="*50 + "\n")
            sys.stdout.flush()
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48:
            print(f"\n[ERROR] Port {PORT} is already in use.")
            print(f"Try running with a different port: python3 dev_server.py 8085")
            print(f"Or kill the existing process: lsof -ti:{PORT} | xargs kill -9")
        else:
            raise e
    except KeyboardInterrupt:
        print("\nShutting down server.")
