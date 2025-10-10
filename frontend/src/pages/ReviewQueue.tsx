import { useState } from 'react';

const initialSuggestions = [
  {
    id: 1,
    suggestion_type: 'create_task',
    confidence: 0.92,
    payload: { title: 'Implement OAuth2 login', assignee: 'dev1', priority: 9, effort_tag: 'large' }
  },
  {
    id: 2,
    suggestion_type: 'split_task',
    confidence: 0.78,
    payload: {
      subtasks: [
        { title: 'Refactor API endpoints - Part 1', description: 'User endpoints' },
        { title: 'Refactor API endpoints - Part 2', description: 'Task endpoints' }
      ]
    }
  },
  {
    id: 3,
    suggestion_type: 'set_focus_time',
    confidence: 0.88,
    payload: { task_id: 2, focus_time: 4 }
  },
];

export default function ReviewQueue() {
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  const handleApprove = (suggestionId: number) => {
    alert('Task approved and created!');
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  const handleReject = (suggestionId: number) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  const runSuggestions = () => {
    alert('Suggestion engine ran successfully!');
    setSuggestions([...suggestions, {
      id: Date.now(),
      suggestion_type: 'create_task',
      confidence: 0.85,
      payload: { title: 'New AI-generated task', assignee: 'dev1', priority: 6, effort_tag: 'medium' }
    }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Review Queue</h1>
        <button
          onClick={runSuggestions}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          🤖 Run Suggestion Engine
        </button>
      </div>

      {suggestions.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-600 text-lg">No suggestions pending review</p>
          <p className="text-gray-500 text-sm mt-2">
            Process a meeting or run the suggestion engine to generate suggestions
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {suggestion.suggestion_type.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  {suggestion.suggestion_type === 'create_task' && (
                    <div>
                      <p className="font-medium text-lg text-gray-800 mb-2">
                        {suggestion.payload.title || suggestion.payload.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {suggestion.payload.assignee && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            👤 {suggestion.payload.assignee}
                          </span>
                        )}
                        {suggestion.payload.priority && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Priority: {suggestion.payload.priority}
                          </span>
                        )}
                        {suggestion.payload.effort_tag && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {suggestion.payload.effort_tag}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {suggestion.suggestion_type === 'split_task' && (
                    <div>
                      <p className="font-medium text-gray-800 mb-2">
                        Split task into {suggestion.payload.subtasks?.length} subtasks
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {suggestion.payload.subtasks?.map((sub: any, idx: number) => (
                          <li key={idx}>{sub.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestion.suggestion_type === 'set_focus_time' && (
                    <div>
                      <p className="font-medium text-gray-800">
                        Set focus time: {suggestion.payload.focus_time} hours
                      </p>
                      <p className="text-sm text-gray-600">Task ID: {suggestion.payload.task_id}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(suggestion.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(suggestion.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
