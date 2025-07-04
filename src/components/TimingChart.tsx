import React, { useEffect, useRef } from "react";

interface TimingChartProps {
  dates: string[];
  prices: number[];
  volumes: number[];
  recommendations: ("매수" | "관망")[];
  apexChartsLoaded: boolean;
}

const TimingChart: React.FC<TimingChartProps> = ({
  dates,
  prices,
  volumes,
  recommendations,
  apexChartsLoaded,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!apexChartsLoaded || !chartRef.current) return;

    // 기존 차트 정리
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const buyPoints = dates.filter((_, i) => recommendations[i] === "매수");
    const buyPrices = prices.filter((_, i) => recommendations[i] === "매수");

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

    chartInstance.current = new window.ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dates, prices, volumes, recommendations, apexChartsLoaded]);

  if (!apexChartsLoaded) {
    return <div>차트 준비 중입니다...</div>;
  }

  if (!dates || dates.length === 0 || !prices || prices.length === 0) {
    return <div>매수 타이밍 데이터가 없습니다.</div>;
  }

  return <div ref={chartRef} />;
};

export default TimingChart;
