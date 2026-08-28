import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { leads } from "./db/schema";
import { db, hasDatabase } from "./db";
import { leadSchema } from "../shared/validation";

const app = express();
const port = Number(process.env.PORT ?? 3002);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, database: hasDatabase ? "configured" : "not-configured" });
});

app.post("/api/leads", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  if (db) {
    await db.insert(leads).values(parsed.data);
  }

  return res.status(201).json({ ok: true, stored: Boolean(db) });
});

// Redirections 301 depuis les anciennes URL WordPress (préservation SEO).
const redirects: Record<string, string> = {
  "/azur": "/projets/azur",
  "/luxos-hills": "/projets/luxos-hills",
  "/cdm-tongandaku": "/projets/cdm-tongandaku",
  "/muasi-ya-talo-2026": "/projets/muasi-ya-talo-2026",
  "/muasi-ya-talo": "/projets/muasi-ya-talo-2026",
  "/cites-des-merveilles": "/projets/cite-des-merveilles",
  "/cite-des-merveilles": "/projets/cite-des-merveilles",
  "/peages-2": "/projets/peage",
  "/peage": "/projets/peage",
  "/luxos-c": "/projets/luxos-c"
};

app.get(/.*/, (req, res, next) => {
  const target = redirects[req.path.replace(/\/+$/, "") || "/"];
  if (target && target !== req.path) return res.redirect(301, target);
  return next();
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    return res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Luxos API listening on http://localhost:${port}`);
});
