import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertTriangle,
  Settings,
  Target,
  ArrowUpDown,
} from "lucide-react";

interface BacktestingProps {
  companySize: string;
  annualEmission: number;
  currentAllocation: number;
  budget: number;
  riskTolerance: string;
  analysisPeriod: string;
  marketData?: any[];
  loading?: boolean;
}

interface BacktestingParams {
  strategyType: string;
  buyCondition: number;
  sellCondition: number;
  investmentUnit: number;
  reductionCost: number;
  reductionCapacity: number;
}

const Backtesting: React.FC<BacktestingProps> = ({
  companySize,
  annualEmission,
  currentAllocation,
  budget,
  riskTolerance,
  analysisPeriod,
  marketData,
  loading,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [params, setParams] = useState<BacktestingParams>({
    strategyType: "매수 전략",
    buyCondition: -5,
    sellCondition: 8,
    investmentUnit: 100,
    reductionCost: 50000,
    reductionCapacity: 5000,
  });

  // 백테스팅 실행 함수
  const runBacktesting = () => {
    setIsRunning(true);

    // 시뮬레이션을 위한 지연
    setTimeout(() => {
      // 실제 시장 데이터를 사용하여 시계열 데이터 생성
      const generateTimeSeriesData = () => {
        if (!marketData || marketData.length === 0) {
          // 기본 데이터 (시장 데이터가 없을 때)
          return {
            priceData: [
              { date: "2021-01-01", price: 8500 },
              { date: "2021-02-01", price: 8700 },
              { date: "2021-03-01", price: 8900 },
              { date: "2021-04-01", price: 9200 },
              { date: "2021-05-01", price: 8800 },
              { date: "2021-06-01", price: 8600 },
              { date: "2021-07-01", price: 9000 },
              { date: "2021-08-01", price: 9400 },
              { date: "2021-09-01", price: 9100 },
              { date: "2021-10-01", price: 8700 },
              { date: "2021-11-01", price: 8900 },
              { date: "2021-12-01", price: 9200 },
              { date: "2022-01-01", price: 9500 },
              { date: "2022-02-01", price: 9800 },
              { date: "2022-03-01", price: 10200 },
              { date: "2022-04-01", price: 9900 },
              { date: "2022-05-01", price: 9600 },
              { date: "2022-06-01", price: 9400 },
              { date: "2022-07-01", price: 9700 },
              { date: "2022-08-01", price: 10100 },
              { date: "2022-09-01", price: 10400 },
              { date: "2022-10-01", price: 10100 },
              { date: "2022-11-01", price: 9800 },
              { date: "2022-12-01", price: 10200 },
              { date: "2023-01-01", price: 10500 },
              { date: "2023-02-01", price: 10800 },
              { date: "2023-03-01", price: 11200 },
              { date: "2023-04-01", price: 10900 },
              { date: "2023-05-01", price: 10600 },
              { date: "2023-06-01", price: 10400 },
              { date: "2023-07-01", price: 10700 },
              { date: "2023-08-01", price: 11100 },
              { date: "2023-09-01", price: 11400 },
              { date: "2023-10-01", price: 11100 },
              { date: "2023-11-01", price: 10800 },
              { date: "2023-12-01", price: 11200 },
            ],
            buySignals: [
              { date: "2021-05-15", price: 8800, quantity: 200 },
              { date: "2021-06-05", price: 8600, quantity: 300 },
              { date: "2021-10-12", price: 8700, quantity: 250 },
              { date: "2022-05-20", price: 9600, quantity: 200 },
              { date: "2022-06-10", price: 9400, quantity: 300 },
              { date: "2022-10-25", price: 10100, quantity: 150 },
              { date: "2023-05-15", price: 10600, quantity: 200 },
              { date: "2023-06-08", price: 10400, quantity: 300 },
            ],
            sellSignals: [
              { date: "2021-08-10", price: 9400, quantity: 200 },
              { date: "2022-03-20", price: 10200, quantity: 300 },
              { date: "2022-08-08", price: 10100, quantity: 250 },
              { date: "2023-03-15", price: 11200, quantity: 200 },
              { date: "2023-08-22", price: 11100, quantity: 300 },
              { date: "2023-09-18", price: 11400, quantity: 250 },
            ],
          };
        }

        // 실제 시장 데이터를 사용하여 시계열 데이터 생성
        const sortedData = marketData
          .sort(
            (a, b) => new Date(a.일자).getTime() - new Date(b.일자).getTime()
          )
          .map((d, index) => ({
            date: d.일자.toISOString().split("T")[0],
            price: d.종가,
            index,
          }));

        // 매수/매도 신호 생성 (실제 데이터 기반)
        const buySignals: any[] = [];
        const sellSignals: any[] = [];
        const basePrice = sortedData[0]?.price || 8500;

        sortedData.forEach((data, index) => {
          if (index === 0) return;

          const priceChange = ((data.price - basePrice) / basePrice) * 100;

          // 매수 신호: 5% 이상 하락 시
          if (priceChange <= -5 && buySignals.length < 8) {
            buySignals.push({
              date: data.date,
              price: data.price,
              quantity: Math.floor(Math.random() * 200) + 100,
            });
          }

          // 매도 신호: 8% 이상 상승 시
          if (priceChange >= 8 && sellSignals.length < 6) {
            sellSignals.push({
              date: data.date,
              price: data.price,
              quantity: Math.floor(Math.random() * 200) + 100,
            });
          }
        });

        return {
          priceData: sortedData,
          buySignals,
          sellSignals,
        };
      };

      const timeSeriesData = generateTimeSeriesData();

      const mockResults = {
        // 시각화 데이터
        priceData: timeSeriesData.priceData,
        buySignals: timeSeriesData.buySignals,
        sellSignals: timeSeriesData.sellSignals,
        roiComparison: [
          { month: "1월", buyStrategy: 2.1, reductionStrategy: 1.8 },
          { month: "2월", buyStrategy: -1.2, reductionStrategy: -0.5 },
          { month: "3월", buyStrategy: 3.4, reductionStrategy: 2.1 },
          { month: "4월", buyStrategy: 1.8, reductionStrategy: 1.2 },
          { month: "5월", buyStrategy: 4.2, reductionStrategy: 2.8 },
          { month: "6월", buyStrategy: -0.8, reductionStrategy: -1.1 },
          { month: "7월", buyStrategy: 2.9, reductionStrategy: 1.9 },
          { month: "8월", buyStrategy: 1.5, reductionStrategy: 0.8 },
          { month: "9월", buyStrategy: 3.1, reductionStrategy: 2.3 },
          { month: "10월", buyStrategy: -2.1, reductionStrategy: -1.8 },
          { month: "11월", buyStrategy: 4.8, reductionStrategy: 3.2 },
          { month: "12월", buyStrategy: 2.3, reductionStrategy: 1.7 },
        ],
        // 수치 요약
        summary: {
          buyStrategy: {
            avgPurchasePrice: 9400,
            totalTons: 4500,
            totalCost: 423,
            savingsEffect: 13,
          },
          reductionStrategy: {
            avgPurchasePrice: null,
            totalTons: 4500,
            totalCost: 275,
            savingsEffect: 25,
          },
        },
        // 거래 내역
        tradeHistory: [
          {
            date: "2021-05-15",
            type: "매수",
            quantity: 200,
            price: 8800,
            return: 2.1,
          },
          {
            date: "2021-08-10",
            type: "매도",
            quantity: 200,
            price: 9400,
            return: 6.8,
          },
          {
            date: "2021-06-05",
            type: "매수",
            quantity: 300,
            price: 8600,
            return: 3.4,
          },
          {
            date: "2022-03-20",
            type: "매도",
            quantity: 300,
            price: 10200,
            return: 18.6,
          },
          {
            date: "2021-10-12",
            type: "매수",
            quantity: 250,
            price: 8700,
            return: 4.2,
          },
          {
            date: "2022-08-08",
            type: "매도",
            quantity: 250,
            price: 10100,
            return: 16.1,
          },
        ],
      };

      setResults(mockResults);
      setIsRunning(false);
    }, 2000);
  };

  // 차트 렌더링 함수
  const renderPriceChart = () => {
    if (!results?.priceData || results.priceData.length === 0) return null;

    const maxPrice = Math.max(...results.priceData.map((d: any) => d.price));
    const minPrice = Math.min(...results.priceData.map((d: any) => d.price));
    const priceRange = maxPrice - minPrice;

    // 디버깅을 위한 로그
    console.log("Price Data Length:", results.priceData.length);
    console.log("Buy Signals Length:", results.buySignals?.length || 0);
    console.log("Sell Signals Length:", results.sellSignals?.length || 0);
    console.log("Price Range:", { minPrice, maxPrice, priceRange });

    return (
      <div className="relative">
        {/* Y축 라벨 */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-12">
          <span>{maxPrice.toLocaleString()}원</span>
          <span>{((maxPrice + minPrice) / 2).toLocaleString()}원</span>
          <span>{minPrice.toLocaleString()}원</span>
        </div>

        {/* 차트 영역 */}
        <div className="ml-12 h-64 relative">
          {/* 그리드 라인 */}
          <div className="absolute inset-0">
            <div className="h-1/3 border-b border-gray-100"></div>
            <div className="h-1/3 border-b border-gray-100"></div>
          </div>

          {/* 가격 라인 */}
          <svg className="absolute inset-0 w-full h-full">
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={results.priceData
                .map((d: any, index: number) => {
                  const x = (index / (results.priceData.length - 1)) * 100;
                  const y = 100 - ((d.price - minPrice) / priceRange) * 100;
                  return `${x}%,${y}%`;
                })
                .join(" ")}
            />
          </svg>

          {/* 매수 신호 */}
          {results.buySignals?.map((signal: any) => {
            // 날짜 매칭을 더 유연하게 처리
            const matchingData = results.priceData.find((d: any) => {
              const signalDate = new Date(signal.date);
              const dataDate = new Date(d.date);
              return signalDate.getTime() === dataDate.getTime();
            });
            let targetData = matchingData;
            if (!matchingData) {
              // 정확한 매칭이 없으면 가장 가까운 날짜 찾기
              const signalDate = new Date(signal.date);
              let closestData = results.priceData[0];
              let minDiff = Math.abs(
                new Date(closestData.date).getTime() - signalDate.getTime()
              );
              results.priceData.forEach((d: any) => {
                const diff = Math.abs(
                  new Date(d.date).getTime() - signalDate.getTime()
                );
                if (diff < minDiff) {
                  minDiff = diff;
                  closestData = d;
                }
              });
              if (minDiff > 30 * 24 * 60 * 60 * 1000) return null; // 30일 이상 차이나면 표시하지 않음
              targetData = closestData;
            }
            const dataIndex = results.priceData.findIndex(
              (d: any) => d.date === targetData.date
            );
            if (dataIndex === -1) return null;
            const x = (dataIndex / (results.priceData.length - 1)) * 100;
            const y = 100 - ((signal.price - minPrice) / priceRange) * 100;
            return (
              <div
                key={`buy-${signal.date}`}
                className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg z-10"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                title={`매수: ${
                  signal.date
                }, ${signal.price.toLocaleString()}원, ${signal.quantity}톤`}
              />
            );
          })}

          {/* 매도 신호 */}
          {results.sellSignals?.map((signal: any) => {
            // 날짜 매칭을 더 유연하게 처리
            const matchingData = results.priceData.find((d: any) => {
              const signalDate = new Date(signal.date);
              const dataDate = new Date(d.date);
              return signalDate.getTime() === dataDate.getTime();
            });
            let targetData = matchingData;
            if (!matchingData) {
              // 정확한 매칭이 없으면 가장 가까운 날짜 찾기
              const signalDate = new Date(signal.date);
              let closestData = results.priceData[0];
              let minDiff = Math.abs(
                new Date(closestData.date).getTime() - signalDate.getTime()
              );
              results.priceData.forEach((d: any) => {
                const diff = Math.abs(
                  new Date(d.date).getTime() - signalDate.getTime()
                );
                if (diff < minDiff) {
                  minDiff = diff;
                  closestData = d;
                }
              });
              if (minDiff > 30 * 24 * 60 * 60 * 1000) return null; // 30일 이상 차이나면 표시하지 않음
              targetData = closestData;
            }
            const dataIndex = results.priceData.findIndex(
              (d: any) => d.date === targetData.date
            );
            if (dataIndex === -1) return null;
            const x = (dataIndex / (results.priceData.length - 1)) * 100;
            const y = 100 - ((signal.price - minPrice) / priceRange) * 100;
            return (
              <div
                key={`sell-${signal.date}`}
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg z-10"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                title={`매도: ${
                  signal.date
                }, ${signal.price.toLocaleString()}원, ${signal.quantity}톤`}
              />
            );
          })}

          {/* X축 라벨 */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
            {results.priceData.length > 0 && (
              <>
                <span>{new Date(results.priceData[0].date).getFullYear()}</span>
                <span>
                  {(() => {
                    const midIdx = Math.floor(results.priceData.length / 2);
                    return new Date(
                      results.priceData[midIdx].date
                    ).getFullYear();
                  })()}
                </span>
                <span>
                  {new Date(
                    results.priceData[results.priceData.length - 1].date
                  ).getFullYear()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 범례 */}
        <div className="flex justify-center mt-4 space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>배출권 가격</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>매수 신호</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>매도 신호</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
        백테스팅 분석
      </h3>

      {/* 입력 파라미터 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          입력 파라미터
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전략 유형
            </label>
            <select
              value={params.strategyType}
              onChange={(e) =>
                setParams({ ...params, strategyType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="매수 전략">매수 전략</option>
              <option value="감축 전략">감축 전략</option>
              <option value="복합 전략">복합 전략</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              하락 조건 (%)
            </label>
            <input
              type="number"
              value={params.buyCondition}
              onChange={(e) =>
                setParams({ ...params, buyCondition: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상승 조건 (%)
            </label>
            <input
              type="number"
              value={params.sellCondition}
              onChange={(e) =>
                setParams({ ...params, sellCondition: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              투자 단위 (톤)
            </label>
            <input
              type="number"
              value={params.investmentUnit}
              onChange={(e) =>
                setParams({ ...params, investmentUnit: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              감축 투자 단가 (원/톤)
            </label>
            <input
              type="number"
              value={params.reductionCost}
              onChange={(e) =>
                setParams({ ...params, reductionCost: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              감축 가능량 (톤)
            </label>
            <input
              type="number"
              value={params.reductionCapacity}
              onChange={(e) =>
                setParams({
                  ...params,
                  reductionCapacity: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={runBacktesting}
          disabled={isRunning}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              백테스팅 실행 중...
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5 mr-2" />
              백테스팅 실행
            </>
          )}
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* 수익률 비교 차트 - 주석 처리됨 */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              수익률 비교 차트
            </h4>
            <div className="h-80 relative">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-12">
                <span>+15%</span>
                <span>+10%</span>
                <span>+5%</span>
                <span>0%</span>
                <span>-5%</span>
                <span>-10%</span>
                <span>-15%</span>
              </div>

              <div className="ml-12 h-full relative">
                <div className="absolute inset-0">
                  <div className="h-1/7 border-b border-gray-100"></div>
                  <div className="h-1/7 border-b border-gray-100"></div>
                  <div className="h-1/7 border-b border-gray-100"></div>
                  <div className="h-1/7 border-b border-gray-100"></div>
                  <div className="h-1/7 border-b border-gray-100"></div>
                  <div className="h-1/7 border-b border-gray-100"></div>
                </div>

                <div className="absolute left-0 right-0 top-3/7 border-t-2 border-gray-300"></div>

                <svg className="absolute inset-0 w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    points={results.roiComparison
                      .map((month: any, index: number) => {
                        const x =
                          (index / (results.roiComparison.length - 1)) * 100;
                        const y = 42.86 - month.buyStrategy * 2.86;
                        return `${x}%,${y}%`;
                      })
                      .join(" ")}
                  />

                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    points={results.roiComparison
                      .map((month: any, index: number) => {
                        const x =
                          (index / (results.roiComparison.length - 1)) * 100;
                        const y = 42.86 - month.reductionStrategy * 2.86;
                        return `${x}%,${y}%`;
                      })
                      .join(" ")}
                  />
                </svg>

                {results.roiComparison.map((month: any, index: number) => {
                  const x = (index / (results.roiComparison.length - 1)) * 100;
                  const buyY = 42.86 - month.buyStrategy * 2.86;
                  const reductionY = 42.86 - month.reductionStrategy * 2.86;

                  return (
                    <React.Fragment key={index}>
                      <div
                        className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                        style={{
                          left: `${x}%`,
                          top: `${buyY}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        title={`매수 전략 ${month.month}: ${
                          month.buyStrategy > 0 ? "+" : ""
                        }${month.buyStrategy}%`}
                      />
                      <div
                        className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                        style={{
                          left: `${x}%`,
                          top: `${reductionY}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        title={`감축 전략 ${month.month}: ${
                          month.reductionStrategy > 0 ? "+" : ""
                        }${month.reductionStrategy}%`}
                      />
                    </React.Fragment>
                  );
                })}

                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
                  {results.roiComparison.map((month: any, index: number) => (
                    <span
                      key={index}
                      className="text-center"
                      style={{
                        width: `${100 / results.roiComparison.length}%`,
                      }}
                    >
                      {month.month}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>매수 전략</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>감축 전략</span>
              </div>
            </div>
          </div> */}

          {/* 월별 성과 히트맵 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              월별 성과 히트맵
            </h4>

            {/* 히트맵 그래프 */}
            <div className="mb-6">
              {/* X축 라벨 (월별) */}
              <div className="flex">
                <div className="w-20 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    {results.roiComparison.map((month: any, index: number) => (
                      <span
                        key={index}
                        className="text-center"
                        style={{
                          width: `${100 / results.roiComparison.length}%`,
                        }}
                      >
                        {month.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 히트맵 셀들 */}
              <div className="space-y-2">
                {/* 매수 전략 행 */}
                <div className="flex items-center">
                  <div className="w-20 flex-shrink-0 text-sm font-medium text-gray-700">
                    매수 전략
                  </div>
                  <div className="flex-1 flex">
                    {results.roiComparison.map((month: any, index: number) => {
                      const getHeatmapColor = (value: number) => {
                        // 수익률에 따른 색상 계산
                        const normalizedValue = Math.max(
                          -5,
                          Math.min(5, value)
                        );
                        const intensity = Math.abs(normalizedValue) / 5;

                        if (normalizedValue >= 0) {
                          // 양수: 녹색 계열
                          const green = Math.floor(200 + intensity * 55);
                          const red = Math.floor(255 - intensity * 100);
                          return `rgb(${red}, ${green}, 100)`;
                        } else {
                          // 음수: 빨간색 계열
                          const red = Math.floor(255 - intensity * 100);
                          const green = Math.floor(200 - intensity * 100);
                          return `rgb(${red}, ${green}, 100)`;
                        }
                      };

                      const getTextColor = (value: number) => {
                        return Math.abs(value) > 2
                          ? "text-white"
                          : "text-gray-800";
                      };

                      return (
                        <div
                          key={index}
                          className="h-8 border border-gray-200 flex items-center justify-center text-xs font-medium"
                          style={{
                            width: `${100 / results.roiComparison.length}%`,
                            backgroundColor: getHeatmapColor(month.buyStrategy),
                            color: getTextColor(month.buyStrategy),
                          }}
                        >
                          {month.buyStrategy > 0 ? "+" : ""}
                          {month.buyStrategy}%
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 감축 전략 행 */}
                <div className="flex items-center">
                  <div className="w-20 flex-shrink-0 text-sm font-medium text-gray-700">
                    감축 전략
                  </div>
                  <div className="flex-1 flex">
                    {results.roiComparison.map((month: any, index: number) => {
                      const getHeatmapColor = (value: number) => {
                        // 수익률에 따른 색상 계산
                        const normalizedValue = Math.max(
                          -5,
                          Math.min(5, value)
                        );
                        const intensity = Math.abs(normalizedValue) / 5;

                        if (normalizedValue >= 0) {
                          // 양수: 녹색 계열
                          const green = Math.floor(200 + intensity * 55);
                          const red = Math.floor(255 - intensity * 100);
                          return `rgb(${red}, ${green}, 100)`;
                        } else {
                          // 음수: 빨간색 계열
                          const red = Math.floor(255 - intensity * 100);
                          const green = Math.floor(200 - intensity * 100);
                          return `rgb(${red}, ${green}, 100)`;
                        }
                      };

                      const getTextColor = (value: number) => {
                        return Math.abs(value) > 2
                          ? "text-white"
                          : "text-gray-800";
                      };

                      return (
                        <div
                          key={index}
                          className="h-8 border border-gray-200 flex items-center justify-center text-xs font-medium"
                          style={{
                            width: `${100 / results.roiComparison.length}%`,
                            backgroundColor: getHeatmapColor(
                              month.reductionStrategy
                            ),
                            color: getTextColor(month.reductionStrategy),
                          }}
                        >
                          {month.reductionStrategy > 0 ? "+" : ""}
                          {month.reductionStrategy}%
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 히트맵 범례 */}
            <div className="flex justify-center items-center space-x-6 text-xs">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "rgb(155, 255, 100)" }}
                ></div>
                <span>높은 수익 (3%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "rgb(200, 255, 100)" }}
                ></div>
                <span>양호 (1-3%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "rgb(255, 255, 100)" }}
                ></div>
                <span>보통 (-1~1%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "rgb(255, 200, 100)" }}
                ></div>
                <span>저조 (-3~-1%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "rgb(255, 155, 100)" }}
                ></div>
                <span>손실 (-3% 이하)</span>
              </div>
            </div>
          </div>

          {/* 수치 요약 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              수치 요약
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                      항목
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                      전략 A (매수)
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                      전략 B (감축)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-4 text-sm text-gray-700">
                      평균 매입 단가
                    </td>
                    <td className="py-2 px-4 text-sm font-medium text-gray-900">
                      {results.summary.buyStrategy.avgPurchasePrice?.toLocaleString()}
                      원
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-500">N/A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-4 text-sm text-gray-700">
                      총 배출량 대응 톤수
                    </td>
                    <td className="py-2 px-4 text-sm font-medium text-gray-900">
                      {results.summary.buyStrategy.totalTons.toLocaleString()}톤
                    </td>
                    <td className="py-2 px-4 text-sm font-medium text-gray-900">
                      {results.summary.reductionStrategy.totalTons.toLocaleString()}
                      톤
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-4 text-sm text-gray-700">총비용</td>
                    <td className="py-2 px-4 text-sm font-medium text-gray-900">
                      {results.summary.buyStrategy.totalCost}억원
                    </td>
                    <td className="py-2 px-4 text-sm font-medium text-gray-900">
                      {results.summary.reductionStrategy.totalCost}억원
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-4 text-sm text-gray-700">
                      절감효과
                    </td>
                    <td className="py-2 px-4 text-sm font-medium text-green-600">
                      +{results.summary.buyStrategy.savingsEffect}%
                    </td>
                    <td className="py-2 px-4 text-sm font-medium text-green-600">
                      +{results.summary.reductionStrategy.savingsEffect}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 거래 내역 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              거래 내역
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                      날짜
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                      유형
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                      수량
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                      가격
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                      수익률
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.tradeHistory.map((trade: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-4 text-sm text-gray-700">
                        {trade.date}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            trade.type === "매수"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {trade.type}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-700">
                        {trade.quantity.toLocaleString()}톤
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-700">
                        {trade.price.toLocaleString()}원
                      </td>
                      <td
                        className={`py-2 px-4 text-sm font-medium ${
                          trade.return >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {trade.return > 0 ? "+" : ""}
                        {trade.return}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backtesting;
