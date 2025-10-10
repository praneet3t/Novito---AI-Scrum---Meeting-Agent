import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: any;
  type?: string;
}

export default function ChatAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello. I can help you analyze your workspace data. Ask me about overdue tasks, blockers, velocity, workload, risks, or any other metrics.',
      type: 'info'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    'What tasks are overdue?',
    'Show me blocked tasks',
    'What is our sprint velocity?',
    'Who is overloaded?',
    'What tasks are at risk?',
    'How many tasks are completed?'
  ];

  const handleSend = async (question?: string) => {
    const query = question || input;
    if (!query.trim()) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/chat/query?question=${encodeURIComponent(query)}&workspace_id=1`, {
        method: 'POST'
      });
      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        data: data.data,
        type: data.type
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Failed to process query. Please try again.',
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'alert': return 'border-l-4 border-red-500 bg-red-50';
      case 'warning': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'success': return 'border-l-4 border-green-500 bg-green-50';
      default: return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Intelligence Agent</h1>
        <p className="text-gray-600 mt-1">Natural language interface to your workspace data</p>
      </div>

      {/* Quick Questions */}
      <div className="mb-4 flex flex-wrap gap-2">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`${msg.role === 'user' ? 'ml-auto max-w-2xl' : 'mr-auto max-w-3xl'}`}>
            {msg.role === 'user' ? (
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2.5">
                <p className="text-sm">{msg.content}</p>
              </div>
            ) : (
              <div className={`rounded-lg px-4 py-3 ${getTypeColor(msg.type)}`}>
                <p className="text-sm text-gray-800 leading-relaxed">{msg.content}</p>
                {msg.data && Array.isArray(msg.data) && msg.data.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.data.slice(0, 5).map((item: any, i: number) => (
                      <div key={i} className="bg-white rounded px-3 py-2 text-xs">
                        <div className="font-medium text-gray-900">{item.title || item.name}</div>
                        {item.priority && <span className="text-gray-600">Priority: {item.priority}</span>}
                        {item.reason && <span className="text-gray-600">{item.reason}</span>}
                        {item.tasks && <span className="text-gray-600">{item.tasks} tasks</span>}
                      </div>
                    ))}
                  </div>
                )}
                {msg.data && !Array.isArray(msg.data) && Object.keys(msg.data).length > 0 && (
                  <div className="mt-3 bg-white rounded px-3 py-2 text-xs space-y-1">
                    {Object.entries(msg.data).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-700">{key}: </span>
                        <span className="text-gray-600">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="loading-spinner"></div>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your workspace..."
          className="flex-1 input-field"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
