# UserSpec (기초 데이터 정의)

> 목적: 대화 토픽을 구성하기 위한 **기초 사용자 스펙 데이터**를 문서화한다.  
> 활용: DB 적재(정규화/스키마 설계) + 대화 질문지(설문/온보딩/프로파일링) + 토픽 그래프 구성.

## 1. 표현 방식(문서 → DB 매핑 관점)

- **트리 구조**: `대분류(Topic)` → `중분류(Subtopic)` → `항목(Item)`  
- **가중치(weight)**: 우선순위/중요도를 나타내는 숫자(%)이며, **동일 레벨 형제 합이 100%**가 되도록 설계한다.  
  - 남/녀(또는 평가 주체)마다 기본값이 달라질 수 있으므로, 문서에서는 `maleDefault` / `femaleDefault`로 분리한다.
  - 실제 서비스에서는 사용자 응답/상황에 따라 가중치가 조절될 수 있다(기본값은 시작점).
- **null 허용(전역 규칙)**: 미입력/미수집은 **항상 `null`로 저장 가능**(예: `sex: null`).  
  - 따라서 개별 항목에 `nullable: true`를 반복 표기하지 않는다.
- **데이터 타입**: 가능한 한 **구간/선택지(카테고리)** 기반으로 저장하고, 자유입력은 최소화한다(추후 분석/추천/정책 적용에 유리).

### 1.1 공통 필드(권장)

- **topicId**: 문자열 ID (예: `EXT.ECONOMY`)  
- **name**: 사람이 읽는 이름  
- **weight**: 상위 레벨 내 비중(%)  
- **items[]**: 질문/응답 정의

### 1.2 질문(Item) 공통 스키마(권장)

- **itemId**: 문자열 ID (예: `EXT.ECONOMY.INCOME`)  
- **question**: 사용자에게 표시할 질문 문장  
- **answerType**: `single_select | multi_select | number | range | text`  
- **examples**: 예시 입력/선택지  
- **notes**: 정규화/검증/주의사항

---

## 2. 최상위 토픽 트리

> 최상위 토픽은 우선 **기본 / 외적 스펙 / 내적 스펙** 3개 축으로 시작한다.  
> - **기본(Basic)**: 인구통계/식별에 가까운 필수 프로필(예: **생년**, 성별)  
> - **외적(External)**: 소득/신체/학력·직업 등 비교적 객관적 스펙  
> - **내적(Internal)**: 가치관/습관/미래관 등 주관적 성향

### 2.1 기본(Basic)

#### BASIC.FACTS — 팩트 기반 스펙(기본)

- **topicId**: `BASIC.FACTS`
- **weightDefaults**: `maleDefault=10, femaleDefault=10`
- **정의**: **객관적/서류 기반으로 확인 가능한 “팩트 스펙”** 을 기본에서 분리해 관리한다.  
  - 예: 생년, 성별, (서류적) 범죄경력 여부, 학력/학교 등
  - 상대에 대한 질문(예: “나이”)은 저장된 팩트(예: `birthYear`)로 **역산/파생**해 묻는다.

**하위 항목**

1) `BASIC.FACTS.BIRTH_YEAR` — 생년
- **question**: 본인의 출생 연도(생년)는 몇 년인가요? (예: 1995)
- **answerType(권장)**: `number`
- **examples**: `1995`
- **notes**:
  - DB에는 **생년(YYYY)** 를 저장하고, 나이는 **현재 연도 기준으로 역산**해 사용한다.
  - 입력 검증(정책): 예 `1900~현재연도`.
  - 상대에게 “나이”를 물어야 하는 UX에서는, 저장된 `birthYear`로 계산한 값을 사용해 질문/필터를 구성한다.

2) `BASIC.FACTS.SEX` — 성별
- **question**: 본인의 성별은 무엇인가요?
- **answerType(권장)**: `single_select`
- **examples**: `남성 | 여성 | 기타 | 응답거부`
- **notes**:
  - DB에는 enum 코드로 저장 권장.
  - 애플리케이션 객체 예시: `sex: null` 가능.

3) `BASIC.FACTS.EDUCATION_LEVEL` — 최종 학력(서류 기준)
- **question**: 최종 학력은 어떻게 되나요?
- **answerType(권장)**: `single_select`
- **examples**: `고졸 | 전문대 | 학사(대졸) | 석사 | 박사 | 기타 | 응답거부`

