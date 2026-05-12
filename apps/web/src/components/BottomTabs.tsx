"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FeatureDef } from "@/lib/features";

function TabButton({
  label,
  active,
  disabled
}: {
  label: string;
  active: boolean;
  disabled: boolean;
}) {
  return (
    <div
      className={[
        "flex h-11 items-center justify-center rounded-xl text-xs font-medium",
        active ? "bg-zinc-900 text-white" : "bg-transparent text-zinc-700",
        disabled ? "opacity-40" : ""
      ].join(" ")}
      aria-disabled={disabled}
    >
      {label}
    </div>
  );
}

export function BottomTabs({
  tabs,
  unlocked,
  onOpenMenu
}: {
  tabs: FeatureDef[];
  unlocked: Set<string>;
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 safe-bottom">
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="grid grid-cols-5 gap-2 rounded-2xl border border-zinc-200 bg-white/90 p-2 backdrop-blur">
          {tabs.map((t) => {
            const isActive =
              (t.href === "/" && pathname === "/") ||
              (t.href !== "/" && pathname.startsWith(t.href));

            const enabled = unlocked.has(t.id);
            if (!enabled) {
              return (
                <button
                  key={t.id}
                  type="button"
                  className="cursor-not-allowed"
                  onClick={() => {}}
                  title="아직 경험하지 않은 기능입니다."
                >
                  <TabButton label={t.label} active={false} disabled />
                </button>
              );
            }

            return (
              <Link key={t.id} href={t.href} className="block">
                <TabButton label={t.label} active={isActive} disabled={false} />
              </Link>
            );
          })}

          <button
            type="button"
            onClick={onOpenMenu}
            className="relative"
            title="전체 메뉴"
          >
            <div className="flex h-11 items-center justify-center rounded-xl bg-zinc-100 text-xs font-semibold text-zinc-900 hover:bg-zinc-200">
              Menu
            </div>
            <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-semibold text-white">
              All
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

