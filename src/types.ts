// Operator surface for Azure landing-zone baselines and drift posture.
//
// Inputs reflect exported or captured Azure platform posture:
//   - landing-zone baseline snapshots
//   - drift events across policy, identity, network, logging, and defender controls

export type ScopeKind = "MANAGEMENT_GROUP" | "SUBSCRIPTION" | "PLATFORM";
export type ZoneHealth = "HEALTHY" | "WATCH" | "CRITICAL";
export type BaselineStatus = "CURRENT" | "STALE";
export type DriftStatus = "ADDED" | "REMOVED" | "CHANGED";
export type ControlFamily =
  | "Identity"
  | "Network"
  | "Policy"
  | "Logging"
  | "Defender"
  | "Connectivity"
  | "Recovery";

export type ResourceType =
  | "ManagementGroup"
  | "Subscription"
  | "PolicyAssignment"
  | "RoleAssignment"
  | "VirtualNetwork"
  | "NetworkSecurityGroup"
  | "RouteTable"
  | "KeyVault"
  | "LogAnalyticsWorkspace"
  | "DefenderPlan"
  | string;

export interface LandingZoneSnapshot {
  id: string;
  name: string;
  scope: ScopeKind;
  zoneStatus: ZoneHealth;
  baselineStatus: BaselineStatus;
  managementGroupPath: string;
  subscriptionId?: string;
  controlCount: number;
  owner: string;
  collectedAt: string;
}

export interface LandingZoneDrift {
  id: string;
  snapshotId: string;
  resourcePath: string;
  resourceType: ResourceType;
  scope: ScopeKind;
  controlFamily: ControlFamily;
  status: DriftStatus;
  expectedState: string;
  observedState: string;
  changeWindowHours: number;
  breaksGuardrail?: boolean;
  internetExposure?: boolean;
  impactsIdentity?: boolean;
  note?: string;
}

export interface LandingZoneDriftExport {
  snapshots?: LandingZoneSnapshot[];
  drifts?: LandingZoneDrift[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-baseline"
  | "stale-baseline"
  | "owner-role-drift"
  | "public-ingress-open"
  | "policy-assignment-missing"
  | "defender-plan-disabled"
  | "diagnostic-settings-missing"
  | "hub-spoke-route-drift"
  | "stale-drift-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  controlFamily?: ControlFamily;
  resourceType?: ResourceType;
}

export interface DriftReport {
  generatedAt: string;
  zones: number;
  currentBaselines: number;
  drifts: number;
  guardrailDrifts: number;
  networkDrifts: number;
  identityDrifts: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface DriftOptions {
  now?: string;
  staleDriftAfterHours?: number;
}
