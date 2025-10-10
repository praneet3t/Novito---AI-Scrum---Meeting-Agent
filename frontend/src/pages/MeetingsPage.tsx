import { useState } from 'react';

export default function MeetingsPage() {
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [processing, setProcessing] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleProcess = () => {
    if (!title || !transcript) {
      alert('Please enter title and transcript');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      const extracted = [
        { description: 'Implement OAuth2 login', assignee: 'dev1', priority: 9, effort_tag: 'large', confidence: 0.92, is_blocked: false },
        { description: 'Write test cases for login flow', assignee: 'qa1', priority: 7, effort_tag: 'medium', confidence: 0.85, is_blocked: false },
      ];
      setCandidates(extracted);
      setShowResults(true);
      setProcessing(false);
    }, 1000);
  };

  const useSample = () => {
    setTitle('Daily Standup');
    setTranscript(`Dev1: I will continue working on OAuth2 login. I'm 60% done. Should be ready by Friday.
QA1: I'll start writing test cases for the login flow once Dev1 finishes. This depends on Dev1 completing the implementation.
PO: Great progress. Dev1, is anything blocking you?
Dev1: No blockers right now.
QA1: I also need to update the test automation framework. That's a large task, probably 8 hours of work.`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Process Meeting</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Daily Standup"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transcript</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste meeting transcript here..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleProcess}
              disabled={processing}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {processing ? 'Processing...' : '🤖 Process with AI'}
            </button>
            <button
              onClick={useSample}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Use Sample
            </button>
          </div>
        </div>
      </div>

      {showResults && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Extracted Tasks ({candidates.length})
          </h2>
          
          {candidates.length === 0 ? (
            <p className="text-gray-600">No tasks found in transcript.</p>
          ) : (
            <div className="space-y-3">
              {candidates.map((candidate, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{candidate.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        {candidate.assignee && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            👤 {candidate.assignee}
                          </span>
                        )}
                        {candidate.priority && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Priority: {candidate.priority}
                          </span>
                        )}
                        {candidate.effort_tag && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {candidate.effort_tag}
                          </span>
                        )}
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Confidence: {(candidate.confidence * 100).toFixed(0)}%
                        </span>
                        {candidate.is_blocked && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                            🚫 Blocked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ Tasks have been added to the Review Queue. Go to the Review page to approve them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
