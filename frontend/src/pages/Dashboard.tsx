import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome, {user}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">{mockTasks.length}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{mockTasks.filter(t => t.status === 'done').length}</p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">In Progress</h3>
          <p className="text-3xl font-bold text-yellow-600">{mockTasks.filter(t => t.status === 'in_progress').length}</p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">My Tasks</h3>
          <p className="text-3xl font-bold text-purple-600">{myTasks.length}</p>
        </div>
      </div>

      {/* My Tasks */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">My Tasks ({myTasks.length})</h2>
        <div className="space-y-3">
          {myTasks.map(task => (
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Task Completion Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
