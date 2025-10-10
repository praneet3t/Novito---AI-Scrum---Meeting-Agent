import { useState, useEffect } from 'react';

export default function BlockersPage() {
  const [blockers, setBlockers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockers();
  }, []);

  const fetchBlockers = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks/blockers?workspace_id=1');
      const data = await response.json();
      setBlockers(data);
    } catch (error) {
      console.error('Failed to fetch blockers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (taskId: number) => {
    try {
      await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_blocked: false, blocker_reason: null })
      });
      alert('✅ Blocker resolved');
      fetchBlockers();
    } catch (error) {
      alert('Failed to resolve blocker');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading blockers...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Blocked Tasks</h1>
        <p className="text-gray-600 mt-1">Resolve blockers to keep work flowing</p>
      </div>

      {blockers.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-600 text-lg">No blocked tasks</p>
          <p className="text-gray-500 text-sm mt-2">All tasks are progressing smoothly</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blockers.map((task: any) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                    <p className="text-sm font-medium text-red-800">🚫 Blocker Reason:</p>
                    <p className="text-sm text-red-700 mt-1">{task.blocker_reason}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      Assignee ID: {task.assignee_id}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">
                      Priority: {task.priority}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleResolve(task.id)}
                  className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap"
                >
                  ✓ Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
