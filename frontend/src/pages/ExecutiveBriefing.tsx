import { useState, useEffect } from 'react';

export default function ExecutiveBriefing() {
  const [briefing, setBriefing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBriefing();
  }, []);

  const fetchBriefing = async () => {
    try {
      const response = await fetch('http://localhost:8000/briefing/daily?workspace_id=1&user_id=1');
      const data = await response.json();
      setBriefing(data);
    } catch (error) {
      console.error('Failed to fetch briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!briefing) {
    return <div className="text-center py-12 text-gray-600">Failed to load briefing</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Briefing</h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={fetchBriefing} className="btn-secondary">
          Refresh
        </button>
      </div>

      {/* AI Insight Banner */}
      <div className="card p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">💡</div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Strategic Insight</h2>
            <p className="text-blue-50 text-lg leading-relaxed">{briefing.ai_insight}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="metric-label">Overdue</div>
          <div className={`metric-value ${briefing.summary.overdue_count > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {briefing.summary.overdue_count}
          </div>
        </div>
        <div className="stat-card">
          <div className="metric-label">Blocked</div>
          <div className={`metric-value ${briefing.summary.blocked_count > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
            {briefing.summary.blocked_count}
          </div>
        </div>
        <div className="stat-card">
          <div className="metric-label">At Risk</div>
          <div className={`metric-value ${briefing.summary.at_risk_count > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
            {briefing.summary.at_risk_count}
          </div>
        </div>
        <div className="stat-card">
          <div className="metric-label">In Review</div>
          <div className="metric-value text-blue-600">{briefing.summary.pending_review_count}</div>
        </div>
        <div className="stat-card">
          <div className="metric-label">AI Suggestions</div>
          <div className="metric-value text-purple-600">{briefing.summary.suggestions_pending}</div>
        </div>
      </div>

      {/* Critical Items */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Overdue */}
        {briefing.overdue_tasks.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Tasks</h3>
            <div className="space-y-3">
              {briefing.overdue_tasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{task.title}</div>
                  </div>
                  <span className="badge badge-danger">P{task.priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blocked */}
        {briefing.blocked_tasks.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked Tasks</h3>
            <div className="space-y-3">
              {briefing.blocked_tasks.map((task: any) => (
                <div key={task.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="font-medium text-gray-900 mb-1">{task.title}</div>
                  <div className="text-sm text-orange-700">{task.blocker_reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* At Risk */}
        {briefing.at_risk_tasks.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">At-Risk Tasks</h3>
            <div className="space-y-3">
              {briefing.at_risk_tasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-yellow-700 mt-1">{task.progress}% complete</div>
                  </div>
                  <span className="badge badge-warning">P{task.priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Reviews */}
        {briefing.pending_reviews.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Reviews</h3>
            <div className="space-y-3">
              {briefing.pending_reviews.map((task: any) => (
                <div key={task.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <div className="text-sm text-blue-700 mt-1">
                    Submitted {new Date(task.submitted_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Wins */}
      {briefing.quick_wins.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Wins Available</h3>
          <p className="text-sm text-gray-600 mb-4">High-impact tasks that can be completed quickly</p>
          <div className="grid md:grid-cols-3 gap-3">
            {briefing.quick_wins.map((task: any) => (
              <div key={task.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="font-medium text-gray-900 mb-2">{task.title}</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700">Priority {task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Clear State */}
      {briefing.overdue_tasks.length === 0 && 
       briefing.blocked_tasks.length === 0 && 
       briefing.at_risk_tasks.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">All Systems Operational</h3>
          <p className="text-gray-600">No critical items requiring immediate attention</p>
        </div>
      )}
    </div>
  );
}
