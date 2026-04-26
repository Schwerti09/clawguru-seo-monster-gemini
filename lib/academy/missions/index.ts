import type { Mission } from "../missionEngine"
import { nginxHstsMission } from "./nginx-hsts"
import { sshHardeningMission } from "./ssh-hardening"
import { ufwFirewallMission } from "./ufw-firewall"
import { letsEncryptMission } from "./lets-encrypt"
import { misconfigHuntMission } from "./misconfig-hunt"
import { dockerNonrootMission } from "./docker-nonroot"
import { postgresHardeningMission } from "./postgres-hardening"
import { reverseProxyRatelimitMission } from "./reverse-proxy-ratelimit"
import { backupRestoreDrillMission } from "./backup-restore-drill"
import { secretsRotationMission } from "./secrets-rotation"

// Mission registry. Add new missions here; they become instantly routable via
// /academy/mission/[slug]. Mission metadata on the hub + track pages is pulled
// from MISSION_INDEX below, which associates each mission with a track.
export const MISSIONS: Record<string, Mission> = {
  [nginxHstsMission.slug]:        nginxHstsMission,
  [sshHardeningMission.slug]:     sshHardeningMission,
  [ufwFirewallMission.slug]:      ufwFirewallMission,
  [letsEncryptMission.slug]:      letsEncryptMission,
  [misconfigHuntMission.slug]:    misconfigHuntMission,
  [dockerNonrootMission.slug]:        dockerNonrootMission,
  [postgresHardeningMission.slug]:    postgresHardeningMission,
  [reverseProxyRatelimitMission.slug]:reverseProxyRatelimitMission,
  [backupRestoreDrillMission.slug]:   backupRestoreDrillMission,
  [secretsRotationMission.slug]:      secretsRotationMission,
}

export interface MissionIndexEntry {
  slug: string
  track: string
  order: number
  xp: number
  durationMin: number
  accent: "emerald" | "blue" | "red" | "cyan" | "amber" | "violet" | "pink" | "lime"
}

// Stable ordering + metadata per track. Single source of truth for track pages.
export const MISSION_INDEX: MissionIndexEntry[] = [
  // Foundations (beginner) — Linux + nginx basics
  { slug: "nginx-hsts",         track: "beginner",     order: 1, xp: 120, durationMin: 5,  accent: "emerald" },
  { slug: "ssh-hardening",      track: "beginner",     order: 2, xp: 140, durationMin: 6,  accent: "emerald" },
  { slug: "ufw-firewall",       track: "beginner",     order: 3, xp: 130, durationMin: 5,  accent: "emerald" },
  { slug: "lets-encrypt",       track: "beginner",     order: 4, xp: 150, durationMin: 7,  accent: "emerald" },
  { slug: "misconfig-hunt",     track: "beginner",     order: 5, xp: 160, durationMin: 8,  accent: "emerald" },
  // Stack Hardening (intermediate) — containers, databases, runtime hardening
  { slug: "docker-nonroot",         track: "intermediate", order: 1, xp: 150, durationMin: 7,  accent: "blue" },
  { slug: "postgres-hardening",     track: "intermediate", order: 2, xp: 180, durationMin: 10, accent: "blue" },
  { slug: "reverse-proxy-ratelimit",track: "intermediate", order: 3, xp: 200, durationMin: 9,  accent: "blue" },
  { slug: "backup-restore-drill",   track: "intermediate", order: 4, xp: 220, durationMin: 12, accent: "blue" },
  { slug: "secrets-rotation",       track: "intermediate", order: 5, xp: 240, durationMin: 13, accent: "blue" },
]

export function getMission(slug: string): Mission | undefined {
  return MISSIONS[slug]
}

export function listMissionSlugs(): string[] {
  return Object.keys(MISSIONS)
}

export function listMissionsForTrack(trackSlug: string): MissionIndexEntry[] {
  return MISSION_INDEX.filter((m) => m.track === trackSlug).sort((a, b) => a.order - b.order)
}
