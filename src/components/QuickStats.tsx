import React from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const QuickStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-pulse relative group">
        <div className="text-center">
          <div className="text-sm text-red-700 mb-2 flex items-center justify-center font-semibold">
            총 배출량
            <AlertTriangle className="h-4 w-4 ml-1 text-red-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-red-800">676,648</div>
          <div className="text-sm text-red-600">Gg CO₂eq (2021년 기준)</div>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg w-64">
          <div className="font-semibold mb-1">⚠️ 긴급 경고</div>
          <div className="text-gray-200 break-words">
            현재 할당량 대비 15% 초과 배출이 감지되었습니다. 즉시 감축 조치가
            필요합니다.
          </div>
          <div className="text-gray-400 text-xs mt-1 break-words">
            권장 조치: 에너지 효율 개선, 재생에너지 전환
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-pulse relative group">
        <div className="text-center">
          <div className="text-sm text-yellow-700 mb-2 flex items-center justify-center font-semibold">
            KAU24 가격
            <AlertCircle className="h-4 w-4 ml-1 text-yellow-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-yellow-800">8,770원</div>
          <div className="text-sm text-yellow-600">+2.3%</div>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg w-64">
          <div className="font-semibold mb-1">⚠️ 가격 경고</div>
          <div className="text-gray-200 break-words">
            KAU24 가격이 8,770원으로 전년 대비 2.3% 상승했습니다. 시장 전망은
            긍정적이지만 구매 전략 재검토가 필요합니다.
          </div>
          <div className="text-gray-400 text-xs mt-1 break-words">
            권장 조치: 점진적 분할 매수, 헤징 전략 고려
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">할당 대상</div>
          <div className="text-2xl font-bold text-gray-900">1,247개</div>
          <div className="text-sm text-gray-500">3차 사전할당</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-pulse relative group">
        <div className="text-center">
          <div className="text-sm text-yellow-700 mb-2 flex items-center justify-center font-semibold">
            감축 목표
            <AlertCircle className="h-4 w-4 ml-1 text-yellow-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-yellow-800">40%</div>
          <div className="text-sm text-yellow-600">2030년까지</div>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg w-64">
          <div className="font-semibold mb-1">⚠️ 목표 경고</div>
          <div className="text-gray-200 break-words">
            2030년 감축 목표 대비 현재 달성률이 18.5%로 목표 달성에 추가 노력이
            필요합니다.
          </div>
          <div className="text-gray-400 text-xs mt-1 break-words">
            권장 조치: 공급망 최적화, 기술 혁신 투자
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