4) `BASIC.FACTS.SCHOOL_NAME` — 학교명(선택)
- **question**: (선택) 졸업(또는 재학)한 학교명을 알려주세요. (예: 서울대)
- **answerType(권장)**: `text`
- **notes**:
  - 초기에는 자유응답으로 받고, 필요 시 학교 코드 테이블로 정규화한다.

5) `BASIC.FACTS.CRIMINAL_RECORD_DOCUMENTED` — 범죄경력(서류적) 여부
- **question**: (서류 기준) 범죄경력이 있나요?
- **answerType(권장)**: `single_select`
- **examples**: `없음 | 있음 | 확인 불가 | 응답거부`
- **notes**:
  - “자기신고 기반 리스크”는 `BASIC.SAFETY`에서 별도로 다룬다.

6) `BASIC.FACTS.AFFILIATION_TYPE` — 소속(팩트)
- **question**: 현재 소속은 어디에 해당하나요?
- **answerType(권장)**: `single_select`
- **examples**: `학생 | 직장 | 사업 | 무직 | 기타 | 응답거부`
- **notes**:
  - 기본에서는 “어디에 속해 있는가”만 팩트로 분류한다(직무/업종/연봉 등은 외적/대화로 확장).

7) `BASIC.FACTS.AFFILIATION_NAME` — 소속 기관/회사/학교명(검증 대상, 선택)
- **question**: (선택) 소속 기관/회사/학교명을 알려주세요. (검증이 필요한 경우에만)
- **answerType(권장)**: `text`
- **notes**:
  - 이 필드는 **검증 대상**이므로, 검증 플로우/정책이 준비되기 전에는 수집을 강제하지 않는다.
  - 저장 시 “자기기입 값”과 “검증 상태”(예: `unverified/verified/rejected`)를 분리해 관리하는 것을 권장한다.

8) `BASIC.FACTS.NATIONAL_LICENSES` — 주요 국가 자격/면허(검증 대상, 선택)
- **question**: (선택) 국가 자격증/면허를 보유하고 있나요?
- **answerType(권장)**: `multi_select`
- **examples**: `의사 | 변호사 | 회계사 | 세무사 | 변리사 | 약사 | 간호사 | 교사 | 공인중개사 | 기술사 | 기타 | 응답거부`
- **notes**:
  - 이 항목은 **검증 대상**이며, 검증 플로우가 준비되기 전에는 수집/노출을 강제하지 않는다.
  - “보유”를 체크한 경우에만 아래를 후속으로 묻는다(필요 최소).
    - `BASIC.FACTS.NATIONAL_LICENSES_NOTE` (text): (선택) 자격/면허명을 구체적으로 적어주세요. (예: ‘공인회계사’, ‘간호사’)
  - 저장 시 “자기기입 값”과 “검증 상태”(예: `unverified/verified/rejected`)를 분리해 관리하는 것을 권장한다.

---

#### BASIC.LOCATION — 거주지역(국가/도시)

- **topicId**: `BASIC.LOCATION`
- **weightDefaults**: `maleDefault=10, femaleDefault=8`
- **정의**: 현재 거주 기반(국가/권역) 정보. **동일 권역 여부 판단**에 주로 사용한다.

**하위 항목**

1) `BASIC.LOCATION.COUNTRY` — 거주 국가
- **question**: 현재 거주 중인 국가는 어디인가요?
- **answerType(권장)**: `single_select`
- **examples**: `KR | US | JP | ... | 응답거부`
- **notes**:
  - DB에는 ISO 국가 코드(예: `KR`) 저장 권장.

2) `BASIC.LOCATION.CITY` — 거주 도시/지역
- **question**: 현재 거주 중인 도시는 어디인가요? (예: 서울, 부산)
- **answerType(권장)**: `single_select` 또는 `text`
- **examples**: `서울 | 경기/인천 | 부산 | 대구 | 광주 | 대전 | 울산 | 세종 | 강원 | 충청 | 전라 | 경상 | 제주 | 해외 | 응답거부`
- **notes**:
  - **동일 국가일 경우**(예: `KR`)는 “도시”를 **권역(enum)** 으로 수집해 동일 권역 여부만 판단한다.
  - **국가가 다를 경우**는 `text`로 도시명을 받아도 된다(예: `Tokyo`, `San Jose`).

