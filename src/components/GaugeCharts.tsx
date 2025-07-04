import React, { useEffect, useRef } from "react";

interface GaugeChartsProps {
  gaugeData: {
    탄소배출권_보유수량: number;
    현재_탄소배출량: number;
  };
  apexChartsLoaded: boolean;
}

const GaugeCharts: React.FC<GaugeChartsProps> = ({
  gaugeData,
  apexChartsLoaded,
}) => {
  const allowanceChartRef = useRef<HTMLDivElement>(null);
  const emissionChartRef = useRef<HTMLDivElement>(null);
  const allowanceChartInstance = useRef<any>(null);
  const emissionChartInstance = useRef<any>(null);

  useEffect(() => {
    if (!apexChartsLoaded) return;

    // 기존 차트 정리
    if (allowanceChartInstance.current) {
      allowanceChartInstance.current.destroy();
    }
    if (emissionChartInstance.current) {
      emissionChartInstance.current.destroy();
    }

    // 탄소배출권 보유수량 게이지
    if (allowanceChartRef.current) {
      const allowanceOptions = {
        chart: {
          type: "radialBar" as const,
          height: 300,
          toolbar: {
            show: false,
          },
        },
        series: [
          Math.min((gaugeData.탄소배출권_보유수량 / 1500000) * 100, 100),
        ],
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
              margin: 15,
              size: "70%",
            },
            track: {
              background: "#e7e7e7",
              strokeWidth: "97%",
              margin: 5,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: 10,
                color: "#111",
                fontSize: "22px",
                show: true,
                formatter: function (val: number) {
                  return Math.round(
                    gaugeData.탄소배출권_보유수량
                  ).toLocaleString();
                },
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#3b82f6"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "round",
        },
        labels: ["탄소배출권 보유수량"],
      };

      allowanceChartInstance.current = new window.ApexCharts(
        allowanceChartRef.current,
        allowanceOptions
      );
      allowanceChartInstance.current.render();
    }

    // 현재 탄소배출량 게이지
    if (emissionChartRef.current) {
      const emissionOptions = {
        chart: {
          type: "radialBar" as const,
          height: 300,
          toolbar: {
            show: false,
          },
        },
        series: [Math.min((gaugeData.현재_탄소배출량 / 1500000) * 100, 100)],
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
              margin: 15,
              size: "70%",
            },
            track: {
              background: "#e7e7e7",
              strokeWidth: "97%",
              margin: 5,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: 10,
                color: "#111",
                fontSize: "22px",
                show: true,
                formatter: function (val: number) {
                  return Math.round(gaugeData.현재_탄소배출량).toLocaleString();
                },
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#ef4444"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "round",
        },
        labels: ["현재 탄소배출량"],
      };

      emissionChartInstance.current = new window.ApexCharts(
        emissionChartRef.current,
        emissionOptions
      );
      emissionChartInstance.current.render();
    }

    return () => {
      if (allowanceChartInstance.current) {
        allowanceChartInstance.current.destroy();
      }
      if (emissionChartInstance.current) {
        emissionChartInstance.current.destroy();
      }
    };
  }, [gaugeData, apexChartsLoaded]);

  if (!apexChartsLoaded) {
    return <div>차트 준비 중입니다...</div>;
  }

  if (
    !gaugeData ||
    !gaugeData.탄소배출권_보유수량 ||
    !gaugeData.현재_탄소배출량
  ) {
    return <div>게이지 데이터가 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          탄소배출권 보유 현황
        </h3>
        <div ref={allowanceChartRef} />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          현재 탄소배출량
        </h3>
        <div ref={emissionChartRef} />
      </div>
    </div>
  );
};

export default GaugeCharts;
