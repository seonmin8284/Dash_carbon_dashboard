import React, { useState, useEffect, useContext } from "react";
import {
  TrendingUp,
  Target,
  BarChart3,
  Calculator,
  Lightbulb,
  ArrowUpRight,
  DollarSign,
  Calendar,
  TrendingDown,
  Zap,
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

interface KAUStrategy {
  id: string;
  name: string;
  description: string;
  kauPrice: number;
  quantity: number;
  totalCost: number;
  expectedReduction: number;
  risk: "low" | "medium" | "high";
  timing: "immediate" | "gradual" | "opportunistic";
  marketCondition: "bullish" | "bearish" | "neutral";
}

const StrategyAnalysis: React.FC = () => {
  const { sidebarTab } = useContext(SidebarContext);
  const isChatSidebarOpen = sidebarTab === "chat";
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [selectedKAUStrategyId, setSelectedKAUStrategyId] =
    useState<string>("");
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

  // KAU 구매 전략 데이터
  const kauStrategies: KAUStrategy[] = [
    {
      id: "kau-immediate",
      name: "즉시 구매 전략",
      description: "현재 시장 가격에 즉시 KAU 구매하여 할당량 확보",
      kauPrice: 28500,
      quantity: 1000,
      totalCost: 28500000,
      expectedReduction: 100, // 할당량 100% 확보
      risk: "medium",
      timing: "immediate",
      marketCondition: "neutral",
    },
    {
      id: "kau-gradual",
      name: "단계적 구매 전략",
      description: "분기별로 나누어 KAU를 구매하여 평균 비용 절감",
      kauPrice: 27200,
      quantity: 1000,
      totalCost: 27200000,
      expectedReduction: 100, // 할당량 100% 확보
      risk: "low",
      timing: "gradual",
      marketCondition: "neutral",
    },
    {
      id: "kau-opportunistic",
      name: "기회적 구매 전략",
      description: "가격 하락 시점을 노려 대량 구매로 비용 최소화",
      kauPrice: 25800,
      quantity: 1000,
      totalCost: 25800000,
      expectedReduction: 100, // 할당량 100% 확보
      risk: "high",
      timing: "opportunistic",
      marketCondition: "bearish",
    },
    {
      id: "kau-hybrid",
      name: "하이브리드 전략",
      description: "즉시 구매와 기회적 구매를 조합한 균형 전략",
      kauPrice: 27000,
      quantity: 1000,
      totalCost: 27000000,
      expectedReduction: 100, // 할당량 100% 확보
      risk: "medium",
      timing: "gradual",
      marketCondition: "neutral",
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

  // 투자 대비 감축 효율성 차트
  useEffect(() => {
    if (!apexChartsLoaded) return;

    const investmentChartElement = document.getElementById("investment-chart");
    if (!investmentChartElement) return;

    if (investmentChartElement.innerHTML) {
      investmentChartElement.innerHTML = "";
    }

    // 투자 대비 감축 효율성 계산 (감축률 / 투자금액 * 1000)
    const efficiencyData = strategies.map((s) => ({
      x: s.investment / 1000000, // 투자금액 (백만원)
      y: s.reductionRate, // 감축률 (%)
      name: s.name,
      investment: s.investment,
      efficiency: (s.reductionRate / (s.investment / 1000000)) * 1000, // 효율성 지수
    }));

    const options = {
      series: [
        {
          name: "투자 대비 감축 효율성",
          data: efficiencyData.map((d) => ({
            x: d.x,
            y: d.y,
            z: d.efficiency, // 점 크기용
          })),
        },
      ],
      chart: {
        type: "scatter",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ["#10B981"],
      plotOptions: {
        scatter: {
          distributed: false,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          return efficiencyData[opts.dataPointIndex].name;
        },
        style: {
          fontSize: "11px",
          colors: ["#374151"],
        },
        offsetY: -5,
      },
      xaxis: {
        type: "numeric",
        title: {
          text: "투자금액 (백만원)",
          style: {
            color: "#6B7280",
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            colors: "#6B7280",
          },
          formatter: function (value: number) {
            return value.toFixed(1);
          },
        },
      },
      yaxis: {
        title: {
          text: "감축률 (%)",
          style: {
            color: "#6B7280",
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            colors: "#6B7280",
          },
        },
        min: 0,
        max: 50,
      },
      tooltip: {
        theme: "light",
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          const data = efficiencyData[dataPointIndex];
          return `
            <div class="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div class="font-semibold text-gray-900 mb-2">${data.name}</div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">투자금액:</span>
                  <span class="font-medium">${(
                    data.investment / 1000000
                  ).toFixed(1)}백만원</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">감축률:</span>
                  <span class="font-medium text-green-600">${data.y.toFixed(
                    1
                  )}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">효율성 지수:</span>
                  <span class="font-medium text-blue-600">${data.efficiency.toFixed(
                    1
                  )}</span>
                </div>
              </div>
            </div>
          `;
        },
      },
      markers: {
        size: efficiencyData.map((d) =>
          Math.max(6, Math.min(12, d.efficiency / 10))
        ),
        colors: ["#10B981"],
        strokeColors: ["#059669"],
        strokeWidth: 2,
      },
    };

    const chart = new window.ApexCharts(investmentChartElement, options);
    chart.render();
  }, [apexChartsLoaded]);

  // KAU vs 감축 투자 비교 차트
  useEffect(() => {
    if (!apexChartsLoaded) return;

    const comparisonChartElement = document.getElementById(
      "kau-comparison-chart"
    );
    if (!comparisonChartElement) return;

    if (comparisonChartElement.innerHTML) {
      comparisonChartElement.innerHTML = "";
    }

    // 감축 투자와 KAU 구매 전략 비교 데이터
    const comparisonData = [
      ...strategies.map((s) => ({
        name: s.name,
        cost: s.investment / 1000000,
        reduction: s.reductionRate,
        type: "감축 투자",
        roi: s.roi,
        category: s.category,
      })),
      ...kauStrategies.map((k) => ({
        name: k.name,
        cost: k.totalCost / 1000000,
        reduction: 0, // KAU는 직접 감축 효과 없음
        type: "KAU 구매",
        roi: 0,
        category: k.timing,
      })),
    ];

    const options = {
      series: [
        {
          name: "감축 투자",
          data: strategies.map((s) => ({
            x: s.investment / 1000000,
            y: s.reductionRate,
            z: s.roi,
            name: s.name,
          })),
        },
        {
          name: "KAU 구매",
          data: kauStrategies.map((k) => ({
            x: k.totalCost / 1000000,
            y: (k.quantity / 1000) * 100, // 할당량 대비 감축률로 계산
            z: 0,
            name: k.name,
          })),
        },
      ],
      chart: {
        type: "scatter",
        height: 400,
        toolbar: {
          show: false,
        },
      },
      colors: ["#10B981", "#EF4444"],
      plotOptions: {
        scatter: {
          distributed: false,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          const data =
            opts.seriesIndex === 0
              ? strategies[opts.dataPointIndex]
              : kauStrategies[opts.dataPointIndex];
          return data.name;
        },
        style: {
          fontSize: "10px",
          colors: ["#374151"],
        },
        offsetY: -5,
      },
      xaxis: {
        type: "numeric",
        title: {
          text: "투자금액 (백만원)",
          style: {
            color: "#6B7280",
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            colors: "#6B7280",
          },
          formatter: function (value: number) {
            return value.toFixed(1);
          },
        },
      },
      yaxis: {
        title: {
          text: "감축률/할당량 확보율 (%)",
          style: {
            color: "#6B7280",
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            colors: "#6B7280",
          },
        },
        min: 0,
        max: 100,
      },
      tooltip: {
        theme: "light",
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          if (seriesIndex === 0) {
            const strategy = strategies[dataPointIndex];
            return `
               <div class="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                 <div class="font-semibold text-gray-900 mb-2">${
                   strategy.name
                 }</div>
                 <div class="space-y-1 text-sm">
                   <div class="flex justify-between">
                     <span class="text-gray-600">투자금액:</span>
                     <span class="font-medium">${(
                       strategy.investment / 1000000
                     ).toFixed(1)}백만원</span>
                   </div>
                   <div class="flex justify-between">
                     <span class="text-gray-600">감축률:</span>
                     <span class="font-medium text-green-600">${
                       strategy.reductionRate
                     }%</span>
                   </div>
                   <div class="flex justify-between">
                     <span class="text-gray-600">ROI:</span>
                     <span class="font-medium text-blue-600">${
                       strategy.roi
                     }%</span>
                   </div>
                 </div>
               </div>
             `;
          } else {
            const kauStrategy = kauStrategies[dataPointIndex];
            return `
               <div class="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                 <div class="font-semibold text-gray-900 mb-2">${
                   kauStrategy.name
                 }</div>
                 <div class="space-y-1 text-sm">
                   <div class="flex justify-between">
                     <span class="text-gray-600">투자금액:</span>
                     <span class="font-medium">${(
                       kauStrategy.totalCost / 1000000
                     ).toFixed(1)}백만원</span>
                   </div>
                   <div class="flex justify-between">
                     <span class="text-gray-600">KAU 가격:</span>
                     <span class="font-medium text-red-600">${kauStrategy.kauPrice.toLocaleString()}원</span>
                   </div>
                   <div class="flex justify-between">
                     <span class="text-gray-600">구매 수량:</span>
                     <span class="font-medium text-purple-600">${kauStrategy.quantity.toLocaleString()}개</span>
                   </div>
                 </div>
               </div>
             `;
          }
        },
      },
      markers: {
        size: [8, 6],
        colors: ["#10B981", "#EF4444"],
        strokeColors: ["#059669", "#DC2626"],
        strokeWidth: 2,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "14px",
      },
    };

    const chart = new window.ApexCharts(comparisonChartElement, options);
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
  const selectedKAUStrategyData = kauStrategies.find(
    (k) => k.id === selectedKAUStrategyId
  );

  return (
    <div className="space-y-8">
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

      {/* Wavico 권장 전략 (최상단) */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 shadow-sm mt-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
          Wavico 권장 전략
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              에너지 효율 개선 + 단계적 KAU 구매 병행
            </div>
            <div className="text-sm text-gray-600 mb-3">
              LED 조명 교체 및 스마트 빌딩 시스템
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">감축 투자:</span>
                <span className="font-medium">250만원 (ROI 28.5%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KAU 구매:</span>
                <span className="font-medium">2,720만원 (27,200원/톤)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 비용:</span>
                <span className="font-medium text-blue-600">2,970만원</span>
              </div>
              <div className="text-gray-500 mt-2">
                효과: 즉각적 감축 + 안정적 할당량
              </div>
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
              재생에너지 투자 + 기회적 KAU 구매
            </div>
            <div className="text-sm text-gray-600 mb-3">
              태양광 패널 설치 및 풍력 발전소
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">감축 투자:</span>
                <span className="font-medium">850만원 (ROI 42.1%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KAU 구매:</span>
                <span className="font-medium">2,580만원 (25,800원/톤)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 비용:</span>
                <span className="font-medium text-blue-600">3,430만원</span>
              </div>
              <div className="text-gray-500 mt-2">
                효과: 실질 감축 + 비용 효율
              </div>
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
              탄소 포집 기술 + 보조적 KAU 구매
            </div>
            <div className="text-sm text-gray-600 mb-3">
              CCUS 기술 도입 및 탄소 저장
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">감축 투자:</span>
                <span className="font-medium">1,500만원 (ROI 18.7%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KAU 구매:</span>
                <span className="font-medium">2,700만원 (27,000원/톤)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 비용:</span>
                <span className="font-medium text-blue-600">4,200만원</span>
              </div>
              <div className="text-gray-500 mt-2">
                효과: ESG 경쟁력 + 근본 감축
              </div>
            </div>
          </div>
        </div>
        {/* 최적 전략 결론 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800">
            최적 전략: 단기에는 KAU 구매 비중을 높여 안정성을 확보하고,
            중장기적으로는 자체 감축 투자 비중을 높여 ESG 경쟁력을 강화하는
            전략이 최적입니다.
          </div>
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

      {/* KAU 구매 전략 섹션 */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center mb-6">
          <DollarSign className="h-8 w-8 text-red-600 mr-3" />
          <h3 className="text-2xl font-bold text-gray-900">
            <span className="text-red-600">KAU</span> 구매 전략 비교
          </h3>
        </div>
        <p className="text-gray-700 mb-6 text-center leading-relaxed">
          감축 투자와 KAU 구매 전략의 비용 효율성을 비교하여 최적의 전략을
          선택하세요.
        </p>

        {/* KAU 전략 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kauStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`bg-white border rounded-lg p-4 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedKAUStrategyId === strategy.id
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-red-300"
              }`}
              onClick={() => setSelectedKAUStrategyId(strategy.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl">💰</div>
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
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {strategy.name}
              </h4>
              <p className="text-gray-600 text-xs mb-3">
                {strategy.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">KAU 가격</div>
                  <div className="font-semibold text-red-600">
                    {strategy.kauPrice.toLocaleString()}원
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">총 비용</div>
                  <div className="font-semibold text-gray-900">
                    {(strategy.totalCost / 1000000).toFixed(1)}M원
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KAU vs 감축 투자 비교 차트와 선택된 KAU 전략 상세 분석을 가로로 배치 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KAU vs 감축 투자 비교 차트 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-orange-600" />
              KAU 구매 vs 감축 투자 비교
            </h4>
            <div id="kau-comparison-chart" className="w-full" />
          </div>

          {/* 선택된 KAU 전략 상세 분석 */}
          {selectedKAUStrategyData ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedKAUStrategyData.name} - 상세 분석
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {selectedKAUStrategyData.kauPrice.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500">KAU 단가</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {selectedKAUStrategyData.quantity.toLocaleString()}개
                    </div>
                    <div className="text-xs text-gray-500">구매 수량</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {(selectedKAUStrategyData.totalCost / 1000000).toFixed(1)}
                      M
                    </div>
                    <div className="text-xs text-gray-500">총 비용</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    전략 개요
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">구매 타이밍</span>
                      <span className="font-medium">
                        {selectedKAUStrategyData.timing === "immediate"
                          ? "즉시 구매"
                          : selectedKAUStrategyData.timing === "gradual"
                          ? "단계적 구매"
                          : "기회적 구매"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">시장 상황</span>
                      <span className="font-medium">
                        {selectedKAUStrategyData.marketCondition === "bullish"
                          ? "상승장"
                          : selectedKAUStrategyData.marketCondition ===
                            "bearish"
                          ? "하락장"
                          : "중립"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">리스크 수준</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                          selectedKAUStrategyData.risk
                        )}`}
                      >
                        {selectedKAUStrategyData.risk === "low"
                          ? "낮음"
                          : selectedKAUStrategyData.risk === "medium"
                          ? "보통"
                          : "높음"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">예상 할당량</span>
                      <span className="font-medium text-green-600">
                        {selectedKAUStrategyData.quantity}톤 CO₂
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    비용 분석
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">톤당 비용</span>
                      <span className="font-medium">
                        {selectedKAUStrategyData.kauPrice.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">시장 평균 대비</span>
                      <span className="font-medium text-green-600">
                        -
                        {(
                          ((28500 - selectedKAUStrategyData.kauPrice) / 28500) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">연간 할당량 충족도</span>
                      <span className="font-medium text-blue-600">
                        {(
                          (selectedKAUStrategyData.quantity / 1000) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">예상 절감액</span>
                      <span className="font-medium text-green-600">
                        {(
                          (28500 - selectedKAUStrategyData.kauPrice) *
                          selectedKAUStrategyData.quantity
                        ).toLocaleString()}
                        원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  KAU 전략 선택
                </h4>
                <p className="text-gray-500 text-sm">
                  위의 KAU 전략 카드 중 하나를 선택하면 상세 분석이 표시됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default StrategyAnalysis;
