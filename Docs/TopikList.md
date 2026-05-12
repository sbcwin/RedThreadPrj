# TopikList

> `UserSpec.md`에서 **토픽 제목 + `maleDefault` / `femaleDefault`**만 추린 트리.  
> 원칙: 이 파일의 **토픽 순서/값은 `UserSpec.md`와 항상 동일**해야 한다. (수정 시 `UserSpec.md`를 기준으로 동기화)

## Basic Spec

- **BASIC.FACTS — 팩트 기반 스펙** (`maleDefault=10`, `femaleDefault=10`)
- **BASIC.LOCATION — 거주지역(국가/도시)** (`maleDefault=10`, `femaleDefault=8`)
- **BASIC.WORK — 직업** (`maleDefault=10`, `femaleDefault=12`)
- **BASIC.MARRIAGE — 혼인/가족** (`maleDefault=15`, `femaleDefault=15`)
- **BASIC.INTENT — 관계/결혼 의사** (`maleDefault=15`, `femaleDefault=15`)
- **BASIC.LIFESTYLE — 생활 습관** (`maleDefault=10`, `femaleDefault=8`)
- **BASIC.HEALTH — 건강 여부** (`maleDefault=10`, `femaleDefault=10`)
- **BASIC.SAFETY — 안전/법적 리스크** (`maleDefault=15`, `femaleDefault=20`)
- **BASIC.RELIGION — 종교** (`maleDefault=5`, `femaleDefault=2`)

## External Spec

- **EXT.PHYSICAL — 신체조건** (`maleDefault=45`, `femaleDefault=20`)
  - **EXT.PHYSICAL.APPEARANCE — 외형적 특성** (`maleDefault=80`, `femaleDefault=60`)
  - **EXT.PHYSICAL.HEALTH_MANAGEMENT — 건강 관리** (`maleDefault=20`, `femaleDefault=40`)

- **EXT.ECONOMY — 경제력** (`maleDefault=25`, `femaleDefault=50`)
  - **EXT.ECONOMY.INCOME — 소득 수준** (`maleDefault=40`, `femaleDefault=50`)
  - **EXT.ECONOMY.ASSET — 자산 현황** (`maleDefault=30`, `femaleDefault=35`)
  - **EXT.ECONOMY.HOUSING_PLAN — 주거 계획** (`maleDefault=30`, `femaleDefault=15`)

- **EXT.SOCIAL_STATUS — 사회적 지위** (`maleDefault=30`, `femaleDefault=30`)
  - **EXT.SOCIAL_STATUS.JOB_STABILITY — 직업적 안정성** (`maleDefault=60`, `femaleDefault=75`)
  - **EXT.SOCIAL_STATUS.EDUCATION — 학업 배경** (`maleDefault=40`, `femaleDefault=25`)

## Internal Spec

- **INT.VALUES — 내적 가치관** (`maleDefault=100`, `femaleDefault=100`)
  - **INT.VALUES.RELIGION_LIFESTYLE — 종교 및 생활 습관** (`maleDefault=30`, `femaleDefault=30`)
  - **INT.VALUES.CHILDREN_FUTURE — 자녀 및 미래관** (`maleDefault=40`, `femaleDefault=30`)
  - **INT.VALUES.SPENDING_HABITS — 소비 성향** (`maleDefault=30`, `femaleDefault=40`)

