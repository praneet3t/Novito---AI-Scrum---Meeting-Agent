import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTasks = [
  { id: 1, title: 'Complete safety inspection', status: 'in_progress', assignee: 'member', priority: 9, due: 'Today' },
  { id: 2, title: 'Order equipment supplies', status: 'todo', assignee: 'member', priority: 7, due: 'Tomorrow' },
  { id: 3, title: 'Update client report', status: 'done', assignee: 'manager', priority: 8, due: 'Yesterday' },
  { id: 4, title: 'Schedule team training', status: 'in_progress', assignee: 'admin', priority: 6, due: 'Next Week' },
  { id: 5, title: 'Review budget allocation', status: 'todo', assignee: 'manager', priority: 10, due: 'Today' },
];

const completionData = [
  { name: 'Mon', completed: 12 },
  { name: 'Tue', completed: 15 },
  { name: 'Wed', completed: 18 },
  { name: 'Thu', completed: 14 },
  { name: 'Fri', completed: 20 },
];

export default function Dashboard() {
  const [user] = useState(localStorage.getItem('token') || 'admin');
  const myTasks = user === 'admin' ? mockTasks : mockTasks.filter(t => t.assignee === user);

  // Risk Detection Logic (Mock)
  const atRiskTasks = mockTasks.filter(t => t.priority > 8 && t.status !== 'done');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-[var(--color-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">Overview of your workspace activity.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">Export Report</button>
          <button className="btn btn-primary">New Task</button>
        </div>
      </div>

      {/* Smart Daily Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Smart Daily Briefing</h3>
          </div>
          <p className="text-[var(--color-text-primary)] text-sm mb-4">
            Good morning, <span className="font-medium capitalize">{user}</span>. You have <span className="font-medium">{atRiskTasks.length} high-priority items</span> requiring attention today.
            Team velocity is tracking <span className="text-green-600 font-medium">12% higher</span> than last week.
          </p>
          <div className="grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-4">
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">{mockTasks.filter(t => t.status === 'in_progress').length}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">{mockTasks.filter(t => t.status === 'todo').length}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">{mockTasks.filter(t => t.priority > 8).length}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">Critical</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Risk Detection</h3>
          </div>
          <div className="space-y-3">
            {atRiskTasks.length > 0 ? (
              atRiskTasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 p-2 rounded hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">{task.title}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Due {task.due} • Priority {task.priority}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">No immediate risks detected.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Active Tasks</h3>
            <button className="text-xs font-medium text-[var(--color-accent)] hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  <th className="px-4 py-3 font-medium w-16">ID</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium text-right">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {myTasks.map(task => {
                  const statusClass = task.status === 'done' ? 'badge-success' :
                    task.status === 'in_progress' ? 'badge-info' :
                      'badge-neutral';

                  const priorityColor = task.priority >= 9 ? 'bg-red-500' :
                    task.priority >= 7 ? 'bg-amber-500' :
                      'bg-blue-500';

                  return (
                    <tr key={task.id} className="hover:bg-[var(--color-surface-subtle)] transition-colors group">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-tertiary)]">#{task.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                        {task.title}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${statusClass}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${priorityColor}`}></div>
                          <span className="text-xs text-[var(--color-text-secondary)]">{task.priority}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--color-text-secondary)]">{task.due}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="card p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-6">Completion Velocity</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                  cursor={{ fill: '#f4f4f5' }}
                />
                <Bar dataKey="completed" fill="#18181b" radius={[2, 2, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
