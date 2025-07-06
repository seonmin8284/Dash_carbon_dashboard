import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

interface ESGRankingTableProps {
  rankings: CompanyRanking[];
  currentCompany: string;
}

const ESGRankingTable: React.FC<ESGRankingTableProps> = ({
  rankings,
  currentCompany,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const standards = [
    {
      name: "GRI 305 기준",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      columns: [
        "순위",
        "기업",
        "Scope 1",
        "Scope 2",
        "Scope 3",
        "감축률 (%)",
        "배출 집약도",
        "GRI 총점",
      ],
      dataKey: "gri",
    },
    {
      name: "SASB / ISSB 기준",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      columns: [
        "순위",
        "기업",
        "온실가스 총배출량",
        "에너지 소비량",
        "업계 평균대비",
        "공시 여부",
        "SASB 총점",
      ],
      dataKey: "sasb",
    },
    {
      name: "DJSI 기준",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      columns: [
        "순위",
        "기업",
        "GHG 배출 감소율",
        "에너지 전략",
        "위험관리 정책",
        "기후 리스크 대응",
        "DJSI 총점",
      ],
      dataKey: "djsi",
    },
    {
      name: "K-ESG 기준",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      columns: [
        "순위",
        "기업",
        "GHG 배출량",
        "오염물질 배출",
        "에코 라벨 도입",
        "공시 항목 수",
        "K-ESG 총점",
      ],
      dataKey: "k-esg",
    },
  ];

  const currentStandard = standards[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % standards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + standards.length) % standards.length);
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
      {/* Header with Current Company Rank */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            업종별 ESG 랭킹
          </h4>
        </div>
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

      {/* Standard Title */}
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-4 ${currentStandard.bgColor} ${currentStandard.borderColor} ${currentStandard.color}`}
      >
        {currentStandard.name}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="w-full bg-white rounded-lg border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {currentStandard.columns?.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rankings.slice(0, 5).map((company, index) => (
                <tr
                  key={index}
                  className={`${
                    company.company === currentCompany
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                        company.rank === 1
                          ? "bg-yellow-500"
                          : company.rank === 2
                          ? "bg-gray-400"
                          : company.rank === 3
                          ? "bg-yellow-600"
                          : "bg-gray-300"
                      }`}
                    >
                      {company.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {company.company}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {currentSlide === 0
                      ? company.scope1
                      : currentSlide === 1
                      ? company.totalEmission
                      : currentSlide === 2
                      ? company.reductionRate
                      : company.reductionRate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {currentSlide === 0
                      ? company.scope2
                      : currentSlide === 1
                      ? company.energyConsumption
                      : currentSlide === 2
                      ? company.energyStrategy
                      : company.pollutionEmission}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {currentSlide === 0
                      ? company.scope3
                      : currentSlide === 1
                      ? company.industryAverage
                      : currentSlide === 2
                      ? company.riskManagement
                      : company.ecoLabelAdoption}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {currentSlide === 0
                      ? `${company.reductionRate}%`
                      : currentSlide === 1
                      ? company.disclosureStatus
                      : currentSlide === 2
                      ? company.climateRiskResponse
                      : company.disclosureItems}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {currentSlide === 0
                      ? company.emissionIntensity
                      : currentSlide === 1
                      ? company.esgScore
                      : currentSlide === 2
                      ? company.esgScore
                      : company.esgScore}
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">
                    {company.totalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Company Stats */}
        <div className="lg:col-span-1">
          <CompanyStats currentRank={6} currentEsgScore={85.2} grade="A" />
        </div>
      </div>
    </div>
  );
};

export default ESGRankingTable;
