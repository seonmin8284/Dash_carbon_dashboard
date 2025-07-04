import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  ShoppingCart,
  MessageCircle,
  Info,
  Globe,
} from "lucide-react";

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "메인 대시보드" },
    { path: "/dashboard", icon: BarChart3, label: "현황 대시보드" },
    { path: "/strategy", icon: ShoppingCart, label: "구매 전략" },
    { path: "/chatbot", icon: MessageCircle, label: "AI 챗봇" },
    { path: "/info", icon: Info, label: "프로그램 정보" },
  ];

  return (
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
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
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
      <div className="flex-1 flex flex-col">
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
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 text-xs ${
                    location.pathname === item.path
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
