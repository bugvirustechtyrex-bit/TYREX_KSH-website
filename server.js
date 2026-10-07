const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  let requested = decodeURIComponent(req.url.split("?")[0]);

  if (requested === "/" || requested === "") requested = "/index.html";

  // Prevent path traversal
  const filePath = path.join(ROOT, requested);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA/static-site fallback
      fs.readFile(path.join(ROOT, "index.html"), (fallbackErr, fallback) => {
        if (fallbackErr) {
          res.writeHead(500);
          return res.end("Server error");
        }
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(fallback);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=3600"
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`TYREX_KSH TECH website running on port ${PORT}`);
});
