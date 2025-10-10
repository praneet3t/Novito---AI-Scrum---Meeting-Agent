import { useState } from 'react';

const initialSuggestions = [
  {
    id: 1,
    type: 'AI Extracted Task',
    confidence: 0.92,
    task: { title: 'Complete safety inspection by Friday', assignee: 'John', priority: 9, effort: 'medium' }
  },
  {
    id: 2,
    type: 'AI Extracted Task',
    confidence: 0.85,
    task: { title: 'Order new equipment from supplier', assignee: 'Sarah', priority: 7, effort: 'small' }
  },
  {
    id: 3,
    type: 'AI Extracted Task',
    confidence: 0.78,
    task: { title: 'Schedule team training session', assignee: 'Mike', priority: 6, effort: 'medium' }
  },
];

export default function ReviewQueue() {
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  const handleApprove = (suggestionId: number) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    alert(`✅ Task approved: "${suggestion?.task.title}"\n\nTask has been created and assigned to ${suggestion?.task.assignee}`);
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  const handleReject = (suggestionId: number) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  const handleEdit = (suggestionId: number) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    alert(`Edit functionality would open a modal to modify:\n\n${JSON.stringify(suggestion?.task, null, 2)}`);
  };

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
                      {suggestion.task.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                        👤 Assignee: {suggestion.task.assignee}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">
                        Priority: {suggestion.task.priority}/10
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                        Effort: {suggestion.task.effort}
                      </span>
                    </div>
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
