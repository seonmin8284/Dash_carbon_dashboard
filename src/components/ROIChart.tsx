import React, { useEffect, useRef } from "react";

interface ROIChartProps {
  apexChartsLoaded: boolean;
}

const ROIChart: React.FC<ROIChartProps> = ({ apexChartsLoaded }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!apexChartsLoaded || !chartRef.current) return;

    // 기존 차트 정리
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

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
      colors: ["#3b82f6"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "70%",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val + "%";
        },
      },
    };

    chartInstance.current = new window.ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [apexChartsLoaded]);

  if (!apexChartsLoaded) {
    return <div>차트 준비 중입니다...</div>;
  }

  return <div ref={chartRef} />;
};

export default ROIChart;
