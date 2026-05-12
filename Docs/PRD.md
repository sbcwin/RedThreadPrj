# PRD (Product Requirements Document)

> 문서 상태: **Draft**  
> 최종목표: 이 문서 하나로 **무엇을/왜/누가/어떻게/언제** 만들지 합의하고, 개발·디자인·QA·운영이 같은 기준으로 움직이게 한다.

## 1. 개요

### 1.1 제품/프로젝트 정보
- **제품명(가칭)**:
- **문서 버전**: v0.1
- **작성일**:
- **작성자/오너**:
- **의사결정자(Approver)**:
- **관련 링크**: (디자인/이슈트래커/레포/노션 등)

### 1.2 배경 & 문제정의
- **현 상황**:
- **고객의 Pain point**:
- **왜 지금인가(타이밍/기회)**:

### 1.3 목표(Goals) / 비목표(Non-goals)
- **Goals**
  - 
- **Non-goals**
  - 

### 1.4 성공지표(Success Metrics)
> 숫자로 측정 가능한 “완료 기준”을 정의한다.
- **North Star Metric**:
- **입력 지표(leading)**:
  - 
- **결과 지표(lagging)**:
  - 
- **가드레일 지표(품질/비용)**:
  - 

## 2. 사용자 & 시나리오

### 2.1 타겟 사용자/페르소나
- **Persona A**:
  - 목표:
  - 행동/맥락:
  - 주요 니즈:
- **Persona B**:

### 2.2 핵심 사용자 여정(User Journey)
1) 
2) 
3) 

### 2.3 사용자 스토리(User Stories)
형식: “As a [사용자], I want [기능] so that [가치].”
- 

## 3. 범위(스코프) & 기능 요구사항

### 3.1 범위 정의
- **MVP 범위**:
- **v1 범위**:
- **추후(Backlog)**:

### 3.2 기능 목록(Feature List)
| ID | 기능 | 설명 | 우선순위(P0/P1/P2) | 플랫폼(Web) | 상태 |
|---:|---|---|---|---|---|
| F-001 | 랜딩(대화 시작) | 최초 진입 화면. “대화를 시작하는 느낌”을 주는 CTA 제공 | P0 | Web | Implemented (Scaffold) |
| F-002 | 하단 탭 내비게이션 | 일반적인 앱 형태의 하단 브라우징 탭. 좌측=Landing, 우측=전체메뉴 | P0 | Web | Implemented (Scaffold) |
| F-003 | 전체 메뉴(우하단) | 우측 하단에서 전체 기능 리스트를 확인(바텀시트) | P0 | Web | Implemented (Scaffold) |
| F-004 | 기능 경험 기반 활성화 | 사용자가 “경험한 기능”만 탭/메뉴에서 활성화. 잠긴 기능은 비활성 표시 | P0 | Web | Implemented (Scaffold) |
| F-005 | Gemini Chat 테스트 모드 | `/chat` 진입 시 프롬프트+RAG 컨텍스트로 대화 모드 구성, 전송 시 **Gemini 3.1 Flash Lite**(`gemini-3.1-flash-lite`) 우선 호출 후 타임라인 표시 | P0 | Web | Implemented (Test) |

### 3.3 상세 기능 요구사항(Functional Requirements)
> 기능별로 “입력/처리/출력”, “권한”, “오류”, “로깅”까지 포함한다.

#### F-001. (기능명)
- **설명**:
- **사용자 가치**:
- **권한/역할**:
- **전제조건(Prerequisites)**:
- **기본 플로우(Main Flow)**:
  1. 
  2. 
- **예외/오류 플로우(Edge Cases)**:
  - 
- **입력 규칙(Validation)**:
  - 
- **출력/표시(UI)**:
  - 
- **로그/추적(Observability)**:
  - 이벤트:
  - 로그 필드(예: requestId, userId, featureId):

### 3.4 권한/역할(Authorization)
- **역할 정의**:
  - Admin:
  - Member:
  - Guest:
- **권한 매트릭스(요약)**:

## 4. UX/UI 요구사항

### 4.1 정보 구조(IA)
- 주요 섹션:
  - 랜딩(시작점)
  - 채팅(대화 화면)
  - 브라우즈(탭 콘텐츠 예시)
  - 히스토리(기록 예시)
  - 소개(About, 예시)
- 내비게이션:
  - **앱 시작은 항상 랜딩(`/`)에서 시작**
  - **하단 탭(브라우징)**: 일반 앱처럼 하단에서 이동
    - **좌측 첫 탭**: Landing(`/`)
    - **우측(오른쪽 아래)**: 전체 메뉴 버튼(`Menu`) → 바텀시트
  - **기능 잠금 정책**: “경험한 기능”만 탭/전체메뉴에서 활성화
    - 잠긴 항목은 비활성(잠금 표시)
    - 기능 경험은 기본적으로 “해당 라우트 방문”으로 처리(추후 이벤트/튜토리얼 완료 등으로 세분화 가능)

