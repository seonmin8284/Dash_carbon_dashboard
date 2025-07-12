import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ESGRankingTable from "./ESGRankingTable";
import CompanyStats from "./CompanyStats";

interface CompanyRanking {
  rank: number;
  company: string;
  industry: string;
  scope1?: number;
  scope2?: number;
  scope3?: number;
  reductionRate: number;
  emissionIntensity?: number;
  totalEmission?: number;
  energyConsumption?: number;
  industryAverage?: number;
  disclosureStatus?: string;
  energyStrategy?: string;
  riskManagement?: string;
  climateRiskResponse?: string;
  pollutionEmission?: number;
  ecoLabelAdoption?: string;
  disclosureItems?: number;
  esgScore: number;
  totalScore: number;
}

interface ESGRankingCardProps {
  rankings: CompanyRanking[];
  currentCompany: string;
  isChatSidebarOpen?: boolean;
}

const ESGRankingCard: React.FC<ESGRankingCardProps> = ({
  rankings,
  currentCompany,
  isChatSidebarOpen = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const standards = [
    {
      name: "GRI 305 기준",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      columns: 8,
    },
    {
      name: "SASB / ISSB 기준",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      columns: 7,
    },
    {
      name: "DJSI 기준",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      columns: 7,
    },
    {
      name: "K-ESG 기준",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      columns: 7,
    },
  ];

  const currentStandard = standards[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % standards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + standards.length) % standards.length);
  };

  useEffect(() => {
    const checkWidth = () => {
      if (cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth;
        // 현재 선택된 기준의 컬럼 수에 따른 최소 너비 계산
        const currentColumns = standards[currentSlide].columns;
        const tableMinWidth = currentColumns * 120 + 100; // 컬럼당 120px + 여유공간
        const companyStatsWidth = 320;
        const gap = 24;
        const extraSpace = 50;
        const minWidthForSideBySide =
          tableMinWidth + companyStatsWidth + gap + extraSpace;

        // 사이드바가 열려있으면 더 엄격한 조건 적용
        // GRI 305 기준은 더 많은 컬럼이 있으므로 더 관대한 조건 적용
        const effectiveMinWidth = isChatSidebarOpen
          ? minWidthForSideBySide + 200
          : currentSlide === 0
          ? minWidthForSideBySide - 600 // GRI 305 기준은 더 관대한 조건
          : minWidthForSideBySide - 400; // 다른 기준들

        console.log("ESGRankingCard Debug:", {
          cardWidth,
          currentSlide,
          currentColumns,
          isChatSidebarOpen,
          effectiveMinWidth,
          isNarrow: cardWidth < effectiveMinWidth,
        });

        setIsNarrow(cardWidth < effectiveMinWidth);
      }
    };

    // 즉시 체크
    checkWidth();

    // 사이드바 상태 변경 시 여러 번 재계산
    if (isChatSidebarOpen !== undefined) {
      const timer1 = setTimeout(checkWidth, 50);
      const timer2 = setTimeout(checkWidth, 200);
      const timer3 = setTimeout(checkWidth, 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }

    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [currentSlide, isChatSidebarOpen]); // currentSlide와 사이드바 상태가 변경될 때도 재계산

  return (
    <div
      ref={cardRef}
      className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900">
          업종별 ESG 랭킹 & 통계
        </h4>
        <p className="text-sm text-gray-600 mt-1">
          실시간 ESG 성과 추적 및 경쟁 분석
        </p>
      </div>

      {/* Standard Title with Carousel Controls */}
      <div className="flex justify-between items-center mb-4">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${currentStandard.bgColor} ${currentStandard.borderColor} ${currentStandard.color}`}
        >
          {currentStandard.name}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex space-x-1">
            {standards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ESGRankingTable */}
        <div className={`overflow-x-auto ${isNarrow ? "w-full" : "flex-1"}`}>
          <ESGRankingTable
            rankings={rankings}
            currentCompany={currentCompany}
            currentSlide={currentSlide}
          />
        </div>

        {/* CompanyStats - Desktop (넓을 때만) */}
        {!isNarrow && (
          <div className="w-80 flex-shrink-0">
            <CompanyStats
              currentRank={6}
              currentEsgScore={85.2}
              grade="A"
              companyName="삼성전자"
              currentReductionRate={18.5}
              currentAllocationRatio={112.3}
              medal="🥇"
            />
          </div>
        )}
      </div>

      {/* CompanyStats - 하단 (좁을 때만) */}
      {isNarrow && (
        <div className="mt-6">
          <CompanyStats
            currentRank={6}
            currentEsgScore={85.2}
            grade="A"
            companyName="삼성전자"
            currentReductionRate={18.5}
            currentAllocationRatio={112.3}
            medal="🥇"
          />
        </div>
      )}
    </div>
  );
};

export default ESGRankingCard;
