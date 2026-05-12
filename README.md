# RedThreadPrj

## Frontend (Next.js)

Location: `apps/web`

### Setup

```bash
npm install
```

### Run (web)

```bash
npm run dev:web
```

### Windows에서 `npm run`이 안 될 때 (자주 나는 원인)

PowerShell이 **`npm.ps1`을 “스크립트 실행”으로 막아서** `npm` 자체가 실패하는 경우가 많습니다. (메시지에 `about_Execution_Policies`, `npm.ps1` 로드 불가 등이 보임)

**해결 A — 한 번만 정책 완화(권장, 현재 사용자만)**

PowerShell을 **관리자 권한 없이** 열고:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

터미널/Cursor를 **완전히 닫았다가 다시 연 뒤** `npm run dev:web`를 다시 시도하세요.

**해결 B — `npm.cmd`로 우회 (정책 변경 없이)**

프로젝트 루트에서:

```bat
npm.cmd run dev:web
```

또는 저장소에 포함된 배치 파일:

```bat
scripts\dev-web.cmd
```

**해결 C — Cursor/VS Code에서 `cmd`로 실행**

- `Terminal: Run Task…` → **dev:web (Windows, npm.cmd)** 선택 (`.vscode/tasks.json`)

Node가 아예 없으면 `npm.cmd not found`가 납니다. 이 경우 [Node.js LTS](https://nodejs.org/) 설치 후 터미널을 다시 여세요.

### What’s implemented (skeleton)

- Always starts at the **Landing** page (`/`)
- Bottom tabs:
  - Left-most: **Landing**
  - Middle tabs: enabled only after the feature is “experienced”
  - Right-most: **Menu** (opens full feature list)
- Full menu (bottom sheet): shows all features, but **locks** those not experienced yet

