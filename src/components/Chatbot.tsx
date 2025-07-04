import React, { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, Brain, BarChart3, Database } from "lucide-react";
import { ChatMessage } from "../types";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const exampleQueries = [
    "📈 총배출량의 연도별 변화 추이는?",
    "🏭 에너지 산업과 수송 산업의 배출량 비교",
    "📊 2017년과 2021년의 배출량 차이는?",
    "🔍 가장 많이 배출하는 분야는?",
    "📉 감축률이 가장 높은 연도는?",
    "🌍 전체 데이터에서 평균 배출량은?",
  ];

  const analyzeQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("추이") || lowerQuery.includes("변화")) {
      return `📈 **연도별 배출량 변화 추이 분석**

2017년부터 2021년까지의 데이터를 분석한 결과:

• **총배출량**: 679,600 Gg CO₂eq (2017) → 656,287 Gg CO₂eq (2021)
• **감소율**: 약 3.4% 감소
• **주요 변화**: 에너지 부문이 전체 배출량의 약 70%를 차지
• **트렌드**: 2018년 이후 꾸준한 감소 추세

이는 정부의 탄소중립 정책과 기업들의 ESG 경영 강화가 효과를 보이고 있음을 시사합니다.`;
    }

    if (
      lowerQuery.includes("비교") ||
      lowerQuery.includes("에너지") ||
      lowerQuery.includes("수송")
    ) {
      return `🏭 **에너지 vs 수송 산업 배출량 비교**

2021년 기준 분석 결과:

• **에너지 산업**: 459,801 Gg CO₂eq (전체의 70.1%)
• **수송 산업**: 98,852 Gg CO₂eq (전체의 15.1%)
• **차이**: 에너지 산업이 수송 산업보다 약 4.7배 많음

**주요 특징**:
- 에너지 산업은 발전소, 제철소 등 대규모 시설
- 수송 산업은 자동차, 항공, 선박 등
- 최근 전기차 보급으로 수송 부문 감소 추세`;
    }

    if (
      lowerQuery.includes("2017") ||
      lowerQuery.includes("2021") ||
      lowerQuery.includes("차이")
    ) {
      return `📊 **2017년 vs 2021년 배출량 상세 비교**

**총배출량 변화**:
• 2017년: 679,600 Gg CO₂eq
• 2021년: 656,287 Gg CO₂eq
• **절대 감소량**: 23,313 Gg CO₂eq
• **감소율**: 3.43%

**부문별 변화**:
• 에너지: 485,214 → 459,801 (5.2% 감소)
• 산업공정: 58,947 → 56,124 (4.8% 감소)
• 농업: 21,089 → 20,845 (1.2% 감소)
• 폐기물: 17,350 → 16,517 (4.8% 감소)

정부의 그린뉴딜 정책과 기업들의 자발적 감축 노력이 성과를 보이고 있습니다.`;
    }

    if (
      lowerQuery.includes("가장") ||
      lowerQuery.includes("많이") ||
      lowerQuery.includes("분야")
    ) {
      return `🔍 **최대 배출 분야 분석**

**2021년 기준 배출량 순위**:

1. **에너지 부문**: 459,801 Gg CO₂eq (70.1%)
   - 발전소, 제철소, 석유화학
   
2. **수송 부문**: 98,852 Gg CO₂eq (15.1%)
   - 자동차, 항공, 선박
   
3. **산업공정**: 56,124 Gg CO₂eq (8.5%)
   - 시멘트, 철강, 화학공정
   
4. **농업**: 20,845 Gg CO₂eq (3.2%)
   - 축산업, 벼 재배
   
5. **폐기물**: 16,517 Gg CO₂eq (2.5%)
   - 매립지, 소각시설

**결론**: 에너지 부문이 압도적으로 많아 우선 감축 대상입니다.`;
    }

    if (
      lowerQuery.includes("감축률") ||
      lowerQuery.includes("높은") ||
      lowerQuery.includes("연도")
    ) {
      return `📉 **연도별 감축률 분석**

**연도별 전년 대비 감축률**:

• **2018년**: -1.2% (소폭 증가)
• **2019년**: +2.1% (첫 본격 감축)
• **2020년**: +3.8% (코로나19 + 정책 효과)
• **2021년**: +1.9% (지속적 감축)

**최고 감축률**: 2020년 3.8%
- 코로나19로 인한 경제활동 감소
- 재생에너지 확대 정책
- 탄소배출권 거래제 강화

**지속 가능한 감축**: 2019-2021년 평균 2.6%
정책적 노력이 지속적 성과를 만들어내고 있습니다.`;
    }

    if (
      lowerQuery.includes("평균") ||
      lowerQuery.includes("전체") ||
      lowerQuery.includes("데이터")
    ) {
      return `🌍 **전체 데이터 통계 분석**

**1990-2021년 전체 기간 통계**:

• **평균 배출량**: 587,432 Gg CO₂eq
• **최대 배출량**: 679,600 Gg CO₂eq (2017년)
• **최소 배출량**: 292,961 Gg CO₂eq (1990년)
• **전체 증가율**: 124.2% (1990 대비 2021년)

**최근 10년 평균**: 651,248 Gg CO₂eq
**최근 5년 감축 추세**: 연평균 1.8% 감소

**부문별 30년 평균 비중**:
- 에너지: 68.5%
- 수송: 16.2%
- 산업공정: 9.1%
- 농업: 3.8%
- 폐기물: 2.4%

지속적인 감축 노력으로 2030년 목표 달성 가능성이 높아지고 있습니다.`;
    }

    // 기본 응답
    return `🤖 **AI 탄소 데이터 분석 어시스턴트입니다!**

현재 다음과 같은 데이터를 분석할 수 있습니다:

📊 **이용 가능한 데이터**:
• 국가 온실가스 인벤토리 (1990-2021)
• 배출권 거래 데이터 (KAU24)
• 3차 사전할당 데이터 (2021-2025)
• 지역별 CO₂ 농도 데이터

💡 **분석 가능한 질문들**:
• 연도별 배출량 변화 추이
• 부문별 배출량 비교
• 특정 연도 상세 분석
• 감축 효과 및 트렌드 분석

궁금한 것이 있으시면 언제든 물어보세요!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: analyzeQuery(input),
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleExampleClick = (query: string) => {
    setInput(query);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
          🤖 AI 챗봇 - 탄소 데이터 분석
        </h1>
        <p className="text-gray-600">
          탄소 배출 데이터에 대해 궁금한 것을 물어보세요!
        </p>
      </div>

      {/* Data Info */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          📊 데이터 정보
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold">🌍 국가 온실가스 인벤토리</h3>
            <p className="text-gray-600">1990-2021년 연도별 배출량 데이터</p>
          </div>
          <div>
            <h3 className="font-semibold">💹 배출권 거래 데이터</h3>
            <p className="text-gray-600">KAU24 일별 시가 및 거래량</p>
          </div>
          <div>
            <h3 className="font-semibold">🏭 3차 사전할당 데이터</h3>
            <p className="text-gray-600">2021-2025년 업체별 할당량</p>
          </div>
          <div>
            <h3 className="font-semibold">🗺️ 지역별 CO₂ 농도</h3>
            <p className="text-gray-600">실시간 지역별 이산화탄소 농도</p>
          </div>
        </div>
      </div>

      {/* Example Queries */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          💡 예시 질문들
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(query)}
              className="text-left p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all duration-200 text-sm"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h2 className="text-xl font-bold flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            💬 AI 챗봇과 대화하기
          </h2>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>AI 어시스턴트가 대기 중입니다.</p>
              <p className="text-sm">
                탄소 데이터에 대해 궁금한 것을 물어보세요!
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {message.role === "user" ? "🙋‍♂️ 사용자" : "🤖 AI 어시스턴트"}
                </div>
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">
                    AI가 분석 중입니다...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="질문을 입력하세요 (예: 2021년 총배출량은 얼마인가요?)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {messages.length > 0 && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={clearMessages}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center text-sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                🗑️ 채팅 히스토리 초기화
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
