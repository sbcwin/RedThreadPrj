import type { FeatureId } from "@/lib/features";

const STORAGE_KEY = "rt:unlockedFeatures:v1";

function safeParse(json: string | null): FeatureId[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return [];
    return data.filter((x): x is FeatureId => typeof x === "string") as FeatureId[];
  } catch {
    return [];
  }
}

export function getUnlockedFeatures(): Set<FeatureId> {
  if (typeof window === "undefined") return new Set(["landing"]);
  const list = safeParse(window.localStorage.getItem(STORAGE_KEY));
  return new Set<FeatureId>(["landing", ...list]);
}

export function isFeatureUnlocked(id: FeatureId): boolean {
  return getUnlockedFeatures().has(id);
}

export function unlockFeature(id: FeatureId) {
  if (typeof window === "undefined") return;
  const current = getUnlockedFeatures();
  current.add(id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
  window.dispatchEvent(new Event("rt:unlockedFeaturesChanged"));
}

