const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8788);
const HOST = process.env.HOST || "0.0.0.0";
const AUTH_USER = process.env.SITE_USER || "";
const AUTH_PASS = process.env.SITE_PASS || "";
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const RECORDS = path.join(DATA_DIR, "records.json");
const EVIDENCES = path.join(DATA_DIR, "evidencias_minitab.json");
const TEXTS = path.join(DATA_DIR, "textos_resultados.json");

function ensure() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(RECORDS)) fs.writeFileSync(RECORDS, "[]", "utf8");
  if (!fs.existsSync(EVIDENCES)) fs.writeFileSync(EVIDENCES, "[]", "utf8");
  if (!fs.existsSync(TEXTS)) fs.writeFileSync(TEXTS, "{}", "utf8");
}
function readJson(file, fallback) {
  ensure();
  try { return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "")); }
  catch { return fallback; }
}
function writeJson(file, data) {
  ensure();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}
function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {"Content-Type":"application/json; charset=utf-8","Content-Length":Buffer.byteLength(body),"Cache-Control":"no-store","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type"});
  res.end(body);
}
function authorized(req) {
  if (!AUTH_USER || !AUTH_PASS) return true;
  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) return false;
  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const split = decoded.indexOf(":");
    const user = split >= 0 ? decoded.slice(0, split) : "";
    const pass = split >= 0 ? decoded.slice(split + 1) : "";
    return user === AUTH_USER && pass === AUTH_PASS;
  } catch {
    return false;
  }
}
function requestAuth(res) {
  res.writeHead(401, {
    "WWW-Authenticate": 'Basic realm="Resultados PIC Palhacoterapia"',
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end("Acesso restrito.");
}
function body(req) {
  return new Promise((resolve, reject) => {
    let out = "";
    req.on("data", chunk => {
      out += chunk;
      if (out.length > 80_000_000) {
        reject(new Error("Arquivo grande demais."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(out));
    req.on("error", reject);
  });
}
function type(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  if (file.endsWith(".csv")) return "text/csv; charset=utf-8";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (!authorized(req)) return requestAuth(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204, {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type"});
      res.end();
      return;
    }
    if (url.pathname === "/api/status") return sendJson(res, 200, { ok:true, records: readJson(RECORDS, []).length });
    if (url.pathname === "/api/records" && req.method === "GET") return sendJson(res, 200, readJson(RECORDS, []));
    if (url.pathname === "/api/records" && req.method === "PUT") {
      const rows = JSON.parse(await body(req));
      if (!Array.isArray(rows)) throw new Error("Base inválida.");
      writeJson(RECORDS, rows);
      return sendJson(res, 200, { ok:true, records: rows.length });
    }
    if (url.pathname === "/api/records/upsert" && req.method === "POST") {
      const record = JSON.parse(await body(req));
      if (!record || !record.id) throw new Error("Registro sem ID.");
      const rows = readJson(RECORDS, []);
      const idx = rows.findIndex(r => String(r.id) === String(record.id));
      if (idx >= 0) rows[idx] = record; else rows.push(record);
      writeJson(RECORDS, rows);
      return sendJson(res, 200, { ok:true, records: rows.length });
    }
    if (url.pathname.startsWith("/api/records/") && req.method === "DELETE") {
      const id = decodeURIComponent(url.pathname.replace("/api/records/", ""));
      const rows = readJson(RECORDS, []).filter(r => String(r.id) !== id);
      writeJson(RECORDS, rows);
      return sendJson(res, 200, { ok:true, records: rows.length });
    }
    if (url.pathname === "/api/evidences" && req.method === "GET") return sendJson(res, 200, readJson(EVIDENCES, []));
    if (url.pathname === "/api/evidences" && req.method === "POST") {
      const item = JSON.parse(await body(req));
      const rows = readJson(EVIDENCES, []);
      rows.unshift({ ...item, id: item.id || String(Date.now()), createdAt: new Date().toISOString() });
      writeJson(EVIDENCES, rows);
      return sendJson(res, 200, { ok:true, evidences: rows.length });
    }
    if (url.pathname.startsWith("/api/evidences/") && req.method === "DELETE") {
      const id = decodeURIComponent(url.pathname.replace("/api/evidences/", ""));
      const rows = readJson(EVIDENCES, []).filter(r => String(r.id) !== id);
      writeJson(EVIDENCES, rows);
      return sendJson(res, 200, { ok:true, evidences: rows.length });
    }
    if (url.pathname === "/api/texts" && req.method === "GET") return sendJson(res, 200, readJson(TEXTS, {}));
    if (url.pathname === "/api/texts" && req.method === "PUT") {
      const texts = JSON.parse(await body(req));
      writeJson(TEXTS, texts || {});
      return sendJson(res, 200, { ok:true });
    }
    const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    const full = path.normalize(path.join(ROOT, file));
    if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
      res.writeHead(404); res.end("Not found"); return;
    }
    const data = fs.readFileSync(full);
    res.writeHead(200, {"Content-Type": type(full), "Cache-Control":"no-store","Access-Control-Allow-Origin":"*"});
    res.end(data);
  } catch (err) {
    sendJson(res, 500, { ok:false, error: err.message });
  }
}).listen(PORT, HOST, () => console.log(`Resultados editável: http://${HOST === "0.0.0.0" ? "127.0.0.1" : HOST}:${PORT}`));
