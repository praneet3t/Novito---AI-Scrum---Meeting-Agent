import { useState, useEffect } from 'react';

interface Suggestion {
  id: number;
  type: string;
  confidence: number;
  payload: any;
  suggestion_type?: string;
}

export default function ReviewQueue() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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
      alert('Task created successfully');
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
    return <div className="text-center py-12 text-[var(--color-text-secondary)]">Loading suggestions...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end border-b border-[var(--color-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Review Queue</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">Review AI-extracted tasks before assignment.</p>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4 text-[var(--color-text-tertiary)]">✓</div>
          <p className="text-[var(--color-text-primary)] text-lg font-medium">All caught up</p>
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">
            No pending suggestions to review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="card p-6 hover:border-[var(--color-text-secondary)] transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="badge badge-primary">
                      {suggestion.type}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-2">
                      {suggestion.payload?.title || suggestion.suggestion_type}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {suggestion.payload?.assignee_id && (
                        <span className="badge badge-neutral">
                          Assignee: {suggestion.payload.assignee_id}
                        </span>
                      )}
                      {suggestion.payload?.priority && (
                        <span className="badge badge-warning">
                          Priority: {suggestion.payload.priority}
                        </span>
                      )}
                      {suggestion.payload?.effort_tag && (
                        <span className="badge badge-info">
                          Effort: {suggestion.payload.effort_tag}
                        </span>
                      )}
                    </div>
                    {suggestion.payload?.description && (
                      <p className="text-[var(--color-text-secondary)] text-sm mt-3 leading-relaxed">{suggestion.payload.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => handleApprove(suggestion.id)}
                    className="btn btn-primary w-24"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleEdit(suggestion.id)}
                    className="btn btn-secondary w-24"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleReject(suggestion.id)}
                    className="btn btn-secondary w-24 text-red-600 hover:bg-red-50 hover:border-red-200"
                  >
                    Reject
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