---

#### BASIC.WORK — 직업(기본)

- **topicId**: `BASIC.WORK`
- **weightDefaults**: `maleDefault=10, femaleDefault=12`
- **정의**: 상세 스펙(안정성/연봉) 이전의 “현재 직업 상태/직종” 기본값.

**하위 항목**

1) `BASIC.WORK.JOB_CATEGORY` — 직업/직종
- **question**: 현재 직업은 무엇인가요?
- **answerType(권장)**: `single_select`
- **examples**: `사업 | 직장인 | 무직 | 학생 | 기타 | 응답거부`
- **notes**:
  - 외적 스펙의 `EXT.SOCIAL_STATUS.JOB_STABILITY`와 연결 가능(세부는 외적에서).
  - **후속 질문(조건부)**: 선택지가 `기타`이면 아래를 추가로 묻는다.
    - `BASIC.WORK.JOB_DETAIL` (text): 어떤 일을 하는지 한 문장으로 설명해 주세요.

---

#### BASIC.MARRIAGE — 혼인/가족(기본)

- **topicId**: `BASIC.MARRIAGE`
- **weightDefaults**: `maleDefault=15, femaleDefault=15`
- **정의**: 혼인 이력·자녀 유무와 함께, **부모·형제와의 동거**, **부양·지원·독립성**을 기본으로 다룬다. 민감도가 높은 **가족 배경·원가 자산·관계에 영향이 갈 특별 가족관계**는 **특별 계층**으로 별도 질문으로 분리한다.

**하위 항목**

1) `BASIC.MARRIAGE.FAMILY_COHABITATION` — 부모·형제와의 거주/동거
- **question**: 현재 부모님 또는 형제자매와 함께 살고 있나요?
- **answerType(권장)**: `single_select`
- **examples**: `혼자 거주 | 부모만 동거 | 형제 포함 동거 | 부모·형제 모두 동거 | 기타 가족과 동거 | 응답거부`
- **notes**:
  - 부모·형제 **유무**는 “누구와 동거하는지” 선택지로 함께 파악한다.

2) `BASIC.MARRIAGE.FAMILY_SUPPORT_INDEPENDENCE` — 부양·지원·독립성
- **question**: 가족에 대한 부양·경제적 지원, 그리고 본인의 독립 생활은 어느 쪽에 가깝나요?
- **answerType(권장)**: `single_select`
- **examples**: `가족 부양 책임 있음 | 가족으로부터 지원 받는 편 | 상호 지원 | 독립적(의존·지원 적음) | 복합 | 응답거부`
- **notes**:
  - 세 축(부양 / 지원 / 독립성)을 한 문항으로 요약하고, 필요 시 후속으로 세분화한다.

**특별 계층(민감·선택, 별도 질문)**

3) `BASIC.MARRIAGE.FAMILY_BACKGROUND_SPECIAL` — 가족 배경
- **question**: (선택) 파트너가 알아두면 좋을 가족 배경이 있다면, 필요한 범위에서 알려주세요.
- **answerType(권장)**: `text`
- **notes**:
  - 직업·지역·가구 구성 등 **과도한 식별 정보**는 유도하지 않는다.

4) `BASIC.MARRIAGE.FAMILY_ASSETS_SPECIAL` — 가족(원가) 자산
- **question**: (선택) 결혼·동거 계획과 관련해, 원가(가족) 측 자산·부동산 등이 있다면 필요한 범위에서 알려주세요.
- **answerType(권장)**: `text` 또는 `single_select` (구간)
- **notes**:
  - 민감도가 높으므로 **강제 수집하지 않는다**. 검증 정책은 별도.

5) `BASIC.MARRIAGE.FAMILY_RELATIONSHIP_IMPACT_SPECIAL` — 관계에 영향이 갈 특별 가족관계
- **question**: (선택) 연애·결혼 생활에 영향을 줄 수 있는 특별한 가족관계(거리감, 갈등, 돌봄 등)가 있다면, 공유 가능한 범위에서 알려주세요.
- **answerType(권장)**: `text`
- **notes**:
  - `BASIC.SAFETY`와 겹칠 수 있는 내용은 안전 토픽으로 분기할 수 있다.

