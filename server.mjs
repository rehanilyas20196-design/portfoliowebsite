import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".webm": "video/webm",
  ".wasm": "application/wasm",
  ".hdr": "application/octet-stream",
  ".enc": "application/octet-stream",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
};

async function sendFile(res, filePath) {
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("not a file");
    const data = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath)] || "application/octet-stream",
      "Content-Length": data.length,
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    return false;
  }
  return true;
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/_vercel/insights/script.js" || pathname === "/_vercel/speed-insights/script.js") {
    res.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-cache" });
    res.end("");
    return;
  }

  if (pathname.startsWith("/api/")) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
    return;
  }

  const filePath = normalize(join(ROOT, pathname === "/" ? "index.html" : pathname));
  if (filePath.startsWith(ROOT) && (await sendFile(res, filePath))) return;

  const index = join(ROOT, "index.html");
  if (await sendFile(res, index)) return;

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
}).listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
