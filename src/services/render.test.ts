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
    const html = renderOverview();
    expect(html).toContain("Azure landing-zone drift");
    expect(html).toContain("Product depth");
    expect(html).toContain("What these repos have in common");
    expect(html).toContain("buyer value");
    expect(html).toContain("portfolio.kineticgain.com");
    expect(html).toContain("suite.kineticgain.com");
  });

  test("secondary routes render their headings", () => {
    expect(renderZoneLane()).toContain("Zone Lane");
    expect(renderGuardrailRisks()).toContain("Guardrail Risks");
    expect(renderDriftPosture()).toContain("Drift Posture");
    expect(renderVerification()).toContain("Verification");
    expect(renderDocs()).toContain("Offline landing-zone drift analysis");
  });
});
