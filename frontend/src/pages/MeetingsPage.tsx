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
        { description: 'Complete safety inspection by Friday', assignee: 'John', priority: 9, effort_tag: 'medium', confidence: 0.92, is_blocked: false },
        { description: 'Order new equipment from supplier', assignee: 'Sarah', priority: 7, effort_tag: 'small', confidence: 0.85, is_blocked: false },
        { description: 'Schedule team training session', assignee: 'Mike', priority: 6, effort_tag: 'medium', confidence: 0.78, is_blocked: false },
      ];
      setCandidates(extracted);
      setShowResults(true);
      setProcessing(false);
    }, 1500);
  };

  const useSample = () => {
    setTitle('Weekly Operations Meeting');
    setTranscript(`Team Lead: Good morning everyone. Let's review this week's priorities.

John: I will complete the safety inspection by Friday. It's critical for compliance.

Sarah: I need to order new equipment from our supplier. The current tools are worn out.

Mike: I'll schedule the team training session for next month. We need to cover the new procedures.

Team Lead: Great. John, make sure the inspection is thorough. Sarah, get quotes from at least two suppliers. Mike, coordinate with HR on the training dates.

John: Will do. I'll also document any issues I find.

Sarah: I'll have the quotes ready by Wednesday.

Mike: I'll send out a calendar invite once I confirm with HR.`);
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
              placeholder="e.g., Weekly Operations Meeting"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Transcript</label>
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
              {processing ? 'Processing...' : '🤖 Extract Tasks with AI'}
            </button>
            <button
              onClick={useSample}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Use Sample Transcript
            </button>
          </div>
        </div>
      </div>

      {showResults && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            ✨ AI Extracted Tasks ({candidates.length})
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ Tasks have been extracted. Go to the <strong>Review Tasks</strong> page to approve them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