6) `BASIC.MARRIAGE.MARITAL_HISTORY` — 혼인 이력
- **question**: 혼인 이력은 어떻게 되나요?
- **answerType(권장)**: `single_select`
- **examples**: `미혼 | 이혼 | 사별 | 기타 | 응답거부`
- **notes**:
  - **후속 질문(조건부)**: `이혼/사별/기타`이면 아래를 추가로 묻는다(민감도 높음).
    - `BASIC.MARRIAGE.HISTORY_SHARE_LEVEL` (single_select): 혼인 이력 관련 정보를 어느 정도까지 공유할 수 있나요? `기본만 | 필요 시 | 자세히 | 응답거부`
    - `BASIC.MARRIAGE.HISTORY_TIME` (single_select): 종료 시점은 언제쯤인가요? `1년 이내 | 1~3년 | 3년+ | 응답거부`

7) `BASIC.MARRIAGE.HAS_CHILDREN` — 자녀 유무(현재)
- **question**: 현재 자녀가 있나요?
- **answerType(권장)**: `single_select` (또는 boolean)
- **examples**: `있음 | 없음 | 응답거부`
- **notes**:
  - 세부(자녀 수, 동거 여부 등)는 필요 시 확장 토픽으로 분리.
  - **후속 질문(조건부)**: `있음`이면 아래를 추가로 묻는다(대화 흐름상 필수로 이어지는 경우가 많음).
    - `BASIC.MARRIAGE.CHILDREN_COUNT` (number 또는 single_select): 자녀는 몇 명인가요?
    - `BASIC.MARRIAGE.CHILDREN_LIVE_WITH` (single_select): 자녀와 함께 살고 있나요? `동거 | 비동거 | 일부 | 응답거부`
    - `BASIC.MARRIAGE.CHILDREN_AGE_BAND` (single_select): 자녀 연령대는? `영유아 | 초등 | 중등 | 고등 | 성인 | 혼합 | 응답거부`

---

#### BASIC.INTENT — 관계/결혼 의사(기본)

- **topicId**: `BASIC.INTENT`
- **weightDefaults**: `maleDefault=15, femaleDefault=15`
- **정의**: 커플/파트너십의 형태가 다양하다고 가정하고, **결혼 외 의사**는 자유 응답으로 수집한다.

**하위 항목**

1) `BASIC.INTENT.RELATIONSHIP_INTENT_TEXT` — 관계 의사(자유 응답)
- **question**: 어떤 형태의 관계/파트너십을 원하시나요? (예: 연애, 동거, 비혼 동반자, 결혼 등 자유롭게)
- **answerType(권장)**: `text`
- **notes**:
  - 결혼 여부를 포함해, 사용자가 원하는 관계 형태/지향을 한 문장 이상으로 서술하도록 유도한다.
  - 필요 시 키워드 추출로 `marriageIntent` 등 구조화 필드로 파생 가능.

2) `BASIC.INTENT.MARRIAGE_INTENT` — 결혼 의향
- **question**: 결혼 의향이 있나요?
- **answerType(권장)**: `single_select`
- **examples**: `있음 | 없음 | 미정 | 응답거부`
 - **notes**:
  - **후속 질문(조건부)**: `있음/미정`이면 아래를 추가로 묻는다.
    - `BASIC.INTENT.PARTNER_PREFERENCE_TEXT` (text): 어떠한 상대를 찾고 싶은가요? (자유롭게 작성)

---

#### BASIC.LIFESTYLE — 생활 습관(기본)

- **topicId**: `BASIC.LIFESTYLE`
- **weightDefaults**: `maleDefault=10, femaleDefault=8`
- **정의**: 초기 필터/분기에서 자주 쓰이는 생활 습관(흡연/음주 등).

**하위 항목**

1) `BASIC.LIFESTYLE.DRINKING` — 음주
- **question**: 음주 빈도는 어느 정도인가요?
- **answerType(권장)**: `single_select`
- **examples**: `안마심 | 월 1회 이하 | 주 1회 | 주 2~3회 | 주 4회+ | 응답거부`

2) `BASIC.LIFESTYLE.SMOKING` — 흡연 여부
- **question**: 흡연을 하나요?
- **answerType(권장)**: `single_select`
- **examples**: `비흡연 | 흡연 | 전자담배 | 가끔 | 금연중 | 응답거부`
- **notes**:
  - 선택지는 서비스 정책에 맞게 단순화 가능(예: `흡연/비흡연`만).

