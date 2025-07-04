import React, { useEffect, useRef, useState } from "react";

interface EmissionsChartProps {
  data: Array<{
    year: string;
    total: number;
    energy: number;
    transport: number;
    industry: number;
    agriculture: number;
    waste: number;
  }>;
  selectedYear: string;
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({
  data,
  selectedYear,
}) => {
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
        // CDN에서 ApexCharts 로드
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

    const selectedData =
      data.find((item) => item.year === selectedYear) || data[0];

    // 데이터 검증 및 기본값 처리
    const validData = [
      {
        name: "에너지",
        value: isNaN(selectedData.energy) ? 0 : selectedData.energy,
      },
      {
        name: "수송",
        value: isNaN(selectedData.transport) ? 0 : selectedData.transport,
      },
      {
        name: "산업공정",
        value: isNaN(selectedData.industry) ? 0 : selectedData.industry,
      },
      {
        name: "농업",
        value: isNaN(selectedData.agriculture) ? 0 : selectedData.agriculture,
      },
      {
        name: "폐기물",
        value: isNaN(selectedData.waste) ? 0 : selectedData.waste,
      },
    ];

    const options = {
      chart: {
        type: "pie" as const,
        height: 400,
        toolbar: {
          show: false,
        },
      },
      series: validData.map((item) => item.value),
      labels: validData.map((item) => item.name),
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      legend: {
        position: "bottom" as const,
        fontSize: "14px",
      },
      title: {
        text: `${selectedYear}년 온실가스 배출량`,
        align: "center" as const,
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(1) + "%";
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: "bottom" as const,
            },
          },
        },
      ],
    };

    chartInstance.current = new window.ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, selectedYear, apexChartsLoaded]);

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
            <p className="text-gray-600">배출량 데이터가 없습니다.</p>
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

export default EmissionsChart;
