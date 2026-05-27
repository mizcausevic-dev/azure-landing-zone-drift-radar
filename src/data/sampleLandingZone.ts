import type { LandingZoneDriftExport } from "../types.js";

export const sampleLandingZonePayload: LandingZoneDriftExport = {
  snapshots: [
    {
      id: "zone-corp-prod",
      name: "Corp Prod Landing Zone",
      scope: "MANAGEMENT_GROUP",
      zoneStatus: "WATCH",
      baselineStatus: "CURRENT",
      managementGroupPath: "/providers/Microsoft.Management/managementGroups/kg-corp-prod",
      controlCount: 47,
      owner: "Azure Platform Engineering",
      collectedAt: "2026-05-29T14:00:00Z"
    },
    {
      id: "zone-analytics-sbx",
      name: "Analytics Sandbox Zone",
      scope: "SUBSCRIPTION",
      zoneStatus: "CRITICAL",
      baselineStatus: "STALE",
      managementGroupPath: "/providers/Microsoft.Management/managementGroups/kg-analytics-sbx",
      subscriptionId: "1c6f73b3-66cf-41be-b0af-2ebfd10b1c44",
      controlCount: 31,
      owner: "Data Platform",
      collectedAt: "2026-05-26T02:15:00Z"
    }
  ],
  drifts: [
    {
      id: "drift-public-nsg",
      snapshotId: "zone-corp-prod",
      resourcePath:
        "/subscriptions/2f91d9f9-e629-46cb-8b62-d82f93de31f0/resourceGroups/rg-edge-prod/providers/Microsoft.Network/networkSecurityGroups/nsg-edge-frontdoor",
      resourceType: "NetworkSecurityGroup",
      scope: "SUBSCRIPTION",
      controlFamily: "Network",
      status: "CHANGED",
      expectedState: "Inbound allowlist restricted to AzureFrontDoor.Backend and VPN ranges",
      observedState: "Inbound HTTPS open to 0.0.0.0/0",
      changeWindowHours: 11,
      breaksGuardrail: true,
      internetExposure: true,
      note: "Temporary rule never rolled back after partner cutover."
    },
    {
      id: "drift-owner-role",
      snapshotId: "zone-corp-prod",
      resourcePath:
        "/subscriptions/2f91d9f9-e629-46cb-8b62-d82f93de31f0/providers/Microsoft.Authorization/roleAssignments/ops-contractor-owner",
      resourceType: "RoleAssignment",
      scope: "SUBSCRIPTION",
      controlFamily: "Identity",
      status: "ADDED",
      expectedState: "Owner assignments limited to PIM-backed platform-admin group",
      observedState: "Owner granted to direct user contractor@partnerops.io",
      changeWindowHours: 6,
      breaksGuardrail: true,
      impactsIdentity: true
    },
    {
      id: "drift-policy-assignment",
      snapshotId: "zone-analytics-sbx",
      resourcePath:
        "/providers/Microsoft.Management/managementGroups/kg-analytics-sbx/providers/Microsoft.Authorization/policyAssignments/deny-public-ip-paas",
      resourceType: "PolicyAssignment",
      scope: "MANAGEMENT_GROUP",
      controlFamily: "Policy",
      status: "REMOVED",
      expectedState: "Deny public IP assignment on PaaS workloads",
      observedState: "Policy assignment missing from landing-zone inheritance",
      changeWindowHours: 42,
      breaksGuardrail: true
    },
    {
      id: "drift-defender-plan",
      snapshotId: "zone-analytics-sbx",
      resourcePath:
        "/subscriptions/1c6f73b3-66cf-41be-b0af-2ebfd10b1c44/providers/Microsoft.Security/pricings/VirtualMachines",
      resourceType: "DefenderPlan",
      scope: "SUBSCRIPTION",
      controlFamily: "Defender",
      status: "CHANGED",
      expectedState: "Defender for Servers Plan 2 enabled",
      observedState: "Disabled during sandbox cost cut",
      changeWindowHours: 77,
      breaksGuardrail: true
    },
    {
      id: "drift-diagnostics",
      snapshotId: "zone-corp-prod",
      resourcePath:
        "/subscriptions/2f91d9f9-e629-46cb-8b62-d82f93de31f0/resourceGroups/rg-secrets-prod/providers/Microsoft.KeyVault/vaults/kv-payments-prod",
      resourceType: "KeyVault",
      scope: "SUBSCRIPTION",
      controlFamily: "Logging",
      status: "CHANGED",
      expectedState: "Diagnostic settings shipping AuditEvent and AllMetrics to central LAW",
      observedState: "Missing diagnostic settings",
      changeWindowHours: 28
    },
    {
      id: "drift-route-bypass",
      snapshotId: "zone-corp-prod",
      resourcePath:
        "/subscriptions/2f91d9f9-e629-46cb-8b62-d82f93de31f0/resourceGroups/rg-net-prod/providers/Microsoft.Network/routeTables/rt-spoke-checkout",
      resourceType: "RouteTable",
      scope: "SUBSCRIPTION",
      controlFamily: "Connectivity",
      status: "CHANGED",
      expectedState: "Default route forced through hub firewall",
      observedState: "0.0.0.0/0 next hop bypass firewall to Internet",
      changeWindowHours: 19,
      breaksGuardrail: true,
      note: "Spoke UDR bypass introduced during incident workaround."
    }
  ]
};

