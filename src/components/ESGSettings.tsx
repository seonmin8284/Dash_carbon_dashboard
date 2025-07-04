import React from "react";

interface ESGSettingsProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  currentEsgScore: number;
  setCurrentEsgScore: (score: number) => void;
  currentReductionRate: number;
  setCurrentReductionRate: (rate: number) => void;
  currentAllocationRatio: number;
  setCurrentAllocationRatio: (ratio: number) => void;
}

const ESGSettings: React.FC<ESGSettingsProps> = ({
  companyName,
  setCompanyName,
  industry,
  setIndustry,
  currentEsgScore,
  setCurrentEsgScore,
  currentReductionRate,
  setCurrentReductionRate,
  currentAllocationRatio,
  setCurrentAllocationRatio,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ESG 설정</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기업명
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            업종
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="전자제품">전자제품</option>
            <option value="철강">철강</option>
            <option value="화학">화학</option>
            <option value="자동차">자동차</option>
            <option value="건설">건설</option>
            <option value="에너지">에너지</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 ESG 점수
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentEsgScore}
            onChange={(e) => setCurrentEsgScore(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm font-semibold mt-1 text-gray-900">
            {currentEsgScore}점
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 감축률 (%)
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={currentReductionRate}
            onChange={(e) => setCurrentReductionRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm font-semibold mt-1 text-gray-900">
            {currentReductionRate}%
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할당 대비 보유율 (%)
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={currentAllocationRatio}
            onChange={(e) => setCurrentAllocationRatio(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm font-semibold mt-1 text-gray-900">
            {currentAllocationRatio}%
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            목표 ESG 점수
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentEsgScore}
            onChange={(e) => setCurrentEsgScore(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm font-semibold mt-1 text-gray-900">
            {currentEsgScore}점
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGSettings;
