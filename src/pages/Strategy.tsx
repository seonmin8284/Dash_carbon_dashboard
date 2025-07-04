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
  ShoppingCart,
} from "lucide-react";
import StrategySettings from "../components/StrategySettings";
import TimingChart from "../components/TimingChart";
import ROIChart from "../components/ROIChart";

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-green-600" />
            구매 전략 대시보드
          </h1>
          <p className="text-gray-600 mt-2">
            AI 기반 탄소배출권 구매 전략 및 최적 타이밍 분석
          </p>
        </div>

        <div className="p-6">
          {/* Strategy Settings */}
          <StrategySettings
            companySize={companySize}
            setCompanySize={setCompanySize}
            annualEmission={annualEmission}
            setAnnualEmission={setAnnualEmission}
            currentAllocation={currentAllocation}
            setCurrentAllocation={setCurrentAllocation}
            budget={budget}
            setBudget={setBudget}
            riskTolerance={riskTolerance}
            setRiskTolerance={setRiskTolerance}
            analysisPeriod={analysisPeriod}
            setAnalysisPeriod={setAnalysisPeriod}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">알림 설정</div>
                  <div className="text-lg font-semibold text-gray-900">
                    활성화
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">예상 수익률</div>
                  <div className="text-lg font-semibold text-gray-900">
                    8.5%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <Recycle className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">권장 구매량</div>
                  <div className="text-lg font-semibold text-gray-900">
                    10,000톤
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">예상 비용</div>
                  <div className="text-lg font-semibold text-gray-900">
                    87.7억원
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timing Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-red-600" />
              최적 매수 타이밍 분석
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <TimingChart
                dates={dates}
                prices={prices}
                volumes={volumes}
                recommendations={recommendations}
                apexChartsLoaded={apexChartsLoaded}
              />
            </div>
          </div>

          {/* ROI Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
              전략별 ROI 비교
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <ROIChart apexChartsLoaded={apexChartsLoaded} />
            </div>
          </div>

          {/* Strategy Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                위험 요소 분석
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3 mt-1">•</span>
                  <div>
                    <span className="font-medium">정책 변화 위험</span>
                    <p className="text-sm text-gray-600">
                      정부의 탄소중립 정책 강화로 인한 가격 변동성 증가
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3 mt-1">•</span>
                  <div>
                    <span className="font-medium">시장 유동성 위험</span>
                    <p className="text-sm text-gray-600">
                      거래량 부족으로 인한 매매 실행 지연 가능성
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3 mt-1">•</span>
                  <div>
                    <span className="font-medium">환율 위험</span>
                    <p className="text-sm text-gray-600">
                      글로벌 탄소시장 연동으로 인한 환율 변동 영향
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                권장 전략
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <div>
                    <span className="font-medium">분할 매수 전략</span>
                    <p className="text-sm text-gray-600">
                      월 2,000톤씩 5개월에 걸쳐 분할 매수 권장
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <div>
                    <span className="font-medium">헤징 전략</span>
                    <p className="text-sm text-gray-600">
                      ETF와 선물을 활용한 포트폴리오 다각화
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <div>
                    <span className="font-medium">모니터링 강화</span>
                    <p className="text-sm text-gray-600">
                      실시간 가격 알림 및 시장 동향 추적
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Mail className="h-5 w-5 mr-2" />
              전략 리포트 다운로드
            </button>
            <button className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="h-5 w-5 mr-2" />
              전략 재계산
            </button>
            <button className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Bell className="h-5 w-5 mr-2" />
              알림 설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Strategy;
