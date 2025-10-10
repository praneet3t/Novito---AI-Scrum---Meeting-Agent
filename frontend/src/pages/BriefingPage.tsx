import { useState, useEffect } from 'react';

export default function BriefingPage() {
  const [briefing, setBriefing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem('token') || 'admin';
  const userId = user === 'dev1' ? 3 : 1;

  useEffect(() => {
    fetchBriefing();
  }, []);

  const fetchBriefing = async () => {
    try {
      const response = await fetch(`http://localhost:8000/briefing/daily?workspace_id=1&user_id=${userId}`);
      const data = await response.json();
      setBriefing(data);
    } catch (error) {
      console.error('Failed to fetch briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading your daily briefing...</div>;
  }

  if (!briefing) {
    return <div className="text-center py-12">Failed to load briefing</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">☀️ Daily Briefing</h1>
        <p className="text-gray-600 mt-1">AI-powered summary of what needs your attention</p>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">🤖</div>
          <div>
            <h2 className="text-xl font-bold">Nova's Insight</h2>
            <p className="text-lg mt-1">{briefing.ai_insight}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-red-600">{briefing.summary.overdue_count}</div>
          <div className="text-sm text-gray-600 mt-1">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-orange-600">{briefing.summary.blocked_count}</div>
          <div className="text-sm text-gray-600 mt-1">Blocked</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-yellow-600">{briefing.summary.at_risk_count}</div>
          <div className="text-sm text-gray-600 mt-1">At Risk</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600">{briefing.summary.pending_review_count}</div>
          <div className="text-sm text-gray-600 mt-1">In Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-purple-600">{briefing.summary.suggestions_pending}</div>
          <div className="text-sm text-gray-600 mt-1">AI Suggestions</div>
        </div>
      </div>

      {/* My Focus Today */}
      {briefing.my_focus_today.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Your Focus Today</h3>
          <div className="space-y-2">
            {briefing.my_focus_today.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded">
                <span className="font-medium">{task.title}</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">
                  Priority {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {briefing.quick_wins.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Wins Available</h3>
          <p className="text-sm text-gray-600 mb-3">Small tasks you can knock out quickly</p>
          <div className="space-y-2">
            {briefing.quick_wins.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span className="font-medium">{task.title}</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                  Priority {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Overdue */}
        {briefing.overdue_tasks.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <h4 className="font-bold text-red-800 mb-2">🚨 Overdue Tasks</h4>
            <ul className="space-y-1">
              {briefing.overdue_tasks.map((task: any) => (
                <li key={task.id} className="text-sm text-red-700">• {task.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Blocked */}
        {briefing.blocked_tasks.length > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <h4 className="font-bold text-orange-800 mb-2">🚫 Blocked Tasks</h4>
            <ul className="space-y-1">
              {briefing.blocked_tasks.map((task: any) => (
                <li key={task.id} className="text-sm text-orange-700">
                  • {task.title}
                  <span className="text-xs block ml-3 text-orange-600">{task.blocker_reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* At Risk */}
        {briefing.at_risk_tasks.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ At-Risk Tasks</h4>
            <ul className="space-y-1">
              {briefing.at_risk_tasks.map((task: any) => (
                <li key={task.id} className="text-sm text-yellow-700">
                  • {task.title} ({task.progress}% complete)
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pending Reviews */}
        {briefing.pending_reviews.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-bold text-blue-800 mb-2">👀 Pending Reviews</h4>
            <ul className="space-y-1">
              {briefing.pending_reviews.map((task: any) => (
                <li key={task.id} className="text-sm text-blue-700">• {task.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
