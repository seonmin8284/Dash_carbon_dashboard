import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Bell, Info, AlertCircle } from "lucide-react";

interface Alert {
  id: string;
  type: "urgent" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const EmergencyAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "urgent",
      title: "탄소배출권 할당량 초과 경고",
      message:
        "현재 할당량 대비 15% 초과 배출이 감지되었습니다. 즉시 감축 조치가 필요합니다.",
      timestamp: "2025-01-15 14:30",
      isRead: false,
    },
    {
      id: "2",
      type: "warning",
      title: "KAU 가격 급등",
      message:
        "KAU24 가격이 8,770원으로 전년 대비 2.3% 상승했습니다. 구매 전략 재검토가 필요합니다.",
      timestamp: "2025-01-15 13:45",
      isRead: false,
    },
    {
      id: "3",
      type: "info",
      title: "ESG 등급 업데이트",
      message:
        "2024년 4분기 ESG 등급이 A+로 상향 조정되었습니다. 축하드립니다!",
      timestamp: "2025-01-15 12:20",
      isRead: true,
    },
    {
      id: "4",
      type: "warning",
      title: "감축 목표 달성률 부족",
      message:
        "2030년 감축 목표 대비 현재 달성률이 18.5%로 목표 달성에 추가 노력이 필요합니다.",
      timestamp: "2025-01-15 11:15",
      isRead: false,
    },
    {
      id: "5",
      type: "urgent",
      title: "시장 변동성 증가",
      message:
        "탄소배출권 시장 변동성이 증가하고 있습니다. 포트폴리오 리밸런싱을 고려해보세요.",
      timestamp: "2025-01-15 10:30",
      isRead: false,
    },
  ]);

  const [isExpanded, setIsExpanded] = useState(false);

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  // 실시간 알림 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      // 랜덤하게 새로운 알림 추가 (10% 확률)
      if (Math.random() < 0.1) {
        const newAlerts = [
          {
            id: Date.now().toString(),
            type: "warning" as const,
            title: "KAU 가격 변동",
            message:
              "KAU24 가격이 " +
              (Math.random() * 1000 + 8000).toFixed(0) +
              "원으로 변동되었습니다.",
            timestamp: new Date().toLocaleString("ko-KR"),
            isRead: false,
          },
          {
            id: Date.now().toString(),
            type: "info" as const,
            title: "시스템 업데이트",
            message:
              "탄소배출권 관리 시스템이 업데이트되었습니다. 새로운 기능을 확인해보세요.",
            timestamp: new Date().toLocaleString("ko-KR"),
            isRead: false,
          },
        ];

        const randomAlert =
          newAlerts[Math.floor(Math.random() * newAlerts.length)];
        setAlerts((prev) => [randomAlert, ...prev.slice(0, 4)]); // 최대 5개 유지
      }
    }, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "info":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getAlertTextColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <h3 className="text-lg font-semibold">긴급 알림</h3>
            {unreadCount > 0 && (
              <span className="bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            {isExpanded ? "접기" : "펼치기"}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div
        className={`${
          isExpanded ? "block" : "hidden"
        } divide-y divide-gray-200 flex-1 overflow-y-auto`}
      >
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            className={`p-4 border-l-4 ${getAlertColor(alert.type)} ${
              !alert.isRead ? "border-l-4 border-l-red-500" : ""
            } transition-all duration-300 ease-in-out ${
              !alert.isRead ? "animate-slide-in" : ""
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4
                      className={`font-semibold ${getAlertTextColor(
                        alert.type
                      )}`}
                    >
                      {alert.title}
                    </h4>
                    {!alert.isRead && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{alert.timestamp}</span>
                    {!alert.isRead && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        읽음 표시
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary (when collapsed) */}
      {!isExpanded && (
        <div className="p-4 bg-gray-50 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {unreadCount}개의 읽지 않은 알림이 있습니다
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {alerts.length}개 알림
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlerts;
