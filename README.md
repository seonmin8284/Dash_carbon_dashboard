# 🌍 탄소배출권 통합 관리 시스템

한국의 탄소배출량과 배출권 거래 현황을 시각화하는 현대적인 웹 대시보드입니다. React + TypeScript 프론트엔드와 Flask 백엔드로 구축되었으며, 실시간 데이터 분석과 AI 기반 리포트 생성기를 제공합니다.

![image](https://github.com/user-attachments/assets/da4a6623-b8fd-47f3-882b-400ae9b5feb2)
![image](https://github.com/user-attachments/assets/5da6498a-e303-452f-b530-a5f5e9d99a47)

## 🎯 최신 업데이트 (2025.01)

### ✨ 주요 개선사항

- **🔄 React + TypeScript 마이그레이션**: 현대적인 프론트엔드 아키텍처로 전환
- **📄 AI 리포트 생성기**: PDF 문서 분석 및 새로운 주제의 보고서 자동 생성
- **🎨 현대적인 UI/UX**: Tailwind CSS 기반의 깔끔하고 직관적인 인터페이스
- **📊 인터랙티브 목차 편집**: 드래그 앤 드롭으로 목차 구조 편집 가능
- **🤖 AI 챗봇**: 탄소 데이터 분석을 위한 대화형 AI 어시스턴트
- **📈 실시간 시각화**: 다양한 차트와 그래프로 데이터 시각화
- **📱 반응형 디자인**: 모바일과 데스크톱에서 최적화된 경험

## 📊 주요 기능

### 🏠 메인 대시보드

- **📊 실시간 지표**: 탄소배출권 보유수량 및 현재 배출량 게이지
- **📈 동적 차트**: 다양한 차트 타입으로 데이터 시각화
- **🔍 인터랙티브 필터링**: 연도/월별 데이터 필터링
- **📊 ESG 순위**: 기업별 ESG 평가 및 순위 표시

### 📄 AI 리포트 생성기

- **📎 PDF 문서 업로드**: 참고할 보고서 형식의 PDF 파일 업로드
- **🧠 AI 문서 분석**: 목차 자동 추출 및 문서 구조 분석
- **📝 새로운 주제 입력**: 생성할 보고서의 주제 입력
- **🤖 AI 보고서 생성**: 참고 문서의 형식을 학습하여 새로운 주제의 보고서 생성
- **📥 Word 문서 다운로드**: 생성된 보고서를 .docx 형식으로 다운로드
- **🎯 인터랙티브 목차 편집**: 드래그 앤 드롭으로 목차 구조 수정

### 💹 구매 전략

- **📊 시장 분석**: KAU24 시가 및 거래량 추이 분석
- **🏭 기업별 현황**: 주요 기업별 탄소배출권 할당량 분석
- **📈 전략 도구**: 다양한 구매 전략 시뮬레이션

### 🤖 AI 챗봇

- **💬 실시간 대화**: 탄소 데이터에 대한 즉시 질의응답
- **📊 자동 시각화**: 질문에 따른 차트와 그래프 자동 생성
- **🔍 스마트 분석**: 복잡한 데이터 질문도 즉시 분석 및 답변

## 🏗️ 프로젝트 구조

```
Dash_carbon_dashboard/
├── src/                          # 🎯 React 프론트엔드
│   ├── components/               # 📦 재사용 가능한 컴포넌트
│   │   ├── Layout.tsx           # 🏗️ 메인 레이아웃
│   │   ├── ChatInterface.tsx    # 💬 챗봇 인터페이스
│   │   ├── CompanyStats.tsx     # 📊 기업 통계
│   │   ├── EmissionsChart.tsx   # 📈 배출량 차트
│   │   ├── ESGRankingCard.tsx   # 🌱 ESG 순위 카드
│   │   ├── GaugeCharts.tsx      # 📊 게이지 차트
│   │   ├── MarketChart.tsx      # 💹 시장 차트
│   │   ├── QuickStats.tsx       # ⚡ 빠른 통계
│   │   └── ...                  # 기타 컴포넌트들
│   ├── pages/                   # 📄 페이지 컴포넌트
│   │   ├── Dashboard.tsx        # 🏠 메인 대시보드
│   │   ├── Strategy.tsx         # 💹 구매 전략
│   │   ├── ReportGenerator.tsx  # 📄 AI 리포트 생성기
│   │   ├── Chatbot.tsx          # 🤖 AI 챗봇
│   │   └── ProgramInfo.tsx      # ℹ️ 프로그램 정보
│   ├── hooks/                   # 🎣 커스텀 훅
│   │   └── useData.ts           # 📊 데이터 관리 훅
│   ├── types/                   # 📝 TypeScript 타입 정의
│   │   └── index.ts             # 🏷️ 공통 타입들
│   ├── utils/                   # 🔧 유틸리티 함수
│   │   └── dataLoader.ts        # 📊 데이터 로더
│   ├── contexts/                # 🎯 React 컨텍스트
│   ├── App.tsx                  # 🎯 메인 앱 컴포넌트
│   └── main.tsx                 # 🚀 앱 진입점
├── api/                         # 🔧 Flask 백엔드
│   └── report_generator.py      # 📄 AI 리포트 생성기 API
├── data/                        # 📁 탄소 배출 데이터 파일들
│   ├── 국가 온실가스 인벤토리(1990_2021).csv  # 주요 데이터
│   ├── 01. 3차_사전할당_20250613090824.csv
│   ├── 추가할당량_20250613090845.csv
│   └── 기타 탄소 관련 CSV 파일들...
├── chatbot_app.py               # 🤖 챗봇 앱 (레거시)
├── main.py                      # 🎯 Streamlit 메인 앱 (레거시)
├── run_api_server.py            # 🚀 AI 리포트 생성기 API 서버 실행
├── run_dashboard.bat            # 🚀 Windows용 실행 스크립트
├── run_dashboard.ps1            # 🚀 PowerShell용 실행 스크립트
├── package.json                 # 📦 Node.js 의존성
├── requirements.txt             # 📦 Python 의존성
├── vite.config.ts              # ⚡ Vite 설정
└── tailwind.config.js          # 🎨 Tailwind CSS 설정
```

## 🚀 실행 방법

### 방법 1: React 프론트엔드 + Flask 백엔드 (권장)

#### 1단계: 의존성 설치

```bash
# Node.js 의존성 설치
npm install

# Python 의존성 설치
pip install -r requirements.txt
```

#### 2단계: 백엔드 API 서버 실행

```bash
# AI 리포트 생성기 API 서버 실행 (포트 8000)
python run_api_server.py
```

#### 3단계: 프론트엔드 실행

```bash
# React 개발 서버 실행 (포트 5173)
npm run dev
```

#### 4단계: 브라우저에서 접속

- **메인 대시보드**: http://localhost:5173
- **AI 리포트 생성기**: http://localhost:5173/report
- **구매 전략**: http://localhost:5173/strategy
- **AI 챗봇**: http://localhost:5173/chatbot
- **API 서버**: http://localhost:8000

### 방법 2: 기존 Streamlit 방식 실행

#### Windows 사용자

```bash
# 배치 파일로 실행 (가장 간단)
run_dashboard.bat
```

#### PowerShell 사용자

```powershell
# PowerShell 스크립트로 실행
.\run_dashboard.ps1
```

#### 수동 실행

```bash
# 터미널 1: 메인 앱 실행 (포트 8501)
streamlit run main.py --server.port 8501

# 터미널 2: 챗봇 앱 실행 (포트 8502)
streamlit run chatbot_app.py --server.port 8502
```

## 📄 AI 리포트 생성기 사용법

### ✨ 주요 기능

- **📎 PDF 문서 업로드**: 참고할 보고서 형식의 PDF 파일 업로드
- **🧠 AI 문서 분석**: 목차 자동 추출 및 문서 구조 분석
- **📝 새로운 주제 입력**: 생성할 보고서의 주제 입력
- **🤖 AI 보고서 생성**: 참고 문서의 형식을 학습하여 새로운 주제의 보고서 생성
- **📥 Word 문서 다운로드**: 생성된 보고서를 .docx 형식으로 다운로드
- **🎯 인터랙티브 목차 편집**: 드래그 앤 드롭으로 목차 구조 수정

### 🔄 사용 단계

1. **문서 업로드**: 참고할 PDF 문서를 업로드합니다
2. **문서 분석**: AI가 문서의 목차와 구조를 자동으로 분석합니다
3. **주제 입력**: 새로 작성할 보고서의 주제를 입력합니다
4. **목차 편집**: 드래그 앤 드롭으로 목차 구조를 수정합니다
5. **보고서 생성**: AI가 참고 문서의 형식을 학습하여 새로운 주제의 보고서를 생성합니다
6. **다운로드**: 생성된 보고서를 Word 문서로 다운로드합니다

### 🛠️ 기술 스택

- **프론트엔드**: React, TypeScript, Tailwind CSS, Vite
- **백엔드**: Flask, OpenAI API, Pinecone 벡터 스토어
- **PDF 처리**: pdfplumber
- **문서 생성**: python-docx
- **드래그 앤 드롭**: @dnd-kit/core

## 🎨 UI/UX 특징

### 🎯 현대적인 디자인

- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **반응형 디자인**: 모바일과 데스크톱에서 최적화
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 전환
- **애니메이션**: 부드러운 전환 효과와 호버 애니메이션

### 📊 인터랙티브 차트

- **다양한 차트 타입**: 바차트, 라인차트, 파이차트, 게이지 등
- **실시간 업데이트**: 데이터 변경 시 즉시 반영
- **줌 및 팬**: 차트 확대/축소 및 이동 기능
- **툴팁**: 마우스 오버 시 상세 정보 표시

### 🎯 사용자 경험

- **직관적인 네비게이션**: 명확한 메뉴 구조
- **빠른 로딩**: Vite를 통한 빠른 개발 및 빌드
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- **오프라인 지원**: PWA 기능으로 오프라인에서도 사용 가능

## 🔧 개발 환경 설정

### 필수 요구사항

- **Node.js**: 18.0.0 이상
- **Python**: 3.8 이상
- **npm**: 8.0.0 이상

### 개발 도구

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint

# 타입 체크
npm run type-check
```

### 환경 변수 설정

`.env` 파일에 필요한 API 키들을 설정하세요:

```bash
# .env 파일 생성 및 편집
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_PINECONE_API_KEY=your_pinecone_api_key_here
VITE_PINECONE_ENV=your_pinecone_environment_here
```

## 📈 성능 최적화

### 🚀 빌드 최적화

- **코드 스플리팅**: 라우트별 코드 분할
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **이미지 최적화**: WebP 포맷 및 압축
- **캐싱**: 브라우저 캐시 전략

### 📊 데이터 최적화

- **가상화**: 대용량 데이터 렌더링 최적화
- **메모이제이션**: React.memo 및 useMemo 활용
- **지연 로딩**: 필요할 때만 데이터 로드
- **캐싱**: API 응답 캐싱

## 🤝 기여하기

### 개발 환경 설정

1. 저장소를 포크합니다
2. 로컬에 클론합니다
3. 의존성을 설치합니다
4. 개발 서버를 실행합니다
5. 변경사항을 커밋하고 푸시합니다
6. Pull Request를 생성합니다

### 코딩 컨벤션

- **TypeScript**: 엄격한 타입 체크 사용
- **ESLint**: 코드 품질 유지
- **Prettier**: 일관된 코드 포맷팅
- **커밋 메시지**: Conventional Commits 사용

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 [Issues](https://github.com/your-repo/issues) 페이지를 통해 제출해 주세요.

---

**탄소배출권 통합 관리 시스템** - 지속가능한 미래를 위한 데이터 기반 의사결정 도구 🌱
