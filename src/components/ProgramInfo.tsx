import React, { useState } from "react";
import {
  Database,
  RefreshCw,
  Code,
  FileText,
  Mail,
  Download,
  Search,
  Calendar,
  Info,
  Cpu,
  Globe,
} from "lucide-react";

const ProgramInfo: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState([
    "데이터 소스",
    "업데이트 히스토리",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const categories = [
    "데이터 소스",
    "업데이트 히스토리",
    "시스템 정보",
    "사용 가이드",
    "기술 스택",
  ];

  const dataSources = {
    "국가 온실가스 인벤토리": {
      제공기관: "환경부",
      기간: "1990-2021",
      데이터형태: "CSV",
      업데이트주기: "연 1회",
      설명: "국가별 온실가스 배출량 통계 데이터",
      파일명: "국가 온실가스 인벤토리(1990_2021).csv",
    },
    "배출권 거래데이터": {
      제공기관: "한국환경공단",
      기간: "2021-현재",
      데이터형태: "CSV",
      업데이트주기: "일 1회",
      설명: "KAU24 등 배출권 거래 시장 데이터",
      파일명: "배출권_거래데이터.csv",
    },
    "3차 사전할당": {
      제공기관: "환경부",
      기간: "2021-2025",
      데이터형태: "CSV",
      업데이트주기: "연 1회",
      설명: "3차 사전할당 대상 업체별 할당량",
      파일명: "01. 3차_사전할당_20250613090824.csv",
    },
    "지역별 CO₂ 농도": {
      제공기관: "기상청/환경부",
      기간: "2020-현재",
      데이터형태: "Excel",
      업데이트주기: "월 1회",
      설명: "지역별 이산화탄소 농도 측정 데이터",
      파일명: "기업_규모_지역별_온실가스_배출량_20250615183643.xlsx",
    },
    "기업 배출량": {
      제공기관: "한국에너지공단",
      기간: "2020-현재",
      데이터형태: "CSV",
      업데이트주기: "분기 1회",
      설명: "산업부문 에너지사용 및 온실가스배출량 통계",
      파일명:
        "한국에너지공단_산업부문 에너지사용 및 온실가스배출량 통계_20231231.csv",
    },
  };

  const updates = [
    {
      날짜: "2024-01-15",
      버전: "v2.0.0",
      제목: "ESG 랭킹 시스템 메인 페이지 통합 완료",
      설명: "ESG 기반 탄소 감축 랭킹 시스템을 메인 페이지에 완전 통합",
      카테고리: "기능 추가",
      상세내용: [
        "🥇 ESG 랭킹 보드 구현",
        "🥈 KPI 비교 시스템 추가",
        "🥉 Gamification 배지 시스템",
        "🧠 AI 시뮬레이터 통합",
      ],
    },
    {
      날짜: "2024-01-14",
      버전: "v1.3.0",
      제목: "AI 챗봇 시나리오 시뮬레이션 추가",
      설명: "대화형 AI 챗봇을 통한 What-if 분석 기능 구현",
      카테고리: "기능 추가",
      상세내용: [
        "💬 자연어 입력 처리",
        "📊 시나리오 시뮬레이션",
        "🎯 전략 추천 시스템",
        "📈 결과 시각화",
      ],
    },
    {
      날짜: "2024-01-13",
      버전: "v1.2.0",
      제목: "구매 전략 대시보드 개발",
      설명: "탄소배출권 구매 전략을 위한 전문 대시보드 구현",
      카테고리: "기능 추가",
      상세내용: [
        "🔔 알림 시스템",
        "📈 타이밍 분석",
        "♻️ 대체 전략 분석",
        "💹 헤징 전략",
        "📄 AI 리포트",
      ],
    },
    {
      날짜: "2024-01-12",
      버전: "v1.1.0",
      제목: "실시간 데이터 연동 완료",
      설명: "실제 CSV 데이터 파일과 연동하여 정확한 분석 제공",
      카테고리: "데이터 연동",
      상세내용: [
        "📁 CSV 파일 로드",
        "🔧 인코딩 문제 해결",
        "📊 데이터 전처리",
        "🎯 정확한 시각화",
      ],
    },
    {
      날짜: "2024-01-11",
      버전: "v1.0.0",
      제목: "초기 버전 출시",
      설명: "탄소배출권 통합 관리 시스템 첫 출시",
      카테고리: "초기 출시",
      상세내용: [
        "🌍 기본 대시보드",
        "📊 차트 시각화",
        "🔍 필터링 기능",
        "📱 반응형 디자인",
      ],
    },
  ];

  const techStack = {
    프론트엔드: {
      React: "사용자 인터페이스 라이브러리",
      TypeScript: "타입 안전성을 위한 JavaScript 확장",
      Vite: "빠른 개발 서버 및 빌드 도구",
      "Tailwind CSS": "유틸리티 기반 CSS 프레임워크",
    },
    백엔드: {
      "Node.js": "JavaScript 런타임 환경",
      Express: "웹 애플리케이션 프레임워크",
      TypeScript: "백엔드 타입 안전성",
      PM2: "프로세스 관리자",
    },
    "데이터 시각화": {
      "Plotly.js": "인터랙티브 차트 라이브러리",
      "React-Plotly.js": "React용 Plotly 래퍼",
      Recharts: "React용 차트 라이브러리",
      "D3.js": "데이터 기반 문서 조작",
    },
    "데이터 처리": {
      "Papa Parse": "CSV 파싱 라이브러리",
      Lodash: "JavaScript 유틸리티 라이브러리",
      "Math.js": "수학 계산 라이브러리",
      "Date-fns": "날짜 조작 라이브러리",
    },
    "배포 및 인프라": {
      Docker: "컨테이너화 플랫폼",
      Nginx: "웹 서버 및 리버스 프록시",
      "GitHub Actions": "CI/CD 파이프라인",
      "AWS/Vercel": "클라우드 호스팅 플랫폼",
    },
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filterByDate = (dateString: string) => {
    const date = new Date(dateString);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const filterBySearch = (text: string) => {
    if (!searchTerm) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          📋 프로그램 정보
        </h1>
        <p className="text-gray-600">탄소배출권 통합 관리 시스템 상세 정보</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Search className="h-5 w-5 mr-2" />
          🔍 정보 필터
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 선택
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날짜 범위
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색어
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="키워드를 입력하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Data Sources */}
      {selectedCategories.includes("데이터 소스") && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Database className="h-6 w-6 mr-2" />
            📁 데이터 소스
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(dataSources).map(([name, info]) => {
              if (!filterBySearch(name) && !filterBySearch(info.설명))
                return null;

              return (
                <div key={name} className="bg-white/20 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{name}</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>제공기관:</strong> {info.제공기관}
                    </div>
                    <div>
                      <strong>기간:</strong> {info.기간}
                    </div>
                    <div>
                      <strong>데이터형태:</strong> {info.데이터형태}
                    </div>
                    <div>
                      <strong>업데이트주기:</strong> {info.업데이트주기}
                    </div>
                    <div>
                      <strong>설명:</strong> {info.설명}
                    </div>
                    <div className="bg-white/20 p-2 rounded mt-2">
                      <strong>파일명:</strong>{" "}
                      <code className="text-xs">{info.파일명}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Update History */}
      {selectedCategories.includes("업데이트 히스토리") && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <RefreshCw className="h-6 w-6 mr-2" />
            🔄 업데이트 히스토리
          </h2>

          <div className="space-y-4">
            {updates.map((update, index) => {
              if (!filterByDate(update.날짜)) return null;
              if (!filterBySearch(update.제목) && !filterBySearch(update.설명))
                return null;

              return (
                <div key={index} className="bg-white/20 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{update.제목}</h3>
                      <div className="text-sm opacity-90">
                        {update.날짜} - {update.버전} | {update.카테고리}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{update.설명}</p>
                  <div className="space-y-1">
                    <div className="font-semibold text-sm">상세 내용:</div>
                    {update.상세내용.map((detail, idx) => (
                      <div key={idx} className="text-sm ml-4">
                        • {detail}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System Info */}
      {selectedCategories.includes("시스템 정보") && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Cpu className="h-6 w-6 mr-2" />
            💻 시스템 정보
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3">🏗️ 아키텍처</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>프레임워크:</strong> React + Vite
                </div>
                <div>
                  <strong>언어:</strong> TypeScript
                </div>
                <div>
                  <strong>스타일링:</strong> Tailwind CSS
                </div>
                <div>
                  <strong>차트:</strong> Plotly.js + Recharts
                </div>
                <div>
                  <strong>라우팅:</strong> React Router
                </div>
                <div>
                  <strong>상태관리:</strong> React Hooks
                </div>
              </div>
            </div>

            <div className="bg-white/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3">📁 프로젝트 구조</h3>
              <div className="text-sm font-mono bg-black/20 p-3 rounded">
                <div>carbon-dashboard/</div>
                <div>├── src/</div>
                <div>│ ├── components/</div>
                <div>│ ├── hooks/</div>
                <div>│ ├── types/</div>
                <div>│ ├── utils/</div>
                <div>│ └── main.tsx</div>
                <div>├── public/</div>
                <div>├── package.json</div>
                <div>└── vite.config.ts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Guide */}
      {selectedCategories.includes("사용 가이드") && (
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
            <Info className="h-6 w-6 mr-2" />
            📖 사용 가이드
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                🎯 1단계: 현황 파악
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ol className="space-y-2 text-sm">
                  <li>
                    1. <strong>ESG 랭킹 페이지</strong>에서 전체 시스템 개요
                    확인
                  </li>
                  <li>
                    2. <strong>필터 설정</strong>에서 기업 정보 입력
                  </li>
                  <li>
                    3. <strong>KPI 대시보드</strong>에서 현재 성과 확인
                  </li>
                  <li>
                    4. <strong>랭킹 보드</strong>에서 경쟁사 대비 위치 파악
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">
                💡 2단계: 전략 수립
              </h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <ol className="space-y-2 text-sm">
                  <li>
                    1. <strong>현황 대시보드</strong>에서 시장 상황 분석
                  </li>
                  <li>
                    2. <strong>구매 전략 페이지</strong>에서 투자 방향 결정
                  </li>
                  <li>
                    3. <strong>AI 챗봇</strong>으로 시나리오 시뮬레이션
                  </li>
                  <li>
                    4. <strong>헤징 전략</strong>으로 리스크 관리
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-3">
                📈 3단계: 실행 및 모니터링
              </h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <ol className="space-y-2 text-sm">
                  <li>1. 수립된 전략 실행</li>
                  <li>
                    2. <strong>실시간 알림</strong>으로 시장 변화 추적
                  </li>
                  <li>
                    3. <strong>성과 지표</strong>로 결과 모니터링
                  </li>
                  <li>
                    4. <strong>AI 리포트</strong>로 주기적 평가
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {selectedCategories.includes("기술 스택") && (
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
            <Code className="h-6 w-6 mr-2" />
            🛠️ 기술 스택
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(techStack).map(([category, technologies]) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-blue-600">
                  {category}
                </h3>
                <div className="space-y-2">
                  {Object.entries(technologies).map(([tech, description]) => (
                    <div key={tech} className="border-l-4 border-blue-200 pl-3">
                      <div className="font-semibold text-sm">{tech}</div>
                      <div className="text-xs text-gray-600">{description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
          <FileText className="h-6 w-6 mr-2" />
          📤 정보 내보내기
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <FileText className="h-5 w-5 mr-2" />
            📄 PDF 리포트 생성
          </button>

          <button className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-5 w-5 mr-2" />
            📊 Excel 데이터 내보내기
          </button>

          <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Mail className="h-5 w-5 mr-2" />
            📧 이메일 공유
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 py-8 border-t">
        <div className="flex items-center justify-center mb-2">
          <Globe className="h-5 w-5 mr-2" />
          <span className="font-semibold">탄소배출권 통합 관리 시스템</span>
        </div>
        <p className="text-sm">최신 업데이트: 2024-01-15 | 버전: v2.0.0</p>
        <p className="text-xs mt-1">Built with React + TypeScript + Vite</p>
      </div>
    </div>
  );
};

export default ProgramInfo;
