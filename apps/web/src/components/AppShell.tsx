"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { FEATURES, featureIdFromPath } from "@/lib/features";
import { getUnlockedFeatures, unlockFeature } from "@/lib/featureProgress";
import { BottomTabs } from "@/components/BottomTabs";
import { FullMenuSheet } from "@/components/FullMenuSheet";
import { UserProfileProvider } from "@/contexts/UserProfileContext";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const apply = () => setUnlocked(new Set(getUnlockedFeatures()));
    apply();
    window.addEventListener("rt:unlockedFeaturesChanged", apply);
    return () => window.removeEventListener("rt:unlockedFeaturesChanged", apply);
  }, []);

  useEffect(() => {
    const id = featureIdFromPath(pathname);
    if (!id) return;
    unlockFeature(id);
  }, [pathname]);

  const tabFeatures = useMemo(
    () => [...FEATURES].filter((f) => typeof f.tabOrder === "number").sort((a, b) => (a.tabOrder ?? 0) - (b.tabOrder ?? 0)),
    []
  );

  return (
    <UserProfileProvider>
      <div className="min-h-dvh bg-white">
        {children}

        <BottomTabs
          tabs={tabFeatures}
          unlocked={unlocked}
          onOpenMenu={() => setIsMenuOpen(true)}
        />

        <FullMenuSheet
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          features={FEATURES}
          unlocked={unlocked}
        />
      </div>
    </UserProfileProvider>
  );
}