export const zoneLanePackets = [
  {
    id: "policy-guardrails",
    lane: "Policy guardrail lane",
    owner: "Cloud Governance",
    focus: "Deny assignments and landing-zone inheritance",
    status: "red",
    note: "Management-group inheritance drift is weakening the Azure baseline.",
    nextAction: "Restore required deny assignments and re-run baseline capture."
  },
  {
    id: "identity-posture",
    lane: "Identity lane",
    owner: "Azure IAM",
    focus: "Owner role assignments and PIM hygiene",
    status: "red",
    note: "Direct user owner drift is live in the production zone.",
    nextAction: "Revoke direct owner grant and force role path back through PIM groups."
  },
  {
    id: "network-perimeter",
    lane: "Network perimeter lane",
    owner: "Network Security",
    focus: "NSGs, UDRs, and firewall path integrity",
    status: "red",
    note: "Public ingress and hub-spoke bypass both need cleanup.",
    nextAction: "Close open ingress and restore firewall transit routes."
  },
  {
    id: "observability-coverage",
    lane: "Observability lane",
    owner: "Platform Reliability",
    focus: "Diagnostics, logs, and stale baseline freshness",
    status: "yellow",
    note: "Key telemetry coverage and snapshot cadence have drifted.",
    nextAction: "Restore diagnostics and refresh stale zone baselines."
  }
] as const;

export const driftPackets = [
  {
    packetId: "AZ-PA-14",
    lane: "Policy assignment recovery",
    owner: "Cloud Governance",
    status: "red",
    completenessScore: 61,
    decisionNote: "Deny-public-IP guardrail is missing from analytics sandbox inheritance.",
    blocker: "Landing-zone inheritance is incomplete across the affected management group.",
    launchWindowHours: 12
  },
  {
    packetId: "AZ-ID-07",
    lane: "Owner role rollback",
    owner: "Azure IAM",
    status: "red",
    completenessScore: 58,
    decisionNote: "Direct contractor owner access is active outside the approved PIM path.",
    blocker: "Owner privilege needs rollback before the next admin change window.",
    launchWindowHours: 8
  },
  {
    packetId: "AZ-NW-22",
    lane: "Perimeter repair",
    owner: "Network Security",
    status: "red",
    completenessScore: 64,
    decisionNote: "NSG ingress and UDR bypass both drifted away from the expected hub firewall design.",
    blocker: "Firewall path must be restored before external traffic posture is called healthy.",
    launchWindowHours: 10
  },
  {
    packetId: "AZ-OB-31",
    lane: "Baseline and telemetry refresh",
    owner: "Platform Reliability",
    status: "yellow",
    completenessScore: 79,
    decisionNote: "Diagnostics and stale baselines can clear once the logging lane is reattached.",
    blocker: "Key Vault diagnostics and stale sandbox baseline need one coordinated refresh cycle.",
    launchWindowHours: 24
  }
] as const;
