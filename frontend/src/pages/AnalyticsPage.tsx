import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [velocityData, setVelocityData] = useState<any>(null);
  const [cycleTime, setCycleTime] = useState<any>(null);
  const [workload, setWorkload] = useState<any>(null);
  const [aiEffectiveness, setAiEffectiveness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [vel, cycle, work, ai] = await Promise.all([
        fetch('http://localhost:8000/analytics/velocity-forecast?workspace_id=1').then(r => r.json()),
        fetch('http://localhost:8000/analytics/task-cycle-time?workspace_id=1').then(r => r.json()),
        fetch('http://localhost:8000/analytics/workload-distribution?workspace_id=1').then(r => r.json()),
        fetch('http://localhost:8000/analytics/ai-effectiveness?workspace_id=1').then(r => r.json())
      ]);
      setVelocityData(vel);
      setCycleTime(cycle);
      setWorkload(work);
      setAiEffectiveness(ai);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading advanced analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Advanced Analytics</h1>
        <p className="text-gray-600 mt-1">Predictive intelligence and performance metrics</p>
      </div>

      {/* Velocity Forecast */}
      {velocityData && !velocityData.error && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sprint Velocity Forecast</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-sm text-gray-600">Average Velocity</div>
              <div className="text-2xl font-bold text-blue-600">
                {velocityData.historical_velocity.average} pts
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Trend: {velocityData.historical_velocity.trend}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-sm text-gray-600">Completion Probability</div>
              <div className="text-2xl font-bold text-green-600">
                {velocityData.current_sprint.completion_probability}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Risk: {velocityData.current_sprint.risk_level}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <div className="text-sm text-gray-600">Remaining Points</div>
              <div className="text-2xl font-bold text-purple-600">
                {velocityData.current_sprint.remaining_points}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {velocityData.current_sprint.days_remaining} days left
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm font-medium text-gray-700">Recommendation:</p>
            <p className="text-sm text-gray-600 mt-1">{velocityData.recommendation}</p>
          </div>
        </div>
      )}

      {/* Cycle Time Analysis */}
      {cycleTime && !cycleTime.error && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Task Cycle Time Analysis</h3>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="bg-indigo-50 p-4 rounded">
              <div className="text-sm text-gray-600">Average</div>
              <div className="text-2xl font-bold text-indigo-600">
                {cycleTime.overall.average_days} days
              </div>
            </div>
            <div className="bg-indigo-50 p-4 rounded">
              <div className="text-sm text-gray-600">Median</div>
              <div className="text-2xl font-bold text-indigo-600">
                {cycleTime.overall.median_days} days
              </div>
            </div>
            <div className="bg-indigo-50 p-4 rounded">
              <div className="text-sm text-gray-600">85th Percentile</div>
              <div className="text-2xl font-bold text-indigo-600">
                {cycleTime.overall.p85_days} days
              </div>
            </div>
            <div className="bg-indigo-50 p-4 rounded">
              <div className="text-sm text-gray-600">Range</div>
              <div className="text-2xl font-bold text-indigo-600">
                {cycleTime.overall.min_days}-{cycleTime.overall.max_days}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm font-medium text-gray-700">Insight:</p>
            <p className="text-sm text-gray-600 mt-1">{cycleTime.insight}</p>
          </div>
        </div>
      )}

      {/* Workload Distribution */}
      {workload && !workload.error && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Workload Distribution</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Team Balance Score</span>
              <span className="text-2xl font-bold text-green-600">
                {workload.balance_metrics.balance_score}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${workload.balance_metrics.balance_score}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {workload.balance_metrics.interpretation}
            </p>
          </div>
          <div className="space-y-2">
            {workload.team_workload.map((member: any) => (
              <div key={member.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-600">
                    {member.task_count} tasks • {member.total_points} points • {member.completion_rate}% complete
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${
                  member.status === 'overloaded' ? 'bg-red-100 text-red-800' :
                  member.status === 'balanced' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
          {workload.recommendations.length > 0 && (
            <div className="mt-4 bg-blue-50 p-4 rounded">
              <p className="text-sm font-medium text-blue-800">Recommendations:</p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                {workload.recommendations.map((rec: string, idx: number) => (
                  <li key={idx}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* AI Effectiveness */}
      {aiEffectiveness && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">AI Effectiveness Metrics</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-purple-50 p-4 rounded">
              <div className="text-sm text-gray-600">Total Suggestions</div>
              <div className="text-2xl font-bold text-purple-600">
                {aiEffectiveness.overall_metrics.total_suggestions}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <div className="text-sm text-gray-600">Adoption Rate</div>
              <div className="text-2xl font-bold text-purple-600">
                {aiEffectiveness.overall_metrics.adoption_rate}%
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <div className="text-sm text-gray-600">Effectiveness</div>
              <div className="text-lg font-bold text-purple-600">
                {aiEffectiveness.overall_metrics.effectiveness_score}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {aiEffectiveness.by_suggestion_type.map((type: any) => (
              <div key={type.type} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{type.type}</div>
                  <div className="text-sm text-gray-600">
                    {type.applied}/{type.total} applied • Avg confidence: {type.avg_confidence}
                  </div>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {type.adoption_rate}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <p className="text-sm font-medium text-gray-700">Insight:</p>
            <p className="text-sm text-gray-600 mt-1">{aiEffectiveness.insight}</p>
          </div>
        </div>
      )}
    </div>
  );
}
