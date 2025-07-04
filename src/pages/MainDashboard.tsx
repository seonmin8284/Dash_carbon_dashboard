import React, { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { useData } from "../hooks/useData";
import QuickStats from "../components/QuickStats";
import MainFeatures from "../components/MainFeatures";
import ESGSettings from "../components/ESGSettings";
import ESGRankingTable from "../components/ESGRankingTable";
import CompanyStats from "../components/CompanyStats";

interface CompanyRanking {
  rank: number;
  company: string;
  industry: string;
  reductionRate: number;
  allocationEfficiency: number;
  esgScore: number;
  totalScore: number;
}

const MainDashboard: React.FC = () => {
  const { esgTrendData } = useData();
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

  // ApexCharts 로딩 상태 관리 (최상위에서 한 번만)
  useEffect(() => {
    if (window.ApexCharts) {
      setApexChartsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/apexcharts@3.45.1/dist/apexcharts.min.js";
    script.onload = () => setApexChartsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 사이드바 설정 상태
  const [companyName, setCompanyName] = useState("삼성전자");
  const [industry, setIndustry] = useState("전자제품");
  const [currentEsgScore, setCurrentEsgScore] = useState(85.2);
  const [currentReductionRate, setCurrentReductionRate] = useState(18.5);
  const [currentAllocationRatio, setCurrentAllocationRatio] = useState(112.3);

  // 배지 생성 함수
  const generateBadgeContent = () => {
    const score = currentEsgScore;
    if (score >= 90)
      return { grade: "A+", medal: "🥇", color: "text-yellow-600" };
    if (score >= 80) return { grade: "A", medal: "🥈", color: "text-gray-600" };
    if (score >= 70)
      return { grade: "B+", medal: "🥉", color: "text-amber-600" };
    if (score >= 60) return { grade: "B", medal: "🏅", color: "text-blue-600" };
    return { grade: "C", medal: "🎖️", color: "text-red-600" };
  };

  // 랭킹 데이터 생성
  const generateRankingData = (): CompanyRanking[] => {
    const companies = [
      { name: "삼성전자", industry: "전자제품" },
      { name: "POSCO", industry: "철강" },
      { name: "LG화학", industry: "화학" },
      { name: "현대자동차", industry: "자동차" },
      { name: "현대건설", industry: "건설" },
      { name: "한국전력", industry: "에너지" },
    ];

    return companies
      .map((comp, index) => {
        const reductionRate = Math.random() * 20 + 10; // 10-30%
        const allocationEfficiency = Math.random() * 70 + 80; // 80-150%
        const esgScore = Math.random() * 35 + 60; // 60-95
        const totalScore =
          reductionRate * 0.4 +
          (allocationEfficiency / 100) * 30 +
          esgScore * 0.3;

        return {
          rank: index + 1,
          company: comp.name,
          industry: comp.industry,
          reductionRate: Math.round(reductionRate * 10) / 10,
          allocationEfficiency: Math.round(allocationEfficiency * 10) / 10,
          esgScore: Math.round(esgScore * 10) / 10,
          totalScore: Math.round(totalScore * 10) / 10,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  };

  const rankings = generateRankingData();
  const { grade, medal, color } = generateBadgeContent();

  // 현재 순위 계산
  const currentRank = rankings.findIndex((r) => r.company === companyName) + 1;

  // 업종 평균 감축률 계산
  const industryAvgReduction =
    rankings
      .filter((r) => r.industry === industry)
      .reduce((sum, r) => sum + r.reductionRate, 0) /
    Math.max(rankings.filter((r) => r.industry === industry).length, 1);

  // 차트 생성 함수들
  const createTrendChart = () => {
    if (!apexChartsLoaded) return <div>차트 준비 중입니다...</div>;
    if (!esgTrendData || esgTrendData.length === 0)
      return <div>ESG 등급 추세 데이터가 없습니다.</div>;
    return <div id="trend-chart" />;
  };

  const createKPIChart = () => {
    if (!apexChartsLoaded) return <div>차트 준비 중입니다...</div>;
    return <div id="kpi-chart" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          탄소배출권 통합 관리 시스템
        </h1>
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            통합 탄소배출권 관리 플랫폼
          </h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            탄소배출량 모니터링부터 구매 전략 수립까지, 모든 것을 한 곳에서
            관리하세요.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            이 시스템은 기업의 탄소배출권 관리를 위한 종합 솔루션을 제공합니다.
            실시간 데이터 기반 분석과 AI 기반 전략 추천으로 최적의 의사결정을
            지원합니다.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Features */}
      <MainFeatures />

      {/* ESG Ranking System */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            ESG 기반 탄소 감축 랭킹 시스템
          </h2>
          <p className="mt-2 text-gray-600">
            실시간 ESG 성과 추적 및 경쟁 분석
          </p>
        </div>

        <div className="p-6">
          {/* ESG Settings */}
          <ESGSettings
            companyName={companyName}
            setCompanyName={setCompanyName}
            industry={industry}
            setIndustry={setIndustry}
            currentEsgScore={currentEsgScore}
            setCurrentEsgScore={setCurrentEsgScore}
            currentReductionRate={currentReductionRate}
            setCurrentReductionRate={setCurrentReductionRate}
            currentAllocationRatio={currentAllocationRatio}
            setCurrentAllocationRatio={setCurrentAllocationRatio}
          />

          {/* ESG Ranking Board */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              탄소 감축 성과 기반 ESG 랭킹 보드
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Rankings Table */}
            <ESGRankingTable rankings={rankings} currentCompany={companyName} />

            {/* Current Company Stats */}
            <CompanyStats
              currentRank={currentRank}
              currentEsgScore={currentEsgScore}
              grade={grade}
            />
          </div>

          {/* Trend Chart */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              ESG 등급 추세
            </h4>
            {createTrendChart()}
          </div>

          {/* KPI Comparison */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              업종별·기업별 탄소 KPI 비교
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  총배출량 대비 감축률
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentReductionRate}%
                </div>
                <div className="text-sm text-gray-500">
                  업종 평균 {industryAvgReduction.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  할당 대비 잉여율
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentAllocationRatio}%
                </div>
                <div className="text-sm text-gray-500">
                  {currentAllocationRatio > 100 ? "탄소 여유 있음" : "부족"}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">거래 활용도</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(Math.random() * 35 + 60).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">효율적</div>
              </div>
            </div>
          </div>

          {/* KPI Comparison Chart */}
          <div className="mb-6">{createKPIChart()}</div>

          {/* Badge System */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              ESG 등급 배지 + 소셜 공유
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Badge Display */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-8 rounded-lg text-center">
                <div className="text-4xl mb-4">{medal}</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {grade} 등급
                </div>
                <div className="text-lg text-gray-700 mb-2">{companyName}</div>
                <div className="text-gray-600">ESG 점수: {currentEsgScore}</div>
                <div className="mt-4 text-sm text-gray-500">
                  감축률: {currentReductionRate}% | 할당효율:{" "}
                  {currentAllocationRatio}%
                </div>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                ESG 성과 공유
              </h4>
              <p className="text-gray-600 mb-4">
                당신의 ESG 성과를 소셜 미디어에 공유하세요!
              </p>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  LinkedIn에 공유
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                  Twitter에 공유
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  이메일로 공유
                </button>
              </div>
            </div>
          </div>

          {/* AI Simulator */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              AI 시뮬레이터
            </h4>
            <p className="text-gray-600 mb-4">
              ESG 점수 향상을 위한 AI 기반 전략 시뮬레이션
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">현재 상태</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {currentEsgScore}점
                  </div>
                  <div className="text-xs text-gray-500">ESG 점수</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {currentReductionRate}%
                  </div>
                  <div className="text-xs text-gray-500">감축률</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {currentAllocationRatio}%
                  </div>
                  <div className="text-xs text-gray-500">할당 효율</div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-2">개선 전략</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">에너지 효율 개선</span>
                  <span className="text-green-600">+5점</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">재생에너지 투자</span>
                  <span className="text-green-600">+8점</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">공급망 최적화</span>
                  <span className="text-green-600">+3점</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
