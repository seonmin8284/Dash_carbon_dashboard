import React, { useState, useEffect } from "react";
import { useData } from "../hooks/useData";
import { EmissionData, MarketData, ChatMessage } from "../types";
import { TrendingUp, Building2, LineChart } from "lucide-react";
import EmissionsChart from "../components/EmissionsChart";
import MarketChart from "../components/MarketChart";
import GaugeCharts from "../components/GaugeCharts";
import ChatInterface from "../components/ChatInterface";

const Dashboard: React.FC = () => {
  // 오류 상태 관리
  const [error, setError] = useState<string | null>(null);

  // 오류 발생 시 처리
  const handleError = (error: Error) => {
    console.error("Dashboard 오류:", error);
    setError(error.message);
  };

  // 오류가 있으면 오류 화면 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              오류가 발생했습니다
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { emissionsData, marketData, loading } = useData();
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

  // ApexCharts 로딩 상태 관리 (최상위에서 한 번만)
  useEffect(() => {
    if (window.ApexCharts) {
      setApexChartsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/apexcharts@3.45.1/dist/apexcharts.min.js";
    script.onload = () => setApexChartsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 게이지 데이터 생성
  const generateGaugeData = (year: number, month: number) => {
    // 입력값 검증
    const safeYear =
      isNaN(year) || year === undefined
        ? 2024
        : Math.max(Math.min(year, 2030), 2020);
    const safeMonth =
      isNaN(month) || month === undefined
        ? 1
        : Math.max(Math.min(month, 12), 1);

    const baseAllowance = 1000000 + (safeYear - 2020) * 50000;
    const baseEmission = 700000 + (safeYear - 2020) * 30000;

    // 안정적인 랜덤 값 생성 (seed 기반)
    const seed = safeYear * 12 + safeMonth;
    const random1 = ((seed * 9301 + 49297) % 233280) / 233280;
    const random2 = (((seed + 1) * 9301 + 49297) % 233280) / 233280;

    // 안전한 값 계산
    const allowance = Math.max(baseAllowance + random1 * 200000, 100000);
    const emission = Math.max(baseEmission + random2 * 200000, 100000);

    return {
      탄소배출권_보유수량: isNaN(allowance) ? 1000000 : allowance,
      현재_탄소배출량: isNaN(emission) ? 700000 : emission,
    };
  };

  // 게이지 데이터를 상태로 관리하여 안정화
  const [gaugeData, setGaugeData] = useState(() =>
    generateGaugeData(selectedYear, selectedMonth)
  );

  // selectedYear나 selectedMonth가 변경될 때 게이지 데이터 업데이트
  useEffect(() => {
    setGaugeData(generateGaugeData(selectedYear, selectedMonth));
  }, [selectedYear, selectedMonth]);

  // 데이터 상태 디버깅
  useEffect(() => {
    console.log("📊 데이터 상태:", {
      apexChartsLoaded,
      emissionsDataLength: emissionsData.length,
      marketDataLength: marketData.length,
      selectedYear,
      selectedMonth,
      gaugeData,
    });
  }, [
    apexChartsLoaded,
    emissionsData.length,
    marketData.length,
    selectedYear,
    selectedMonth,
    gaugeData,
  ]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: "탄소배출권에 대한 질문을 해주세요.",
      timestamp: new Date().toISOString(),
    };

    setChatMessages([...chatMessages, userMessage, assistantMessage]);
    setChatInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <LineChart className="h-6 w-6 mr-2 text-blue-600" />
            현황 대시보드
          </h1>
          <p className="text-gray-600 mt-2">
            탄소배출량 현황 및 시장 동향을 한눈에 확인하세요
          </p>
        </div>

        <div className="p-6">
          {/* Year/Month Selector */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연도 선택
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월 선택
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gauge Charts */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              실시간 현황
            </h2>
            <GaugeCharts
              gaugeData={gaugeData}
              apexChartsLoaded={apexChartsLoaded}
            />
          </div>

          {/* Emissions Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-red-600" />
              연도별 탄소배출량 추이
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <EmissionsChart
                data={emissionsData.map((d) => ({
                  year: d.연도.toString(),
                  total: d.총배출량,
                  energy: d.에너지,
                  transport: 0, // 수송 데이터가 없으므로 0으로 설정
                  industry: d.산업공정,
                  agriculture: d.농업,
                  waste: d.폐기물,
                }))}
                selectedYear={selectedYear.toString()}
              />
            </div>
          </div>

          {/* Market Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-blue-600" />
              KAU24 시장 동향
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <MarketChart
                data={marketData.map((d) => ({
                  date: d.연도.toString(),
                  price: d.시가,
                  volume: d.거래량,
                }))}
              />
            </div>
          </div>

          {/* Chat Interface */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              AI 챗봇 상담
            </h2>
            <ChatInterface
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              onChatSubmit={handleChatSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
