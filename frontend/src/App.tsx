import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MeetingsPage from './pages/MeetingsPage';
import ReviewQueue from './pages/ReviewQueue';
import TasksPage from './pages/TasksPage';
import ReportsPage from './pages/ReportsPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import AuditPage from './pages/AuditPage';
import BlockersPage from './pages/BlockersPage';
import BriefingPage from './pages/BriefingPage';
import SmartActionsPage from './pages/SmartActionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatAgentPage from './pages/ChatAgentPage';
import ExecutiveBriefing from './pages/ExecutiveBriefing';
import Layout from './components/Layout';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/review" element={<ReviewQueue />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/blockers" element={<BlockersPage />} />
          <Route path="/briefing" element={<BriefingPage />} />
          <Route path="/smart" element={<SmartActionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/chat" element={<ChatAgentPage />} />
          <Route path="/executive" element={<ExecutiveBriefing />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
