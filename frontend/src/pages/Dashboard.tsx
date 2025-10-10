import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const mockVelocity = [
  { sprint: 'Sprint 1', velocity: 35 },
  { sprint: 'Sprint 2', velocity: 38 },
  { sprint: 'Sprint 3', velocity: 42 },
];

const mockDistribution = [
  { name: 'To Do', value: 5 },
  { name: 'In Progress', value: 3 },
  { name: 'QA', value: 2 },
  { name: 'Done', value: 8 },
];

const mockTasks = [
  { id: 1, title: 'Implement OAuth2 login', status: 'in_progress', assignee: 'dev1', priority: 9 },
  { id: 2, title: 'Write test cases for login', status: 'todo', assignee: 'qa1', priority: 7 },
  { id: 3, title: 'Fix database migration', status: 'in_progress', assignee: 'dev1', priority: 10, blocked: true },
  { id: 4, title: 'Design dashboard wireframes', status: 'done', assignee: 'product_owner', priority: 8 },
];

const getRoleContent = (role: string) => {
  switch(role) {
    case 'admin':
      return {
        title: 'Admin Dashboard',
        tasks: mockTasks,
        features: ['Manage Users', 'System Settings', 'View All Reports', 'Audit Logs'],
        stats: { total: mockTasks.length, completed: 8, pending: 6, issues: 1 }
      };
    case 'product_owner':
      return {
        title: 'Product Owner Dashboard',
        tasks: mockTasks.filter(t => t.assignee === 'product_owner'),
        features: ['Manage Backlog', 'Sprint Planning', 'Stakeholder Reports', 'Roadmap'],
        stats: { backlog: 12, sprints: 3, epics: 5, releases: 2 }
      };
    case 'dev1':
      return {
        title: 'Developer Dashboard',
        tasks: mockTasks.filter(t => t.assignee === 'dev1'),
        features: ['Code Reviews', 'Pull Requests', 'Build Status', 'Documentation'],
        stats: { commits: 47, prs: 8, reviews: 12, bugs: 3 }
      };
    case 'qa1':
      return {
        title: 'QA Dashboard',
        tasks: mockTasks.filter(t => t.assignee === 'qa1'),
        features: ['Test Cases', 'Bug Reports', 'Test Automation', 'Quality Metrics'],
        stats: { tests: 156, passed: 142, failed: 8, automated: 89 }
      };
    default:
      return {
        title: 'Dashboard',
        tasks: [],
        features: [],
        stats: {}
      };
  }
};

export default function Dashboard() {
  const [user] = useState(localStorage.getItem('token') || 'admin');
  const content = getRoleContent(user);
  const blockedTasks = mockTasks.filter(t => t.blocked);



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{content.title}</h1>
          <p className="text-gray-600">Welcome, {user}</p>
        </div>
      </div>

      {/* Role-specific Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(content.stats).map(([key, value]) => (
          <div key={key} className="bg-gradient-to-br from-indigo-50 to-blue-50 border-l-4 border-indigo-500 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-800 capitalize">{key.replace('_', ' ')}</h3>
            <p className="text-3xl font-bold text-indigo-600">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {content.features.map((feature, idx) => (
            <button
              key={idx}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition"
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* My Tasks */}
      {content.tasks.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Tasks ({content.tasks.length})</h2>
          <div className="space-y-3">
            {content.tasks.map(task => (
              <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between">
                  <p className="font-medium">{task.title}</p>
                  <span className={`px-2 py-1 rounded text-sm ${
                    task.status === 'done' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Priority: {task.priority}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sprint Velocity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockVelocity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sprint" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="velocity" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mockDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {blockedTasks.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">⚠️ Blocked Tasks</h2>
          <div className="space-y-2">
            {blockedTasks.map(task => (
              <div key={task.id} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-600">Waiting for DBA approval</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
