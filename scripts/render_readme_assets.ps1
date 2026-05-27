$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Path $screenshots -Force | Out-Null

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Eyebrow,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $width = 1600
    $height = 900
    $bitmap = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
    $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect,
        ([System.Drawing.Color]::FromArgb(10, 18, 32)),
        ([System.Drawing.Color]::FromArgb(5, 7, 12)),
        90
    $graphics.FillRectangle($gradient, $rect)

    $cyanBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(25, 199, 255))
    $greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(55, 255, 139))
    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 198, 220))
    $linePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 120, 255, 170)), 2

    $eyebrowFont = New-Object System.Drawing.Font("Consolas", 20, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Segoe UI", 42, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Regular)

    $graphics.DrawString("Azure Landing Zone Drift Radar", $eyebrowFont, $greenBrush, 92, 92)
    $graphics.DrawString($Eyebrow, $eyebrowFont, $cyanBrush, 92, 140)
    $graphics.DrawString($Title, $titleFont, $textBrush, [System.Drawing.RectangleF]::new(92, 200, 1400, 180))
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, [System.Drawing.RectangleF]::new(92, 380, 1400, 120))

    $y = 530
    foreach ($bullet in $Bullets) {
        $graphics.FillEllipse($greenBrush, 100, $y + 10, 12, 12)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 128, $y)
        $y += 58
    }

    $graphics.DrawRectangle($linePen, 72, 72, 1456, 756)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Eyebrow "OVERVIEW" `
    -Title "Azure landing-zone drift, policy inheritance, and platform hygiene in one operator surface." `
    -Subtitle "Public ingress, owner drift, missing policy assignments, diagnostics gaps, stale baselines, and Defender posture in one Azure control plane." `
    -Bullets @(
        "Landing-zone snapshots stay tied to management-group and subscription owners.",
        "Guardrail drift is visible before audit, rollout, or admin expansion windows slip.",
        "Recruiter-facing Azure platform proof without exposing tenant credentials."
    )

New-ProofImage -Path (Join-Path $screenshots "02-zone-lane-proof.png") `
    -Eyebrow "ZONE LANE" `
    -Title "Owner-mapped Azure remediation lanes instead of raw platform exports." `
    -Subtitle "Each lane keeps focus, status, and next action visible for policy, identity, network, and observability teams." `
    -Bullets @(
        "Cloud Governance handles inheritance and deny-policy recovery.",
        "Azure IAM owns owner-role drift and privilege-path cleanup.",
        "Network Security restores perimeter integrity and firewall transit."
    )

New-ProofImage -Path (Join-Path $screenshots "03-guardrail-risks-proof.png") `
    -Eyebrow "GUARDRAIL RISKS" `
    -Title "The risk table stays specific: public ingress, owner drift, disabled Defender, and missing diagnostics." `
    -Subtitle "The lane is grounded in Azure landing-zone drift exports rather than generic cloud-security copy." `
    -Bullets @(
        "Resource paths stay visible for real platform triage.",
        "Severity ranking keeps high-impact drift first.",
        "Control-family framing makes cleanup ownership obvious."
    )

New-ProofImage -Path (Join-Path $screenshots "04-drift-posture-proof.png") `
    -Eyebrow "DRIFT POSTURE" `
    -Title "Remediation packets turn drift into a launch-ready cleanup queue." `
    -Subtitle "Packet completeness, blockers, and cleanup windows show what needs to clear before the landing zone is called healthy." `
    -Bullets @(
        "Policy, identity, perimeter, and telemetry packets stay separate.",
        "The system is shaped for real Azure platform-governance proof.",
        "It composes cleanly with Entra, Intune, M365, AWS, and GCP admin lanes."
    )
