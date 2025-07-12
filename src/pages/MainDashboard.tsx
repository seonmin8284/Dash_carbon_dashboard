import React, { useState, useEffect, useMemo, useContext } from "react";
import { Trophy } from "lucide-react";
import { useData } from "../hooks/useData";
import QuickStats from "../components/QuickStats";
import MainFeatures from "../components/MainFeatures";
import ESGSettings from "../components/ESGSettings";
import ESGRankingCard from "../components/ESGRankingCard";
import EmergencyAlerts from "../components/EmergencyAlerts";
import { SidebarContext } from "../components/Layout";

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
  const { esgTrendData, esgMultiStandardData } = useData();
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);
  const { sidebarTab } = useContext(SidebarContext);
  const isChatSidebarOpen = sidebarTab === "chat";

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

  // Trend Chart 렌더링
  useEffect(() => {
    if (
      !apexChartsLoaded ||
      !esgMultiStandardData ||
      esgMultiStandardData.length === 0
    )
      return;

    const trendChartElement = document.getElementById("trend-chart");
    if (!trendChartElement) return;

    // 기존 차트 제거
    if (trendChartElement.innerHTML) {
      trendChartElement.innerHTML = "";
    }

    // 평균 ESG 점수 계산
    const averageESGScores = esgMultiStandardData.map((item) => {
      const avg =
        (item.gri.score + item.sasb.score + item.djsi.score + item.kEsg.score) /
        4;
      return Math.round(avg * 10) / 10;
    });

    const options = {
      series: [
        {
          name: "평균 ESG 점수",
          data: averageESGScores,
        },
        {
          name: "GRI 기준",
          data: esgMultiStandardData.map((item) => item.gri.score),
        },
        {
          name: "SASB 기준",
          data: esgMultiStandardData.map((item) => item.sasb.score),
        },
        {
          name: "DJSI 기준",
          data: esgMultiStandardData.map((item) => item.djsi.score),
        },
        {
          name: "K-ESG 기준",
          data: esgMultiStandardData.map((item) => item.kEsg.score),
        },
      ],
      chart: {
        type: "line",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ["#EF4444", "#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
      stroke: {
        curve: "smooth",
        width: [4, 2, 2, 2, 2],
      },
      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 4,
      },
      xaxis: {
        categories: esgMultiStandardData.map((item) => item.year.toString()),
        labels: {
          style: {
            colors: "#6B7280",
          },
        },
      },
      yaxis: {
        min: 50,
        max: 100,
        labels: {
          style: {
            colors: "#6B7280",
          },
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: function (value: number) {
            return value.toFixed(1) + "점";
          },
        },
      },
      markers: {
        size: [8, 4, 4, 4, 4],
        strokeColors: "#FFFFFF",
        strokeWidth: 2,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "14px",
        markers: {
          width: 12,
          height: 12,
        },
      },
    };

    const chart = new window.ApexCharts(trendChartElement, options);
    chart.render();
  }, [apexChartsLoaded, esgMultiStandardData]);

  // KPI Chart 렌더링
  useEffect(() => {
    if (!apexChartsLoaded) return;

    const kpiChartElement = document.getElementById("kpi-chart");
    if (!kpiChartElement) return;

    // 기존 차트 제거
    if (kpiChartElement.innerHTML) {
      kpiChartElement.innerHTML = "";
    }

    const options = {
      series: [
        {
          name: "감축률",
          data: [24.8, 18.5, 22.1, 19.8, 25.3, 21.7, 23.9],
        },
        {
          name: "할당효율",
          data: [118.2, 112.3, 108.7, 115.2, 102.8, 118.5, 110.3],
        },
        {
          name: "ESG 점수",
          data: [91.5, 85.2, 88.7, 82.3, 91.5, 86.8, 89.1],
        },
      ],
      chart: {
        type: "bar",
        height: 300,
        toolbar: {
          show: false,
        },
      },
      colors: ["#10B981", "#3B82F6", "#F59E0B"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Wavico",
          "삼성전자",
          "POSCO",
          "LG화학",
          "현대자동차",
          "현대건설",
          "한국전력",
        ],
        labels: {
          style: {
            colors: [
              "#3B82F6",
              "#6B7280",
              "#6B7280",
              "#6B7280",
              "#6B7280",
              "#6B7280",
              "#6B7280",
            ],
            fontWeight: [
              "bold",
              "normal",
              "normal",
              "normal",
              "normal",
              "normal",
              "normal",
            ],
          },
        },
      },
      yaxis: {
        title: {
          text: "수치 (%)",
          style: {
            color: "#6B7280",
          },
        },
        labels: {
          style: {
            colors: "#6B7280",
          },
        },
      },
      fill: {
        opacity: [1, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      },
      annotations: {
        yaxis: [
          {
            y: 24.8,
            borderColor: "#3B82F6",
            borderWidth: 1,
            strokeDashArray: 3,
            opacity: 0.7,
          },
          {
            y: 118.2,
            borderColor: "#3B82F6",
            borderWidth: 1,
            strokeDashArray: 3,
            opacity: 0.7,
          },
          {
            y: 91.5,
            borderColor: "#3B82F6",
            borderWidth: 1,
            strokeDashArray: 3,
            opacity: 0.7,
          },
        ],
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: function (value: number) {
            return value + "%";
          },
        },
      },
    };

    const chart = new window.ApexCharts(kpiChartElement, options);
    chart.render();
  }, [apexChartsLoaded]);

  // 업종별 ESG 랭킹 차트 렌더링
  useEffect(() => {
    if (!apexChartsLoaded) return;

    const industryChartElement = document.getElementById("industry-esg-chart");
    if (!industryChartElement) return;

    // 기존 차트 제거
    if (industryChartElement.innerHTML) {
      industryChartElement.innerHTML = "";
    }

    const industryData = [
      { industry: "전자제품", avgScore: 87.2, companies: 15, trend: "up" },
      { industry: "철강", avgScore: 82.5, companies: 8, trend: "stable" },
      { industry: "화학", avgScore: 79.8, companies: 12, trend: "up" },
      { industry: "자동차", avgScore: 85.1, companies: 10, trend: "down" },
      { industry: "건설", avgScore: 76.3, companies: 20, trend: "up" },
      { industry: "에너지", avgScore: 88.9, companies: 6, trend: "stable" },
      { industry: "제조업", avgScore: 81.4, companies: 25, trend: "up" },
      { industry: "서비스업", avgScore: 83.7, companies: 18, trend: "stable" },
    ];

    const options = {
      series: [
        {
          name: "평균 ESG 점수",
          data: industryData.map((item) => item.avgScore),
        },
        {
          name: "기업 수",
          data: industryData.map((item) => item.companies),
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ["#10B981", "#3B82F6"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          if (opts.seriesIndex === 0) {
            return val.toFixed(1);
          }
          return val;
        },
        style: {
          fontSize: "12px",
          colors: ["#374151", "#374151"],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: industryData.map((item) => item.industry),
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
          rotate: -45,
        },
      },
      yaxis: [
        {
          title: {
            text: "ESG 점수",
            style: {
              color: "#6B7280",
            },
          },
          labels: {
            style: {
              colors: "#6B7280",
            },
          },
        },
        {
          opposite: true,
          title: {
            text: "기업 수",
            style: {
              color: "#6B7280",
            },
          },
          labels: {
            style: {
              colors: "#6B7280",
            },
          },
        },
      ],
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: "light",
        y: [
          {
            formatter: function (value: number) {
              return value.toFixed(1) + "점";
            },
          },
          {
            formatter: function (value: number) {
              return value + "개사";
            },
          },
        ],
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "14px",
      },
    };

    const chart = new window.ApexCharts(industryChartElement, options);
    chart.render();
  }, [apexChartsLoaded]);

  // 사이드바 설정 상태
  const [companyName, setCompanyName] = useState("삼성전자");
  const [industry, setIndustry] = useState("전자제품");
  const [currentEsgScore, setCurrentEsgScore] = useState(85.2);
  const [currentReductionRate, setCurrentReductionRate] = useState(18.5);
  const [currentAllocationRatio, setCurrentAllocationRatio] = useState(112.3);

  // 랭킹 데이터 생성 - useMemo로 최적화
  const rankings = useMemo((): CompanyRanking[] => {
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
  }, []);

  // 배지 정보 계산 - useMemo로 최적화
  const badgeInfo = useMemo(() => {
    const score = currentEsgScore;
    if (score >= 90)
      return { grade: "A+", medal: "🥇", color: "text-yellow-600" };
    if (score >= 80) return { grade: "A", medal: "🥈", color: "text-gray-600" };
    if (score >= 70)
      return { grade: "B+", medal: "🥉", color: "text-amber-600" };
    if (score >= 60) return { grade: "B", medal: "🏅", color: "text-blue-600" };
    return { grade: "C", medal: "🎖️", color: "text-red-600" };
  }, [currentEsgScore]);

  const { grade, medal, color } = badgeInfo;

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
    if (!apexChartsLoaded)
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          차트 로딩 중...
        </div>
      );
    if (!esgMultiStandardData || esgMultiStandardData.length === 0)
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          ESG 등급 추세 데이터가 없습니다.
        </div>
      );
    return <div id="trend-chart" className="w-full" />;
  };

  const createKPIChart = () => {
    if (!apexChartsLoaded)
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          차트 로딩 중...
        </div>
      );
    return <div id="kpi-chart" className="w-full" />;
  };

  const createIndustryESGChart = () => {
    if (!apexChartsLoaded)
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          차트 로딩 중...
        </div>
      );
    return <div id="industry-esg-chart" className="w-full" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              <span className="text-blue-600">Wavico</span> 탄소배출권 관리
              대시보드
            </h2>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed text-lg">
            <span className="font-semibold text-blue-600">Wavico</span>의 ESG
            우수성을 바탕으로 한
            <span className="font-semibold">
              {" "}
              실시간 탄소배출권 관리 및 전략적 의사결정
            </span>
            을 지원합니다.
          </p>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="text-sm text-gray-600">현재 ESG 점수</div>
              <div className="text-xl font-bold text-blue-600">91.5점</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="text-sm text-gray-600">탄소 감축률</div>
              <div className="text-xl font-bold text-green-600">24.8%</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="text-sm text-gray-600">할당 효율성</div>
              <div className="text-xl font-bold text-purple-600">118.2%</div>
            </div>
          </div> */}
          <p className="text-gray-600 text-sm leading-relaxed">
            AI 기반 예측 분석과 실시간 모니터링으로{" "}
            <span className="font-semibold">Wavico</span>의 지속가능한 성장을
            위한 최적의 탄소배출권 전략을 제시합니다.
          </p>
        </div>
      </div>

      {/* Emergency Alerts */}
      {/* <EmergencyAlerts /> */}

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Features */}
      {/* <MainFeatures /> */}

      {/* ESG Ranking System */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200 border-b border-gray-300 p-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            ESG 기반 탄소 감축 랭킹 시스템
          </h2>
          <p className="mt-2 text-gray-700 font-medium">
            실시간 ESG 성과 추적 및 경쟁 분석
          </p>
        </div>

        <div className="p-6">
          {/* ESG Settings */}
          {/* <ESGSettings
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
          /> */}

          {/* ESG Ranking Board */}
          <ESGRankingCard
            rankings={rankings}
            currentCompany={companyName}
            isChatSidebarOpen={isChatSidebarOpen}
          />

          {/* Trend Charts */}
          <div className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 업종별 ESG 랭킹 차트 */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 mt-6">
                  업종별 ESG 랭킹 & 통계
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  {createIndustryESGChart()}
                </div>
              </div>

              {/* ESG 등급 추세 차트 */}
              <div>
                <h4 className="text-lg font-semibold mb-4 mt-6">
                  <span className="text-blue-600">Wavico</span>
                  <span className="text-gray-900">
                    {" "}
                    ESG 등급 추세 (4가지 기준)
                  </span>
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  {createTrendChart()}
                </div>
              </div>
            </div>
          </div>

          {/* KPI Comparison */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 mt-6">
              업종별·기업별 탄소 KPI 비교
            </h4>
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
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {createKPIChart()}
            </div>
          </div>

          {/* AI Simulator */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
