// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { driftPackets, sampleLandingZonePayload, zoneLanePackets } from "../data/sampleLandingZone.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleLandingZonePayload, {
  now: NOW,
  staleDriftAfterHours: 24
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    zones: report.zones,
    currentBaselines: report.currentBaselines,
    drifts: report.drifts,
    guardrailDrifts: report.guardrailDrifts,
    networkDrifts: report.networkDrifts,
    identityDrifts: report.identityDrifts,
    highFindings: report.findingsList.filter((finding) => finding.severity === "high").length,
    recommendation:
      "Restore missing deny policies, close public ingress, remove direct owner drift, re-enable Defender, and refresh stale baselines before certifying the Azure landing zone healthy."
  };
}

export function zoneLane() {
  return zoneLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "policy-guardrails") {
        return finding.code === "policy-assignment-missing";
      }
      if (lane.id === "identity-posture") {
        return finding.code === "owner-role-drift";
      }
      if (lane.id === "network-perimeter") {
        return finding.code === "public-ingress-open" || finding.code === "hub-spoke-route-drift";
      }
      if (lane.id === "observability-coverage") {
        return finding.code === "diagnostic-settings-missing" || finding.code === "stale-baseline" || finding.code === "stale-drift-window";
      }
      return false;
    }).length
  }));
}

export function guardrailRisks() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.code === "public-ingress-open" || finding.code === "hub-spoke-route-drift"
          ? "Network Security"
          : finding.code === "owner-role-drift"
            ? "Azure IAM"
            : finding.code === "policy-assignment-missing"
              ? "Cloud Governance"
              : finding.code === "defender-plan-disabled"
                ? "Defender Operations"
                : "Platform Reliability"
    }));
}

export function driftPosture() {
  return driftPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline drift analyzer and CLI, not static copy alone.",
    "Landing-zone snapshots and drift packets are synthetic sample data only; no live Azure tenant credentials, subscriptions, or secrets are published.",
    "The control plane keeps policy, identity, network, logging, and Defender drift visible for Azure platform and security stakeholders.",
    "This surface demonstrates Azure landing-zone drift operations, not a generic cloud keyword page.",
    "It complements Entra, Intune, Microsoft 365, AWS, and GCP proof with a concrete Azure platform-governance lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    zoneLane: zoneLane(),
    guardrailRisks: guardrailRisks(),
    driftPosture: driftPosture(),
    verification: verification(),
    sample: sampleLandingZonePayload
  };
}
