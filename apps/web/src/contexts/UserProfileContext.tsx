"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { UserProfile, UserSex } from "@/lib/userProfile";
import { EMPTY_USER_PROFILE } from "@/lib/userProfile";

type UserProfileContextValue = {
  profile: UserProfile;
  /** 부분 갱신. `sex`/`age`에 `null`을 넣으면 “미입력”으로 되돌릴 수 있습니다. */
  setProfile: (patch: Partial<UserProfile>) => void;
  setSex: (sex: UserSex | null) => void;
  setAge: (age: number | null) => void;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(() => ({
    ...EMPTY_USER_PROFILE
  }));

  const setProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfileState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setSex = useCallback((sex: UserSex | null) => {
    setProfileState((prev) => ({ ...prev, sex }));
  }, []);

  const setAge = useCallback((age: number | null) => {
    setProfileState((prev) => ({ ...prev, age }));
  }, []);

  const value = useMemo(
    () => ({ profile, setProfile, setSex, setAge }),
    [profile, setProfile, setSex, setAge]
  );

  return (
    <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>
  );
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return ctx;
}
