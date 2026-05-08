"use client";

import Link from "next/link";
import type { FeatureDef } from "@/lib/features";

export function FullMenuSheet({
  open,
  onClose,
  features,
  unlocked
}: {
  open: boolean;
  onClose: () => void;
  features: readonly FeatureDef[];
  unlocked: Set<string>;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close menu"
      />

      <div className="absolute inset-x-0 bottom-0 safe-bottom">
        <div className="mx-auto max-w-md px-4 pb-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">전체 기능</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  잠긴 기능은 “경험” 후 자동으로 활성화됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
              >
                닫기
              </button>
            </div>

            <div className="mt-4 divide-y divide-zinc-100">
              {features.map((f) => {
                const enabled = unlocked.has(f.id);
                if (!enabled) {
                  return (
                    <div key={f.id} className="py-3 opacity-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{f.label}</p>
                          {f.description ? (
                            <p className="mt-1 text-xs text-zinc-500">
                              {f.description}
                            </p>
                          ) : null}
                        </div>
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-semibold text-zinc-700">
                          Locked
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={f.id}
                    href={f.href}
                    onClick={onClose}
                    className="block py-3 hover:bg-zinc-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {f.label}
                        </p>
                        {f.description ? (
                          <p className="mt-1 text-xs text-zinc-500">
                            {f.description}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-xs font-medium text-zinc-500">
                        Open
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

