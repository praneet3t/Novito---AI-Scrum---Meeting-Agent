import { useState, useEffect } from 'react';

export default function ReviewQueue() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:8000/agent/suggestions?workspace_id=1&applied=false');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (suggestionId: number) => {
    try {
      await fetch(`http://localhost:8000/agent/suggestions/${suggestionId}/apply?actor_id=1`, {
        method: 'PATCH'
      });
      alert('✅ Task created successfully');
      fetchSuggestions();
    } catch (error) {
      alert('Failed to apply suggestion');
    }
  };

  const handleReject = async (suggestionId: number) => {
    try {
      await fetch(`http://localhost:8000/agent/suggestions/${suggestionId}/reject?actor_id=1`, {
        method: 'PATCH'
      });
      fetchSuggestions();
    } catch (error) {
      alert('Failed to reject suggestion');
    }
  };

  const handleEdit = (suggestionId: number) => {
    const suggestion = suggestions.find((s: any) => s.id === suggestionId);
    alert(`Edit functionality would open a modal to modify:\n\n${JSON.stringify(suggestion?.payload, null, 2)}`);
  };

  if (loading) {
    return <div className="text-center py-12">Loading suggestions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Review AI-Extracted Tasks</h1>
          <p className="text-gray-600 mt-1">Review and approve tasks before assigning to team members</p>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-600 text-lg">No tasks pending review</p>
          <p className="text-gray-500 text-sm mt-2">
            Process a meeting transcript to generate tasks for review
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {suggestion.type}
                    </span>
                    <span className="text-sm text-gray-600">
                      AI Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {suggestion.payload?.title || suggestion.suggestion_type}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {suggestion.payload?.assignee_id && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                          👤 Assignee ID: {suggestion.payload.assignee_id}
                        </span>
                      )}
                      {suggestion.payload?.priority && (
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">
                          Priority: {suggestion.payload.priority}
                        </span>
                      )}
                      {suggestion.payload?.effort_tag && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                          Effort: {suggestion.payload.effort_tag}
                        </span>
                      )}
                    </div>
                    {suggestion.payload?.description && (
                      <p className="text-gray-600 text-sm mt-2">{suggestion.payload.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleApprove(suggestion.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleEdit(suggestion.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleReject(suggestion.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 whitespace-nowrap"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p className="text-yellow-800">
          💡 <strong>Tip:</strong> Review each task carefully. You can edit details before approving or reject tasks that don't seem accurate.
        </p>
      </div>
    </div>
  );
}
