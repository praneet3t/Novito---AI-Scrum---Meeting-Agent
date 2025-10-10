import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { week: 'Week 1', completed: 12, created: 15 },
  { week: 'Week 2', completed: 15, created: 18 },
  { week: 'Week 3', completed: 18, created: 16 },
  { week: 'Week 4', completed: 14, created: 20 },
];

const teamPerformance = [
  { name: 'John', completed: 24, pending: 3 },
  { name: 'Sarah', completed: 18, pending: 5 },
  { name: 'Mike', completed: 21, pending: 2 },
  { name: 'Admin', completed: 15, pending: 4 },
  { name: 'Manager', completed: 19, pending: 3 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last-30-days');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive performance metrics and insights</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="last-7-days">Last 7 Days</option>
          <option value="last-30-days">Last 30 Days</option>
          <option value="last-90-days">Last 90 Days</option>
          <option value="this-year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">127</p>
          <p className="text-sm text-blue-700 mt-1">+12% from last period</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Completion Rate</h3>
          <p className="text-3xl font-bold text-green-600">87%</p>
          <p className="text-sm text-green-700 mt-1">+5% from last period</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Avg. Completion Time</h3>
          <p className="text-3xl font-bold text-yellow-600">3.2d</p>
          <p className="text-sm text-yellow-700 mt-1">-0.5d from last period</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Team Productivity</h3>
          <p className="text-3xl font-bold text-purple-600">94%</p>
          <p className="text-sm text-purple-700 mt-1">+3% from last period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Task Creation vs Completion</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" />
              <Bar dataKey="pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="border-2 border-indigo-600 text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-50 font-medium">
            📊 Export Task Summary
          </button>
          <button className="border-2 border-green-600 text-green-600 px-4 py-3 rounded-lg hover:bg-green-50 font-medium">
            👥 Export Team Performance
          </button>
          <button className="border-2 border-purple-600 text-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 font-medium">
            📈 Export Productivity Metrics
          </button>
        </div>
      </div>
    </div>
  );
}
