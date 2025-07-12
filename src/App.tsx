import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Lazy loading for better performance
const MainDashboard = lazy(() => import("./pages/MainDashboard"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const Strategy = lazy(() => import("./pages/Strategy"));
const StrategyAnalysis = lazy(() => import("./pages/StrategyAnalysis"));
const ProgramInfo = lazy(() => import("./pages/ProgramInfo"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ReportGenerator = lazy(() => import("./pages/ReportGenerator"));

// Simple loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">로딩 중...</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="p-8 text-center text-xl">페이지를 찾을 수 없습니다.</div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/strategy-analysis" element={<StrategyAnalysis />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/info" element={<ProgramInfo />} />
            <Route path="/report" element={<ReportGenerator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
