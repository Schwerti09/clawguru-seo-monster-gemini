import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return {
    title: locale === "de" 
      ? "Windows Server Security 2026 | Active Directory & Defender Hardening"
      : "Windows Server Security 2026 | Active Directory & Defender Hardening",
    description: locale === "de"
      ? "Windows Server Security: Active Directory, Group Policy, Defender for Endpoint, Credential Guard, AppLocker & Security Baselines."
      : "Windows Server security: Active Directory, Group Policy, Defender for Endpoint, Credential Guard, AppLocker & security baselines.",
    keywords: [
      "Windows Server security",
      "Windows hardening",
      "Active Directory security",
      "Group Policy security",
      "Defender for Endpoint",
      "Credential Guard",
      "AppLocker",
      "Windows Defender",
      "AD hardening",
      "Windows compliance",
    ],
    alternates: buildLocalizedAlternates(locale, "/windows-server-security"),
    openGraph: {
      images: ["/og-image.png"],
      title: "Windows Server Security 2026: AD & Defender Hardening",
      description: "Windows Server security with Active Directory, GPO, Defender & Credential Guard.",
      type: "article",
      url: `${BASE_URL}/${locale}/windows-server-security`,
    },
  };
}

export default async function WindowsSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Windows Server Security</h1>
            <p className="text-2xl text-blue-200 mb-4">AD & Defender Hardening 2026</p>
            <p className="text-xl text-white/80 mb-8">Active Directory, Group Policy, Defender for Endpoint, Credential Guard & AppLocker</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Active Directory</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Defender</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">GPO</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">AppLocker</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Active Directory Security Architecture</h2>
            <p className="text-gray-200 text-lg mb-6">
              Active Directory ist das Identitätszentrum von Windows-Umgebungen. Kompromittierte AD bedeutet vollständige Domänenkontrolle. Sichern Sie Forest, Domain Controller und Berechtigungsstrukturen mit Defense-in-Depth.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold text-blue-200 mb-2">AD Hardening</h3>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• Tier-Modell (Tier 0/1/2)</li>
                  <li>• Admin Forest (ESAE)</li>
                  <li>• Privileged Access Workstations</li>
                  <li>• Just-in-Time Admin</li>
                </ul>
              </div>
              <div className="bg-indigo-900 border border-indigo-700 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-200 mb-2">Authentication</h3>
                <ul className="text-sm text-indigo-300 space-y-1">
                  <li>• Windows Hello for Business</li>
                  <li>• FIDO2/Passwordless</li>
                  <li>• Smart Cards</li>
                  <li>• NTLM Restrictions</li>
                </ul>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="font-semibold text-gray-100 mb-2">Monitoring</h3>
                <ul className="text-sm text-gray-100 space-y-1">
                  <li>• Advanced Audit Policies</li>
                  <li>• Defender for Identity</li>
                  <li>• Event Forwarding</li>
                  <li>• SIEM Integration</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Group Policy Security Baselines</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# PowerShell - Deploy Security Baseline GPOs

# Import Security Compliance Toolkit baselines
Import-GPO -BackupGpoName "MSFT Windows Server 2022 - Domain Controller" \\\n  -Path "C:\\SecurityBaselines" \\\n  -TargetName "Production DC Baseline" \\\n  -CreateIfNeeded

# Computer Configuration - Security Settings
$ComputerSettings = @{
    # Account Policies
    "PasswordPolicy/MinimumPasswordLength" = 14
    "PasswordPolicy/PasswordComplexity" = 1
    "PasswordPolicy/MaximumPasswordAge" = 60
    "PasswordPolicy/MinimumPasswordAge" = 1
    "PasswordPolicy/PasswordHistorySize" = 24
    
    # Account Lockout
    "AccountLockoutPolicy/AccountLockoutThreshold" = 5
    "AccountLockoutPolicy/AccountLockoutDuration" = 30
    "AccountLockoutPolicy/ResetAccountLockoutCounterAfter" = 30
    
    # Audit Policy
    "AuditPolicy/AccountLogon" = "Success,Failure"
    "AuditPolicy/AccountManagement" = "Success,Failure"
    "AuditPolicy/LogonEvents" = "Success,Failure"
    "AuditPolicy/ObjectAccess" = "Failure"
    "AuditPolicy/PolicyChange" = "Success,Failure"
    "AuditPolicy/PrivilegeUse" = "Failure"
    "AuditPolicy/ProcessTracking" = "Success,Failure"
    "AuditPolicy/SystemEvents" = "Success,Failure"
    
    # User Rights Assignment
    "UserRights/SeTrustedCredManAccessPrivilege" = @()  # No one
    "UserRights/SeNetworkLogonRight" = @("Authenticated Users")
    "UserRights/SeDenyNetworkLogonRight" = @("Guests")
    "UserRights/SeRemoteInteractiveLogonRight" = @("Domain Admins", "Remote Desktop Users")
    
    # Security Options
    "SecurityOptions/LSAProtection" = 1
    "SecurityOptions/LAPS" = 1
    "SecurityOptions/CredentialGuard" = 1
    "SecurityOptions/DeviceGuard" = 1
    "SecurityOptions/HVCI" = 1
    
    # Windows Defender
    "Defender/RealTimeProtection" = 1
    "Defender/CloudProtection" = 1
    "Defender/SubmitSamplesConsent" = 1
    "Defender/PUAProtection" = 1
    "Defender/AttackSurfaceReduction" = 1
}

