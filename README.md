# 🌍 탄소배출량 및 배출권 현황 대시보드

한국의 탄소배출량과 배출권 거래 현황을 시각화하는 인터랙티브 웹 대시보드입니다. Streamlit을 기반으로 구축되었으며, 실시간 데이터 분석과 AI 기반 챗봇을 제공합니다.

![image](https://github.com/user-attachments/assets/da4a6623-b8fd-47f3-882b-400ae9b5feb2)
![image](https://github.com/user-attachments/assets/5da6498a-e303-452f-b530-a5f5e9d99a47)

## 🎯 최신 업데이트 (2025.01)

### ✨ 주요 개선사항

- **🤖 AI 챗봇 완전 리뉴얼**: 질문 의도 분석 및 자동 시각화 생성
- **📊 정확한 데이터 표시**: 국가 온실가스 인벤토리 데이터 정확성 개선
- **🎨 동적 시각화**: 질문 타입에 따른 최적 차트 자동 선택
- **🔍 스마트 분석**: 복잡한 데이터 질문도 즉시 분석 및 답변
- **📈 실시간 그래프**: "그래프로 보여줘" 요청 시 즉시 시각화 생성
- **🖥️ 웹뷰 통합**: 메인 대시보드에 우측 패널로 AI 챗봇 iframe 임베드

## 📊 주요 기능

- **🔍 인터랙티브 필터링**: 연도/월별 데이터 필터링
- **📈 실시간 지표**: 탄소배출권 보유수량 및 현재 배출량 게이지
- **🗺️ 지역별 분석**: 전국 17개 시도별 CO₂ 농도 지도 시각화
- **📊 다양한 차트**: 바차트, 트리맵, 시계열 분석 등
- **💹 시장 데이터**: KAU24 시가 및 거래량 추이 분석
- **🏭 기업별 현황**: 주요 기업별 탄소배출권 할당량 분석
- **🤖 AI 챗봇**: 탄소 데이터 분석을 위한 대화형 AI 어시스턴트 (완전 리뉴얼)
- **🖥️ 웹뷰 통합**: 메인 대시보드 우측 패널에 챗봇 임베드

## 🏗️ 프로젝트 구조

```
Dash_carbon_dashboard/
├── main.py                       # 🎯 Streamlit 메인 대시보드 (웹뷰 통합)
├── run_dashboard.bat             # 🚀 Windows용 실행 스크립트
├── run_dashboard.ps1             # 🚀 PowerShell용 실행 스크립트
├── agent/
│   ├── enhanced_carbon_rag_agent.py  # 🚀 향상된 RAG 에이전트 (메인 시스템)
│   ├── data_preprocessor.py      # 📊 데이터 전처리 및 통합
│   ├── query_analyzer.py         # 🧠 질문 의도 분석기 (새로 개선)
│   ├── visualization_engine.py   # 📈 동적 시각화 엔진 (완전 리뉴얼)
│   ├── metadata_manager.py       # 🗃️ 메타데이터 관리자
│   ├── code_executor.py          # ⚡ 안전한 코드 실행기
│   └── carbon_rag_agent.py       # 🤖 기본 탄소 데이터 분석 RAG 에이전트
├── pages/
│   ├── 1_현황_대시보드.py          # 📊 현황 대시보드 페이지
│   ├── 2_구매_전략.py             # 💹 구매 전략 페이지
│   ├── 4_프로그램_정보.py          # ℹ️ 프로그램 정보 페이지
│   └── 5_AI_챗봇.py              # 🤖 AI 챗봇 페이지 (iframe용 최적화)
├── data/                         # 📁 탄소 배출 데이터 파일들
│   ├── 국가 온실가스 인벤토리(1990_2021).csv  # 주요 데이터
│   ├── 01. 3차_사전할당_20250613090824.csv
│   ├── 추가할당량_20250613090845.csv
│   └── 기타 탄소 관련 CSV 파일들...
├── dash_scripts/                 # 📊 Dash 버전 스크립트들
└── requirements.txt              # 📦 의존성 관리 파일
```

### 🔥 핵심 컴포넌트 설명

#### 🤖 Enhanced Carbon RAG Agent

- **통합 시스템**: 모든 CSV 파일을 자동으로 분석하고 통합
- **질문 의도 파악**: AI가 사용자 질문의 의도를 정확히 분석
- **자동 시각화**: 질문 타입에 따라 최적의 차트를 자동 생성
- **정확한 데이터**: 실제 CSV 데이터 값을 정확히 반영

#### 📊 Query Analyzer (질문 분석기)

- **7가지 질문 타입 지원**: 비교, 추세, 순위, 통계, 특정값, 상관관계, 요약
- **시각화 키워드 감지**: "그래프로", "표현해줘", "비교해줘" 등 자동 감지
- **연도 및 엔티티 추출**: 질문에서 연도, 분야, 메트릭 자동 추출

#### 🎨 Visualization Engine (시각화 엔진)

- **동적 차트 생성**: 질문에 맞는 최적 차트 타입 자동 선택
- **한글 폰트 지원**: Windows 환경에서 완벽한 한글 표시
- **데이터 정확성**: 백만톤 CO₂ 단위 정확히 표시
- **스마트 포맷팅**: 데이터 범위에 따른 자동 포맷팅

## 🚀 실행 방법

### 방법 1: 웹뷰 통합 실행 (권장)

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
streamlit run pages/5_AI_챗봇.py --server.port 8502
```

**웹뷰 통합 실행 시**:

- 메인 대시보드: http://localhost:8501
- 우측 패널에 챗봇이 iframe으로 임베드됨
- 별도 창 없이 하나의 인터페이스에서 모든 기능 사용 가능

### 방법 2: 기존 방식 실행

### 1단계: 프로젝트 클론

```bash
# Git 저장소 클론
git clone <repository-url>
cd Dash_carbon_dashboard
```

### 2단계: 가상환경 설정 (권장)

```bash
# 가상환경 생성
python -m venv .venv

# 가상환경 활성화
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

### 3단계: 의존성 설치

```bash
# 필요한 패키지 설치
pip install -r requirements.txt
```

### 4단계: 환경 변수 설정

`.env` 파일에 Upstage API 키를 설정하세요:

```bash
# .env 파일 생성 및 편집
UPSTAGE_API_KEY=your_upstage_api_key_here
```

### 5단계: 대시보드 실행

```bash
# Streamlit 대시보드 실행
streamlit run main.py
```

### 6단계: 브라우저에서 접속

대시보드가 성공적으로 실행되면 터미널에 다음과 같은 메시지가 표시됩니다:

```
You can now view your Streamlit app in your browser.

Local URL: http://localhost:8501
Network URL: http://192.168.x.x:8501
```

브라우저에서 **http://localhost:8501**로 접속하세요.

## 🖥️ 웹뷰 통합 기능

### ✨ 새로운 레이아웃

- **좌측 패널 (3/4)**: 메인 대시보드 콘텐츠
- **우측 패널 (1/4)**: AI 챗봇 iframe 임베드
- **반응형 디자인**: 화면 크기에 따른 자동 조정

### 🤖 우측 패널 챗봇 기능

- **실시간 대화**: 탄소 데이터에 대한 즉시 질의응답
- **빠른 질문 버튼**: 자주 묻는 질문들
- **시각화 지원**: 차트와 그래프 자동 생성
- **컴팩트 UI**: iframe에 최적화된 인터페이스

### 💡 사용 팁

1. **메인 콘텐츠 확인**: 좌측에서 대시보드 데이터 확인
2. **챗봇 질문**: 우측 패널에서 데이터 분석 요청
3. **시각화 공유**: 챗봇이 생성한 차트를 메인 화면에서 확인
4. **빠른 질문**: 우측 하단의 빠른 질문 버튼 활용

## 📋 필요 패키지

```
streamlit>=1.28.0
pandas>=1.5.0
plotly>=5.15.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn==0.13.2
Pillow>=9.5.0
scipy>=1.10.0
python-dotenv==1.0.1

# LangChain & AI 관련
langchain==0.3.21
langchain-upstage==0.3.1
langchain-experimental==0.3.4
langchain-teddynote==0.3.44

# 기타 의존성
scikit-learn>=1.3.0
openpyxl>=3.1.0
tabulate==0.9.0
```

## 🎯 사용 방법

### 기본 조작

1. **페이지 선택**: 사이드바에서 원하는 페이지 선택
2. **연도 선택**: 상단 슬라이더로 연도 선택
3. **월 선택**: 월별 데이터 필터링
4. **차트 상호작용**: 마우스 오버, 줌, 팬 등 지원

### 🤖 AI 챗봇 사용법 (완전 리뉴얼)

#### 📍 접근 방법

1. **웹뷰 통합 모드**: 메인 대시보드 우측 패널에서 바로 사용
2. **독립 실행 모드**: 사이드바에서 **"AI 챗봇"** 페이지 선택
3. 페이지 로딩 시 자동으로 데이터 분석 완료

#### 💬 질문 방법

1. **예시 질문 버튼**: 6가지 예시 질문 중 선택

   - 📈 총배출량의 연도별 변화 추이는?
   - 🏭 에너지 산업과 수송 산업의 배출량 비교
   - 📊 2017년과 2021년의 배출량 차이는?
   - 🔍 가장 많이 배출하는 분야는?
   - 📉 감축률이 가장 높은 연도는?
   - 🌍 전체 데이터에서 평균 배출량은?

2. **직접 질문 입력**: 텍스트 입력창에 질문 작성 후 엔터키 또는 "질문하기" 버튼

#### 🎯 지원하는 질문 타입

| 질문 타입          | 키워드                   | 예시 질문                     | 생성되는 차트 |
| ------------------ | ------------------------ | ----------------------------- | ------------- |
| **📊 비교 분석**   | 비교, 차이, 대비, vs     | "2017년과 2021년 배출량 비교" | 막대 차트     |
| **📈 추세 분석**   | 추이, 변화, 트렌드, 경향 | "연도별 총배출량 변화 추이"   | 선 그래프     |
| **🏆 순위 분석**   | 순위, 가장, 많은, 적은   | "가장 많이 배출하는 분야"     | 막대 차트     |
| **📋 통계 분석**   | 평균, 총합, 전체, 비율   | "전체 평균 배출량"            | 파이 차트     |
| **🔍 특정값 조회** | 얼마, 몇, 수치, 값       | "2021년 총배출량은 얼마?"     | 텍스트 + 차트 |

#### 🎨 시각화 자동 생성 기능

**시각화 키워드 감지**:

- "그래프로 보여줘"
- "차트로 표현해줘"
- "시각화해줘"
