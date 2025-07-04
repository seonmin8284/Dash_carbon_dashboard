import React from "react";

const QuickStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">총 배출량</div>
          <div className="text-2xl font-bold text-gray-900">676,648</div>
          <div className="text-sm text-gray-500">Gg CO₂eq (2021년 기준)</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">KAU24 가격</div>
          <div className="text-2xl font-bold text-gray-900">8,770원</div>
          <div className="text-sm text-green-600">+2.3%</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">할당 대상</div>
          <div className="text-2xl font-bold text-gray-900">1,247개</div>
          <div className="text-sm text-gray-500">3차 사전할당</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">감축 목표</div>
          <div className="text-2xl font-bold text-gray-900">40%</div>
          <div className="text-sm text-gray-500">2030년까지</div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
