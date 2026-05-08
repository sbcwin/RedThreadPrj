export type FeatureId =
  | "landing"
  | "about"
  | "chat"
  | "browse"
  | "history";

export type FeatureDef = {
  id: FeatureId;
  label: string;
  href: string;
  description?: string;
  tabOrder?: number;
};

export const FEATURES: readonly FeatureDef[] = [
  {
    id: "landing",
    label: "Landing",
    href: "/",
    description: "처음 실행 시 시작점",
    tabOrder: 0
  },
  {
    id: "browse",
    label: "Browse",
    href: "/browse",
    description: "일반적인 하단 브라우징 탭(예시)",
    tabOrder: 1
  },
  {
    id: "chat",
    label: "Chat",
    href: "/chat",
    description: "대화를 시작/진행",
    tabOrder: 2
  },
  {
    id: "history",
    label: "History",
    href: "/history",
    description: "기록/아카이브(예시)",
    tabOrder: 3
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    description: "프로젝트 소개(예시)"
  }
] as const;

export function featureIdFromPath(pathname: string): FeatureId | null {
  if (pathname === "/") return "landing";
  const hit = FEATURES.find((f) => f.href !== "/" && pathname.startsWith(f.href));
  return hit?.id ?? null;
}