---

#### BASIC.HEALTH — 건강 여부(기본)

- **topicId**: `BASIC.HEALTH`
- **weightDefaults**: `maleDefault=10, femaleDefault=10`
- **정의**: 민감정보가 될 수 있는 건강/신체 상태를 **“전반적 건강 여부”** 수준에서 확인하고, 필요 시에만 완곡하게 추가 질문으로 확장한다.

**하위 항목**

1) `BASIC.HEALTH.HEALTH_STATUS` — 전반적 건강 여부
- **question**: 전반적인 건강 상태는 어떠신가요?
- **answerType(권장)**: `single_select`
- **examples**: `특이사항 없음 | 관리/치료 중인 사항 있음 | 응답거부`
- **notes**:
  - 기본에서는 “있다/없다”가 아니라 **특이사항 유무**만 확인한다.
  - 이 토픽은 “결혼/커플 상대로써 함께 생활할 때” 필요한 **배려/제약/생활 영향**을 파악하기 위한 것이며, 의학적 진단/상세 병력 수집이 목적이 아니다.
  - 민감도가 높은 질문은 **해당되는 경우에만**(조건부) 최소한으로 이어서 묻고, 사용자는 **응답거부/미응답**을 선택할 수 있다.
  - **후속 질문(조건부)**: `관리/치료 중인 사항 있음`일 때만 아래를 추가로 묻는다(완곡한 표현 유지).
    - `BASIC.HEALTH.CHRONIC_CONDITION` (single_select): 장기간 관리가 필요한(만성) 질환/상태가 있나요? `없음 | 있음 | 응답거부`
    - `BASIC.HEALTH.DISABILITY_ACCOMMODATION` (single_select): 일상에서 특별한 배려/지원이 필요한 신체적 상태가 있나요? `없음 | 있음 | 응답거부`
    - `BASIC.HEALTH.HEALTH_NOTE` (text): (선택) 파트너가 알아두면 좋을 “생활상의 배려/제약”이 있다면 필요한 범위 내에서 알려주세요. (예: 식이 제한, 정기 치료 등)

---

#### BASIC.SAFETY — 안전/법적 리스크(기본)

- **topicId**: `BASIC.SAFETY`
- **weightDefaults**: `maleDefault=15, femaleDefault=20`
- **정의**: 결혼/커플 관계에서 **안전(폭력/범죄 관련 리스크)** 을 확인하기 위한 최소 질문.  
  - 디테일 수집이 목적이 아니라, “대화/관계에서의 안전” 관점에서 **있음/없음/응답거부** 수준의 플래그를 먼저 확인한다.

**하위 항목**

1) `BASIC.SAFETY.VIOLENCE_FLAG` — 폭력 관련 이슈 여부(직접 확인)
- **question**: 관계에서의 안전을 위해 확인합니다. 폭력(신체/정서/경제/성) 문제로 인해 법적 조치(고소, 접근금지, 보호명령 등)가 있었던 적이 있나요?
- **answerType(권장)**: `single_select`
- **examples**: `없음 | 있음 | 응답거부`
- **notes**:
  - **후속 질문(조건부)**: `있음`일 때만 아래를 추가로 묻는다(최소/완곡).
    - `BASIC.SAFETY.DISCLOSURE_LEVEL` (single_select): 관련 정보를 어느 정도까지 공유할 수 있나요? `기본만 | 필요 시 | 자세히 | 응답거부`
    - `BASIC.SAFETY.STATUS_NOW` (single_select): 현재 상태는 어떤가요? `종결됨 | 진행/분쟁 중 | 보호조치/접근금지 등 | 응답거부`
    - `BASIC.SAFETY.SAFETY_NOTE` (text): (선택) 파트너가 알아두면 좋을 범위에서 간단히 알려주세요.

2) `BASIC.SAFETY.CRIME_FLAG` — 안전에 영향 큰 범죄 이력 여부(직접 확인)
- **question**: 파트너의 안전에 영향을 줄 수 있는 범죄 관련 이력이 있나요?
- **answerType(권장)**: `single_select`
- **examples**: `없음 | 있음 | 응답거부`
- **notes**:
  - **후속 질문(조건부)**: `있음`일 때만 아래를 추가로 묻는다(최소/완곡).
    - `BASIC.SAFETY.DISCLOSURE_LEVEL` / `BASIC.SAFETY.STATUS_NOW` / `BASIC.SAFETY.SAFETY_NOTE`를 재사용한다.

