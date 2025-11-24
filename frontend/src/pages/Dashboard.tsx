import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const mockTasks = [
  { id: 1, title: 'Complete safety inspection', status: 'in_progress', assignee: 'member', priority: 9 },
  { id: 2, title: 'Order equipment supplies', status: 'todo', assignee: 'member', priority: 7 },
  { id: 3, title: 'Update client report', status: 'done', assignee: 'manager', priority: 8 },
  { id: 4, title: 'Schedule team training', status: 'in_progress', assignee: 'admin', priority: 6 },
  { id: 5, title: 'Review budget allocation', status: 'todo', assignee: 'manager', priority: 10 },
];

const completionData = [
  { name: 'Week 1', completed: 12 },
  { name: 'Week 2', completed: 15 },
  { name: 'Week 3', completed: 18 },
  { name: 'Week 4', completed: 14 },
];

const statusData = [
  { name: 'To Do', value: 8 },
  { name: 'In Progress', value: 5 },
  { name: 'Done', value: 12 },
  { name: 'Blocked', value: 2 },
];

export default function Dashboard() {
  const [user] = useState(localStorage.getItem('token') || 'admin');
  const myTasks = user === 'admin' ? mockTasks : mockTasks.filter(t => t.assignee === user);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, <span className="capitalize font-medium text-indigo-600">{user}</span>. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <h3 className="metric-label text-indigo-600">Total Tasks</h3>
          <p className="metric-value text-slate-900 mt-2">{mockTasks.length}</p>
          <div className="mt-2 text-xs text-slate-500">
            <span className="text-green-600 font-medium">↑ 12%</span> from last week
          </div>
        </div>
        <div className="stat-card">
          <h3 className="metric-label text-green-600">Completed</h3>
          <p className="metric-value text-slate-900 mt-2">{mockTasks.filter(t => t.status === 'done').length}</p>
          <div className="mt-2 text-xs text-slate-500">
            <span className="text-green-600 font-medium">↑ 8%</span> completion rate
          </div>
        </div>
        <div className="stat-card">
          <h3 className="metric-label text-amber-600">In Progress</h3>
          <p className="metric-value text-slate-900 mt-2">{mockTasks.filter(t => t.status === 'in_progress').length}</p>
          <div className="mt-2 text-xs text-slate-500">
            Active workflows
          </div>
        </div>
        <div className="stat-card">
          <h3 className="metric-label text-purple-600">My Tasks</h3>
          <p className="metric-value text-slate-900 mt-2">{myTasks.length}</p>
          <div className="mt-2 text-xs text-slate-500">
            <span className="text-indigo-600 font-medium">{myTasks.filter(t => t.priority > 8).length}</span> high priority
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Task Completion Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Tasks */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">My Tasks</h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {myTasks.map(task => (
            <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${task.priority >= 9 ? 'bg-red-500' :
                  task.priority >= 7 ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`}></div>
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                  <p className="text-sm text-slate-500">Priority: {task.priority} • Due Tomorrow</p>
                </div>
              </div>
              <span className={`badge ${task.status === 'done' ? 'badge-success' :
                task.status === 'in_progress' ? 'badge-info' :
                  'badge-secondary'
                }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
