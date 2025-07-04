import React from "react";

interface CompanyStatsProps {
  currentRank: number;
  currentEsgScore: number;
  grade: string;
}

const CompanyStats: React.FC<CompanyStatsProps> = ({
  currentRank,
  currentEsgScore,
  grade,
}) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        현재 기업 순위
      </h4>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">현재 순위</div>
            <div className="text-2xl font-bold text-gray-900">
              {currentRank}위
            </div>
            <div className="text-sm text-gray-500">상위 20%</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">ESG 등급</div>
            <div className="text-2xl font-bold text-gray-900">{grade}</div>
            <div className="text-sm text-gray-500">{currentEsgScore}점</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStats;
