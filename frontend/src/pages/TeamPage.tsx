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
  // const [showAddModal, setShowAddModal] = useState(false); // Unused for now

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end border-b border-[var(--color-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Team Management</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">Manage team members and their assignments</p>
        </div>
        {/* <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          Add Team Member
        </button> */}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Total Members</h3>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{teamMembers.length}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Active Tasks</h3>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{teamMembers.reduce((sum, m) => sum + m.tasks, 0)}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Completed</h3>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{teamMembers.reduce((sum, m) => sum + m.completed, 0)}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Avg. Load</h3>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{(teamMembers.reduce((sum, m) => sum + m.tasks, 0) / teamMembers.length).toFixed(1)}</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="card overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Active Tasks</th>
              <th className="px-6 py-3 font-medium">Completed</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                  {member.name}
                </td>
                <td className="px-6 py-4">
                  <span className="badge badge-neutral">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                  {member.email}
                </td>
                <td className="px-6 py-4 text-[var(--color-text-primary)]">
                  {member.tasks}
                </td>
                <td className="px-6 py-4 text-[var(--color-text-primary)]">
                  {member.completed}
                </td>
                <td className="px-6 py-4">
                  <span className="badge badge-success">
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="text-[var(--color-accent)] hover:underline mr-3 font-medium"
                  >
                    View
                  </button>
                  <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{selectedMember.name}</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong className="text-[var(--color-text-secondary)]">Role:</strong> {selectedMember.role}</p>
              <p><strong className="text-[var(--color-text-secondary)]">Email:</strong> {selectedMember.email}</p>
              <p><strong className="text-[var(--color-text-secondary)]">Active Tasks:</strong> {selectedMember.tasks}</p>
              <p><strong className="text-[var(--color-text-secondary)]">Completed Tasks:</strong> {selectedMember.completed}</p>
              <p><strong className="text-[var(--color-text-secondary)]">Status:</strong> <span className="text-green-600">{selectedMember.status}</span></p>
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 btn btn-primary">
                Assign Task
              </button>
              <button className="flex-1 btn btn-secondary">
                View Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
