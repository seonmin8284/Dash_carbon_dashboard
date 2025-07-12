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
}

const MarketChart: React.FC<MarketChartProps> = ({
  data,
  showStats = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

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
      colors: ["#3b82f6", "#e5e7eb"],
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
    </div>
  );
};

export default MarketChart;
