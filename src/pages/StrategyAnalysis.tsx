import React, { useState, useEffect, useContext } from "react";
import {
  TrendingUp,
  Target,
  BarChart3,
  Calculator,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { useData } from "../hooks/useData";
import { SidebarContext } from "../components/Layout";

interface StrategyScenario {
  id: string;
  name: string;
  description: string;
  reductionRate: number;
  investment: number;
  roi: number;
  timeline: number;
  risk: "low" | "medium" | "high";
  category: "energy" | "process" | "technology" | "supply";
}

const StrategyAnalysis: React.FC = () => {
  const { sidebarTab } = useContext(SidebarContext);
  const isChatSidebarOpen = sidebarTab === "chat";
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

  // ApexCharts 로딩
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

  // 전략 시나리오 데이터
  const strategies: StrategyScenario[] = [
    {
      id: "energy-efficiency",
      name: "에너지 효율 개선",
      description: "LED 조명 교체 및 스마트 빌딩 시스템 도입",
      reductionRate: 15.2,
      investment: 2500000,
      roi: 28.5,
      timeline: 12,
      risk: "low",
      category: "energy",
    },
    {
      id: "renewable-energy",
      name: "재생에너지 투자",
      description: "태양광 패널 설치 및 풍력 발전소 구축",
      reductionRate: 32.8,
      investment: 8500000,
      roi: 42.1,
      timeline: 24,
      risk: "medium",
      category: "energy",
    },
    {
      id: "process-optimization",
      name: "공정 최적화",
      description: "제조 공정 개선 및 폐열 회수 시스템",
      reductionRate: 18.5,
      investment: 3200000,
      roi: 35.2,
      timeline: 18,
      risk: "low",
      category: "process",
    },
    {
      id: "carbon-capture",
      name: "탄소 포집 기술",
      description: "CCUS 기술 도입 및 탄소 저장 시설",
      reductionRate: 45.3,
      investment: 15000000,
      roi: 18.7,
      timeline: 36,
      risk: "high",
      category: "technology",
    },
    {
      id: "supply-chain",
      name: "공급망 최적화",
      description: "친환경 공급업체 선정 및 물류 효율화",
      reductionRate: 12.7,
      investment: 1800000,
      roi: 31.4,
      timeline: 9,
      risk: "low",
      category: "supply",
    },
    {
      id: "digital-transformation",
      name: "디지털 전환",
      description: "IoT 센서 및 AI 기반 예측 유지보수",
      reductionRate: 22.1,
      investment: 4200000,
      roi: 38.9,
      timeline: 15,
      risk: "medium",
      category: "technology",
    },
  ];

  // ROI 차트 렌더링
  useEffect(() => {
    if (!apexChartsLoaded) return;

    const roiChartElement = document.getElementById("roi-chart");
    if (!roiChartElement) return;

    if (roiChartElement.innerHTML) {
      roiChartElement.innerHTML = "";
    }

    const options = {
      series: [
        {
          name: "ROI (%)",
          data: strategies.map((s) => s.roi),
        },
        {
          name: "감축률 (%)",
          data: strategies.map((s) => s.reductionRate),
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
        formatter: function (val: number) {
          return val.toFixed(1);
        },
        style: {
          fontSize: "12px",
          colors: ["#fff", "#374151"],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: strategies.map((s) => s.name),
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
            text: "ROI (%)",
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
            text: "감축률 (%)",
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
              return value.toFixed(1) + "%";
            },
          },
          {
            formatter: function (value: number) {
              return value.toFixed(1) + "%";
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

    const chart = new window.ApexCharts(roiChartElement, options);
    chart.render();
  }, [apexChartsLoaded]);

  // 투자 대비 감축률 차트
  useEffect(() => {
    if (!apexChartsLoaded) return;

    const investmentChartElement = document.getElementById("investment-chart");
    if (!investmentChartElement) return;

    if (investmentChartElement.innerHTML) {
      investmentChartElement.innerHTML = "";
    }

    const options = {
      series: [
        {
          name: "투자 대비 감축률",
          data: strategies.map(
            (s) => (s.reductionRate / (s.investment / 1000000)) * 100
          ),
        },
      ],
      chart: {
        type: "scatter",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ["#EF4444"],
      plotOptions: {
        scatter: {
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          return strategies[opts.dataPointIndex].name;
        },
        style: {
          fontSize: "12px",
          colors: ["#374151"],
        },
      },
      xaxis: {
        title: {
          text: "투자금액 (백만원)",
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
      yaxis: {
        title: {
          text: "감축률 (%)",
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
      tooltip: {
        theme: "light",
        x: {
          formatter: function (value: number) {
            return value.toFixed(1) + "백만원";
          },
        },
        y: {
          formatter: function (value: number) {
            return value.toFixed(1) + "%";
          },
        },
      },
    };

    const chart = new window.ApexCharts(investmentChartElement, options);
    chart.render();
  }, [apexChartsLoaded]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "energy":
        return "⚡";
      case "process":
        return "⚙️";
      case "technology":
        return "🔬";
      case "supply":
        return "📦";
      default:
        return "📊";
    }
  };

  const selectedStrategy = strategies.find((s) => s.id === selectedScenario);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              <span className="text-green-600">Wavico</span> 감축 전략 분석
            </h2>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed text-lg">
            <span className="font-semibold text-green-600">
              데이터 기반 분석
            </span>
            을 통한
            <span className="font-semibold"> 최적의 탄소 감축 전략</span> 제시
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            ROI 분석, 리스크 평가, 시나리오 시뮬레이션을 통해 Wavico의
            지속가능한 성장을 위한 전략적 의사결정을 지원합니다.
          </p>
        </div>
      </div>

      {/* 전략 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className={`bg-white border rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedScenario === strategy.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-300"
            }`}
            onClick={() => setSelectedScenario(strategy.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">
                {getCategoryIcon(strategy.category)}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                  strategy.risk
                )}`}
              >
                {strategy.risk === "low"
                  ? "낮음"
                  : strategy.risk === "medium"
                  ? "보통"
                  : "높음"}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {strategy.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{strategy.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">감축률</div>
                <div className="font-semibold text-green-600">
                  {strategy.reductionRate}%
                </div>
              </div>
              <div>
                <div className="text-gray-500">ROI</div>
                <div className="font-semibold text-blue-600">
                  {strategy.roi}%
                </div>
              </div>
              <div>
                <div className="text-gray-500">투자금</div>
                <div className="font-semibold text-gray-900">
                  {(strategy.investment / 1000000).toFixed(1)}M원
                </div>
              </div>
              <div>
                <div className="text-gray-500">기간</div>
                <div className="font-semibold text-gray-900">
                  {strategy.timeline}개월
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 선택된 전략 상세 분석 */}
      {selectedStrategy && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedStrategy.name} - 상세 분석
            </h3>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedStrategy.reductionRate}%
                </div>
                <div className="text-sm text-gray-500">예상 감축률</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedStrategy.roi}%
                </div>
                <div className="text-sm text-gray-500">예상 ROI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(selectedStrategy.investment / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-500">투자금액</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                전략 개요
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">카테고리</span>
                  <span className="font-medium">
                    {getCategoryIcon(selectedStrategy.category)}{" "}
                    {selectedStrategy.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">리스크 수준</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                      selectedStrategy.risk
                    )}`}
                  >
                    {selectedStrategy.risk === "low"
                      ? "낮음"
                      : selectedStrategy.risk === "medium"
                      ? "보통"
                      : "높음"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">구현 기간</span>
                  <span className="font-medium">
                    {selectedStrategy.timeline}개월
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">연간 절감액</span>
                  <span className="font-medium text-green-600">
                    {(
                      (selectedStrategy.investment * selectedStrategy.roi) /
                      100 /
                      12
                    ).toFixed(0)}
                    만원
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                시뮬레이션 결과
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">투자 회수 기간</span>
                  <span className="font-medium">
                    {(
                      selectedStrategy.investment /
                      ((selectedStrategy.investment * selectedStrategy.roi) /
                        100 /
                        12)
                    ).toFixed(1)}
                    개월
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5년 누적 절감액</span>
                  <span className="font-medium text-green-600">
                    {(
                      ((selectedStrategy.investment * selectedStrategy.roi) /
                        100) *
                      5
                    ).toFixed(0)}
                    만원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">탄소 감축량</span>
                  <span className="font-medium text-blue-600">
                    {(selectedStrategy.reductionRate * 100).toFixed(0)}톤 CO₂
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ESG 점수 향상</span>
                  <span className="font-medium text-purple-600">
                    +{selectedStrategy.reductionRate.toFixed(1)}점
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI vs 감축률 차트 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            ROI vs 감축률 비교
          </h4>
          <div id="roi-chart" className="w-full" />
        </div>

        {/* 투자 대비 효율성 차트 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            투자 대비 감축 효율성
          </h4>
          <div id="investment-chart" className="w-full" />
        </div>
      </div>

      {/* 권장 전략 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
          Wavico 권장 전략
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                단기 전략
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                1년 이내
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-1">
              에너지 효율 개선
            </div>
            <div className="text-sm text-gray-600">
              LED 조명 교체 및 스마트 빌딩 시스템
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              ROI 28.5%, 감축률 15.2%
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                중기 전략
              </span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                1-2년
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-1">
              재생에너지 투자
            </div>
            <div className="text-sm text-gray-600">
              태양광 패널 설치 및 풍력 발전소
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              ROI 42.1%, 감축률 32.8%
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                장기 전략
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                2년 이상
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-1">
              탄소 포집 기술
            </div>
            <div className="text-sm text-gray-600">
              CCUS 기술 도입 및 탄소 저장
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              ROI 18.7%, 감축률 45.3%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyAnalysis;
