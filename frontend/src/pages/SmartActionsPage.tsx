import { useState } from 'react';

export default function SmartActionsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const runAction = async (action: string, endpoint: string) => {
    setLoading(action);
    setResults(null);
    try {
      const response = await fetch(`http://localhost:8000/smart/${endpoint}?workspace_id=1`, {
        method: 'POST'
      });
      const data = await response.json();
      setResults({ action, data });
    } catch (error) {
      alert(`Failed to run ${action}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">🤖 Smart Actions</h1>
        <p className="text-gray-600 mt-1">Let Nova proactively analyze and suggest improvements</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Risk Detection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Detect Risks</h3>
              <p className="text-sm text-gray-600">Find tasks at risk of missing deadlines</p>
            </div>
          </div>
          <button
            onClick={() => runAction('Risk Detection', 'detect-risks')}
            disabled={loading === 'Risk Detection'}
            className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            {loading === 'Risk Detection' ? 'Analyzing...' : 'Run Risk Detection'}
          </button>
        </div>

        {/* Workload Rebalancing */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-4xl">⚖️</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Rebalance Workload</h3>
              <p className="text-sm text-gray-600">Suggest task redistribution for overloaded members</p>
            </div>
          </div>
          <button
            onClick={() => runAction('Workload Rebalancing', 'suggest-rebalance')}
            disabled={loading === 'Workload Rebalancing'}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading === 'Workload Rebalancing' ? 'Analyzing...' : 'Suggest Rebalancing'}
          </button>
        </div>

        {/* Dependency Detection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-4xl">🔗</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Find Dependencies</h3>
              <p className="text-sm text-gray-600">Auto-detect task dependencies from descriptions</p>
            </div>
          </div>
          <button
            onClick={() => runAction('Dependency Detection', 'find-dependencies')}
            disabled={loading === 'Dependency Detection'}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading === 'Dependency Detection' ? 'Analyzing...' : 'Find Dependencies'}
          </button>
        </div>

        {/* Auto Prioritize */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Auto-Prioritize</h3>
              <p className="text-sm text-gray-600">Suggest priorities based on deadlines</p>
            </div>
          </div>
          <button
            onClick={() => runAction('Auto-Prioritize', 'auto-prioritize')}
            disabled={loading === 'Auto-Prioritize'}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading === 'Auto-Prioritize' ? 'Analyzing...' : 'Auto-Prioritize Tasks'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">✅ {results.action} Complete</h3>
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800 font-medium mb-2">
              Created {Object.values(results.data)[0]} suggestions
            </p>
            <p className="text-sm text-green-700">
              Go to Review Queue to see and approve the suggestions
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-800">
          💡 <strong>How it works:</strong> Each action analyzes your workspace and creates AI suggestions.
          Review and approve them in the Review Queue.
        </p>
      </div>
    </div>
  );
}
