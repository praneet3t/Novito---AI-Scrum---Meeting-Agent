import { useState } from 'react';

const teamMembers = [
  { id: 1, name: 'John Smith', role: 'Team Member', tasks: 3, completed: 24, email: 'john@company.com', status: 'active' },
  { id: 2, name: 'Sarah Johnson', role: 'Team Member', tasks: 5, completed: 18, email: 'sarah@company.com', status: 'active' },
  { id: 3, name: 'Mike Wilson', role: 'Team Member', tasks: 2, completed: 21, email: 'mike@company.com', status: 'active' },
  { id: 4, name: 'Emily Davis', role: 'Manager', tasks: 4, completed: 19, email: 'emily@company.com', status: 'active' },
  { id: 5, name: 'Robert Brown', role: 'Team Member', tasks: 6, completed: 15, email: 'robert@company.com', status: 'active' },
];

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage team members and their assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Team Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Members</h3>
          <p className="text-3xl font-bold text-blue-600">{teamMembers.length}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Active Tasks</h3>
          <p className="text-3xl font-bold text-green-600">{teamMembers.reduce((sum, m) => sum + m.tasks, 0)}</p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Completed</h3>
          <p className="text-3xl font-bold text-purple-600">{teamMembers.reduce((sum, m) => sum + m.completed, 0)}</p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Avg. Load</h3>
          <p className="text-3xl font-bold text-yellow-600">{(teamMembers.reduce((sum, m) => sum + m.tasks, 0) / teamMembers.length).toFixed(1)}</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Tasks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.tasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.completed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedMember.name}</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p><strong>Role:</strong> {selectedMember.role}</p>
              <p><strong>Email:</strong> {selectedMember.email}</p>
              <p><strong>Active Tasks:</strong> {selectedMember.tasks}</p>
              <p><strong>Completed Tasks:</strong> {selectedMember.completed}</p>
              <p><strong>Status:</strong> <span className="text-green-600">{selectedMember.status}</span></p>
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Assign Task
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                View Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
