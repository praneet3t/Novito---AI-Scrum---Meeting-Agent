import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [agentMode, setAgentMode] = useState('suggest');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [allowedActions, setAllowedActions] = useState<string[]>(['set_focus_time']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaceSettings();
  }, []);

  const fetchWorkspaceSettings = async () => {
    try {
      const response = await fetch('http://localhost:8000/workspaces/1');
      const data = await response.json();
      setAgentMode(data.agent_mode);
      setConfidenceThreshold(data.agent_config?.auto_confidence_threshold || 0.85);
      setAllowedActions(data.agent_config?.allowed_auto_actions || []);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('http://localhost:8000/workspaces/1/agent-mode', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_mode: agentMode,
          agent_config: {
            auto_confidence_threshold: confidenceThreshold,
            allowed_auto_actions: allowedActions
          }
        })
      });
      alert('✅ Settings saved successfully');
    } catch (error) {
      alert('Failed to save settings');
    }
  };

  const toggleAction = (action: string) => {
    if (allowedActions.includes(action)) {
      setAllowedActions(allowedActions.filter(a => a !== action));
    } else {
      setAllowedActions([...allowedActions, action]);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Workspace Settings</h1>
        <p className="text-gray-600 mt-1">Configure Nova agent behavior and automation</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Mode
          </label>
          <select
            value={agentMode}
            onChange={(e) => setAgentMode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="off">Off - No suggestions</option>
            <option value="suggest">Suggest - Human approval required</option>
            <option value="auto">Auto - Apply high-confidence suggestions</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {agentMode === 'off' && 'Nova will not generate any suggestions'}
            {agentMode === 'suggest' && 'Nova will suggest actions but require human approval'}
            {agentMode === 'auto' && 'Nova will automatically apply high-confidence suggestions'}
          </p>
        </div>

        {agentMode === 'auto' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-Apply Confidence Threshold: {(confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Only suggestions with confidence above this threshold will be auto-applied
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Auto-Actions
              </label>
              <div className="space-y-2">
                {['set_focus_time', 'split_task', 'create_task'].map((action) => (
                  <label key={action} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={allowedActions.includes(action)}
                      onChange={() => toggleAction(action)}
                      className="rounded"
                    />
                    <span className="text-sm">{action.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Select which actions Nova can perform automatically
              </p>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Save Settings
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-800">
          💡 <strong>Tip:</strong> Start with "Suggest" mode to review Nova's suggestions before enabling auto-mode.
        </p>
      </div>
    </div>
  );
}
