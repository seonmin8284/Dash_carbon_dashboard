import React, { useEffect, useRef, useState } from "react";

interface MarketChartProps {
  data: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
}

const MarketChart: React.FC<MarketChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

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
    const validPrices = data.map((item) =>
      isNaN(item.price) ? 0 : item.price
    );
    const validVolumes = data.map((item) =>
      isNaN(item.volume) ? 0 : item.volume
    );
    const validDates = data
      .map((item) => item.date || "")
      .filter((date) => date);

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
          name: "배출권 가격",
          type: "line" as const,
          data: validPrices.map((price, index) => ({
            x: validDates[index] || index,
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
        text: "배출권 시장 동향",
        align: "center" as const,
      },
      colors: ["#3b82f6", "#10b981"],
      stroke: {
        width: 2,
      },
      markers: {
        size: 4,
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
            <p className="text-gray-600">차트 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div ref={chartRef} />
    </div>
  );
};

export default MarketChart;
