import React from "react";

interface StrategySettingsProps {
  companySize: string;
  setCompanySize: (size: string) => void;
  annualEmission: number;
  setAnnualEmission: (emission: number) => void;
  currentAllocation: number;
  setCurrentAllocation: (allocation: number) => void;
  budget: number;
  setBudget: (budget: number) => void;
  riskTolerance: string;
  setRiskTolerance: (tolerance: string) => void;
  analysisPeriod: string;
  setAnalysisPeriod: (period: string) => void;
}

const StrategySettings: React.FC<StrategySettingsProps> = ({
  companySize,
  setCompanySize,
  annualEmission,
  setAnnualEmission,
  currentAllocation,
  setCurrentAllocation,
  budget,
  setBudget,
  riskTolerance,
  setRiskTolerance,
  analysisPeriod,
  setAnalysisPeriod,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">전략 설정</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기업 규모
          </label>
          <select
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="대기업">대기업</option>
            <option value="중견기업">중견기업</option>
            <option value="중소기업">중소기업</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연간 배출량 (톤 CO₂)
          </label>
          <input
            type="number"
            value={annualEmission}
            onChange={(e) => setAnnualEmission(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 할당량 (톤 CO₂)
          </label>
          <input
            type="number"
            value={currentAllocation}
            onChange={(e) => setCurrentAllocation(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            예산 (억원)
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm font-semibold mt-1 text-gray-900">
            {budget}억원
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            위험 성향
          </label>
          <select
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="보수적">보수적</option>
            <option value="중립적">중립적</option>
            <option value="공격적">공격적</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            분석 기간
          </label>
          <select
            value={analysisPeriod}
            onChange={(e) => setAnalysisPeriod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="6개월">6개월</option>
            <option value="1년">1년</option>
            <option value="2년">2년</option>
            <option value="3년">3년</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StrategySettings;
