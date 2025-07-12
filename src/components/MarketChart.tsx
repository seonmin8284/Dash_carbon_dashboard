import React, { useEffect, useRef, useState } from "react";

interface MarketChartProps {
  data: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  showStats?: boolean;
  showBuySignals?: boolean;
}

const MarketChart: React.FC<MarketChartProps> = ({
  data,
  showStats = true,
  showBuySignals = false,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

  // 최적 매수 타이밍 분석
  const buySignals = React.useMemo(() => {
    if (!data || data.length < 20) return [];

    const signals: Array<{
      date: string;
      price: number;
      reason: string;
      strength: "strong" | "medium" | "weak";
    }> = [];

    // 이동평균 계산 (20일, 50일)
    const calculateMA = (period: number) => {
      const ma: number[] = [];
      for (let i = period - 1; i < data.length; i++) {
        const sum = data
          .slice(i - period + 1, i + 1)
          .reduce((acc, d) => acc + d.close, 0);
        ma.push(sum / period);
      }
      return ma;
    };

    const ma20 = calculateMA(20);
    const ma50 = calculateMA(50);

    // RSI 계산
    const calculateRSI = (period: number = 14) => {
      const rsi: number[] = [];
      for (let i = period; i < data.length; i++) {
        let gains = 0;
        let losses = 0;

        for (let j = i - period + 1; j <= i; j++) {
          const change = data[j].close - data[j - 1].close;
          if (change > 0) gains += change;
          else losses -= change;
        }

        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        const rsiValue = 100 - 100 / (1 + rs);
        rsi.push(rsiValue);
      }
      return rsi;
    };

    const rsi = calculateRSI();

    // 매수 신호 분석 - 보수적 접근
    for (let i = 50; i < data.length; i++) {
      const currentPrice = data[i].close;
      const currentVolume = data[i].volume;
      const prevPrice = data[i - 1].close;
      const avgVolume =
        data
          .slice(Math.max(0, i - 20), i)
          .reduce((sum, d) => sum + d.volume, 0) / Math.min(20, i);

      // 최근 가격 변동성 계산
      const recentPrices = data
        .slice(Math.max(0, i - 10), i + 1)
        .map((d) => d.close);
      const mean =
        recentPrices.reduce((sum, price) => sum + price, 0) /
        recentPrices.length;
      const variance =
        recentPrices.reduce(
          (sum, price) => sum + Math.pow(price - mean, 2),
          0
        ) / recentPrices.length;
      const priceVolatility = Math.sqrt(variance) / mean;

      let signalStrength: "strong" | "medium" | "weak" = "weak";
      let reason = "";

      // 1. 골든크로스 (20일선이 50일선을 상향돌파) - 엄격한 조건
      if (
        i >= 50 &&
        ma20[i - 20] > ma50[i - 50] &&
        ma20[i - 21] <= ma50[i - 51] &&
        ma20[i - 20] > ma20[i - 21] * 1.01 // 20일선이 상승 추세
      ) {
        reason = "골든크로스 (20일선 > 50일선)";
        signalStrength = "strong";
      }

      // 2. RSI 과매도 구간에서 반등 - 더 엄격한 조건
      else if (
        i >= 14 &&
        rsi[i - 14] < 25 && // 더 낮은 RSI 기준
        currentPrice > prevPrice * 1.02 && // 2% 이상 상승
        currentPrice >
          Math.min(...data.slice(Math.max(0, i - 5), i).map((d) => d.close)) *
            1.01 // 최근 최저가 대비 상승
      ) {
        reason = "RSI 과매도 구간에서 반등";
        signalStrength = "medium";
      }

      // 3. 거래량 급증 + 가격 상승 - 보수적 조건
      else if (
        currentVolume > avgVolume * 2 && // 거래량 2배 이상
        currentPrice > prevPrice * 1.03 && // 3% 이상 상승
        currentPrice >
          Math.min(...data.slice(Math.max(0, i - 10), i).map((d) => d.close)) *
            1.02 // 지지선 대비 상승
      ) {
        reason = "거래량 급증 + 가격 상승";
        signalStrength = "medium";
      }

      // 4. 지지선 근처에서 반등 - 더 엄격한 조건
      else if (
        currentPrice > prevPrice * 1.02 && // 2% 이상 상승
        currentPrice >
          Math.min(...data.slice(Math.max(0, i - 15), i).map((d) => d.low)) *
            1.02 && // 지지선 대비 2% 이상
        currentVolume > avgVolume * 1.5 // 거래량 증가
      ) {
        reason = "지지선 근처에서 반등";
        signalStrength = "weak";
      }

      // 5. 연속 상승 패턴 - 더 엄격한 조건
      else if (
        i >= 5 &&
        currentPrice > prevPrice * 1.01 && // 1% 이상 상승
        prevPrice > data[i - 2].close * 1.01 &&
        data[i - 2].close > data[i - 3].close * 1.01 &&
        data[i - 3].close > data[i - 4].close * 1.01 &&
        data[i - 4].close > data[i - 5].close * 1.01 &&
        currentVolume > avgVolume * 1.2 // 거래량 증가
      ) {
        reason = "연속 상승 패턴";
        signalStrength = "medium";
      }

      // 6. 가격 급등 - 보수적 조건
      else if (
        currentPrice > prevPrice * 1.08 && // 8% 이상 상승
        currentVolume > avgVolume * 2.5 && // 거래량 2.5배 이상
        priceVolatility < 0.1 // 변동성이 낮은 상태
      ) {
        reason = "가격 급등";
        signalStrength = "strong";
      }

      // 7. 거래량 급증 - 보수적 조건
      else if (
        currentVolume > avgVolume * 3 && // 거래량 3배 이상
        currentPrice > prevPrice * 1.02 && // 2% 이상 상승
        currentPrice >
          Math.min(...data.slice(Math.max(0, i - 20), i).map((d) => d.close)) *
            1.03 // 장기 지지선 대비 상승
      ) {
        reason = "거래량 급증";
        signalStrength = "weak";
      }

      if (reason) {
        signals.push({
          date: data[i].date,
          price: currentPrice,
          reason,
          strength: signalStrength,
        });
      }
    }

    console.log(`매수 신호 분석 결과: ${signals.length}개의 신호 발견`);
    console.log("신호 상세:", signals);
    return signals;
  }, [data]);

  // 통계 계산
  const stats = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    const prices = data.map((d) => d.close);
    const volumes = data.map((d) => d.volume);
    const highs = data.map((d) => d.high);
    const lows = data.map((d) => d.low);

    const avgPrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const maxPrice = Math.max(...highs);
    const minPrice = Math.min(...lows);
    const totalVolume = volumes.reduce((sum, volume) => sum + volume, 0);
    const avgVolume = totalVolume / volumes.length;

    return {
      avgPrice: Math.round(avgPrice),
      maxPrice,
      minPrice,
      totalVolume,
      avgVolume: Math.round(avgVolume),
      priceChange: maxPrice - minPrice,
      priceChangePercent: (((maxPrice - minPrice) / minPrice) * 100).toFixed(1),
    };
  }, [data]);

  // ApexCharts 동적 로드
  useEffect(() => {
    const loadApexCharts = async () => {
      if (window.ApexCharts) {
        setApexChartsLoaded(true);
        return;
      }

      try {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/apexcharts@3.45.1/dist/apexcharts.min.js";
        script.onload = () => setApexChartsLoaded(true);
        script.onerror = () => console.error("ApexCharts 로드 실패");
        document.head.appendChild(script);
      } catch (error) {
        console.error("ApexCharts 로드 중 오류:", error);
      }
    };

    loadApexCharts();
  }, []);

  useEffect(() => {
    if (!apexChartsLoaded || !chartRef.current || !data.length) return;

    // 기존 차트 정리
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // 데이터 검증 및 기본값 처리
    const validData = data.map((item) => ({
      x: new Date(item.date).getTime(),
      y: [
        isNaN(item.open) ? 0 : item.open,
        isNaN(item.high) ? 0 : item.high,
        isNaN(item.low) ? 0 : item.low,
        isNaN(item.close) ? 0 : item.close,
      ],
    }));

    const validVolumes = data.map((item) => ({
      x: new Date(item.date).getTime(),
      y: isNaN(item.volume) ? 0 : item.volume,
    }));

    const validDates = data
      .map((item) => item.date || "")
      .filter((date) => date);

    // 매수 신호 데이터 준비
    const buySignalData = showBuySignals
      ? buySignals.map((signal) => ({
          x: new Date(signal.date).getTime(),
          y: signal.price,
        }))
      : [];

    console.log("매수 신호 차트 데이터:", buySignalData);
    console.log("showBuySignals:", showBuySignals);
    console.log("buySignals.length:", buySignals.length);
    console.log(
      "매수 신호 annotations:",
      showBuySignals
        ? buySignals.map((signal) => ({
            x: new Date(signal.date).getTime(),
            y: signal.price,
            strength: signal.strength,
          }))
        : []
    );

    const options = {
      chart: {
        type: "candlestick" as const,
        height: 400,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
        stacked: false,
        zoom: {
          enabled: true,
        },
      },
      series: [
        {
          name: "배출권 가격",
          type: "candlestick" as const,
          data: validData,
        },
        {
          name: "거래량",
          type: "column" as const,
          data: validVolumes,
          opacity: 0.6,
        },
      ],
      xaxis: {
        type: "datetime" as const,
        title: {
          text: "날짜",
        },
        labels: {
          format: "MM/dd",
          rotate: -45,
          rotateAlways: false,
        },
        tickAmount: 12, // 월별로 표시
      },
      yaxis: [
        {
          title: {
            text: "가격 (원)",
          },
          min: Math.min(...data.map((d) => d.low)) * 0.95,
          max: Math.max(...data.map((d) => d.high)) * 1.05,
          labels: {
            formatter: function (value: number) {
              return value.toLocaleString();
            },
          },
        },
        {
          opposite: true,
          title: {
            text: "거래량",
          },
          min: 0,
          max: Math.max(...data.map((d) => d.volume)) * 1.1,
          labels: {
            formatter: function (value: number) {
              return (value / 1000).toFixed(0) + "K";
            },
          },
        },
      ],
      title: {
        text: "KAU24 배출권 시장 동향 (OHLC)",
        align: "center" as const,
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      colors: ["#3b82f6", "#e5e7eb", "#10b981"],
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#10b981",
            downward: "#ef4444",
          },
          wick: {
            useFillColor: true,
          },
        },
        bar: {
          columnWidth: "60%",
        },
        scatter: {
          size: 8,
          strokeWidth: 2,
          strokeColor: "#ffffff",
        },
      },
      tooltip: {
        enabled: true,
        theme: "light",
        x: {
          format: "MM/dd/yyyy",
        },
        y: {
          formatter: function (
            value: any,
            { seriesIndex, dataPointIndex, w }: any
          ) {
            if (seriesIndex === 0) {
              const data = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
              return [
                `시가: ${data[0].toLocaleString()}원`,
                `고가: ${data[1].toLocaleString()}원`,
                `저가: ${data[2].toLocaleString()}원`,
                `종가: ${data[3].toLocaleString()}원`,
              ].join("<br>");
            } else if (seriesIndex === 1) {
              return `거래량: ${value.toLocaleString()}`;
            }
            return `${value.toLocaleString()}원`;
          },
        },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 5,
      },
      annotations: showBuySignals
        ? {
            points: buySignals.map((signal, index) => ({
              x: new Date(signal.date).getTime(),
              y: signal.price,
              marker: {
                size:
                  signal.strength === "strong"
                    ? 8
                    : signal.strength === "medium"
                    ? 6
                    : 4,
                fillColor:
                  signal.strength === "strong"
                    ? "#10b981"
                    : signal.strength === "medium"
                    ? "#f59e0b"
                    : "#6b7280",
                strokeColor: "#ffffff",
                strokeWidth: 2,
                radius: 2,
              },
              label: {
                borderColor:
                  signal.strength === "strong"
                    ? "#10b981"
                    : signal.strength === "medium"
                    ? "#f59e0b"
                    : "#6b7280",
                borderWidth: 1,
                text:
                  signal.strength === "strong"
                    ? "●"
                    : signal.strength === "medium"
                    ? "●"
                    : "●",
                style: {
                  color: "#ffffff",
                  background:
                    signal.strength === "strong"
                      ? "#10b981"
                      : signal.strength === "medium"
                      ? "#f59e0b"
                      : "#6b7280",
                },
              },
            })),
          }
        : undefined,
    };

    chartInstance.current = new window.ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, apexChartsLoaded]);

  if (!apexChartsLoaded) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">차트 준비 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">시장 데이터가 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div ref={chartRef} />

      {/* 통계 정보 */}
      {showStats && stats && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-600">평균 종가</div>
            <div className="text-2xl font-bold text-blue-900">
              {stats.avgPrice.toLocaleString()}원
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm font-medium text-green-600">최고가</div>
            <div className="text-2xl font-bold text-green-900">
              {stats.maxPrice.toLocaleString()}원
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-600">최저가</div>
            <div className="text-2xl font-bold text-red-900">
              {stats.minPrice.toLocaleString()}원
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-600">총 거래량</div>
            <div className="text-2xl font-bold text-purple-900">
              {(stats.totalVolume / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
      )}

      {/* 매수 신호 정보 */}
      {showBuySignals && buySignals.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            최적 매수 타이밍 분석 ({buySignals.length}개 신호 발견)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buySignals
              .slice(-10)
              .reverse()
              .map((signal, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 border ${
                    signal.strength === "strong"
                      ? "bg-green-50 border-green-200"
                      : signal.strength === "medium"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {new Date(signal.date).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        signal.strength === "strong"
                          ? "bg-green-100 text-green-800"
                          : signal.strength === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {signal.strength === "strong"
                        ? "강한 신호"
                        : signal.strength === "medium"
                        ? "보통 신호"
                        : "약한 신호"}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {signal.price.toLocaleString()}원
                  </div>
                  <div className="text-sm text-gray-600">{signal.reason}</div>
                </div>
              ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              • <strong>강한 신호</strong>: 골든크로스, 가격 급등 (8% 이상)
            </p>
            <p>
              • <strong>보통 신호</strong>: RSI 과매도 반등, 거래량 급증 + 가격
              상승, 연속 상승 패턴
            </p>
            <p>
              • <strong>약한 신호</strong>: 지지선 근처 반등, 거래량 급증
            </p>
            <p className="mt-2 text-xs text-gray-500">
              ⚠️ 보수적 분석: 신호가 적게 나타나지만 더 신뢰할 수 있는 매수
              타이밍을 제시합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketChart;