3) `BASIC.SAFETY.INDIRECT_SCREENING` — 간접 질문(대화용, 조건부)
- **question**: (시스템/대화 흐름용) 안전 관련 직접 질문이 부담스럽거나, 신뢰 형성 후에 간접적으로 확인하고 싶을 때 사용할 질문 세트.
- **answerType(권장)**: `text`
- **notes**:
  - 아래 질문들은 “심문”이 아니라 **갈등/안전/경계선**에 대한 일반적인 커뮤니케이션 질문으로 구성한다.
  - 운영 정책상 필요할 때만 노출(예: 매칭 전/초기 온보딩에서 선택적으로).
  - 예시(간접 질문):
    - `BASIC.SAFETY.INDIRECT.CONFLICT_STYLE` (text): 갈등이 생기면 보통 어떻게 해결하려고 하나요?
    - `BASIC.SAFETY.INDIRECT.ANGER_MANAGEMENT` (text): 화가 많이 날 때 감정을 어떻게 다스리나요?
    - `BASIC.SAFETY.INDIRECT.BOUNDARIES` (text): 연인 사이에서도 “절대 하면 안 되는 행동/말”이 있다고 생각하나요? 어떤 것들인가요?
    - `BASIC.SAFETY.INDIRECT.CONSENT_RESPECT` (text): 상대가 싫다고 했을 때(스킨십/연락/만남 등) 보통 어떻게 조율하나요?
    - `BASIC.SAFETY.INDIRECT.SUBSTANCE_TRIGGER` (text): 술을 마시면 성격이나 말투가 달라지는 편인가요? 주변에서 지적받은 적이 있나요?
    - `BASIC.SAFETY.INDIRECT_ACCOUNTABILITY` (text): 관계에서 상처를 줬다고 느낀 적이 있다면, 보통 어떻게 사과/회복을 시도하나요?

---

#### BASIC.RELIGION — 종교(기본)

- **topicId**: `BASIC.RELIGION`
- **weightDefaults**: `maleDefault=5, femaleDefault=2`
- **정의**: 종교는 생활 패턴/가치관 질문의 분기 기준이 되므로 기본 정보로도 수집 가능.

**하위 항목**

1) `BASIC.RELIGION.RELIGION` — 종교
- **question**: 본인의 종교는 무엇인가요?
- **answerType(권장)**: `single_select`
- **examples**: `무교 | 기독교 | 천주교 | 불교 | 기타 | 응답거부`
- **notes**:
  - 내적 스펙의 `INT.VALUES.RELIGION_LIFESTYLE`와 연결(활동 빈도는 내적에서).
  - **후속 질문(조건부)**: 종교가 `무교`가 아니면 아래를 추가로 묻는다.
    - `BASIC.RELIGION.CEREMONY_EXPECTATION` (single_select): 종교적 의식/행사 참여에 대한 기대가 있나요? `있음 | 없음 | 협의 | 응답거부`

---

### 2.2 외적 스펙(External Spec)

#### EXT.PHYSICAL — 신체조건 (비중 20%)

- **topicId**: `EXT.PHYSICAL`
- **weightDefaults**: `maleDefault=45, femaleDefault=20`
- **정의**: 외형/건강 관리(생활 습관 포함)의 객관식 프로필.

**하위 항목**

1) `EXT.PHYSICAL.APPEARANCE` — 외형적 특성 (60%)
- **weightDefaults**: `maleDefault=80, femaleDefault=60`
- **정의**: 외형 프로필(인구통계/신체치수/체형)을 정규화된 필드로 수집한다.

**세부 항목(외형적 특성 하위)**

1-1) `EXT.PHYSICAL.HEIGHT_CM` — 키(cm)
- **question**: 본인의 키는 몇 cm인가요?
- **answerType(권장)**: `number`
- **examples**: `170`
- **notes**:
  - 정수로 저장 권장. 입력 검증(정책): 예 `120~230`.

