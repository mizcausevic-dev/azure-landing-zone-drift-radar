// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  driftPosture,
  guardrailRisks,
  payload,
  summary,
  verification,
  zoneLane
} from "./services/azureLandingZoneDriftRadarService.js";
import {
  renderDocs,
  renderDriftPosture,
  renderGuardrailRisks,
  renderOverview,
  renderVerification,
  renderZoneLane
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5516);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/zone-lane", (_req, res) => res.type("html").send(renderZoneLane()));
app.get("/guardrail-risks", (_req, res) => res.type("html").send(renderGuardrailRisks()));
app.get("/drift-posture", (_req, res) => res.type("html").send(renderDriftPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/zone-lane", (_req, res) => res.json(zoneLane()));
app.get("/api/guardrail-risks", (_req, res) => res.json(guardrailRisks()));
app.get("/api/drift-posture", (_req, res) => res.json(driftPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Azure Landing Zone Drift Radar listening on http://${host}:${port}`);
  });
}

export default app;
