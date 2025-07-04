import React, { useState } from "react";
import { MessageCircle, Send, RotateCcw } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatInterfaceProps {
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  onChatSubmit: (e: React.FormEvent) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  onChatSubmit,
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

    return "탄소배출권과 관련된 질문을 해주세요. 배출량, 가격, 구매 전략, 감축 목표 등에 대해 답변드릴 수 있습니다.";
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
          AI 챗봇 상담
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          탄소배출권 관련 질문을 해주세요
        </p>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
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
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
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

      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="질문을 입력하세요..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={resetChat}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
