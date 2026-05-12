/**
 * 앱 전역에서 참조하는 사용자 프로필(최소 필드).
 * 미수집 값은 `null`로 둡니다(undefined로 “키 없음”을 쓰지 않고, 항상 두 키를 유지).
 */
export type UserSex = "male" | "female" | "other";

export type UserProfile = {
  sex: UserSex | null;
  age: number | null;
};

export const EMPTY_USER_PROFILE: UserProfile = {
  sex: null,
  age: null
};
