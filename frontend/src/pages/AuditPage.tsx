import { useState, useEffect } from 'react';

export default function AuditPage() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await fetch('http://localhost:8000/audits/?workspace_id=1&limit=50');
      const data = await response.json();
      setAudits(data);
    } catch (error) {
      console.error('Failed to fetch audits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async (auditId: number) => {
    if (!confirm('Are you sure you want to undo this action?')) return;
    
    try {
      await fetch(`http://localhost:8000/audits/${auditId}/undo`, {
        method: 'POST'
      });
      alert('✅ Action undone');
      fetchAudits();
    } catch (error) {
      alert('Failed to undo action');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="text-center py-12">Loading audit trail...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Audit Trail</h1>
        <p className="text-gray-600 mt-1">Track all agent actions and changes</p>
      </div>

      {audits.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-600">No audit records found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {audits.map((audit: any) => (
                <tr key={audit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(audit.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                      {audit.action_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {audit.target_type} #{audit.target_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {audit.actor_id ? `User ${audit.actor_id}` : 'Nova (Auto)'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {audit.before && (
                      <button
                        onClick={() => handleUndo(audit.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ↶ Undo
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