### 4.2 화면 목록(Screens)
| 화면 ID | 화면명 | URL(라우트) | 설명 | 비고 |
|---:|---|---|---|---|
| S-001 | Landing | `/` | 최초 진입 화면. 대화 시작 CTA + 안내 | Implemented (Scaffold) |
| S-002 | Chat | `/chat` | 테스트 모드: 프롬프트+RAG 전달 후 **Gemini 3.1 Flash Lite**와 대화. 응답은 타임라인에 표시 | Implemented (Test) |
| S-003 | Browse | `/browse` | 하단 브라우징 탭 예시(placeholder) | Implemented (Scaffold) |
| S-004 | History | `/history` | 기록/아카이브 탭 예시(placeholder) | Implemented (Scaffold) |
| S-005 | Full Menu Sheet | (overlay) | 우하단 Menu 버튼으로 열리는 전체 기능 바텀시트 | Implemented (Scaffold) |
| S-006 | About | `/about` | 소개/예시 화면 | Implemented (Scaffold) |

### 4.3 공통 UI 정책
- **로딩/스켈레톤**:
- **빈 상태(Empty state)**:
- **에러 상태**:
- **토스트/알림**:
- **반응형(브레이크포인트)**:
- **접근성(A11y)**:
- **다국어/지역화(i18n)**:

## 5. 비기능 요구사항(NFR)

### 5.1 성능(Performance)
- **웹 성능(예: Core Web Vitals)**:
  - LCP:
  - INP:
  - CLS:
- **서버 성능 목표**:
  - p95 응답시간:
  - 처리량:

### 5.2 가용성/신뢰성(Reliability)
- **SLO/SLA**:
- **재시도/타임아웃 정책**:
- **장애 시 강등 동작(Degrade gracefully)**:

### 5.3 보안(Security)
- **인증(Authentication)**:
- **권한(Authorization)**:
- **개인정보/PII 처리**:
- **비밀정보 관리(Secrets)**:
- **취약점 대응**:

### 5.4 로깅/모니터링/추적성(Observability)
- **로그 수준/포맷(JSON 권장)**:
- **메트릭**:
- **트레이싱**:
- **알람 정책**:

### 5.5 컴플라이언스/정책
- 

## 6. 기술/아키텍처 개요

### 6.1 기술 스택
- **Frontend**: Next.js (Web App, App Router) + TypeScript + Tailwind CSS
- **Backend**: Java Spring Framework

### 6.2 권장 리포 구조(모노레포)
> 이 섹션은 제안이며, 팀/배포 방식에 맞게 조정한다.

```text
.
├─ Docs/
│  ├─ PRD.md
│  ├─ ADR/                     # Architecture Decision Records (선택)
│  └─ api/                     # API 스펙(예: OpenAPI), 예시, 목업
├─ apps/
│  ├─ web/                     # Next.js(TypeScript)
│  │  ├─ src/
│  │  │  ├─ app/               # Next.js App Router
│  │  │  ├─ components/        # 재사용 UI 컴포넌트
│  │  │  ├─ features/          # 도메인/기능 단위(권장)
│  │  │  ├─ lib/               # 클라이언트 유틸(예: fetch wrapper, env)
│  │  │  ├─ styles/
│  │  │  └─ types/
│  │  ├─ public/
│  │  ├─ next.config.js
│  │  └─ package.json
│  └─ api/                     # (선택) BFF/Edge API가 필요하면 분리
├─ services/
│  └─ backend/                 # Spring Framework
│     ├─ src/
│     │  ├─ main/
│     │  │  ├─ java/com/<org>/<project>/
│     │  │  │  ├─ api/          # Controller, Request/Response DTO
│     │  │  │  ├─ application/  # UseCase/Service (비즈니스 유스케이스)
│     │  │  │  ├─ domain/       # Domain Model, Domain Service
│     │  │  │  ├─ infra/        # DB, 외부 연동, 구현체
│     │  │  │  └─ config/       # Spring 설정
│     │  │  └─ resources/       # application.yml, migration 등
│     │  └─ test/java/...       # 단위/통합 테스트
│     ├─ build.gradle(.kts) 또는 pom.xml
│     └─ Dockerfile (선택)
├─ packages/                   # (선택) 공유 TS 패키지(유틸/타입)
│  ├─ ui/                       # 공유 UI 컴포넌트(선택)
│  └─ shared/                   # 공통 타입/검증 스키마(선택)
├─ scripts/                    # 로컬/CI 스크립트
├─ .github/workflows/          # CI
└─ docker-compose.yml          # 로컬 개발용(선택)
```

