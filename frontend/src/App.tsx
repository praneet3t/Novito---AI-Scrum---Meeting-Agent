import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import GenericPage from './pages/GenericPage';
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
          <Route path="/tasks" element={<TasksPage />} />
          
          {/* Admin routes */}
          <Route path="/users" element={<GenericPage title="User Management" description="Manage system users, roles, and permissions" items={['Add New User', 'Edit User Roles', 'Deactivate Users', 'View User Activity', 'Reset Passwords', 'Bulk Import Users']} />} />
          <Route path="/settings" element={<GenericPage title="System Settings" description="Configure system-wide settings and preferences" items={['General Settings', 'Email Configuration', 'Security Settings', 'Backup & Restore', 'API Keys', 'Integration Settings']} />} />
          <Route path="/reports" element={<GenericPage title="Reports" description="Generate and view system reports" items={['User Activity Report', 'Performance Metrics', 'System Health', 'Usage Statistics', 'Export Data', 'Custom Reports']} />} />
          <Route path="/audit" element={<GenericPage title="Audit Logs" description="View system audit logs and activity history" items={['Login History', 'Data Changes', 'System Events', 'Security Alerts', 'Export Logs', 'Filter by User']} />} />
          
          {/* Product Owner routes */}
          <Route path="/backlog" element={<GenericPage title="Product Backlog" description="Manage and prioritize product backlog items" items={['Create User Stories', 'Prioritize Items', 'Estimate Effort', 'Assign to Sprints', 'Refine Backlog', 'Archive Completed']} />} />
          <Route path="/sprints" element={<GenericPage title="Sprint Planning" description="Plan and manage sprints" items={['Create New Sprint', 'Sprint Goals', 'Capacity Planning', 'Sprint Review', 'Sprint Retrospective', 'Velocity Tracking']} />} />
          <Route path="/roadmap" element={<GenericPage title="Product Roadmap" description="View and manage product roadmap" items={['Quarterly Goals', 'Feature Timeline', 'Release Planning', 'Milestone Tracking', 'Dependency Mapping', 'Share with Stakeholders']} />} />
          <Route path="/stakeholders" element={<GenericPage title="Stakeholder Management" description="Manage stakeholder communications" items={['Stakeholder List', 'Meeting Notes', 'Feedback Collection', 'Status Updates', 'Demo Scheduling', 'Communication Log']} />} />
          
          {/* Developer routes */}
          <Route path="/code-review" element={<GenericPage title="Code Reviews" description="Review and approve code changes" items={['Pending Reviews', 'My Reviews', 'Review Comments', 'Approve Changes', 'Request Changes', 'Review History']} />} />
          <Route path="/pull-requests" element={<GenericPage title="Pull Requests" description="Manage pull requests" items={['Open PRs', 'My PRs', 'Create New PR', 'Merge Requests', 'Conflict Resolution', 'PR Templates']} />} />
          <Route path="/docs" element={<GenericPage title="Documentation" description="Technical documentation and guides" items={['API Documentation', 'Architecture Docs', 'Setup Guides', 'Best Practices', 'Code Standards', 'Troubleshooting']} />} />
          
          {/* QA routes */}
          <Route path="/test-cases" element={<GenericPage title="Test Cases" description="Manage test cases and test suites" items={['Create Test Case', 'Test Suites', 'Test Execution', 'Test Results', 'Test Coverage', 'Regression Tests']} />} />
          <Route path="/bug-reports" element={<GenericPage title="Bug Reports" description="Track and manage bugs" items={['Report New Bug', 'Open Bugs', 'Assigned to Me', 'Bug Priority', 'Verify Fixes', 'Bug Statistics']} />} />
          <Route path="/automation" element={<GenericPage title="Test Automation" description="Automated testing tools and scripts" items={['Automation Scripts', 'Test Runners', 'CI/CD Integration', 'Test Frameworks', 'Scheduled Tests', 'Automation Reports']} />} />
          <Route path="/metrics" element={<GenericPage title="Quality Metrics" description="Quality assurance metrics and KPIs" items={['Test Coverage', 'Bug Density', 'Defect Rate', 'Test Pass Rate', 'Quality Trends', 'Performance Metrics']} />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
