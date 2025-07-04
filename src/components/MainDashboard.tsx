import React, { useState, useEffect } from "react";
import {
  Trophy,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap,
  BarChart3,
  ShoppingCart,
  MessageCircle,
  Info,
  Share2,
  Download,
  Twitter,
  Linkedin,
} from "lucide-react";

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
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

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

  // 월별 트렌드 데이터 생성
  const generateTrendData = () => {
    const months: string[] = [];
    const esgScores: number[] = [];
    const reductionRates: number[] = [];

    for (let i = 1; i <= 12; i++) {
      months.push(`2024-${i.toString().padStart(2, "0")}`);
      esgScores.push(currentEsgScore + (Math.random() - 0.5) * 4);
      reductionRates.push(currentReductionRate + (Math.random() - 0.5) * 2);
    }

    return { months, esgScores, reductionRates };
  };

  const { months, esgScores, reductionRates } = generateTrendData();

  useEffect(() => {
    // ApexCharts가 CDN에서 로드되었는지 확인
    const checkApexCharts = () => {
      if (window.ApexCharts) {
        setApexChartsLoaded(true);
      } else {
        setTimeout(checkApexCharts, 100);
      }
    };
    checkApexCharts();
  }, []);

  // ApexCharts 렌더링 useEffect
  useEffect(() => {
    if (apexChartsLoaded) {
      // ESG 트렌드 차트 렌더링
      const trendChartElement = document.getElementById("trend-chart");
      if (trendChartElement) {
        // 데이터 검증 및 기본값 처리
        const validEsgScores = esgScores.map((score) =>
          isNaN(score) || score === undefined ? 0 : score
        );
        const validReductionRates = reductionRates.map((rate) =>
          isNaN(rate) || rate === undefined ? 0 : rate
        );
        const validMonths = months.filter(
          (month) => month && month.trim() !== ""
        );

        const trendOptions = {
          chart: {
            type: "line" as const,
            height: 400,
            toolbar: {
              show: false,
            },
          },
          series: [
            {
              name: "ESG 점수",
              data: validEsgScores,
            },
            {
              name: "감축률 (%)",
              data: validReductionRates,
            },
          ],
          xaxis: {
            categories: validMonths,
            title: {
              text: "월",
            },
          },
          yaxis: [
            {
              title: {
                text: "ESG 점수",
              },
              min: 0,
              max: Math.max(...validEsgScores) * 1.1,
            },
            {
              opposite: true,
              title: {
                text: "감축률 (%)",
              },
              min: 0,
              max: Math.max(...validReductionRates) * 1.1,
            },
          ],
          title: {
            text: "월별 ESG 점수 및 감축률 추이",
            align: "center" as const,
          },
          colors: ["#3b82f6", "#ef4444"],
          stroke: {
            width: 3,
          },
          markers: {
            size: 6,
          },
        };
        new window.ApexCharts(trendChartElement, trendOptions).render();
      }

      // KPI 차트 렌더링
      const kpiChartElement = document.getElementById("kpi-chart");
      if (kpiChartElement) {
        // 데이터 검증 및 기본값 처리
        const validRankings = rankings.map((r) => ({
          ...r,
          reductionRate:
            isNaN(r.reductionRate) || r.reductionRate === undefined
              ? 0
              : r.reductionRate,
          esgScore:
            isNaN(r.esgScore) || r.esgScore === undefined ? 0 : r.esgScore,
          totalScore:
            isNaN(r.totalScore) || r.totalScore === undefined
              ? 0
              : r.totalScore,
        }));

        const kpiOptions = {
          chart: {
            type: "scatter" as const,
            height: 400,
            toolbar: {
              show: false,
            },
          },
          series: [
            {
              name: "기업",
              data: validRankings.map((r) => ({
                x: r.reductionRate,
                y: r.esgScore,
                z: Math.max(r.totalScore / 2, 1), // 최소값 1 보장
                name: r.company,
              })),
            },
          ],
          xaxis: {
            title: {
              text: "감축률 (%)",
            },
            min: 0,
            max: Math.max(...validRankings.map((r) => r.reductionRate)) * 1.1,
          },
          yaxis: {
            title: {
              text: "ESG 점수",
            },
            min: 0,
            max: Math.max(...validRankings.map((r) => r.esgScore)) * 1.1,
          },
          title: {
            text: "감축률 vs ESG 점수 비교",
            align: "center" as const,
          },
          colors: ["#6366f1"],
          markers: {
            size: validRankings.map((r) => Math.max(r.totalScore / 2, 1)), // 최소값 1 보장
          },
        };
        new window.ApexCharts(kpiChartElement, kpiOptions).render();
      }
    }
  }, [apexChartsLoaded, esgScores, reductionRates, months, rankings]);

  // ESG 트렌드 차트 (ApexCharts)
  const createTrendChart = () => {
    const options = {
      chart: {
        type: "line" as const,
        height: 400,
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: "ESG 점수",
          data: esgScores,
        },
        {
          name: "감축률 (%)",
          data: reductionRates,
        },
      ],
      xaxis: {
        categories: months,
        title: {
          text: "월",
        },
      },
      yaxis: [
        {
          title: {
            text: "ESG 점수",
          },
        },
        {
          opposite: true,
          title: {
            text: "감축률 (%)",
          },
        },
      ],
      title: {
        text: "월별 ESG 점수 및 감축률 추이",
        align: "center" as const,
      },
      colors: ["#3b82f6", "#ef4444"],
      stroke: {
        width: 3,
      },
      markers: {
        size: 6,
      },
    };

    return <div id="trend-chart" className="w-full h-96"></div>;
  };

  // KPI 비교 차트 (ApexCharts)
  const createKPIChart = () => {
    const options = {
      chart: {
        type: "scatter" as const,
        height: 400,
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: "기업",
          data: rankings.map((r) => ({
            x: r.reductionRate,
            y: r.esgScore,
            z: r.totalScore / 2,
            name: r.company,
          })),
        },
      ],
      xaxis: {
        title: {
          text: "감축률 (%)",
        },
      },
      yaxis: {
        title: {
          text: "ESG 점수",
        },
      },
      title: {
        text: "감축률 vs ESG 점수 비교",
        align: "center" as const,
      },
      colors: ["#6366f1"],
      markers: {
        size: rankings.map((r) => r.totalScore / 2),
      },
    };

    return <div id="kpi-chart" className="w-full h-96"></div>;
  };

  // 현재 순위 계산
  const currentRank =
    rankings.find((r) => r.company === companyName)?.rank || "N/A";
  const industryAvgReduction =
    rankings
      .filter((r) => r.industry === industry)
      .reduce((sum, r) => sum + r.reductionRate, 0) /
    rankings.filter((r) => r.industry === industry).length;

  if (!apexChartsLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">차트 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent mb-4">
          🌍 탄소배출권 통합 관리 시스템
        </h1>
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            🎯 통합 탄소배출권 관리 플랫폼
          </h2>
          <p className="text-lg">
            <strong>
              탄소배출량 모니터링부터 구매 전략 수립까지, 모든 것을 한 곳에서
              관리하세요.
            </strong>
          </p>
          <p className="mt-2 opacity-90">
            이 시스템은 기업의 탄소배출권 관리를 위한 종합 솔루션을 제공합니다.
            실시간 데이터 기반 분석과 AI 기반 전략 추천으로 최적의 의사결정을
            지원합니다.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="text-sm opacity-80">📊 총 배출량</div>
            <div className="text-2xl font-bold">676,648 Gg CO₂eq</div>
            <div className="text-sm opacity-80">2021년 기준</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="text-sm opacity-80">💹 KAU24 가격</div>
            <div className="text-2xl font-bold">8,770원</div>
            <div className="text-sm opacity-80">+2.3%</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="text-sm opacity-80">🏭 할당 대상</div>
            <div className="text-2xl font-bold">1,247개 업체</div>
            <div className="text-sm opacity-80">3차 사전할당</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="text-sm opacity-80">🎯 감축 목표</div>
            <div className="text-2xl font-bold">40%</div>
            <div className="text-sm opacity-80">2030년까지</div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
          <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            📊 현황 대시보드
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <div>
                <strong>실시간 모니터링</strong>: 연도별 배출량, 지역별 CO₂ 농도
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <div>
                <strong>시장 분석</strong>: KAU24 가격/거래량 추이
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <div>
                <strong>할당량 현황</strong>: 업종별/업체별 분포
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <div>
                <strong>AI 챗봇</strong>: 시나리오 시뮬레이션
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-200">
          <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2" />
            🎯 구매 전략 대시보드
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <div>
                <strong>알림 시스템</strong>: 정책/가격 급등 예고
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <div>
                <strong>타이밍 분석</strong>: 최적 매수 시점 추천
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <div>
                <strong>ROI 비교</strong>: 감축 vs 구매 전략 분석
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <div>
                <strong>헤징 전략</strong>: ETF/선물 연계 포트폴리오
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ESG Ranking System */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Trophy className="h-6 w-6 mr-2" />
            🏆 ESG 기반 탄소 감축 랭킹 시스템
          </h2>
          <p className="mt-2 opacity-90">실시간 ESG 성과 추적 및 경쟁 분석</p>
        </div>

        <div className="p-6">
          {/* Sidebar Settings */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">⚙️ ESG 설정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기업명
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  업종
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="전자제품">전자제품</option>
                  <option value="철강">철강</option>
                  <option value="화학">화학</option>
                  <option value="자동차">자동차</option>
                  <option value="건설">건설</option>
                  <option value="에너지">에너지</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 ESG 점수
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentEsgScore}
                  onChange={(e) => setCurrentEsgScore(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm font-semibold mt-1">
                  {currentEsgScore}점
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 감축률 (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={currentReductionRate}
                  onChange={(e) =>
                    setCurrentReductionRate(Number(e.target.value))
                  }
                  className="w-full"
                />
                <div className="text-center text-sm font-semibold mt-1">
                  {currentReductionRate}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  할당 대비 보유율 (%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={currentAllocationRatio}
                  onChange={(e) =>
                    setCurrentAllocationRatio(Number(e.target.value))
                  }
                  className="w-full"
                />
                <div className="text-center text-sm font-semibold mt-1">
                  {currentAllocationRatio}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  목표 ESG 점수
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentEsgScore} // This should be targetEsgScore, but the original code had it as currentEsgScore. Sticking to original for now.
                  onChange={(e) => setCurrentEsgScore(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm font-semibold mt-1">
                  {currentEsgScore}점
                </div>
              </div>
            </div>
          </div>

          {/* ESG Ranking Board */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">
              🥇 탄소 감축 성과 기반 ESG 랭킹 보드
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Rankings Table */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-semibold mb-4">📊 업종별 ESG 랭킹</h4>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        순위
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        기업명
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        업종
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        감축률
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        ESG점수
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        종합점수
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rankings.map((company, index) => (
                      <tr
                        key={index}
                        className={`${
                          company.company === companyName
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                              company.rank === 1
                                ? "bg-yellow-500"
                                : company.rank === 2
                                ? "bg-gray-400"
                                : company.rank === 3
                                ? "bg-yellow-600"
                                : "bg-gray-300"
                            }`}
                          >
                            {company.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {company.company}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {company.industry}
                        </td>
                        <td className="px-4 py-3 text-green-600 font-semibold">
                          {company.reductionRate}%
                        </td>
                        <td className="px-4 py-3 text-blue-600 font-semibold">
                          {company.esgScore}
                        </td>
                        <td className="px-4 py-3 text-purple-600 font-semibold">
                          {company.totalScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Current Company Stats */}
            <div>
              <h4 className="text-lg font-semibold mb-4">🏆 현재 기업 순위</h4>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm opacity-80">현재 순위</div>
                    <div className="text-2xl font-bold">{currentRank}위</div>
                    <div className="text-sm opacity-80">상위 20%</div>
                  </div>
                </div>

                <div
                  className={`bg-gradient-to-br ${color} text-white p-4 rounded-lg`}
                >
                  <div className="text-center">
                    <div className="text-sm opacity-80">ESG 등급</div>
                    <div className="text-2xl font-bold">
                      {medal} {grade}
                    </div>
                    <div className="text-sm opacity-80">
                      {currentEsgScore}점
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">📈 ESG 등급 추세</h4>
            {createTrendChart()}
          </div>

          {/* KPI Comparison */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">
              🥈 업종별·기업별 탄소 KPI 비교
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
              <div className="text-center">
                <div className="text-sm opacity-80">총배출량 대비 감축률</div>
                <div className="text-2xl font-bold">
                  {currentReductionRate}%
                </div>
                <div className="text-sm opacity-80">
                  업종 평균 {industryAvgReduction.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
              <div className="text-center">
                <div className="text-sm opacity-80">할당 대비 잉여율</div>
                <div className="text-2xl font-bold">
                  {currentAllocationRatio}%
                </div>
                <div className="text-sm opacity-80">
                  {currentAllocationRatio > 100 ? "탄소 여유 있음" : "부족"}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <div className="text-center">
                <div className="text-sm opacity-80">거래 활용도</div>
                <div className="text-2xl font-bold">
                  {(Math.random() * 35 + 60).toFixed(1)}%
                </div>
                <div className="text-sm opacity-80">효율적</div>
              </div>
            </div>
          </div>

          {/* KPI Comparison Chart */}
          <div className="mb-6">{createKPIChart()}</div>

          {/* Badge System */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold">🥉 ESG 등급 배지 + 소셜 공유</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Badge Display */}
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <div
                className={`bg-gradient-to-br ${color} text-white p-8 rounded-xl text-center shadow-lg`}
              >
                <div className="text-6xl mb-4">{medal}</div>
                <div className="text-3xl font-bold mb-2">{grade} 등급</div>
                <div className="text-xl mb-2">{companyName}</div>
                <div className="text-lg">ESG 점수: {currentEsgScore}</div>
                <div className="mt-4 text-sm opacity-90">
                  감축률: {currentReductionRate}% | 할당효율:{" "}
                  {currentAllocationRatio}%
                </div>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <h4 className="text-lg font-semibold mb-4">🏆 ESG 성과 공유</h4>
              <p className="text-gray-600 mb-4">
                당신의 ESG 성과를 소셜 미디어에 공유하세요!
              </p>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Linkedin className="h-5 w-5 mr-2" />
                  📱 LinkedIn에 공유
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                  <Twitter className="h-5 w-5 mr-2" />
                  🐦 Twitter에 공유
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Share2 className="h-5 w-5 mr-2" />
                  📧 이메일로 전송
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="h-5 w-5 mr-2" />
                  💾 이미지 다운로드
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold mb-2">🏅 획득 가능한 배지</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>🌟 탄소중립 마스터</span>
                    <span className="text-green-600">달성 완료</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⚡ 에너지 효율 전문가</span>
                    <span className="text-blue-600">80% 완료</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💎 ESG 리더십</span>
                    <span className="text-gray-600">진행 중</span>
                  </div>
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
