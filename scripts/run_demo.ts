import { guardrailRisks, summary, zoneLane } from "../src/services/azureLandingZoneDriftRadarService.js";

console.log("azure-landing-zone-drift-radar demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(
  JSON.stringify(
    zoneLane().map((lane) => ({
      lane: lane.lane,
      owner: lane.owner,
      status: lane.status
    })),
    null,
    2
  )
);
console.log(JSON.stringify(guardrailRisks().slice(0, 3), null, 2));
