import { describe, expect, test } from "vitest";

import {
  driftPosture,
  guardrailRisks,
  summary,
  verification,
  zoneLane
} from "./azureLandingZoneDriftRadarService.js";

describe("azureLandingZoneDriftRadarService", () => {
  test("summary reflects the sample Azure posture", () => {
    expect(summary()).toMatchObject({
      zones: 2,
      currentBaselines: 1,
      drifts: 6,
      guardrailDrifts: 5,
      networkDrifts: 2,
      identityDrifts: 1
    });
  });

  test("zone lane stays mapped to owners", () => {
    const lanes = zoneLane();
    expect(lanes).toHaveLength(4);
    expect(lanes.some((lane) => lane.lane === "Policy guardrail lane" && lane.owner === "Cloud Governance")).toBe(true);
  });

  test("guardrail risks sort high severity first", () => {
    const risks = guardrailRisks();
    expect(risks[0]?.severity).toBe("high");
    expect(risks.some((risk) => risk.code === "policy-assignment-missing")).toBe(true);
  });

  test("drift posture and verification stay populated", () => {
    expect(driftPosture()).toHaveLength(4);
    expect(verification().length).toBeGreaterThan(3);
  });
});
