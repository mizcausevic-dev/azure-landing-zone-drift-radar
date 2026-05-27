import type { DriftOptions, DriftReport, Finding, LandingZoneDrift, LandingZoneDriftExport, LandingZoneSnapshot } from "./types.js";

function isCurrent(snapshot: LandingZoneSnapshot): boolean {
  return snapshot.baselineStatus === "CURRENT";
}

function ownerDrift(drift: LandingZoneDrift): boolean {
  const state = `${drift.expectedState} ${drift.observedState}`.toLowerCase();
  return drift.controlFamily === "Identity" && state.includes("owner");
}

export function analyze(payload: LandingZoneDriftExport, options: DriftOptions = {}): DriftReport {
  const now = options.now ?? new Date().toISOString();
  const staleDriftAfterHours = options.staleDriftAfterHours ?? 24;
  const snapshots = payload.snapshots ?? [];
  const drifts = payload.drifts ?? [];
  const findingsList: Finding[] = [];

  const currentBaselines = snapshots.filter(isCurrent).length;
  if (currentBaselines === 0) {
    findingsList.push({
      code: "no-current-baseline",
      severity: "high",
      message: "No current Azure landing-zone baseline is available for drift review.",
      subject: "baseline-currentness"
    });
  }

  for (const snapshot of snapshots) {
    if (snapshot.baselineStatus === "STALE") {
      findingsList.push({
        code: "stale-baseline",
        severity: snapshot.zoneStatus === "CRITICAL" ? "high" : "medium",
        message: `Baseline snapshot for "${snapshot.name}" is stale and should be refreshed before certifying landing-zone posture.`,
        subject: snapshot.id,
        subjectName: snapshot.managementGroupPath,
        scope: snapshot.scope
      });
    }
  }

  for (const drift of drifts) {
    if (drift.internetExposure || drift.observedState.includes("0.0.0.0/0")) {
      findingsList.push({
        code: "public-ingress-open",
        severity: "high",
        message: `Internet-exposed ingress is active on "${drift.resourcePath}" and no longer matches the expected Azure landing-zone guardrail.`,
        subject: drift.id,
        subjectName: drift.resourcePath,
        scope: drift.scope,
        controlFamily: drift.controlFamily,
        resourceType: drift.resourceType
      });
    }

    if (ownerDrift(drift)) {
      findingsList.push({
        code: "owner-role-drift",
        severity: "high",
        message: `Owner-level identity drift is active on "${drift.resourcePath}" and should be rolled back before wider admin posture expands.`,
        subject: drift.id,
        subjectName: drift.resourcePath,
        scope: drift.scope,
        controlFamily: drift.controlFamily,
        resourceType: drift.resourceType
      });
    }

    if (
      drift.controlFamily === "Policy" &&
      drift.status === "REMOVED" &&
      drift.expectedState.toLowerCase().includes("deny")
    ) {
      findingsList.push({
        code: "policy-assignment-missing",
        severity: "high",
        message: `Required policy assignment is missing from "${drift.resourcePath}", weakening the Azure landing-zone guardrail pack.`,
        subject: drift.id,
        subjectName: drift.resourcePath,
        scope: drift.scope,
        controlFamily: drift.controlFamily,
        resourceType: drift.resourceType
      });
    }

    if (drift.controlFamily === "Defender" && drift.observedState.toLowerCase().includes("disabled")) {
      findingsList.push({
        code: "defender-plan-disabled",
        severity: "high",
        message: `Defender coverage is disabled on "${drift.resourcePath}" and should be restored before this zone is called healthy.`,
        subject: drift.id,
        subjectName: drift.resourcePath,
        scope: drift.scope,
        controlFamily: drift.controlFamily,
        resourceType: drift.resourceType
      });
    }

    if (drift.controlFamily === "Logging" && drift.observedState.toLowerCase().includes("missing")) {
      findingsList.push({
        code: "diagnostic-settings-missing",
        severity: "medium",
        message: `Diagnostic settings are missing on "${drift.resourcePath}", reducing auditability for Azure control-plane events.`,
        subject: drift.id,
        subjectName: drift.resourcePath,
        scope: drift.scope,
        controlFamily: drift.controlFamily,
        resourceType: drift.resourceType
      });
    }

    if (
      drift.controlFamily === "Connectivity" &&
      (drift.observedState.toLowerCase().includes("bypass firewall") ||
        (drift.note ?? "").toLowerCase().includes("bypass"))
    ) {
      findingsList.push({
        code: "hub-spoke-route-drift",
        severity: "high",
        message: `Hub-spoke connectivity drift is bypassing the expected firewall path on "${drift.resourcePath}".`,
        subject: drift.id,
        subjectName: drift.resourcePath,
        scope: drift.scope,
        controlFamily: drift.controlFamily,
        resourceType: drift.resourceType
      });
    }

    if (drift.changeWindowHours > staleDriftAfterHours) {
      findingsList.push({
        code: "stale-drift-window",
        severity: drift.changeWindowHours > staleDriftAfterHours * 2 ? "medium" : "low",
        message: `Drift on "${drift.resourcePath}" has remained unresolved for ${drift.changeWindowHours} hours.`,
        subject: drift.id,
        subjectName: drift.resourcePath,
        scope: drift.scope,
        controlFamily: drift.controlFamily,
        resourceType: drift.resourceType
      });
    }
  }

  const guardrailDrifts = drifts.filter((drift) => drift.breaksGuardrail).length;
  const networkDrifts = drifts.filter(
    (drift) => drift.controlFamily === "Network" || drift.controlFamily === "Connectivity"
  ).length;
  const identityDrifts = drifts.filter((drift) => drift.controlFamily === "Identity").length;
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    zones: snapshots.length,
    currentBaselines,
    drifts: drifts.length,
    guardrailDrifts,
    networkDrifts,
    identityDrifts,
    findingsList,
    ok
  };
}