1-2) `EXT.PHYSICAL.WEIGHT_KG` — 몸무게(kg)
- **question**: 본인의 몸무게는 몇 kg인가요?
- **answerType(권장)**: `number`
- **examples**: `63`
- **notes**:
  - 정수 또는 소수(정책 선택)로 저장 가능. 입력 검증(정책): 예 `30~200`.

1-3) `EXT.PHYSICAL.BODY_TYPE` — 체형
- **question**: 본인의 체형은 무엇인가요?
- **answerType(권장)**: `single_select`
- **examples**: `마름 | 보통 | 근육질 | 통통 | 기타 | 응답거부`
- **notes**:
  - enum 코드로 저장 권장(필터/추천에 유리).
  - **후속 질문(조건부)**: 사용자가 외모/매력 관련 대화를 원하거나, 더 자세한 외형 정보를 제공하려는 경우 아래를 추가로 묻는다.
    - `EXT.PHYSICAL.ATTRACTIVENESS_TEXT` (text): 본인이 생각하는 “신체적 매력 포인트”를 자유롭게 알려주세요. (예: 웃는 인상, 어깨/피지컬, 스타일 등)

2) `EXT.PHYSICAL.HEALTH_MANAGEMENT` — 건강 관리 (40%)
- **weightDefaults**: `maleDefault=20, femaleDefault=40`
- **question**: 주당 평균 운동 횟수는 몇 회인가요?
- **answerType(권장)**: `number` (0 이상)
- **examples**: `0`, `2`, `5`
- **notes**:
  - 상한은 정책으로 제한 가능(예: 0~14).

---

#### EXT.ECONOMY — 경제력 (비중 30%)

- **topicId**: `EXT.ECONOMY`
- **weightDefaults**: `maleDefault=25, femaleDefault=50`
- **정의**: 결혼/가정 형성에서 현실적 기반(소득·자산·주거)의 수준과 계획을 나타내는 스펙.

**하위 항목**

1) `EXT.ECONOMY.INCOME` — 소득 수준 (40%)
- **weightDefaults**: `maleDefault=40, femaleDefault=50`
- **question**: 현재 본인의 세전 연봉 구간은 어디에 해당하나요? (예: 5천~7천)
- **answerType(권장)**: `range` 또는 `single_select`
- **examples**:
  - `range`: `min=5000`, `max=7000` (단위: 만원/년)  
  - `single_select`: `~3000`, `3000~5000`, `5000~7000`, `7000~1억`, `1억~`, `응답거부`
- **notes**:
  - DB에는 **숫자 range** 또는 **구간 코드**로 저장(정렬/필터에 유리).

2) `EXT.ECONOMY.ASSET` — 자산 현황 (40%)
- **weightDefaults**: `maleDefault=30, femaleDefault=35`
- **question**: 현재 운용 가능한 순자산(예적금, 주식 등) 규모는 얼마인가요?
- **answerType(권장)**: `range` 또는 `single_select`
- **examples**:
  - `single_select`: `~1000`, `1000~3000`, `3000~5000`, `5000~1억`, `1억~`, `응답거부` (단위: 만원)
- **notes**:
  - “운용 가능한”의 범위를 안내 문구로 고정(부채 포함 여부, 부동산 제외 등).

3) `EXT.ECONOMY.HOUSING_PLAN` — 주거 계획 (20%)
- **weightDefaults**: `maleDefault=30, femaleDefault=15`
- **question**: 결혼 후 신혼집 마련 시 본인이 부담 가능한 금액 비중은 몇 %인가요?
- **answerType(권장)**: `number` (0~100)
- **examples**: `30`, `50`, `70`
- **notes**:
  - `%` 정수 저장 권장. 입력 검증: 0~100.

---

#### EXT.SOCIAL_STATUS — 사회적 지위 (비중 20%)

- **topicId**: `EXT.SOCIAL_STATUS`
- **weightDefaults**: `maleDefault=30, femaleDefault=30`
- **정의**: 직업 안정성/학업 배경 등 사회적 기반을 나타내는 스펙.

**하위 항목**

