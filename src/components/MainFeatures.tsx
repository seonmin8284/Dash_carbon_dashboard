import React from "react";
import { BarChart3, ShoppingCart } from "lucide-react";

const MainFeatures: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          현황 대시보드
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-blue-600 mr-3 mt-1">•</span>
            <div className="text-gray-700">
              <span className="font-medium">실시간 모니터링</span>: 연도별
              배출량, 지역별 CO₂ 농도
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3 mt-1">•</span>
            <div className="text-gray-700">
              <span className="font-medium">시장 분석</span>: KAU24 가격/거래량
              추이
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3 mt-1">•</span>
            <div className="text-gray-700">
              <span className="font-medium">할당량 현황</span>: 업종별/업체별
              분포
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3 mt-1">•</span>
            <div className="text-gray-700">
              <span className="font-medium">AI 챗봇</span>: 시나리오 시뮬레이션
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
          구매 전략 대시보드
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-3 mt-1">•</span>
            <div className="text-gray-700">
              <span className="font-medium">알림 시스템</span>: 정책/가격 급등
              예고
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-3 mt-1">•</span>
            <div className="text-gray-700">
              <span className="font-medium">타이밍 분석</span>: 최적 매수 시점
              추천
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-3 mt-1">•</span>
            <div className="text-gray-700">
              <span className="font-medium">ROI 비교</span>: 감축 vs 구매 전략
              분석
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-3 mt-1">•</span>
            <div className="text-gray-700">
              <span className="font-medium">헤징 전략</span>: ETF/선물 연계
              포트폴리오
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainFeatures;
