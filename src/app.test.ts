import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "./app.js";

describe("app", () => {
  test("serves overview and docs", async () => {
    const overview = await request(app).get("/");
    expect(overview.status).toBe(200);
    expect(overview.text).toContain("Azure landing-zone drift");

    const docs = await request(app).get("/docs");
    expect(docs.status).toBe(200);
    expect(docs.text).toContain("Offline landing-zone drift analysis");
  });

  test("serves summary and sample apis", async () => {
    const summary = await request(app).get("/api/dashboard/summary");
    expect(summary.status).toBe(200);
    expect(summary.body.zones).toBe(2);

    const sample = await request(app).get("/api/sample");
    expect(sample.status).toBe(200);
    expect(sample.body.sample.snapshots).toHaveLength(2);
  });

  test("serves secondary HTML routes", async () => {
    const routes = [
      ["/zone-lane", "Zone Lane"],
      ["/guardrail-risks", "Guardrail Risks"],
      ["/drift-posture", "Drift Posture"],
      ["/verification", "Verification"]
    ] as const;

    for (const [route, marker] of routes) {
      const response = await request(app).get(route);
      expect(response.status).toBe(200);
      expect(response.text).toContain(marker);
    }
  });

  test("serves operator API routes", async () => {
    const zoneLaneResponse = await request(app).get("/api/zone-lane");
    expect(zoneLaneResponse.status).toBe(200);
    expect(zoneLaneResponse.body[0]).toHaveProperty("id");
    expect(zoneLaneResponse.body[0]).toHaveProperty("relatedFindings");

    const guardrailResponse = await request(app).get("/api/guardrail-risks");
    expect(guardrailResponse.status).toBe(200);
    expect(guardrailResponse.body[0]).toHaveProperty("code");
    expect(guardrailResponse.body[0]).toHaveProperty("owner");

    const postureResponse = await request(app).get("/api/drift-posture");
    expect(postureResponse.status).toBe(200);
    expect(postureResponse.body[0]).toHaveProperty("packetId");

    const verificationResponse = await request(app).get("/api/verification");
    expect(verificationResponse.status).toBe(200);
    expect(verificationResponse.body[0]).toContain("offline drift analyzer");
  });
});