1) `EXT.SOCIAL_STATUS.JOB_STABILITY` — 직업적 안정성 (70%)
- **weightDefaults**: `maleDefault=60, femaleDefault=75`
- **question**: 본인의 직종은 무엇이며, 고용 형태(정규직/전문직/자영업 등)는 어떠한가요?
- **answerType(권장)**: `multi_field` 또는 2문항 분리
- **examples**:
  - 직종: `개발 | 기획 | 영업 | 교육 | 의료 | 공무 | ... | 기타`
  - 고용형태: `정규직 | 계약직 | 프리랜서 | 자영업 | 전문직 | 공무원 | 학생 | 무직 | 기타 | 응답거부`
- **notes**:
  - DB 권장 분리:
    - `EXT.SOCIAL_STATUS.JOB_CATEGORY` (enum/string, nullable)
    - `EXT.SOCIAL_STATUS.EMPLOYMENT_TYPE` (enum, nullable)

2) `EXT.SOCIAL_STATUS.EDUCATION` — 학업 배경 (30%)
- **weightDefaults**: `maleDefault=40, femaleDefault=25`
- **question**: 최종 학력과 졸업한 학교의 소재 지역은 어디인가요?
- **answerType(권장)**: `multi_field` 또는 2문항 분리
- **examples**:
  - 최종학력: `고졸 | 전문대 | 학사 | 석사 | 박사 | 기타 | 응답거부`
  - 소재지역: `서울 | 경기/인천 | 충청 | 전라 | 경상 | 강원 | 제주 | 해외 | 응답거부`
- **notes**:
  - 지역은 시/도 단위 코드로 정규화 권장.

---

### 2.3 내적 스펙(Internal Spec)

#### INT.VALUES — 내적 가치관 (비중 30%)

- **topicId**: `INT.VALUES`
- **weightDefaults**: `maleDefault=100, femaleDefault=100`
- **정의**: 종교/미래관/소비 성향 등 생활의 기준과 결혼 후 의사결정 성향을 나타내는 스펙.

**하위 항목**

1) `INT.VALUES.RELIGION_LIFESTYLE` — 종교 및 생활 습관 (40%)
- **weightDefaults**: `maleDefault=30, femaleDefault=30`
- **question**: 본인의 종교와 그에 따른 활동 빈도(무교/주1회 등)는 어떠한가요?
- **answerType(권장)**: `multi_field` (종교=single_select, 빈도=single_select)
- **examples**:
  - 종교: `무교 | 기독교 | 천주교 | 불교 | 기타 | 응답거부`
  - 활동빈도: `없음 | 월1회 | 주1회 | 주2회+ | 기타 | 응답거부`
- **notes**:
  - 종교와 빈도는 분리 저장 권장.

2) `INT.VALUES.CHILDREN_FUTURE` — 자녀 및 미래관 (30%)
- **weightDefaults**: `maleDefault=40, femaleDefault=30`
- **question**: 결혼 후 희망하는 자녀의 수는 몇 명인가요?
- **answerType(권장)**: `number` 또는 `single_select`
- **examples**: `0`, `1`, `2`, `3+`, `응답거부`
- **notes**:
  - `3+` 같은 상위 구간이 필요하면 `single_select`가 더 단순.

3) `INT.VALUES.SPENDING_HABITS` — 소비 성향 (30%)
- **weightDefaults**: `maleDefault=30, femaleDefault=40`
- **question**: 수입 대비 저축 비중은 몇 %인가요? (예: 50% 이상)
- **answerType(권장)**: `number` (0~100) 또는 `single_select`
- **examples**:
  - number: `10`, `30`, `50`
  - single_select: `0~10`, `10~30`, `30~50`, `50~70`, `70~`, `응답거부`
- **notes**:
  - `%` 정수 저장 권장. 입력 검증: 0~100.

---

## 3. 그래프/연관성(초안)

트리 외에 “연관성 그래프”가 필요해지면, 아래처럼 **링크를 추가**해 확장한다.

- 예: `EXT.ECONOMY.HOUSING_PLAN` ↔ `INT.VALUES.SPENDING_HABITS`  
  - 주거 부담 비중(현실)과 저축 성향(습관)이 함께 “재무 스타일” 토픽으로 묶일 수 있음.
- 예: `EXT.SOCIAL_STATUS.JOB_STABILITY` ↔ `EXT.ECONOMY.INCOME`  
  - 고용 형태가 소득 변동성에 영향을 줄 수 있음(추천/질문 순서 최적화에 활용).

> 추후 계획: 각 item에 `relatedItemIds: string[]`를 추가해 그래프를 구성할 수 있다.

