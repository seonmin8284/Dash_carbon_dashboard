import React, { useState } from "react";
import { MessageCircle, Send, RotateCcw } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatInterfaceProps {
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  onChatSubmit: (e: React.FormEvent) => void;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  onChatSubmit,
  onClose,
}) => {
  const analyzeScenario = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("탄소배출량") || lowerInput.includes("배출량")) {
      return "현재 탄소배출량은 676,648 Gg CO₂eq (2021년 기준)입니다. 연도별로 감소 추세를 보이고 있으며, 2030년까지 40% 감축 목표를 달성하기 위해 지속적인 노력이 필요합니다.";
    }

    if (lowerInput.includes("가격") || lowerInput.includes("kau")) {
      return "KAU24 현재 가격은 8,770원으로, 전년 대비 2.3% 상승했습니다. 시장 전망은 긍정적이며, 정부의 탄소중립 정책 강화로 인해 가격 상승이 예상됩니다.";
    }

    if (lowerInput.includes("전략") || lowerInput.includes("구매")) {
      return "탄소배출권 구매 전략으로는 1) 정기적 분할 매수, 2) 가격 하락 시 대량 매수, 3) 헤징을 위한 ETF 투자 등을 고려해볼 수 있습니다. 현재 시장 상황에서는 점진적 매수가 권장됩니다.";
    }

    if (lowerInput.includes("감축") || lowerInput.includes("목표")) {
      return "2030년까지 40% 감축 목표를 달성하기 위해서는 에너지 효율 개선, 재생에너지 전환, 공급망 최적화 등이 필요합니다. 현재 감축률은 18.5%로 목표 달성을 위해 추가 노력이 요구됩니다.";
    }

    if (lowerInput.includes("기업") || lowerInput.includes("할당량")) {
      return "주요 기업별 탄소배출권 할당량은 포스코(2,450만톤), 현대차(1,230만톤), 삼성전자(890만톤) 순입니다. 기업들은 할당량을 초과하지 않도록 감축 노력을 지속하고 있습니다.";
    }

    if (lowerInput.includes("시장") || lowerInput.includes("거래")) {
      return "탄소배출권 거래시장은 2021년부터 본격 운영되었으며, 현재 1,200여개 기업이 참여하고 있습니다. 거래량은 지속적으로 증가하고 있으며, 시장 유동성이 개선되고 있습니다.";
    }

    if (lowerInput.includes("정책") || lowerInput.includes("법")) {
      return "탄소중립기본법과 온실가스 배출권의 할당 및 거래에 관한 법률에 따라 탄소배출권 제도가 운영되고 있습니다. 2030년까지 40% 감축 목표를 달성하기 위한 다양한 정책이 시행되고 있습니다.";
    }

    return "탄소배출권과 관련된 질문을 해주세요. 배출량, 가격, 구매 전략, 감축 목표, 기업 할당량, 시장 현황, 정책 등에 대해 답변드릴 수 있습니다.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: analyzeScenario(chatInput),
      timestamp: new Date().toISOString(),
    };

    setChatMessages([...chatMessages, userMessage, assistantMessage]);
    setChatInput("");
  };

  const resetChat = () => {
    setChatMessages([]);
  };

  return (
    <div className="bg-white h-full flex flex-col w-full">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              AI 챗봇 상담
            </h3>
            <p className="text-sm text-blue-100 mt-1">
              탄소배출권 관련 질문을 해주세요
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="닫기"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-400px)] overflow-y-auto overflow-x-hidden p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>탄소배출권에 대해 궁금한 점을 물어보세요!</p>
          </div>
        ) : (
          chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm break-words ${
                  message.role === "user"
                    ? "bg-blue-600 text-white ml-8"
                    : "bg-gray-100 text-gray-900 mr-8"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 p-4 mt-auto">
        {/* 예시 질문들 */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">
            💡 예시 질문:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "총배출량의 연도별 변화 추이는?",
              "🏭 에너지 산업과 수송 산업의 배출량 비교",
              "📊 2017년과 2021년의 배출량 차이는?",
              "🔍 가장 많이 배출하는 분야는?",
              "📉 감축률이 가장 높은 연도는?",
              "🌍 전체 데이터에서 평균 배출량은?",
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setChatInput(question)}
                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2 min-w-0">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="질문을 입력하세요..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0"
          />
          <button
            type="submit"
            className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={resetChat}
            className="flex-shrink-0 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