# Deploy via GPO
$GPO = Get-GPO -Name "Security Baseline"
foreach ($Setting in $ComputerSettings.GetEnumerator()) {
    Set-GPRegistryValue -Name $GPO.DisplayName \\\n        -Key "HKLM\\Software\\Policies\\Microsoft\\Windows\\$($Setting.Key)" \\\n        -ValueName $Setting.Key.Split('/')[-1] \\\n        -Value $Setting.Value
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Credential Guard & Device Guard</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Enable Credential Guard (via GPO or DSC)

# GPO Path: Computer Configuration > Administrative Templates > System > Device Guard
# Policy: Turn On Virtualization Based Security
# Settings: Enabled with UEFI lock

# PowerShell - Enable Credential Guard
$RegPath = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard"
New-Item -Path $RegPath -Force
Set-ItemProperty -Path $RegPath -Name "EnableVirtualizationBasedSecurity" -Value 1
Set-ItemProperty -Path $RegPath -Name "RequirePlatformSecurityFeatures" -Value 1  # Secure Boot + DMA
Set-ItemProperty -Path $RegPath -Name "HypervisorEnforcedCodeIntegrity" -Value 1
Set-ItemProperty -Path $RegPath -Name "LsaCfgFlags" -Value 2  # UEFI lock

# Verify Credential Guard
Get-WmiObject -Namespace "root\\cimv2\\security\\MicrosoftTpm" -Class Win32_Tpm
msinfo32.exe  # Check "Device Guard Security Services Running"

# Enable Windows Defender Application Control (WDAC)
# Create policy with PowerShell
New-CIPolicy -FilePath "C:\\WDAC\\policy.xml" \\\n    -Rules "Hash" \\\n    -UserPEs \\\n    -ScanPath "C:\\Program Files" \\\n    -Level FilePublisher

# Convert to binary
ConvertFrom-CIPolicy -XmlFilePath "C:\\WDAC\\policy.xml" -BinaryFilePath "C:\\WDAC\\policy.bin"

# Deploy via GPO (copy to SYSVOL)
Copy-Item "C:\\WDAC\\policy.bin" \\\n    "\\\\domain.local\\sysvol\\domain.local\\Policies\\PolicyDefinitions\\WindowsDefenderApplicationControl.bin"

# AppLocker Configuration (backup to WDAC)
Set-Service -Name AppIDSvc -StartupType Automatic
Start-Service -Name AppIDSvc

# Create AppLocker Rules
New-AppLockerPolicy -RuleType Path,Hash,Publisher \\\n    -User Everyone \\\n    -XmlPolicy "C:\\AppLocker\\policy.xml"

# Enforce AppLocker
Set-AppLockerPolicy -XmlPolicy "C:\\AppLocker\\policy.xml" -Merge`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Active Directory Tier Model</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# AD Tier Model Implementation

# Tier 0: Forest/Domain Admins (No internet, dedicated PAWs)
# Tier 1: Server Admins (Protected servers)
# Tier 2: Workstation Admins (User workstations)

# OU Structure
New-ADOrganizationalUnit -Name "Tier 0" -Path "DC=corp,DC=local"
New-ADOrganizationalUnit -Name "Tier 1" -Path "DC=corp,DC=local"
New-ADOrganizationalUnit -Name "Tier 2" -Path "DC=corp,DC=local"
New-ADOrganizationalUnit -Name "Privileged Access Workstations" -Path "OU=Tier 0,DC=corp,DC=local"

# Tier 0 Group Policy (most restrictive)
$Tier0GPO = New-GPO -Name "Tier 0 - Domain Controllers" -Comment "Tier 0 Security Settings"
Set-GPLink -Name $Tier0GPO.DisplayName -Target "OU=Domain Controllers,DC=corp,DC=local" -Enforced Yes

# Tier 0 Restrictions
Set-GPRegistryValue -Name $Tier0GPO.DisplayName \\\n    -Key "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" \\\n    -ValueName "LocalAccountTokenFilterPolicy" \\\n    -Type DWord -Value 0

# Block Tier 0 accounts from Tier 1/2
$DenyTier0 = @"
{
    "Name": "Deny Tier 0 to Tier 1/2",
    "UserRights": {
        "SeDenyNetworkLogonRight": ["CORP\\Tier 0 Admins"],
        "SeDenyInteractiveLogonRight": ["CORP\\Tier 0 Admins"],
        "SeDenyRemoteInteractiveLogonRight": ["CORP\\Tier 0 Admins"]
    }
}
"@

# Authentication Policies (Windows Server 2016+)
New-ADAuthenticationPolicy -Name "Tier 0 Auth Policy" \\\n    -Enforce -UserTGTLifetime 60 \\\n    -ComputerTGTLifetime 240

# Silos
New-ADAuthenticationPolicySilo -Name "Tier 0 Silo" \\\n    -AuthenticationPolicy "Tier 0 Auth Policy" \\\n    -UserCategory Membership \\\n    -ComputerCategory Membership

# Fine-Grained Password Policy for Admins
New-ADFineGrainedPasswordPolicy -Name "Admin Password Policy" \\\n    -MinPasswordLength 16 \\\n    -PasswordComplexityEnabled $true \\\n    -MinPasswordAge "1.00:00:00" \\\n    -MaxPasswordAge "30.00:00:00" \\\n    -PasswordHistoryCount 24 \\\n    -LockoutThreshold 3 \\\n    -LockoutDuration "00:30:00" \\\n    -LockoutObservationWindow "00:30:00"

Add-ADFineGrainedPasswordPolicySubject -Identity "Admin Password Policy" \\\n    -Subjects "Domain Admins", "Enterprise Admins", "Tier 0 Admins"`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Defender for Endpoint Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Microsoft Defender for Endpoint - Intune/Configuration Profile

# ASR (Attack Surface Reduction) Rules
$ASRRules = @{
    # Block Office apps from creating child processes
    "75668C1F-73B5-4CF0-BB93-3ECF5CB7CC84" = 1
    
    # Block Office apps from creating executable content
    "3B576869-A4EC-4529-8536-B800A3967B3B" = 1
    
    # Block all Office apps from injecting code into other processes
    "D3E037E1-3EB8-44C8-A917-57927947596D" = 1
    
    # Block JavaScript/VBScript from launching downloaded executable content
    "D4F940AB-401B-4EFC-AADC-AD5F3C50688A" = 1
    
    # Block execution of potentially obfuscated scripts
    "5BEB7EFE-FD9A-4556-801D-A275C435748C" = 1
    
    # Block Win32 API calls from Office macros
    "92E97FA1-2EDF-4476-BDD6-9DD0B4DDDC7B" = 1
    
    # Block process creations originating from PSExec and WMI commands
    "D1E49AAC-8F56-4280-B9BA-993A6D77406C" = 1
    
    # Block credential stealing from the Windows local security authority subsystem (lsass.exe)
    "9E6C4E1F-7D60-472F-BA1A-A39EF4210F4A" = 1
    
    # Block persistence through WMI event subscription
    "E6DB77E5-3DF2-4CF1-B95A-636979351E5B" = 1
}

# Deploy via Intune or GPO
foreach ($Rule in $ASRRules.GetEnumerator()) {
    Set-MpPreference -AttackSurfaceReductionRules_Ids $Rule.Key \\\n                     -AttackSurfaceReductionRules_Actions $Rule.Value
}

# Enable Exploit Guard
Set-MpPreference -EnableExploitProtectionAuditMode $false
Set-MpPreference -EnableNetworkProtection 1  # Block mode
Set-MpPreference -EnableControlledFolderAccess 1  # Protect Documents/Desktop

# Controlled Folder Access allowed apps
Add-MpPreference -ControlledFolderAccessAllowedApplications "C:\\Program Files\\App\\app.exe"

# Network Protection
Set-MpPreference -EnableNetworkProtection 1

# PUA Protection
Set-MpPreference -PUAProtection 1

# Cloud-delivered protection
Set-MpPreference -MAPSReporting Advanced
Set-MpPreference -SubmitSamplesConsent Always

# Check status
Get-MpComputerStatus | Select-Object \\\n    RealTimeProtectionEnabled, \\\n    OnAccessProtectionEnabled, \\\n    BehaviorMonitorEnabled, \\\n    AntivirusSignatureLastUpdated

# Defender Antivirus Exclusions (minimal!)
Add-MpPreference -ExclusionPath "C:\\ProgramData\\CustomApp\\Logs"
Add-MpPreference -ExclusionProcess "CustomApp.exe"

# Windows Defender Firewall (GPO)
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
Set-NetFirewallProfile -DefaultInboundAction Block -DefaultOutboundAction Allow`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Windows Security Checklist</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Active Directory</h3>
                  {[
                    "Tier Model implemented (0/1/2)",
                    "Privileged Access Workstations deployed",
                    "Fine-grained password policies configured",
                    "Authentication policies/silos enabled",
                    "LAPS deployed on all machines",
                    "AD Recycle Bin enabled",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Endpoint Protection</h3>
                  {[
                    "Credential Guard enabled (UEFI lock)",
                    "Device Guard / HVCI enabled",
                    "Defender for Endpoint onboarded",
                    "ASR rules enabled (block mode)",
                    "Application Control (WDAC/AppLocker)",
                    "Exploit protection configured",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Windows Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-blue-700 rounded-lg font-semibold">Assessment Starten</a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/openclaw-security-check`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">OpenClaw Security Hub</a>
              <a href={`${prefix}/ai-agent-security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">AI Agent Security</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>

          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Windows Server Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
