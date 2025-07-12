import React, { useState, useEffect } from "react";
import { useData } from "../hooks/useData";
import {
  EmissionData,
  MarketData,
  ChatMessage,
  AllocationData,
  MapData,
} from "../types";
import {
  TrendingUp,
  Building2,
  LineChart,
  Users,
  MapPin,
  Globe,
} from "lucide-react";
import EmissionsChart from "../components/EmissionsChart";
import MarketChart from "../components/MarketChart";
import GaugeCharts from "../components/GaugeCharts";
import EmissionChart from "../components/EmissionChart";

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
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<MapData | null>(null);

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

  // Leaflet 지도 로딩 상태 관리
  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 업체별 할당량 데이터 생성
  const generateAllocationData = (): AllocationData[] => {
    const companies = [
      { name: "포스코", sector: "철강" },
      { name: "현대자동차", sector: "자동차" },
      { name: "삼성전자", sector: "전자" },
      { name: "LG화학", sector: "화학" },
      { name: "SK하이닉스", sector: "반도체" },
      { name: "GS칼텍스", sector: "석유화학" },
      { name: "한화솔루션", sector: "화학" },
      { name: "롯데케미칼", sector: "화학" },
      { name: "두산에너빌리티", sector: "에너지" },
      { name: "한국전력", sector: "전력" },
    ];

    return companies.map((company, index) => ({
      연도: selectedYear,
      업체명: company.name,
      업종: company.sector,
      대상년도별할당량:
        Math.floor(500000 + Math.random() * 1000000) +
        (selectedYear - 2020) * 50000,
    }));
  };

  // 지역별 이산화탄소 농도 시계열 데이터 생성
  const generateCO2TimeSeriesData = () => {
    const regions = [
      { name: "서울", lat: 37.5665, lng: 126.978 },
      { name: "부산", lat: 35.1796, lng: 129.0756 },
      { name: "대구", lat: 35.8714, lng: 128.6014 },
      { name: "인천", lat: 37.4563, lng: 126.7052 },
      { name: "광주", lat: 35.1595, lng: 126.8526 },
      { name: "대전", lat: 36.3504, lng: 127.3845 },
      { name: "울산", lat: 35.5384, lng: 129.3114 },
      { name: "세종", lat: 36.48, lng: 127.289 },
    ];

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return regions.map((region) => {
      const baseCO2 = 400 + Math.random() * 50; // 400-450 ppm 기본값
      const timeSeriesData = months.map((month) => {
        // 계절적 변동성 추가 (겨울에 높음, 여름에 낮음)
        const seasonalFactor = 1 + 0.1 * Math.sin(((month - 1) * Math.PI) / 6);
        // 연도별 증가 추세
        const yearlyIncrease = (selectedYear - 2020) * 2;
        return {
          month,
          co2: Math.round(
            (baseCO2 + yearlyIncrease) * seasonalFactor + Math.random() * 10
          ),
        };
      });

      return {
        지역명: region.name,
        위도: region.lat,
        경도: region.lng,
        시계열데이터: timeSeriesData,
        평균_이산화탄소_농도: Math.round(
          timeSeriesData.reduce((sum, d) => sum + d.co2, 0) /
            timeSeriesData.length
        ),
      };
    });
  };

  // 지역별 이산화탄소 농도 현황 데이터 생성
  const generateCO2CurrentData = (): MapData[] => {
    const regions = [
      { name: "서울", lat: 37.5665, lng: 126.978, baseCO2: 420 },
      { name: "부산", lat: 35.1796, lng: 129.0756, baseCO2: 415 },
      { name: "대구", lat: 35.8714, lng: 128.6014, baseCO2: 418 },
      { name: "인천", lat: 37.4563, lng: 126.7052, baseCO2: 425 },
      { name: "광주", lat: 35.1595, lng: 126.8526, baseCO2: 410 },
      { name: "대전", lat: 36.3504, lng: 127.3845, baseCO2: 412 },
      { name: "울산", lat: 35.5384, lng: 129.3114, baseCO2: 430 },
      { name: "세종", lat: 36.48, lng: 127.289, baseCO2: 408 },
      { name: "제주", lat: 33.4996, lng: 126.5312, baseCO2: 405 },
      { name: "강릉", lat: 37.7519, lng: 128.8761, baseCO2: 408 },
      { name: "청주", lat: 36.6424, lng: 127.489, baseCO2: 415 },
      { name: "전주", lat: 35.8242, lng: 127.148, baseCO2: 412 },
      { name: "창원", lat: 35.2278, lng: 128.6817, baseCO2: 418 },
      { name: "수원", lat: 37.2636, lng: 127.0286, baseCO2: 422 },
      { name: "용인", lat: 37.2411, lng: 127.1776, baseCO2: 420 },
    ];

    return regions.map((region) => {
      // 계절적 변동성 (현재 월 기준)
      const seasonalFactor =
        1 + 0.1 * Math.sin(((selectedMonth - 1) * Math.PI) / 6);
      // 연도별 증가 추세
      const yearlyIncrease = (selectedYear - 2020) * 2;
      // 도시 규모에 따른 변동성
      const cityFactor =
        region.name === "서울"
          ? 1.1
          : region.name === "부산"
          ? 1.05
          : region.name === "울산"
          ? 1.08
          : 1.0;

      const co2Level = Math.round(
        (region.baseCO2 + yearlyIncrease) * seasonalFactor * cityFactor +
          Math.random() * 15
      );

      return {
        지역명: region.name,
        평균_이산화탄소_농도: co2Level,
        위도: region.lat,
        경도: region.lng,
      };
    });
  };

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
      mapLoaded,
      emissionsDataLength: emissionsData.length,
      marketDataLength: marketData.length,
      selectedYear,
      selectedMonth,
      gaugeData,
    });
  }, [
    apexChartsLoaded,
    mapLoaded,
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

  // 업체별 할당량 차트 렌더링
  const renderAllocationChart = () => {
    if (!apexChartsLoaded) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">차트 로딩 중...</p>
          </div>
        </div>
      );
    }

    const allocationData = generateAllocationData();
    const chartData = allocationData.map((item) => ({
      x: item.업체명,
      y: item.대상년도별할당량,
    }));

    const options = {
      series: [
        {
          name: "할당량",
          data: chartData.map((d) => d.y),
        },
      ],
      chart: {
        type: "bar",
        height: 400,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadius: 4,
          colors: {
            ranges: [
              {
                from: 0,
                to: 1000000,
                color: "#10B981",
              },
              {
                from: 1000001,
                to: 1500000,
                color: "#F59E0B",
              },
              {
                from: 1500001,
                to: 2000000,
                color: "#EF4444",
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: chartData.map((d) => d.x),
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: {
          text: "할당량 (톤 CO₂)",
          style: {
            fontSize: "14px",
          },
        },
        labels: {
          formatter: function (val: number) {
            return Math.round(val / 1000) + "K";
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val.toLocaleString() + " 톤 CO₂";
          },
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
    };

    const chartElement = document.getElementById("allocation-chart");
    if (chartElement) {
      // 기존 차트 제거
      chartElement.innerHTML = "";
      const chart = new window.ApexCharts(chartElement, options);
      chart.render();
    }
  };

  // 지역별 CO2 농도 시계열 차트 렌더링
  const renderCO2TimeSeriesChart = () => {
    if (!apexChartsLoaded) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">차트 로딩 중...</p>
          </div>
        </div>
      );
    }

    const co2Data = generateCO2TimeSeriesData();
    const months = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];

    const series = co2Data.map((region) => ({
      name: region.지역명,
      data: region.시계열데이터.map((d) => d.co2),
    }));

    const options = {
      series: series,
      chart: {
        type: "line",
        height: 400,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      colors: [
        "#3B82F6",
        "#EF4444",
        "#10B981",
        "#F59E0B",
        "#8B5CF6",
        "#EC4899",
        "#06B6D4",
        "#84CC16",
      ],
      xaxis: {
        categories: months,
        title: {
          text: "월",
          style: {
            fontSize: "14px",
          },
        },
      },
      yaxis: {
        title: {
          text: "CO₂ 농도 (ppm)",
          style: {
            fontSize: "14px",
          },
        },
        min: 380,
        max: 500,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: number) {
            return val.toFixed(1) + " ppm";
          },
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
    };

    const chartElement = document.getElementById("co2-timeseries-chart");
    if (chartElement) {
      // 기존 차트 제거
      chartElement.innerHTML = "";
      const chart = new window.ApexCharts(chartElement, options);
      chart.render();
    }
  };

  // 지역별 CO2 농도 현황 지도 렌더링
  const renderCO2Map = () => {
    if (!mapLoaded) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">지도 로딩 중...</p>
          </div>
        </div>
      );
    }

    const mapElement = document.getElementById("co2-map");
    if (!mapElement) {
      console.error("지도 컨테이너를 찾을 수 없습니다.");
      return;
    }

    // 기존 지도 제거
    mapElement.innerHTML = "";

    try {
      const co2Data = generateCO2CurrentData();

      // 지도 초기화 (컨테이너가 준비된 후 실행)
      const initMap = () => {
        if (!mapElement || mapElement.children.length > 0) return;

        console.log("지도 초기화 시작...");

        const map = window.L.map("co2-map", {
          center: [36.5, 127.5],
          zoom: 7,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: false,
          keyboard: false,
        });

        // 타일 레이어 추가
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 18,
            minZoom: 5,
          }
        ).addTo(map);

        // 범례 생성
        const legend = window.L.control({ position: "bottomright" });
        legend.onAdd = function () {
          const div = window.L.DomUtil.create("div", "info legend");
          div.style.backgroundColor = "white";
          div.style.padding = "10px";
          div.style.borderRadius = "5px";
          div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
          div.style.fontSize = "12px";
          div.style.zIndex = "1000";
          div.innerHTML = `
            <h4 style="margin: 0 0 10px 0; font-size: 14px;">CO₂ 농도 (ppm)</h4>
            <div style="display: flex; align-items: center; margin: 2px 0;">
              <div style="width: 20px; height: 20px; background: #10B981; margin-right: 8px; border-radius: 50%;"></div>
              <span>400-410</span>
            </div>
            <div style="display: flex; align-items: center; margin: 2px 0;">
              <div style="width: 20px; height: 20px; background: #F59E0B; margin-right: 8px; border-radius: 50%;"></div>
              <span>410-420</span>
            </div>
            <div style="display: flex; align-items: center; margin: 2px 0;">
              <div style="width: 20px; height: 20px; background: #EF4444; margin-right: 8px; border-radius: 50%;"></div>
              <span>420+</span>
            </div>
          `;
          return div;
        };
        legend.addTo(map);

        // 마커 추가
        co2Data.forEach((region) => {
          let markerColor = "#10B981"; // 녹색 (낮음)
          if (region.평균_이산화탄소_농도 > 420) {
            markerColor = "#EF4444"; // 빨간색 (높음)
          } else if (region.평균_이산화탄소_농도 > 410) {
            markerColor = "#F59E0B"; // 주황색 (중간)
          }

          // 커스텀 아이콘 생성
          const customIcon = window.L.divIcon({
            className: "custom-marker",
            html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          const marker = window.L.marker([region.위도, region.경도], {
            icon: customIcon,
          }).addTo(map);

          // 마커 클릭 이벤트
          marker.on("click", (e) => {
            e.originalEvent.stopPropagation();
            console.log("마커 클릭됨:", region.지역명);
            setSelectedRegion(region);
          });

          // 팝업 추가
          marker.bindPopup(`
            <div style="text-align: center; min-width: 150px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1F2937;">${region.지역명}</h3>
              <div style="font-size: 18px; font-weight: bold; color: ${markerColor};">
                ${region.평균_이산화탄소_농도} ppm
              </div>
              <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">
                ${selectedYear}년 ${selectedMonth}월 기준
              </div>
              <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">
                클릭하여 상세 정보 보기
              </div>
            </div>
          `);
        });

        // 지도 크기 조정
        setTimeout(() => {
          map.invalidateSize();
          console.log("지도 초기화 완료");
        }, 200);

        return map;
      };

      // 지도 초기화 실행
      setTimeout(initMap, 200);
    } catch (error) {
      console.error("지도 렌더링 오류:", error);
      mapElement.innerHTML = `
        <div class="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div class="text-center">
            <div class="text-red-500 text-4xl mb-2">⚠️</div>
            <p class="text-gray-600">지도 로딩에 실패했습니다</p>
            <p class="text-sm text-gray-500 mt-2">${error.message}</p>
          </div>
        </div>
      `;
    }
  };

  // 차트 렌더링 useEffect
  useEffect(() => {
    if (apexChartsLoaded) {
      setTimeout(() => {
        renderAllocationChart();
        renderCO2TimeSeriesChart();
      }, 100);
    }
  }, [apexChartsLoaded, selectedYear, selectedMonth]);

  // 지도 렌더링 useEffect
  useEffect(() => {
    if (mapLoaded) {
      setTimeout(() => {
        renderCO2Map();
      }, 200);
    }
  }, [mapLoaded, selectedYear, selectedMonth]);

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
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* 연도 슬라이더 */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    연도 선택
                  </label>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {selectedYear}년
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="2020"
                    max="2030"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                        ((selectedYear - 2020) / 10) * 100
                      }%, #E5E7EB ${
                        ((selectedYear - 2020) / 10) * 100
                      }%, #E5E7EB 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2020</span>
                    <span>2025</span>
                    <span>2030</span>
                  </div>
                </div>
              </div>

              {/* 월 슬라이더 */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    월 선택
                  </label>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {selectedMonth === 0 ? "전체" : `${selectedMonth}월`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                        (selectedMonth / 12) * 100
                      }%, #E5E7EB ${
                        (selectedMonth / 12) * 100
                      }%, #E5E7EB 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>전체</span>
                    <span>6월</span>
                    <span>12월</span>
                  </div>
                </div>
              </div>
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
          {/* <div className="mb-8">
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
          </div> */}

          {/* Greenhouse Gas Emission Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-green-600" />
              온실가스 배출량 현황 (환경부 데이터)
            </h2>
            <EmissionChart />
          </div>

          {/* Market Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-blue-600" />
              KAU24 시장 동향
            </h2>

            {/* 월별 필터 */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  월별 필터:
                </span>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      selectedMonth === month
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {month}월
                  </button>
                ))}
                <button
                  onClick={() => setSelectedMonth(0)}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                    selectedMonth === 0
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  전체
                </button>
              </div>

              {/* 선택된 필터 정보 */}
              <div className="text-sm text-gray-600">
                {selectedMonth === 0 ? (
                  <span>
                    전체 월 데이터 표시 중 (총 {marketData.length}개 데이터)
                  </span>
                ) : (
                  <span>
                    {selectedMonth}월 데이터 표시 중 (
                    {marketData.filter((d) => d.월 === selectedMonth).length}개
                    데이터)
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <MarketChart
                data={marketData
                  .filter((d) => selectedMonth === 0 || d.월 === selectedMonth)
                  .map((d) => ({
                    date: d.일자.toISOString().split("T")[0], // YYYY-MM-DD 형식으로 변경
                    open: d.시가,
                    high: d.고가,
                    low: d.저가,
                    close: d.종가,
                    volume: d.거래량,
                  }))}
                showStats={true}
              />
            </div>
          </div>
          {/* 지역별 이산화탄소 농도 현황 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-teal-600" />
              지역별 이산화탄소 농도 현황 ({selectedYear}년 {selectedMonth}월)
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 지도 영역 */}
                <div className="lg:col-span-2">
                  <div
                    id="co2-map"
                    style={{ height: "500px", width: "100%" }}
                  ></div>
                </div>

                {/* 상세 정보 패널 */}
                <div className="lg:col-span-1">
                  {selectedRegion ? (
                    <div className="bg-gray-50 rounded-lg p-6 h-full">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedRegion.지역명}
                        </h3>
                        <div
                          className={`text-3xl font-bold ${
                            selectedRegion.평균_이산화탄소_농도 > 420
                              ? "text-red-600"
                              : selectedRegion.평균_이산화탄소_농도 > 410
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {selectedRegion.평균_이산화탄소_농도} ppm
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedYear}년 {selectedMonth}월 기준
                        </div>
                      </div>

                      {/* 상태 표시 */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <span className="text-sm font-medium text-gray-700">
                            상태
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              selectedRegion.평균_이산화탄소_농도 > 420
                                ? "bg-red-100 text-red-800"
                                : selectedRegion.평균_이산화탄소_농도 > 410
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {selectedRegion.평균_이산화탄소_농도 > 420
                              ? "높음"
                              : selectedRegion.평균_이산화탄소_농도 > 410
                              ? "주의"
                              : "양호"}
                          </span>
                        </div>
                      </div>

                      {/* 상세 정보 */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg border p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            위치 정보
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">위도</span>
                              <span className="font-medium">
                                {selectedRegion.위도}°N
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">경도</span>
                              <span className="font-medium">
                                {selectedRegion.경도}°E
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            농도 분석
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">현재 농도</span>
                                <span className="font-medium">
                                  {selectedRegion.평균_이산화탄소_농도} ppm
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    selectedRegion.평균_이산화탄소_농도 > 420
                                      ? "bg-red-500"
                                      : selectedRegion.평균_이산화탄소_농도 >
                                        410
                                      ? "bg-orange-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      ((selectedRegion.평균_이산화탄소_농도 -
                                        400) /
                                        50) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>400 ppm</span>
                                <span>450 ppm</span>
                              </div>
                            </div>

                            <div className="text-xs text-gray-600">
                              {selectedRegion.평균_이산화탄소_농도 > 420
                                ? "⚠️ 높은 농도로 인한 환경 영향 주의가 필요합니다."
                                : selectedRegion.평균_이산화탄소_농도 > 410
                                ? "⚠️ 주의가 필요한 수준입니다."
                                : "✅ 양호한 수준을 유지하고 있습니다."}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            추천 조치
                          </h4>
                          <div className="text-xs text-gray-600 space-y-2">
                            {selectedRegion.평균_이산화탄소_농도 > 420 ? (
                              <>
                                <div>• 공공교통 이용 권장</div>
                                <div>• 친환경 에너지 사용</div>
                                <div>• 산업시설 배출량 감축</div>
                              </>
                            ) : selectedRegion.평균_이산화탄소_농도 > 410 ? (
                              <>
                                <div>• 대중교통 이용 증가</div>
                                <div>• 에너지 효율성 개선</div>
                                <div>• 녹지 확대</div>
                              </>
                            ) : (
                              <>
                                <div>• 현재 수준 유지</div>
                                <div>• 지속적인 모니터링</div>
                                <div>• 친환경 정책 지속</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-4">🗺️</div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          지역을 선택하세요
                        </h3>
                        <p className="text-sm text-gray-500">
                          지도에서 마커를 클릭하여
                          <br />
                          해당 지역의 상세 정보를 확인하세요
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* 업체별 할당량 현황과 지역별 이산화탄소 농도 시계열 */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 업체별 할당량 현황 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  업체별 할당량 현황 ({selectedYear}년)
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div id="allocation-chart"></div>
                </div>
              </div>

              {/* 지역별 이산화탄소 농도 시계열 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                  지역별 이산화탄소 농도 시계열 ({selectedYear}년)
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div id="co2-timeseries-chart"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
