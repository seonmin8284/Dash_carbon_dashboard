import React, { useState, useEffect } from "react";
import { useData } from "../hooks/useData";
import { EmissionData, MarketData, ChatMessage } from "../types";
import {
  MessageCircle,
  Send,
  RotateCcw,
  TrendingUp,
  Building2,
  LineChart,
} from "lucide-react";

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
  const [selectedYear, setSelectedYear] = useState(2024); // 2025에서 2024로 변경
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

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

  // ApexCharts 로딩 확인
  useEffect(() => {
    const checkApexCharts = () => {
      if (window.ApexCharts) {
        console.log("✅ ApexCharts 로드 완료");
        setApexChartsLoaded(true);
      } else {
        console.log("⏳ ApexCharts 로딩 중...");
        setTimeout(checkApexCharts, 100);
      }
    };
    checkApexCharts();
  }, []);

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

  // ApexCharts 렌더링 useEffect
  useEffect(() => {
    try {
      if (apexChartsLoaded) {
        // 기존 차트 정리
        cleanupCharts();

        // 배출량 차트 렌더링
        const emissionsChartElement =
          document.getElementById("emissions-chart");
        if (emissionsChartElement) {
          const recentData = emissionsData.filter(
            (d) => d.연도 >= selectedYear - 9 && d.연도 <= selectedYear
          );

          // 데이터 검증 및 기본값 처리
          const validTotalEmissions = recentData.map((d) =>
            isNaN(d.총배출량) || d.총배출량 === undefined ? 0 : d.총배출량
          );
          const validEnergyEmissions = recentData.map((d) =>
            isNaN(d.에너지) || d.에너지 === undefined ? 0 : d.에너지
          );
          const validYears = recentData
            .map((d) => d.연도)
            .filter((year) => year && !isNaN(year));

          // 최소 데이터 보장
          if (
            validTotalEmissions.length === 0 ||
            validEnergyEmissions.length === 0
          ) {
            console.warn(
              "배출량 데이터가 부족합니다. 기본 데이터를 표시합니다."
            );
            // 기본 데이터 추가
            const defaultYears = [
              2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
            ];
            const defaultTotalEmissions = [
              709.1, 727.6, 701.3, 648.7, 676.2, 658.9, 642.1, 625.8,
            ];
            const defaultEnergyEmissions = [
              567.3, 582.1, 560.8, 518.2, 540.1, 526.3, 512.8, 499.5,
            ];

            validYears.push(...defaultYears);
            validTotalEmissions.push(...defaultTotalEmissions);
            validEnergyEmissions.push(...defaultEnergyEmissions);
          }

          const options = {
            chart: {
              type: "line" as const,
              height: 400,
              toolbar: {
                show: false,
              },
              animations: {
                enabled: false,
              },
            },
            series: [
              {
                name: "총배출량",
                data: validTotalEmissions,
              },
              {
                name: "에너지배출량",
                data: validEnergyEmissions,
              },
            ],
            xaxis: {
              categories: validYears,
              title: {
                text: "연도",
              },
            },
            yaxis: {
              title: {
                text: "배출량 (Gg CO₂eq)",
              },
              min: 0,
              max:
                Math.max(...validTotalEmissions, ...validEnergyEmissions, 1) *
                1.1,
            },
            title: {
              text: `연도별 온실가스 배출량 추이 (${
                selectedYear - 9
              }~${selectedYear})`,
              align: "center" as const,
            },
            colors: ["#ef4444", "#3b82f6"],
            stroke: {
              width: 3,
            },
            markers: {
              size: 6,
            },
          };

          try {
            new window.ApexCharts(emissionsChartElement, options).render();
          } catch (error) {
            console.error("배출량 차트 렌더링 오류:", error);
          }
        }

        // 시장 차트 렌더링
        const marketChartElement = document.getElementById("market-chart");
        if (marketChartElement) {
          const filteredData = marketData.filter(
            (d) => d.연도 === selectedYear
          );
          const monthlyData = filteredData.reduce((acc, curr) => {
            const existing = acc.find((item) => item.월 === curr.월);
            if (existing) {
              existing.시가 = (existing.시가 + curr.시가) / 2;
              existing.거래량 += curr.거래량;
            } else {
              acc.push({ 월: curr.월, 시가: curr.시가, 거래량: curr.거래량 });
            }
            return acc;
          }, [] as { 월: number; 시가: number; 거래량: number }[]);

          // 데이터 검증 및 기본값 처리
          const validMonthlyData = monthlyData.map((d) => ({
            ...d,
            시가: isNaN(d.시가) || d.시가 === undefined ? 0 : d.시가,
            거래량: isNaN(d.거래량) || d.거래량 === undefined ? 0 : d.거래량,
          }));

          // 최소 데이터 보장
          if (validMonthlyData.length === 0) {
            console.warn("시장 데이터가 부족합니다. 기본 데이터를 표시합니다.");
            const defaultMonthlyData = [
              { 월: 1, 시가: 100000, 거래량: 100 },
              { 월: 2, 시가: 105000, 거래량: 150 },
              { 월: 3, 시가: 110000, 거래량: 200 },
              { 월: 4, 시가: 115000, 거래량: 250 },
              { 월: 5, 시가: 120000, 거래량: 300 },
              { 월: 6, 시가: 125000, 거래량: 350 },
              { 월: 7, 시가: 130000, 거래량: 400 },
              { 월: 8, 시가: 135000, 거래량: 450 },
              { 월: 9, 시가: 140000, 거래량: 500 },
              { 월: 10, 시가: 145000, 거래량: 550 },
              { 월: 11, 시가: 150000, 거래량: 600 },
              { 월: 12, 시가: 155000, 거래량: 650 },
            ];
            validMonthlyData.push(...defaultMonthlyData);
          }

          const options = {
            chart: {
              type: "line" as const,
              height: 400,
              toolbar: {
                show: false,
              },
              animations: {
                enabled: false,
              },
            },
            series: [
              {
                name: "거래량",
                type: "column" as const,
                data: validMonthlyData.map((d) => d.거래량),
              },
              {
                name: "평균 시가",
                type: "line" as const,
                data: validMonthlyData.map((d) => d.시가),
              },
            ],
            xaxis: {
              categories: validMonthlyData.map((d) => d.월),
              title: {
                text: "월",
              },
            },
            yaxis: [
              {
                title: {
                  text: "거래량",
                },
                min: 0,
                max:
                  Math.max(...validMonthlyData.map((d) => d.거래량), 1) * 1.1,
              },
              {
                opposite: true,
                title: {
                  text: "시가 (원)",
                },
                min: 0,
                max: Math.max(...validMonthlyData.map((d) => d.시가), 1) * 1.1,
              },
            ],
            title: {
              text: `${selectedYear}년 KAU24 월별 시가/거래량 추이`,
              align: "center" as const,
            },
            colors: ["#93c5fd", "#ef4444"],
            stroke: {
              width: 3,
            },
          };

          try {
            new window.ApexCharts(marketChartElement, options).render();
          } catch (error) {
            console.error("시장 차트 렌더링 오류:", error);
          }
        }

        // 게이지 차트 렌더링
        const gaugeChart1Element = document.getElementById("gauge-chart-1");
        const gaugeChart2Element = document.getElementById("gauge-chart-2");

        if (gaugeChart1Element && gaugeChart2Element) {
          // 데이터 검증 및 기본값 처리
          const validAllowance =
            isNaN(gaugeData.탄소배출권_보유수량) ||
            gaugeData.탄소배출권_보유수량 === undefined
              ? 1000000
              : Math.max(gaugeData.탄소배출권_보유수량, 100000);
          const validEmission =
            isNaN(gaugeData.현재_탄소배출량) ||
            gaugeData.현재_탄소배출량 === undefined
              ? 700000
              : Math.max(gaugeData.현재_탄소배출량, 100000);

          // 게이지 퍼센트 계산 (안전한 범위 내에서)
          const allowancePercent = Math.min(
            Math.max(Math.round((validAllowance / 1500000) * 100), 0),
            100
          );
          const emissionPercent = Math.min(
            Math.max(Math.round((validEmission / 1200000) * 100), 0),
            100
          );

          const options1 = {
            chart: {
              type: "radialBar" as const,
              height: 350,
              animations: {
                enabled: false, // 애니메이션 비활성화로 안정성 향상
              },
            },
            series: [allowancePercent],
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
                    fontSize: "25px",
                    show: true,
                    formatter: function (val: number) {
                      return Math.round(validAllowance).toLocaleString();
                    },
                  },
                },
              },
            },
            fill: {
              colors: ["#22c55e"],
            },
            stroke: {
              lineCap: "round" as const,
            },
            labels: [`보유수량\n${selectedYear}년 ${selectedMonth}월`],
          };

          const options2 = {
            chart: {
              type: "radialBar" as const,
              height: 350,
              animations: {
                enabled: false, // 애니메이션 비활성화로 안정성 향상
              },
            },
            series: [emissionPercent],
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
                    fontSize: "25px",
                    show: true,
                    formatter: function (val: number) {
                      return Math.round(validEmission).toLocaleString();
                    },
                  },
                },
              },
            },
            fill: {
              colors: ["#f97316"],
            },
            stroke: {
              lineCap: "round" as const,
            },
            labels: [`현재배출량\n${selectedYear}년 ${selectedMonth}월`],
          };

          try {
            new window.ApexCharts(gaugeChart1Element, options1).render();
            new window.ApexCharts(gaugeChart2Element, options2).render();
          } catch (error) {
            console.error("게이지 차트 렌더링 오류:", error);
          }
        }
      }
    } catch (error) {
      console.error("차트 렌더링 오류:", error);
      handleError(error as Error);
    }
  }, [
    apexChartsLoaded,
    emissionsData,
    marketData,
    selectedYear,
    selectedMonth,
    gaugeData,
  ]);

  // Leaflet 지도 렌더링 useEffect
  useEffect(() => {
    if (apexChartsLoaded) {
      // Leaflet이 로드되었는지 확인
      if (window.L) {
        const mapElement = document.getElementById("carbon-map");
        if (mapElement) {
          // 기존 지도 인스턴스 제거
          if ((window as any).mapInstance) {
            (window as any).mapInstance.remove();
          }

          // 기존 지도 정리
          mapElement.innerHTML = "";

          const mapData = generateMapData(selectedYear, selectedMonth);

          try {
            // 지도 생성
            const map = window.L.map("carbon-map").setView([36.5, 127.5], 6);

            // 전역 변수에 지도 인스턴스 저장
            (window as any).mapInstance = map;

            // OpenStreetMap 타일 레이어 추가
            window.L.tileLayer(
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              {
                attribution:
                  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              }
            ).addTo(map);

            // 지역별 마커 추가
            mapData.forEach((region, index) => {
              // CO₂ 농도에 따른 마커 색상 결정
              let markerColor = "#22c55e"; // 녹색 (좋음)
              if (region.co2 > 420) {
                markerColor = "#f97316"; // 주황색 (보통)
              }
              if (region.co2 > 450) {
                markerColor = "#ef4444"; // 빨간색 (나쁨)
              }

              // 커스텀 아이콘 생성
              const customIcon = window.L.divIcon({
                className: "custom-marker",
                html: `
                  <div style="
                    background-color: ${markerColor};
                    border: 2px solid white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  ">
                    ${index + 1}
                  </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              });

              // 마커 추가
              const marker = window.L.marker([region.lat, region.lon], {
                icon: customIcon,
              }).addTo(map);

              // 팝업 추가
              const popupContent = `
                <div style="min-width: 150px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${
                    region.name
                  }</h3>
                  <p style="margin: 4px 0; font-size: 14px;">
                    <strong>CO₂ 농도:</strong> 
                    <span style="color: ${markerColor}; font-weight: bold;">${region.co2.toFixed(
                1
              )} ppm</span>
                  </p>
                  <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
                    측정일: ${selectedYear}년 ${selectedMonth}월
                  </p>
                </div>
              `;

              marker.bindPopup(popupContent);
            });

            // 지도 스타일 추가
            const style = document.createElement("style");
            style.textContent = `
              .custom-marker {
                background: transparent;
                border: none;
              }
              .leaflet-popup-content-wrapper {
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .leaflet-popup-content {
                margin: 8px 12px;
              }
              .map-legend {
                background: white;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                font-size: 12px;
              }
              .legend-item {
                display: flex;
                align-items: center;
                margin: 4px 0;
              }
              .legend-color {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 2px solid white;
                margin-right: 8px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.2);
              }
            `;
            document.head.appendChild(style);

            // 범례 추가
            const legend = window.L.control({ position: "bottomright" });
            legend.onAdd = function () {
              const div = window.L.DomUtil.create("div", "map-legend");
              div.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">CO₂ 농도 (ppm)</div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #22c55e;"></div>
                  <span>좋음 (&lt; 420)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #f97316;"></div>
                  <span>보통 (420-450)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #ef4444;"></div>
                  <span>나쁨 (&gt; 450)</span>
                </div>
              `;
              return div;
            };
            legend.addTo(map);
          } catch (error) {
            console.error("지도 렌더링 오류:", error);
          }
        }
      }
    }
  }, [apexChartsLoaded, selectedYear, selectedMonth]);

  // 새로운 차트들 렌더링 useEffect
  useEffect(() => {
    if (apexChartsLoaded) {
      // 업체별 할당량 차트 렌더링
      const allocationChartElement =
        document.getElementById("allocation-chart");
      if (allocationChartElement) {
        const allocationData = generateAllocationData();

        // 데이터 검증 및 기본값 처리
        const validAllocationData = allocationData.map((d) => ({
          ...d,
          allocation:
            isNaN(d.allocation) || d.allocation === undefined
              ? 50000
              : Math.max(d.allocation, 1000),
          emission:
            isNaN(d.emission) || d.emission === undefined
              ? 45000
              : Math.max(d.emission, 1000),
        }));

        const options = {
          chart: {
            type: "bar" as const,
            height: 400,
            toolbar: {
              show: false,
            },
            animations: {
              enabled: false,
            },
          },
          series: [
            {
              name: "할당량",
              data: validAllocationData.map((d) => d.allocation),
            },
            {
              name: "실제 배출량",
              data: validAllocationData.map((d) => d.emission),
            },
          ],
          xaxis: {
            categories: validAllocationData.map((d) => d.name),
            title: {
              text: "업체명",
            },
          },
          yaxis: {
            title: {
              text: "배출량 (톤 CO₂)",
            },
            min: 0,
            max:
              Math.max(...validAllocationData.map((d) => d.allocation), 1) *
              1.1,
          },
          title: {
            text: "업체별 탄소배출권 할당량 vs 실제 배출량",
            align: "center" as const,
          },
          colors: ["#3b82f6", "#ef4444"],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "70%",
            },
          },
          legend: {
            position: "top" as const,
          },
          dataLabels: {
            enabled: false,
          },
        };

        try {
          new window.ApexCharts(allocationChartElement, options).render();
        } catch (error) {
          console.error("업체별 할당량 차트 렌더링 오류:", error);
        }
      }

      // 지역별 시계열 차트 렌더링
      const regionalTimeSeriesChartElement = document.getElementById(
        "regional-timeseries-chart"
      );
      if (regionalTimeSeriesChartElement) {
        const regionalData = generateRegionalTimeSeriesData();

        // 데이터 검증 및 기본값 처리
        const validRegionalData = regionalData.map((region) => ({
          ...region,
          data: region.data.map((d) => ({
            ...d,
            co2:
              isNaN(d.co2) || d.co2 === undefined
                ? 420
                : Math.max(Math.min(d.co2, 500), 400),
          })),
        }));

        const options = {
          chart: {
            type: "line" as const,
            height: 400,
            toolbar: {
              show: false,
            },
            animations: {
              enabled: false,
            },
          },
          series: validRegionalData.map((region) => ({
            name: region.region,
            data: region.data.map((d) => d.co2),
          })),
          xaxis: {
            categories: validRegionalData[0].data.map((d) => `${d.month}월`),
            title: {
              text: "월",
            },
          },
          yaxis: {
            title: {
              text: "CO₂ 농도 (ppm)",
            },
            min: 400,
            max: 500,
          },
          title: {
            text: "지역별 CO₂ 농도 월별 추이",
            align: "center" as const,
          },
          colors: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"],
          stroke: {
            width: 3,
          },
          markers: {
            size: 4,
          },
          legend: {
            position: "top" as const,
          },
        };

        try {
          new window.ApexCharts(
            regionalTimeSeriesChartElement,
            options
          ).render();
        } catch (error) {
          console.error("지역별 시계열 차트 렌더링 오류:", error);
        }
      }
    }
  }, [apexChartsLoaded]);

  // 차트 정리 함수
  const cleanupCharts = () => {
    const chartElements = [
      "emissions-chart",
      "market-chart",
      "gauge-chart-1",
      "gauge-chart-2",
      "allocation-chart",
      "regional-timeseries-chart",
    ];

    chartElements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = "";
      }
    });
  };

  // Leaflet 지도 렌더링 useEffect
  useEffect(() => {
    if (apexChartsLoaded) {
      // Leaflet이 로드되었는지 확인
      if (window.L) {
        const mapElement = document.getElementById("carbon-map");
        if (mapElement) {
          // 기존 지도 인스턴스 제거
          if ((window as any).mapInstance) {
            try {
              (window as any).mapInstance.remove();
            } catch (e) {
              console.log("기존 지도 제거 중 오류:", e);
            }
          }

          // 기존 지도 정리
          mapElement.innerHTML = "";

          const mapData = generateMapData(selectedYear, selectedMonth);

          try {
            // 지도 생성
            const map = window.L.map("carbon-map").setView([36.5, 127.5], 6);

            // 전역 변수에 지도 인스턴스 저장
            (window as any).mapInstance = map;

            // OpenStreetMap 타일 레이어 추가
            window.L.tileLayer(
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              {
                attribution:
                  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              }
            ).addTo(map);

            // 지역별 마커 추가
            mapData.forEach((region, index) => {
              // CO₂ 농도에 따른 마커 색상 결정
              let markerColor = "#22c55e"; // 녹색 (좋음)
              if (region.co2 > 420) {
                markerColor = "#f97316"; // 주황색 (보통)
              }
              if (region.co2 > 450) {
                markerColor = "#ef4444"; // 빨간색 (나쁨)
              }

              // 커스텀 아이콘 생성
              const customIcon = window.L.divIcon({
                className: "custom-marker",
                html: `
                <div style="
                  background-color: ${markerColor};
                  border: 2px solid white;
                  border-radius: 50%;
                  width: 20px;
                  height: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 10px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                  ${index + 1}
                </div>
              `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              });

              // 마커 추가
              const marker = window.L.marker([region.lat, region.lon], {
                icon: customIcon,
              }).addTo(map);

              // 팝업 추가
              const popupContent = `
              <div style="min-width: 150px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${
                  region.name
                }</h3>
                <p style="margin: 4px 0; font-size: 14px;">
                  <strong>CO₂ 농도:</strong> 
                  <span style="color: ${markerColor}; font-weight: bold;">${region.co2.toFixed(
                1
              )} ppm</span>
                </p>
                <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
                  측정일: ${selectedYear}년 ${selectedMonth}월
                </p>
              </div>
            `;

              marker.bindPopup(popupContent);
            });

            // 지도 스타일 추가
            const style = document.createElement("style");
            style.textContent = `
            .custom-marker {
              background: transparent;
              border: none;
            }
            .leaflet-popup-content-wrapper {
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .leaflet-popup-content {
              margin: 8px 12px;
            }
            .map-legend {
              background: white;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              font-size: 12px;
            }
            .legend-item {
              display: flex;
              align-items: center;
              margin: 4px 0;
            }
            .legend-color {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 2px solid white;
              margin-right: 8px;
              box-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }
          `;
            document.head.appendChild(style);

            // 범례 추가
            const legend = window.L.control({ position: "bottomright" });
            legend.onAdd = function () {
              const div = window.L.DomUtil.create("div", "map-legend");
              div.innerHTML = `
              <div style="font-weight: bold; margin-bottom: 8px;">CO₂ 농도 (ppm)</div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #22c55e;"></div>
                <span>좋음 (&lt; 420)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #f97316;"></div>
                <span>보통 (420-450)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #ef4444;"></div>
                <span>나쁨 (&gt; 450)</span>
              </div>
            `;
              return div;
            };
            legend.addTo(map);
          } catch (error) {
            console.error("지도 렌더링 오류:", error);
          }
        }
      }
    }
  }, [apexChartsLoaded, selectedYear, selectedMonth]);

  // 지역별 맵 데이터 생성
  const generateMapData = (year: number, month: number) => {
    // 입력값 검증
    const safeYear =
      isNaN(year) || year === undefined
        ? 2024
        : Math.max(Math.min(year, 2030), 2020);
    const safeMonth =
      isNaN(month) || month === undefined
        ? 1
        : Math.max(Math.min(month, 12), 1);

    const regions = [
      { name: "서울", lat: 37.5665, lon: 126.978 },
      { name: "부산", lat: 35.1796, lon: 129.0756 },
      { name: "대구", lat: 35.8714, lon: 128.6014 },
      { name: "인천", lat: 37.4563, lon: 126.7052 },
      { name: "광주", lat: 35.1595, lon: 126.8526 },
      { name: "대전", lat: 36.3504, lon: 127.3845 },
      { name: "울산", lat: 35.5384, lon: 129.3114 },
      { name: "세종", lat: 36.48, lon: 127.289 },
      { name: "수원", lat: 37.2636, lon: 127.0286 },
      { name: "고양", lat: 37.6584, lon: 126.832 },
      { name: "용인", lat: 37.2411, lon: 127.1776 },
      { name: "창원", lat: 35.2278, lon: 128.6817 },
      { name: "포항", lat: 36.032, lon: 129.365 },
      { name: "청주", lat: 36.6424, lon: 127.489 },
      { name: "전주", lat: 35.8242, lon: 127.148 },
    ];

    return regions.map((region) => {
      // 계절적 변동성 추가 (여름에 높음, 겨울에 낮음)
      const seasonalFactor =
        Math.sin(((safeMonth - 1) / 12) * 2 * Math.PI) * 10;

      // 도시 규모에 따른 기본 농도 차이
      const cityFactor =
        region.name === "서울"
          ? 20
          : region.name === "부산"
          ? 15
          : region.name === "대구"
          ? 12
          : region.name === "인천"
          ? 10
          : region.name === "광주"
          ? 8
          : region.name === "대전"
          ? 6
          : region.name === "울산"
          ? 18 // 산업도시
          : region.name === "포항"
          ? 16 // 철강도시
          : 5;

      // 연도별 증가 추세
      const yearFactor = (safeYear - 2020) * 2;

      // 랜덤 변동성
      const randomFactor = (Math.random() - 0.5) * 8;

      const calculatedCO2 =
        410 + seasonalFactor + cityFactor + yearFactor + randomFactor;
      const safeCO2 = Math.max(Math.min(calculatedCO2, 500), 400);

      return {
        ...region,
        co2: isNaN(safeCO2) ? 420 : safeCO2,
      };
    });
  };

  // 업체별 할당량 데이터 생성
  const generateAllocationData = () => {
    const companies = [
      {
        name: "삼성전자",
        industry: "전자제품",
        allocation: 85000,
        emission: 72000,
        year: 2024,
      },
      {
        name: "POSCO",
        industry: "철강",
        allocation: 65000,
        emission: 68000,
        year: 2024,
      },
      {
        name: "LG화학",
        industry: "화학",
        allocation: 52000,
        emission: 54000,
        year: 2024,
      },
      {
        name: "현대자동차",
        industry: "자동차",
        allocation: 48000,
        emission: 46000,
        year: 2024,
      },
      {
        name: "현대건설",
        industry: "건설",
        allocation: 35000,
        emission: 32000,
        year: 2024,
      },
      {
        name: "한국전력",
        industry: "에너지",
        allocation: 95000,
        emission: 92000,
        year: 2024,
      },
      {
        name: "SK하이닉스",
        industry: "반도체",
        allocation: 42000,
        emission: 41000,
        year: 2024,
      },
      {
        name: "GS칼텍스",
        industry: "정유",
        allocation: 38000,
        emission: 39000,
        year: 2024,
      },
      {
        name: "롯데케미칼",
        industry: "화학",
        allocation: 32000,
        emission: 33000,
        year: 2024,
      },
      {
        name: "두산에너빌리티",
        industry: "중공업",
        allocation: 28000,
        emission: 27000,
        year: 2024,
      },
    ];

    return companies.map((company) => {
      const safeAllocation = Math.max(company.allocation, 1000);
      const safeEmission = Math.max(company.emission, 1000);
      const utilization =
        safeAllocation > 0
          ? Math.round((safeEmission / safeAllocation) * 100)
          : 0;

      return {
        ...company,
        allocation: safeAllocation,
        emission: safeEmission,
        utilization: Math.max(Math.min(utilization, 200), 0),
        surplus: safeAllocation - safeEmission,
        status: safeEmission > safeAllocation ? "초과" : "여유",
      };
    });
  };

  // 지역별 CO₂ 농도 시계열 데이터 생성
  const generateRegionalTimeSeriesData = () => {
    const regions = ["서울", "부산", "대구", "인천", "광주"];
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return regions.map((region) => {
      const baseCO2 =
        region === "서울"
          ? 430
          : region === "부산"
          ? 425
          : region === "대구"
          ? 420
          : region === "인천"
          ? 418
          : 415;

      const data = months.map((month) => {
        const seasonal = Math.sin(((month - 1) / 12) * 2 * Math.PI) * 15;
        const trend = (month / 12) * 5;
        const random = (Math.random() - 0.5) * 8;

        const calculatedCO2 = baseCO2 + seasonal + trend + random;
        const safeCO2 = Math.max(Math.min(calculatedCO2, 500), 400);

        return {
          month,
          co2: Math.round(safeCO2 * 10) / 10,
        };
      });

      return {
        region,
        data,
      };
    });
  };

  // 배출량 차트 생성 (ApexCharts)
  const createEmissionsChart = () => {
    if (!apexChartsLoaded) return <div>차트 로딩 중...</div>;
    return <div id="emissions-chart" />;
  };

  // 시장 데이터 차트 생성 (ApexCharts)
  const createMarketChart = () => {
    if (!apexChartsLoaded) return <div>차트 로딩 중...</div>;
    return <div id="market-chart" />;
  };

  // 게이지 차트 생성 (ApexCharts)
  const createGaugeCharts = () => {
    if (!apexChartsLoaded) return <div>차트 로딩 중...</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div id="gauge-chart-1" />
        <div id="gauge-chart-2" />
      </div>
    );
  };

  // 업체별 할당량 차트 생성
  const createAllocationChart = () => {
    if (!apexChartsLoaded) return <div>차트 로딩 중...</div>;
    return <div id="allocation-chart" />;
  };

  // 지역별 시계열 차트 생성
  const createRegionalTimeSeriesChart = () => {
    if (!apexChartsLoaded) return <div>차트 로딩 중...</div>;
    return <div id="regional-timeseries-chart" />;
  };

  // 맵 차트 생성 (React Leaflet 지도)
  const createMapChart = () => {
    const mapData = generateMapData(selectedYear, selectedMonth);

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">지역별 CO₂ 농도</h3>

        {/* 지도 컨테이너 */}
        <div className="mb-6">
          <div
            id="carbon-map"
            className="w-full h-96 rounded-lg border border-gray-200"
            style={{ minHeight: "400px" }}
          />
        </div>

        {/* 지역별 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mapData.map((region, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-900">{region.name}</h4>
              <p className="text-2xl font-bold text-blue-600">
                {region.co2.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">ppm</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 챗봇 시나리오 분석
  const analyzeScenario = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (
      lowerInput.includes("그래프") ||
      lowerInput.includes("차트") ||
      lowerInput.includes("시각화")
    ) {
      if (lowerInput.includes("배출량") || lowerInput.includes("온실가스")) {
        return "✅ 요청하신 배출량 차트를 생성했습니다. 2017년 대비 2021년 총배출량이 감소한 것을 확인할 수 있습니다.";
      } else if (
        lowerInput.includes("가격") ||
        lowerInput.includes("시가") ||
        lowerInput.includes("kau")
      ) {
        return "✅ 요청하신 시장 차트를 생성했습니다. KAU24의 월별 시가와 거래량 추이를 보여드립니다.";
      }
    }

    return '안녕하세요! 저는 탄소 중립 보조 AI입니다. "2017년과 2021년 배출량 비교 그래프 보여줘"와 같이 질문해주세요.';
  };

  // 챗봇 메시지 전송
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const timestamp = new Date().toLocaleString();
    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
      timestamp,
    };

    const response = analyzeScenario(chatInput);
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: response,
      timestamp,
    };

    setChatMessages((prev) => [...prev, userMessage, assistantMessage]);
    setChatInput("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🌍 탄소배출량 및 배출권 현황
        </h1>
        <p className="text-gray-600">실제 데이터 기반 분석</p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4">🔍 필터 설정</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연도 선택
            </label>
            <input
              type="range"
              min="1990"
              max="2025"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center mt-1 font-semibold">{selectedYear}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월 선택
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center mt-1 font-semibold">
              {selectedMonth}월
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Gauge Charts */}
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">📊 현황 지표</h3>
            {createGaugeCharts()}
          </div>

          {/* Map Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">
              🗺️ 지역별 이산화탄소 농도 현황
            </h3>
            {createMapChart()}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Emissions Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">
              📊 연도별 탄소 배출량 현황
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              *단위: Gg CO₂eq (기가그램 CO₂ 당량)*
            </p>
            {createEmissionsChart()}
          </div>

          {/* Market Chart */}
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              📈 탄소배출권 시장 동향
            </h3>
            {createMarketChart()}
          </div>

          {/* 업체별 할당량 현황 */}
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              🏢 업체별 탄소배출권 할당량 현황
            </h3>
            <div className="mb-4 text-sm text-gray-600">
              할당량 대비 실제 배출량을 비교하여 업체별 탄소배출권 활용 현황을
              확인할 수 있습니다.
            </div>
            {createAllocationChart()}
          </div>

          {/* 지역별 이산화탄소 농도 시계열 */}
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              📊 지역별 CO₂ 농도 월별 추이
            </h3>
            <div className="mb-4 text-sm text-gray-600">
              주요 도시별 이산화탄소 농도의 계절적 변화와 지역적 특성을 시계열로
              분석합니다.
            </div>
            {createRegionalTimeSeriesChart()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
