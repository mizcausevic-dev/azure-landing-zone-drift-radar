import { describe, expect, test } from "vitest";

import {
  renderDocs,
  renderDriftPosture,
  renderGuardrailRisks,
  renderOverview,
  renderVerification,
  renderZoneLane
} from "./render.js";

describe("render", () => {
  test("overview carries the Azure control-plane framing", () => {
    expect(renderOverview()).toContain("Azure landing-zone drift");
  });

  test("secondary routes render their headings", () => {
    expect(renderZoneLane()).toContain("Zone Lane");
    expect(renderGuardrailRisks()).toContain("Guardrail Risks");
    expect(renderDriftPosture()).toContain("Drift Posture");
    expect(renderVerification()).toContain("Verification");
    expect(renderDocs()).toContain("Offline landing-zone drift analysis");
  });
});