### 6.3 API 설계 원칙(초안)
- **API 스타일**: REST(JSON) 권장 (필요 시 GraphQL/BFF 고려)
- **버전닝**: `/api/v1/...`
- **에러 포맷(권장)**:
  - `code`, `message`, `details`, `requestId`
- **인증**: (예: 세션/쿠키 기반 또는 JWT) 선택 및 근거를 ADR로 남긴다.

### 6.4 데이터(초안)
- **주요 엔티티**:
  - 
- **식별자 전략**: (예: UUID)
- **감사 필드**: createdAt/updatedAt/createdBy 등

## 7. 운영/배포/환경

### 7.1 환경 정의
- **Local**:
- **Dev**:
- **Stage**:
- **Prod**:

### 7.2 구성/설정 관리
- **프론트 env**: `.env.local` 등(비밀정보는 절대 커밋하지 않기)
  - Chat 테스트(F-005): `GEMINI_API_KEY` 필요 (예: `apps/web/.env.local`). 선택: `GEMINI_MODEL`(v1beta에서 실제로 열리는 모델 ID만)
- **백엔드 env**: `application-*.yml` + Secret Manager 권장

### 7.3 릴리즈/롤백
- **배포 전략**: (예: Blue/Green, Rolling)
- **롤백 기준**:

## 8. QA / 수용 기준(Acceptance Criteria)

### 8.1 전역 수용 기준
- 

### 8.2 기능별 수용 기준 예시
#### F-001
- Given
- When
- Then

### 8.3 테스트 전략
- **Frontend**: Unit/Integration/E2E(선택)
- **Backend**: Unit/Integration

## 9. 리스크 & 오픈 이슈

### 9.1 리스크
| 리스크 | 영향 | 가능성 | 대응 |
|---|---|---|---|
|  |  |  |  |

### 9.2 오픈 이슈(결정 필요)
- 인증 방식(세션 vs JWT) 결정
- 에러 표준 포맷 확정
- API 스펙 문서화 방식(OpenAPI/Swagger) 확정

## 10. 일정(마일스톤)
- **M0**: 요구사항 확정
- **M1**: MVP 개발
- **M2**: 내부 QA/베타
- **M3**: 정식 릴리즈

---

## 부록 A. 용어(Glossary)
- 

## 부록 B. 변경 이력(Changelog)
| 날짜 | 버전 | 변경 요약 | 작성자 |
|---|---|---|---|
|  | v0.1 | 초기 생성 |  |
| 2026-05-08 | v0.2 | 프론트엔드 초기 세팅(Next.js+TS+Tailwind), 랜딩/하단탭/전체메뉴, 경험 기반 메뉴 활성화 스캐폴딩 추가 | Cursor Agent |
| 2026-05-08 | v0.3 | Chat 테스트 모드: Gemini 1.5 Flash API 연동(서버 라우트), 프롬프트+RAG 컨텍스트 전달, 응답 타임라인 표시 | Cursor Agent |
| 2026-05-11 | v0.4 | Gemini 모델 가용성 이슈 대응: 서버에서 모델 후보를 순차 폴백(예: `gemini-1.5-flash-latest` → `gemini-2.0-flash`) | Cursor Agent |
| 2026-05-11 | v0.5 | Gemini 429(쿼터) 대응: 서버가 429 및 retry-after 정보를 전달, Chat 자동 시작은 세션당 1회로 제한 | Cursor Agent |
| 2026-05-11 | v0.6 | Windows 개발 환경: PowerShell 실행 정책으로 `npm.ps1`이 막힐 때를 위한 `npm.cmd` 우회(`scripts/dev-web.cmd`), VS Code Task 추가, README 트러블슈팅 | Cursor Agent |
| 2026-05-11 | v0.7 | Chat API: 존재하지 않는 모델 ID(`gemini-3.0-flash` 등)로 인한 404 방지 — 실제 모델 폴백 복구, 선택적 `GEMINI_MODEL` | Cursor Agent |
| 2026-05-11 | v0.8 | Chat 기본 모델을 **Gemini 3.1 Flash Lite**(`gemini-3.1-flash-lite`)로 변경, UI/PRD 문구 정합 | Cursor Agent |
| 2026-05-11 | v0.9 | Chat 시스템 프롬프트: 모델 자기서술 시 1.5 Flash 등 잘못된 관습 응답 방지 — `gemini-3.1-flash-lite`로 답하도록 명시 | Cursor Agent |

