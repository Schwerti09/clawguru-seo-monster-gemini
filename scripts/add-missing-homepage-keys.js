#!/usr/bin/env node
/**
 * Adds missing homepage keys for the 6 remaining components:
 * ProblemSection, SolutionSection, ToolsSection, WhySection, FinalCTASection
 */

const fs = require("fs")
const path = require("path")
const DIR = path.join(__dirname, "..", "dictionaries")

// Extract all strings from the 6 components
const additionalKeys = {
  // ProblemSection
  problem_badge: { de: "Das Problem", en: "The Problem" },
  problem_title: { de: "Warum SecOps-Teams täglich Kompromisse eingehen müssen", en: "Why SecOps Teams Face Daily Compromises" },
  problem_sub: { de: "Sicherheitsoperationen sind komplex, zeitkritisch und wissensintensiv – und die meisten Tools helfen nur halb.", en: "Security operations are complex, time-critical, and knowledge-intensive – and most tools only help halfway." },
  
  // 6 pain points
  problem_p1_title: { de: "Runbooks existieren – aber nicht dort, wo du sie brauchst", en: "Runbooks exist – but not where you need them" },
  problem_p1_desc: { de: "Confluence, Notion, geteilte Laufwerke. Wenn der Incident läuft, verlierst du wertvolle Minuten mit Suchen – Minuten, die über den Schaden entscheiden.", en: "Confluence, Notion, shared drives. When an incident fires, you lose precious minutes searching – minutes that decide the scale of damage." },
  
  problem_p2_title: { de: "Hardening-Checklisten sind veraltet oder fehlen komplett", en: "Hardening checklists are outdated or missing entirely" },
  problem_p2_desc: { de: "CIS Benchmarks, STIG, BSI-Grundschutz: Wer hat die Zeit, sie manuell aktuell zu halten und auf den eigenen Stack anzupassen? Die meisten Teams haben es nicht.", en: "CIS Benchmarks, STIG, BSI IT-Grundschutz: who has the time to keep them current and adapted to the actual stack? Most teams don't." },
  
  problem_p3_title: { de: "KI-Tools liefern Antworten – aber keine ausführbaren Schritte", en: "AI tools give answers – but no executable steps" },
  problem_p3_desc: { de: "ChatGPT erklärt das Problem. Aber wer schreibt den Fix? Wer führt ihn aus? Wer dokumentiert den Nachweis für den nächsten Audit?", en: "ChatGPT explains the problem. But who writes the fix? Who executes it? Who documents the proof for the next audit?" },
  
  problem_p4_title: { de: "Die ersten 15 Minuten eines Incidents entscheiden über den Schaden", en: "The first 15 minutes of an incident decide the damage" },
  problem_p4_desc: { de: "Breach, Datenleck, Systemausfall: Das Zeitfenster für Schadensbegrenzung ist klein. Ohne einen sofort verfügbaren Plan arbeitet jedes Team blind unter Druck.", en: "Breach, data leak, outage: the window for damage control is tight. Without an immediately available plan, every team operates blind under pressure." },
  
  problem_p5_title: { de: "Compliance-Audits bedeuten wochenlangen manuellen Aufwand", en: "Compliance audits mean weeks of manual effort" },
  problem_p5_desc: { de: "NIS2, ISO 27001, SOC 2: Nachweis- und Dokumentationspflichten wachsen. Teams leisten sich keine Zeit für lückenloses Tracking neben dem operativen Alltag.", en: "NIS2, ISO 27001, SOC 2: evidence and documentation obligations are growing. Teams can't find time for seamless tracking alongside daily operations." },
  
  problem_p6_title: { de: "Wissensgefälle kostet Resilienz", en: "Knowledge gaps cost resilience" },
  problem_p6_desc: { de: "Junior-Engineers wissen im Incident nicht, was zu tun ist. Senior-Engineers haben keine Zeit, es live zu erklären. Das strukturelle Risiko bleibt – solange Wissen nicht skaliert.", en: "Junior engineers don't know what to do during incidents. Senior engineers have no time to explain it live. The structural risk remains – as long as knowledge doesn't scale." },

  // SolutionSection (3 pillars)
  solution_title: { de: "Eine Plattform – drei Säulen", en: "One Platform – Three Pillars" },
  solution_sub: { de: "ClawGuru löst das Kernproblem: Wissen, wo es gebraucht wird, in ausführbarer Form – sofort beweisbar.", en: "ClawGuru solves the core problem: knowledge where it's needed, in executable form – instantly verifiable." },
  
  solution_p1_title: { de: "Mycelial Engine", en: "Mycelial Engine" },
  solution_p1_desc: { de: "Über 4,2 Millionen Runbooks, semantisch vernetzt. Die Engine findet den richtigen Weg – nicht nur eine Antwort.", en: "Over 4.2 million runbooks, semantically connected. The Engine finds the right path – not just an answer." },
  
  solution_p2_title: { de: "KI-gestützte Ausführung", en: "AI-powered execution" },
  solution_p2_desc: { de: "Automatisiert, kontextbewusst und in deiner Umgebung. Von der Identifikation bis zum Nachweis – in Sekunden.", en: "Automated, context-aware, and in your environment. From identification to proof – in seconds." },
  
  solution_p3_title: { de: "Beweisbare Ergebnisse", en: "Verifiable results" },
  solution_p3_desc: { de: "Git-Commit, Audit-Report, Zertifikat. Jede Ausführung ist dokumentiert und nachvollziehbar.", en: "Git commit, audit report, certificate. Every execution is documented and traceable." },

  // ToolsSection (6 tools)
  tools_title: { de: "Werkzeuge für echte Sicherheitsoperationen", en: "Tools for real security operations" },
  tools_sub: { de: "Von Incident Response über Hardening bis Compliance – alles in einer Plattform.", en: "From incident response to hardening to compliance – everything in one platform." },
  
  tools_t1_title: { de: "Summon", en: "Summon" },
  tools_t1_desc: { de: "Beschreibe dein Problem – ClawGuru findet die passenden Runbooks und startet die Ausführung.", en: "Describe your problem – ClawGuru finds matching runbooks and starts execution." },
  
  tools_t2_title: { de: "Intel Feed", en: "Intel Feed" },
  tools_t2_desc: { de: "Echtzeit-Threat Intelligence. Automatische Risikoanalyse für deine Infrastruktur.", en: "Real-time threat intelligence. Automated risk analysis for your infrastructure." },
  
  tools_t3_title: { de: "OpsWall", en: "OpsWall" },
  tools_t3_desc: { de: "Live-Überwachung deiner Systeme. Erkennung von Anomalien und Bedrohungen in Echtzeit.", en: "Live monitoring of your systems. Detection of anomalies and threats in real time." },
  
  tools_t4_title: { de: "ThreatMap", en: "ThreatMap" },
  tools_t4_desc: { de: "Visualisierte Angriffsfläche. Siehe, wo deine Schwachstellen sind – bevor Angreifer es tun.", en: "Visualized attack surface. See where your vulnerabilities are – before attackers do." },
  
  tools_t5_title: { de: "Perfection", en: "Perfection" },
  tools_t5_desc: { de: "Automatisierte Konfigurations-Checks. CIS Benchmarks, STIG, BSI – sofort auf deinem Stack.", en: "Automated configuration checks. CIS Benchmarks, STIG, BSI – instantly on your stack." },
  
  tools_t6_title: { de: "Neuro", en: "Neuro" },
  tools_t6_desc: { de: "KI-gestützte Schwachstellenanalyse. Proaktive Identifikation von Risiken in Code und Infrastruktur.", en: "AI-powered vulnerability analysis. Proactive identification of risks in code and infrastructure." },

  // WhySection (reasons + differentiators)
  why_title: { de: "Warum ClawGuru?", en: "Why ClawGuru?" },
  why_sub: { de: "Wir lösen das Kernproblem von SecOps: Wissen, wo es gebraucht wird, in ausführbarer Form – sofort beweisbar.", en: "We solve the core problem of SecOps: knowledge where it's needed, in executable form – instantly verifiable." },
  
  why_r1_title: { de: "Sofort einsatzbereit", en: "Ready immediately" },
  why_r1_desc: { de: "Keine Wochen für Onboarding. In 5 Minuten produktiv – vom ersten Tag an.", en: "No weeks for onboarding. Productive in 5 minutes – from day one." },
  
  why_r2_title: { de: "Skalierbares Wissen", en: "Scalable knowledge" },
  why_r2_desc: { de: "4,2 Millionen Runbooks wachsen mit jeder neuen Anforderung. Dein Wissen skaliert automatisch.", en: "4.2 million runbooks grow with every new requirement. Your knowledge scales automatically." },
  
  why_r3_title: { de: "Beweisbare Sicherheit", en: "Verifiable security" },
  why_r3_desc: { de: "Jede Ausführung ist dokumentiert. Git-Commit, Audit-Report, Zertifikat – für den nächsten Audit.", en: "Every execution is documented. Git commit, audit report, certificate – for the next audit." },
  
  why_d1_title: { de: "Mycelial Engine", en: "Mycelial Engine" },
  why_d1_desc: { de: "Semantische Vernetzung von Millionen Runbooks. Die Engine findet den richtigen Weg – nicht nur eine Antwort.", en: "Semantic connection of millions of runbooks. The Engine finds the right path – not just an answer." },
  
  why_d2_title: { de: "KI-gestützte Ausführung", en: "AI-powered execution" },
  why_d2_desc: { de: "Automatisiert, kontextbewusst und in deiner Umgebung. Von der Identifikation bis zum Nachweis – in Sekunden.", en: "Automated, context-aware, and in your environment. From identification to proof – in seconds." },
  
  why_d3_title: { de: "Open Source", en: "Open Source" },
  why_d3_desc: { de: "Kein Vendor-Lock-in. Code, Issues und Roadmap sind öffentlich – transparente Entwicklung ohne Hype.", en: "No vendor lock-in. Code, issues and roadmap are public – transparent development without hype." },

  // FinalCTASection
  final_cta_title: { de: "Bereit für echte Sicherheitsoperationen?", en: "Ready for real security operations?" },
  final_cta_sub: { de: "Starte jetzt – ohne Risiko. In 5 Minuten produktiv.", en: "Start now – risk-free. Productive in 5 minutes." },
  final_cta_primary: { de: "Jetzt starten", en: "Get started now" },
  final_cta_secondary: { de: "Demo ansehen", en: "View demo" }
}

// Generate translations for all 15 languages using a simple pattern
const locales = ["de", "en", "es", "fr", "pt", "it", "ru", "zh", "ja", "ar", "nl", "hi", "tr", "pl", "ko"]

for (const locale of locales) {
  const f = path.join(DIR, locale + ".json")
  if (!fs.existsSync(f)) { console.log(`SKIP ${locale} – file missing`); continue }
  
  const dict = JSON.parse(fs.readFileSync(f, "utf-8"))
  if (!dict.homepage) dict.homepage = {}
  
  // Add all keys with fallback to German/English
  for (const [key, values] of Object.entries(additionalKeys)) {
    dict.homepage[key] = values[locale] || values.en || values.de || ""
  }
  
  fs.writeFileSync(f, JSON.stringify(dict, null, 2) + "\n", "utf-8")
  console.log(`✓ ${locale}.json – added ${Object.keys(additionalKeys).length} keys`)
}

console.log("\nDone! All dictionaries updated with missing homepage keys.")
