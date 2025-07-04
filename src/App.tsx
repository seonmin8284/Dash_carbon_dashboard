import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MainDashboard from "./components/MainDashboard";
import Chatbot from "./components/Chatbot";
import Strategy from "./components/Strategy";
import ProgramInfo from "./components/ProgramInfo";
import Dashboard from "./components/Dashboard";

const NotFound = () => (
  <div className="p-8 text-center text-xl">페이지를 찾을 수 없습니다.</div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainDashboard />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="strategy" element={<Strategy />} />
          <Route path="info" element={<ProgramInfo />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
