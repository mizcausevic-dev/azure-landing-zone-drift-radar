import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { LandingZoneDriftExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): LandingZoneDriftExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as LandingZoneDriftExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts zones and drifts", () => {
    const report = analyze(fixture("azure-landing-zone-drift.json"), { now: NOW });
    expect(report.zones).toBe(2);
    expect(report.currentBaselines).toBe(1);
    expect(report.drifts).toBe(6);
  });

  it("flags missing current baseline as high", () => {
    const report = analyze({ snapshots: [], drifts: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-current-baseline")?.severity).toBe("high");
  });

  it("flags stale baselines", () => {
    const report = analyze(fixture("azure-landing-zone-drift.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "stale-baseline")?.subjectName).toContain("kg-analytics-sbx");
  });

  it("flags public ingress and owner drift", () => {
    const report = analyze(fixture("azure-landing-zone-drift.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "public-ingress-open")?.subjectName).toContain("nsg-edge-frontdoor");
    expect(report.findingsList.find((finding) => finding.code === "owner-role-drift")?.subjectName).toContain("roleAssignments");
  });

  it("flags missing policy assignments and disabled defender", () => {
    const report = analyze(fixture("azure-landing-zone-drift.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "policy-assignment-missing")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "defender-plan-disabled")).toBeDefined();
  });

  it("flags diagnostics gaps, route drift, and stale windows", () => {
    const report = analyze(fixture("azure-landing-zone-drift.json"), { now: NOW, staleDriftAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "diagnostic-settings-missing")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "hub-spoke-route-drift")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "stale-drift-window")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("azure-landing-zone-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("azure-landing-zone-drift.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("azure-landing-zone-drift.json"), { now: NOW }));
    expect(summary).toMatch(/zones/);
    expect(summary).toMatch(/drifts/);
  });
});
