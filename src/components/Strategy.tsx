import React, { useState, useEffect } from "react";
import {
  Bell,
  TrendingUp,
  Recycle,
  DollarSign,
  FileText,
  Mail,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  Target,
} from "lucide-react";

const Strategy: React.FC = () => {
  const [companySize, setCompanySize] = useState("대기업");
  const [annualEmission, setAnnualEmission] = useState(50000);
  const [currentAllocation, setCurrentAllocation] = useState(40000);
  const [budget, setBudget] = useState(100);
  const [riskTolerance, setRiskTolerance] = useState("중립적");
  const [analysisPeriod, setAnalysisPeriod] = useState("1년");
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

  // ApexCharts 로딩 확인
  useEffect(() => {
    const checkApexCharts = () => {
      if (window.ApexCharts) {
        setApexChartsLoaded(true);
      } else {
        setTimeout(checkApexCharts, 100);
      }
    };
    checkApexCharts();
  }, []);

  // 가격 데이터 생성
  const generatePriceData = () => {
    const dates: string[] = [];
    const prices: number[] = [];
    const volumes: number[] = [];
    const recommendations: ("매수" | "관망")[] = [];

    const startDate = new Date("2024-01-01");
    const basePrice = 8770;

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);

      const seasonal = Math.sin((i / 365) * 2 * Math.PI) * 500;
      const trend = (i / 365) * 1000;
      const volatility = (Math.random() - 0.5) * 400;

      const price = Math.max(basePrice + seasonal + trend + volatility, 1000);
      prices.push(price);
      volumes.push(Math.floor(Math.random() * 9000) + 1000);
      recommendations.push(price < basePrice + seasonal ? "매수" : "관망");
    }

    return { dates, prices, volumes, recommendations };
  };

  const { dates, prices, volumes, recommendations } = generatePriceData();

  // ApexCharts 렌더링 useEffect
  useEffect(() => {
    if (apexChartsLoaded) {
      // 구매 타이밍 차트 렌더링
      const timingChartElement = document.getElementById("timing-chart");
      if (timingChartElement) {
        const buyPoints = dates.filter((_, i) => recommendations[i] === "매수");
        const buyPrices = prices.filter(
          (_, i) => recommendations[i] === "매수"
        );

        // 데이터 검증 및 기본값 처리
        const validPrices = prices.map((price) =>
          isNaN(price) || price === undefined ? 0 : price
        );
        const validVolumes = volumes.map((volume) =>
          isNaN(volume) || volume === undefined ? 0 : volume
        );
        const validBuyPrices = buyPrices.map((price) =>
          isNaN(price) || price === undefined ? 0 : price
        );
        const validDates = dates.filter((date) => date && date.trim() !== "");
        const validBuyPoints = buyPoints.filter(
          (date) => date && date.trim() !== ""
        );

        const options = {
          chart: {
            type: "line" as const,
            height: 600,
            toolbar: {
              show: false,
            },
          },
          series: [
            {
              name: "배출권 가격",
              type: "line" as const,
              data: validPrices.map((price, index) => ({
                x: validDates[index] || index,
                y: price,
              })),
            },
            {
              name: "매수 추천",
              type: "scatter" as const,
              data: validBuyPrices.map((price, index) => ({
                x: validBuyPoints[index] || index,
                y: price,
              })),
            },
            {
              name: "거래량",
              type: "column" as const,
              data: validVolumes.map((volume, index) => ({
                x: validDates[index] || index,
                y: volume,
              })),
            },
          ],
          xaxis: {
            type: "datetime" as const,
            title: {
              text: "날짜",
            },
          },
          yaxis: [
            {
              title: {
                text: "가격 (원)",
              },
              min: 0,
              max: Math.max(...validPrices) * 1.1,
            },
            {
              opposite: true,
              title: {
                text: "거래량",
              },
              min: 0,
              max: Math.max(...validVolumes) * 1.1,
            },
          ],
          title: {
            text: "최적 매수 타이밍 분석",
            align: "center" as const,
          },
          colors: ["#1f77b4", "#ef4444", "#93c5fd"],
          stroke: {
            width: 2,
          },
          markers: {
            size: 6,
          },
        };
        new window.ApexCharts(timingChartElement, options).render();
      }

      // ROI 차트 렌더링
      const roiChartElement = document.getElementById("roi-chart");
      if (roiChartElement) {
        const strategies = [
          "배출권 구매",
          "에너지 효율",
          "재생에너지",
          "탄소 포집",
        ];
        const rois = [8, 15, 25, 30];

        // 데이터 검증 및 기본값 처리
        const validRois = rois.map((roi) =>
          isNaN(roi) || roi === undefined ? 0 : roi
        );

        const options = {
          chart: {
            type: "bar" as const,
            height: 400,
            toolbar: {
              show: false,
            },
          },
          series: [
            {
              name: "ROI (%)",
              data: validRois,
            },
          ],
          xaxis: {
            categories: strategies,
            title: {
              text: "전략",
            },
          },
          yaxis: {
            title: {
              text: "ROI (%)",
            },
            min: 0,
            max: Math.max(...validRois) * 1.1,
          },
          title: {
            text: "전략별 ROI 비교",
            align: "center" as const,
          },
          colors: ["#6366f1"],
          plotOptions: {
            bar: {
              distributed: true,
              colors: {
                ranges: [
                  {
                    from: 0,
                    to: 10,
                    color: "#ef4444",
                  },
                  {
                    from: 10,
                    to: 20,
                    color: "#f97316",
                  },
                  {
                    from: 20,
                    to: 30,
                    color: "#22c55e",
                  },
                ],
              },
            },
          },
        };
        new window.ApexCharts(roiChartElement, options).render();
      }

      // 헤징 차트 렌더링
      const hedgingChartElement = document.getElementById("hedging-chart");
      if (hedgingChartElement) {
        const products = [
          "EUA 선물",
          "탄소 ETF",
          "재생에너지 ETF",
          "탄소 크레딧 펀드",
        ];
        const volatility = [25, 18, 30, 22];
        const returns = [12, 8, 15, 10];
        const minInvestment = [10, 5, 8, 15];

        // 데이터 검증 및 기본값 처리
        const validVolatility = volatility.map((v) =>
          isNaN(v) || v === undefined ? 0 : v
        );
        const validReturns = returns.map((r) =>
          isNaN(r) || r === undefined ? 0 : r
        );
        const validMinInvestment = minInvestment.map((i) =>
          isNaN(i) || i === undefined ? 1 : i
        );

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
              name: "헤징 상품",
              data: validVolatility.map((vol, index) => ({
                x: vol,
                y: validReturns[index],
                z: Math.max(validMinInvestment[index] * 2, 1), // 최소값 1 보장
                name: products[index],
              })),
            },
          ],
          xaxis: {
            title: {
              text: "변동성 (%)",
            },
            min: 0,
            max: Math.max(...validVolatility) * 1.1,
          },
          yaxis: {
            title: {
              text: "수익률 (%)",
            },
            min: 0,
            max: Math.max(...validReturns) * 1.1,
          },
          title: {
            text: "헤징 상품 비교 분석",
            align: "center" as const,
          },
          colors: ["#6366f1"],
          markers: {
            size: validMinInvestment.map((inv) => Math.max(inv * 2, 1)), // 최소값 1 보장
          },
        };
        new window.ApexCharts(hedgingChartElement, options).render();
      }

      // 포트폴리오 차트 렌더링
      const portfolioChartElement = document.getElementById("portfolio-chart");
      if (portfolioChartElement) {
        const portfolioData = [60, 20, 15, 5];

        // 데이터 검증 및 기본값 처리
        const validPortfolioData = portfolioData.map((d) =>
          isNaN(d) || d === undefined ? 0 : d
        );

        const options = {
          chart: {
            type: "pie" as const,
            height: 400,
            toolbar: {
              show: false,
            },
          },
          labels: ["배출권 직접구매", "EUA 선물", "재생에너지 ETF", "현금"],
          colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
          legend: {
            show: true,
            position: "bottom" as const,
          },
          title: {
            text: "권장 포트폴리오 비중",
            align: "center" as const,
          },
        };
        new window.ApexCharts(portfolioChartElement, options).render();
      }
    }
  }, [apexChartsLoaded, dates, prices, volumes, recommendations]);

  // 구매 타이밍 차트 (ApexCharts)
  const createTimingChart = () => {
    if (!apexChartsLoaded) return <div>차트 로딩 중...</div>;
    return <div id="timing-chart" />;
  };

  // ROI 비교 차트 (ApexCharts)
  const createROIChart = () => {
    if (!apexChartsLoaded) return <div>차트 로딩 중...</div>;
    return <div id="roi-chart" />;
  };

  // 헤징 상품 분석 차트 (ApexCharts)
  const createHedgingChart = () => {
    if (!apexChartsLoaded) return <div>차트 로딩 중...</div>;
    return <div id="hedging-chart" />;
  };

  const alerts = [
    {
      level: "🚨 긴급",
      title: "EU 정책 발표 예정",
      content:
        "다음 EU 정책 발표 전까지 가격 급등이 예상됩니다. 2주 내 선매수 권장.",
      time: "2일 후",
    },
    {
      level: "⚠️ 주의",
      title: "환경부 할당량 축소",
      content:
        "환경부가 중소기업 배출권 무상 할당 축소 예정. 비용 상승 가능성 있음.",
      time: "1주 후",
    },
    {
      level: "💡 기회",
      title: "시장 하락 예상",
      content: "다음 달 초 시장 하락이 예상되어 매수 타이밍으로 판단됩니다.",
      time: "3일 후",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
          🎯 탄소배출권 구매 전략 대시보드
        </h1>
        <p className="text-gray-600">
          AI 기반 전략 분석 및 실시간 데이터 기반 최적화된 투자 전략 제공
        </p>
      </div>

      {/* Sidebar Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-lg font-semibold mb-4">⚙️ 전략 설정</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기업 규모
            </label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="대기업">대기업</option>
              <option value="중견기업">중견기업</option>
              <option value="중소기업">중소기업</option>
              <option value="소기업">소기업</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연간 배출량 (톤 CO₂)
            </label>
            <input
              type="number"
              value={annualEmission}
              onChange={(e) => setAnnualEmission(Number(e.target.value))}
              min="1000"
              max="1000000"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 할당량 (톤 CO₂)
            </label>
            <input
              type="number"
              value={currentAllocation}
              onChange={(e) => setCurrentAllocation(Number(e.target.value))}
              min="0"
              max={annualEmission}
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              투자 예산 (억원)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              min="1"
              max="1000"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              리스크 성향
            </label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="보수적">보수적</option>
              <option value="중립적">중립적</option>
              <option value="적극적">적극적</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              분석 기간
            </label>
            <select
              value={analysisPeriod}
              onChange={(e) => setAnalysisPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3개월">3개월</option>
              <option value="6개월">6개월</option>
              <option value="1년">1년</option>
              <option value="2년">2년</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Bell className="h-6 w-6 mr-2" />
          🔔 긴급 알림 요약
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">3건</div>
            <div>🚨 긴급</div>
            <div className="text-sm">정책 발표 예정</div>
          </div>
          <div className="bg-white/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">5건</div>
            <div>⚠️ 주의</div>
            <div className="text-sm">가격 변동 예상</div>
          </div>
          <div className="bg-white/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">2건</div>
            <div>💡 기회</div>
            <div className="text-sm">매수 타이밍</div>
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className="bg-white/20 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold">
                    {alert.level} {alert.title}
                  </span>
                  <span className="ml-2 text-sm">({alert.time})</span>
                </div>
              </div>
              <div className="text-sm">{alert.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timing Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          📈 다이나믹 구매 타이밍 추천 시스템
        </h2>
        {createTimingChart()}

        <div className="mt-4 bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
          <h3 className="font-bold mb-2">🎯 현재 매수 추천:</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>최적 매수 시점:</strong> 다음 주 초 (가격 하락 예상)
            </li>
            <li>
              <strong>목표 가격:</strong> 8,200원 이하
            </li>
            <li>
              <strong>예상 절감:</strong> 약 3억원 (현재 대비 15% 절감)
            </li>
            <li>
              <strong>투자 전략:</strong> 분할 매수 권장 (50% 즉시, 50% 추가
              하락 시)
            </li>
          </ul>
        </div>
      </div>

      {/* Alternative Strategy Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Recycle className="h-6 w-6 mr-2" />
          ♻️ 대체 수단 분석 (감축 vs 구매 ROI 비교)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">🏭 감축 투자 분석</h3>
            <div className="space-y-3">
              {[
                { name: "에너지 효율 개선", cost: 50, reduction: 20, roi: 15 },
                { name: "재생에너지 설치", cost: 200, reduction: 60, roi: 25 },
                { name: "탄소 포집 기술", cost: 300, reduction: 80, roi: 30 },
                { name: "공정 개선", cost: 30, reduction: 15, roi: 12 },
              ].map((option, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold">{option.name}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>투자 비용: {option.cost}억원</div>
                    <div>감축량: {option.reduction}%</div>
                    <div>ROI: {option.roi}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">💰 ROI 비교 분석</h3>
            {createROIChart()}
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
          <h3 className="font-bold mb-2">💡 전략 추천:</h3>
          <p className="text-sm">
            현재 배출권 가격이 높은 상황에서 <strong>재생에너지 설치</strong>가
            가장 높은 ROI(25%)를 보입니다.
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>
              <strong>단기:</strong> 배출권 구매로 즉시 대응
            </li>
            <li>
              <strong>중장기:</strong> 재생에너지 설치로 자체 감축 확대
            </li>
            <li>
              <strong>예상 절감:</strong> 연간 15억원 (투자 대비 25% 수익)
            </li>
          </ul>
        </div>
      </div>

      {/* Hedging Strategy */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <DollarSign className="h-6 w-6 mr-2" />
          💹 탄소 ETF 및 선물 연계 자동 헤징 전략
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">📊 헤징 상품 분석</h3>
            {createHedgingChart()}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">📊 포트폴리오 추천</h3>
            <div>
              {apexChartsLoaded ? (
                <div id="portfolio-chart" />
              ) : (
                <div>차트 로딩 중...</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
          <h3 className="font-bold mb-2">🎯 헤징 전략 추천:</h3>
          <p className="text-sm">
            현재 가격 상승 국면에서{" "}
            <strong>EUA 선물 20% + 재생에너지 ETF 15%</strong> 조합을
            권장합니다.
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>
              <strong>예상 수익률:</strong> 12-15%
            </li>
            <li>
              <strong>리스크 헤지:</strong> 80% 효과
            </li>
            <li>
              <strong>유동성:</strong> 높음
            </li>
            <li>
              <strong>추가 투자:</strong> 35억원 필요
            </li>
          </ul>
        </div>
      </div>

      {/* AI Report */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          📄 AI 기반 전략 리포트
        </h2>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-bold text-lg mb-3">
            # 🎯 탄소배출권 구매 전략 리포트
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold">## 📊 현재 상황 분석</h4>
              <ul className="ml-4 mt-2 space-y-1">
                <li>
                  • <strong>기업 규모:</strong> {companySize}
                </li>
                <li>
                  • <strong>연간 배출량:</strong>{" "}
                  {annualEmission.toLocaleString()}톤 CO₂
                </li>
                <li>
                  • <strong>현재 할당량:</strong>{" "}
                  {currentAllocation.toLocaleString()}톤 CO₂
                </li>
                <li>
                  • <strong>부족량:</strong>{" "}
                  {(annualEmission - currentAllocation).toLocaleString()}톤 CO₂
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">## 💰 투자 전략 요약</h4>
              <ol className="ml-4 mt-2 space-y-1">
                <li>
                  1. <strong>즉시 실행:</strong> 배출권 60% 구매 (60억원)
                </li>
                <li>
                  2. <strong>중기 전략:</strong> 재생에너지 설치 (200억원)
                </li>
                <li>
                  3. <strong>헤징 전략:</strong> EUA 선물 20% (20억원)
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold">## 📈 예상 효과</h4>
              <ul className="ml-4 mt-2 space-y-1">
                <li>
                  • <strong>총 투자:</strong> 280억원
                </li>
                <li>
                  • <strong>연간 절감:</strong> 45억원
                </li>
                <li>
                  • <strong>ROI:</strong> 16%
                </li>
                <li>
                  • <strong>리스크:</strong> 중간
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">## ⚠️ 주의사항</h4>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• 정책 변화 모니터링 필요</li>
                <li>• 가격 변동성 고려</li>
                <li>• 분할 투자 권장</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="h-4 w-4 mr-2" />
            📄 PDF 다운로드
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Mail className="h-4 w-4 mr-2" />
            📧 이메일 발송
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            🔄 리포트 새로고침
          </button>
        </div>
      </div>
    </div>
  );
};

export default Strategy;
