import React, { useState, createContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  ShoppingCart,
  MessageCircle,
  Info,
  Globe,
  FileText,
  Target,
  ChevronDown,
} from "lucide-react";
import ChatInterface from "./ChatInterface";
import { ChatMessage } from "../types";

interface LayoutProps {
  children: React.ReactNode;
}

export const SidebarContext = createContext<{ sidebarTab: "chat" | null }>({
  sidebarTab: null,
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"chat" | null>("chat");
  const [strategyDropdownOpen, setStrategyDropdownOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "ESG 대시보드" },
    { path: "/dashboard", icon: BarChart3, label: "현황 대시보드" },
    // { path: "/chatbot", icon: MessageCircle, label: "AI 챗봇" },
    { path: "/report", icon: FileText, label: "AI 리포트 생성기" },
    { path: "/info", icon: Info, label: "프로그램 정보" },
  ];

  // ReportGenerator 페이지에서는 사이드바를 숨김
  const showSidebar = location.pathname !== "/report";

  // 탭 버튼 클릭 핸들러
  const handleSidebarTab = (tab: "chat") => {
    setSidebarTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <SidebarContext.Provider value={{ sidebarTab }}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Globe className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                탄소배출권 통합 관리 시스템
              </h1>
            </div>

            <nav className="space-y-2">
              {/* ESG 대시보드 */}
              <Link
                to="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">ESG 대시보드</span>
              </Link>

              {/* 현황 대시보드 */}
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">현황 대시보드</span>
              </Link>

              {/* 전략분석 드롭다운 */}
              <div className="relative">
                <button
                  onMouseEnter={() => setStrategyDropdownOpen(true)}
                  onMouseLeave={() => setStrategyDropdownOpen(false)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5" />
                    <span className="font-medium">전략 분석</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      strategyDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {strategyDropdownOpen && (
                  <div
                    className="absolute left-0 right-0 top-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    onMouseEnter={() => setStrategyDropdownOpen(true)}
                    onMouseLeave={() => setStrategyDropdownOpen(false)}
                  >
                    <Link
                      to="/strategy-analysis"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Target className="h-5 w-5" />
                      <span className="font-medium">감축 전략</span>
                    </Link>
                    <Link
                      to="/strategy"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span className="font-medium">구매 전략</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 나머지 메뉴들 */}
              {navItems.slice(2).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg md:hidden">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Globe className="h-8 w-8" />
                  <h1 className="text-xl font-bold">
                    탄소배출권 통합 관리 시스템
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Navigation */}
          <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
            <div className="flex justify-around py-2">
              {/* ESG 대시보드 */}
              <Link
                to="/"
                className="flex flex-col items-center py-2 px-3 text-xs text-gray-500"
              >
                <Home className="h-5 w-5 mb-1" />
                <span>ESG 대시보드</span>
              </Link>

              {/* 현황 대시보드 */}
              <Link
                to="/dashboard"
                className="flex flex-col items-center py-2 px-3 text-xs text-gray-500"
              >
                <BarChart3 className="h-5 w-5 mb-1" />
                <span>현황 대시보드</span>
              </Link>

              {/* 모바일 전략분석 드롭다운 */}
              <div className="relative">
                <button
                  onClick={() => setStrategyDropdownOpen(!strategyDropdownOpen)}
                  className="flex flex-col items-center py-2 px-3 text-xs text-gray-500"
                >
                  <Target className="h-5 w-5 mb-1" />
                  <span>전략 분석</span>
                </button>

                {strategyDropdownOpen && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                    <Link
                      to="/strategy-analysis"
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 text-gray-600 text-xs"
                      onClick={() => setStrategyDropdownOpen(false)}
                    >
                      <Target className="h-4 w-4" />
                      <span>감축 전략</span>
                    </Link>

                    <Link
                      to="/strategy"
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 text-gray-600 text-xs"
                      onClick={() => setStrategyDropdownOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>구매 전략</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 나머지 메뉴들 */}
              {navItems.slice(2).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex flex-col items-center py-2 px-3 text-xs text-gray-500"
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Main Content */}
          <main
            className={`${
              showSidebar && sidebarTab
                ? "lg:w-[calc(100%-384px)] w-full"
                : "w-full"
            } px-4 py-6 pb-20 md:pb-6 transition-all duration-300`}
          >
            {children}
          </main>

          {/* Right Sidebar - Tabbed Interface */}
          {showSidebar && (
            <>
              {/* Desktop Sidebar */}
              {sidebarTab && (
                <aside className="hidden lg:flex w-96 bg-white shadow-lg absolute right-0 top-0 h-full z-50">
                  {/* 챗봇 내용 */}
                  <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
                    <div className="p-4 w-full">
                      <ChatInterface
                        chatMessages={chatMessages}
                        setChatMessages={setChatMessages}
                        chatInput={chatInput}
                        setChatInput={setChatInput}
                        onChatSubmit={(e) => {
                          e.preventDefault();
                          if (!chatInput.trim()) return;

                          const userMessage: ChatMessage = {
                            role: "user",
                            content: chatInput,
                            timestamp: new Date().toISOString(),
                          };

                          // AI 응답 생성
                          const analyzeScenario = (input: string): string => {
                            const lowerInput = input.toLowerCase();

                            if (
                              lowerInput.includes("탄소배출량") ||
                              lowerInput.includes("배출량")
                            ) {
                              return "현재 탄소배출량은 676,648 Gg CO₂eq (2021년 기준)입니다. 연도별로 감소 추세를 보이고 있으며, 2030년까지 40% 감축 목표를 달성하기 위해 지속적인 노력이 필요합니다.";
                            }

                            if (
                              lowerInput.includes("가격") ||
                              lowerInput.includes("kau")
                            ) {
                              return "KAU24 현재 가격은 8,770원으로, 전년 대비 2.3% 상승했습니다. 시장 전망은 긍정적이며, 정부의 탄소중립 정책 강화로 인해 가격 상승이 예상됩니다.";
                            }

                            if (
                              lowerInput.includes("전략") ||
                              lowerInput.includes("구매")
                            ) {
                              return "탄소배출권 구매 전략으로는 1) 정기적 분할 매수, 2) 가격 하락 시 대량 매수, 3) 헤징을 위한 ETF 투자 등을 고려해볼 수 있습니다. 현재 시장 상황에서는 점진적 매수가 권장됩니다.";
                            }

                            if (
                              lowerInput.includes("감축") ||
                              lowerInput.includes("목표")
                            ) {
                              return "2030년까지 40% 감축 목표를 달성하기 위해서는 에너지 효율 개선, 재생에너지 전환, 공급망 최적화 등이 필요합니다. 현재 감축률은 18.5%로 목표 달성을 위해 추가 노력이 요구됩니다.";
                            }

                            if (
                              lowerInput.includes("기업") ||
                              lowerInput.includes("할당량")
                            ) {
                              return "주요 기업별 탄소배출권 할당량은 포스코(2,450만톤), 현대차(1,230만톤), 삼성전자(890만톤) 순입니다. 기업들은 할당량을 초과하지 않도록 감축 노력을 지속하고 있습니다.";
                            }

                            if (
                              lowerInput.includes("시장") ||
                              lowerInput.includes("거래")
                            ) {
                              return "탄소배출권 거래시장은 2021년부터 본격 운영되었으며, 현재 1,200여개 기업이 참여하고 있습니다. 거래량은 지속적으로 증가하고 있으며, 시장 유동성이 개선되고 있습니다.";
                            }

                            if (
                              lowerInput.includes("정책") ||
                              lowerInput.includes("법")
                            ) {
                              return "탄소중립기본법과 온실가스 배출권의 할당 및 거래에 관한 법률에 따라 탄소배출권 제도가 운영되고 있습니다. 2030년까지 40% 감축 목표를 달성하기 위한 다양한 정책이 시행되고 있습니다.";
                            }

                            return "탄소배출권과 관련된 질문을 해주세요. 배출량, 가격, 구매 전략, 감축 목표, 기업 할당량, 시장 현황, 정책 등에 대해 답변드릴 수 있습니다.";
                          };

                          const assistantMessage: ChatMessage = {
                            role: "assistant",
                            content: analyzeScenario(chatInput),
                            timestamp: new Date().toISOString(),
                          };

                          setChatMessages([
                            ...chatMessages,
                            userMessage,
                            assistantMessage,
                          ]);
                          setChatInput("");
                        }}
                        onClose={() => setSidebarTab(null)}
                      />
                    </div>
                  </div>
                </aside>
              )}

              {/* 사이드바가 닫힌 경우 우측 플로팅 버튼 */}
              {!sidebarTab && (
                <div className="hidden lg:block fixed bottom-20 right-4 z-50">
                  <button
                    onClick={() => setSidebarTab("chat")}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    title="챗봇 열기"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </button>
                </div>
              )}

              {/* Mobile Floating Button */}
              <div className="lg:hidden fixed bottom-20 right-4 z-50">
                <button
                  onClick={() => {
                    // 모바일에서는 채팅 페이지로 이동
                    window.location.href = "/chatbot";
                  }}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
