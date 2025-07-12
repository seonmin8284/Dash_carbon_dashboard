import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { loadEmissionData, GreenhouseEmissionData } from "../hooks/useData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmissionChart: React.FC = () => {
  const [emissionData, setEmissionData] = useState<GreenhouseEmissionData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadEmissionData();
        setEmissionData(data);
      } catch (error) {
        console.error("배출량 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const chartData = {
    labels: emissionData.map((item) => item.year.toString()),
    datasets: [
      {
        label: "에너지 배출량",
        data: emissionData.map((item) => item.energyEmission),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "기타 배출량",
        data: emissionData.map((item) => item.otherEmission),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "연도별 온실가스 배출량 현황",
        color: "#333",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString()} kt CO2-eq`;
          },
          afterLabel: function (context: any) {
            const dataIndex = context.dataIndex;
            const total = emissionData[dataIndex]?.totalEmission || 0;
            return `총 배출량: ${total.toLocaleString()} kt CO2-eq`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "연도",
          color: "#333",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
        ticks: {
          color: "#333",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "배출량 (kt CO2-eq)",
          color: "#333",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
        ticks: {
          color: "#333",
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">데이터 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          온실가스 배출량 현황
        </h3>
        <p className="text-sm text-gray-600">
          연도별 총 배출량과 에너지 부문 배출량을 비교한 차트입니다.
        </p>
      </div>

      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-red-800">에너지 배출량</div>
          <div className="text-lg font-bold text-red-600">
            {emissionData.length > 0
              ? emissionData[
                  emissionData.length - 1
                ].energyEmission.toLocaleString()
              : 0}{" "}
            kt CO2-eq
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-blue-800">기타 배출량</div>
          <div className="text-lg font-bold text-blue-600">
            {emissionData.length > 0
              ? emissionData[
                  emissionData.length - 1
                ].otherEmission.toLocaleString()
              : 0}{" "}
            kt CO2-eq
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-800">총 배출량</div>
          <div className="text-lg font-bold text-gray-600">
            {emissionData.length > 0
              ? emissionData[
                  emissionData.length - 1
                ].totalEmission.toLocaleString()
              : 0}{" "}
            kt CO2-eq
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionChart;
