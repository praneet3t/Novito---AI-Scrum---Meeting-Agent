import { useState } from 'react';

const allTasks = [
  { id: 1, title: 'Complete safety inspection', description: 'Thorough inspection required for compliance', status: 'in_progress', assignee: 'John', priority: 9, progress: 60 },
  { id: 2, title: 'Order new equipment', description: 'Get quotes from suppliers', status: 'todo', assignee: 'Sarah', priority: 7, progress: 0 },
  { id: 3, title: 'Schedule team training', description: 'Coordinate with HR for training dates', status: 'todo', assignee: 'Mike', priority: 6, progress: 0 },
  { id: 4, title: 'Update client report', description: 'Quarterly progress report', status: 'done', assignee: 'Manager', priority: 8, progress: 100 },
  { id: 5, title: 'Review budget allocation', description: 'Q2 budget review', status: 'in_progress', assignee: 'Manager', priority: 10, progress: 40 },
  { id: 6, title: 'Prepare presentation', description: 'Board meeting presentation', status: 'todo', assignee: 'Admin', priority: 9, progress: 0 },
];

export default function TasksPage() {
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [tasks, setTasks] = useState(allTasks);
  const [user] = useState(localStorage.getItem('token') || 'admin');

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const displayTasks = user === 'admin' ? filteredTasks : filteredTasks.filter(t => t.assignee.toLowerCase() === user);

  const handleUpdateProgress = (taskId: number, progress: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, progress } : t));
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, progress });
    }
  };

  const handleUpdateStatus = (taskId: number, status: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status, progress: status === 'done' ? 100 : t.progress } : t));
    setSelectedTask(null);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {user === 'admin' ? 'All Tasks' : 'My Tasks'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user === 'admin' ? 'Manage all team tasks' : 'View and update your assigned tasks'}
          </p>
        </div>
        <div className="flex space-x-2">
          {['all', 'todo', 'in_progress', 'done'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {displayTasks.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-600">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Priority: {task.priority}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      👤 {task.assignee}
                    </span>
                  </div>

                  {task.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedTask.title}</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 mb-4">{selectedTask.description}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress: {selectedTask.progress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedTask.progress}
                    onChange={(e) => handleUpdateProgress(selectedTask.id, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleUpdateStatus(selectedTask.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Assigned to:</strong> {selectedTask.assignee}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Priority:</strong> {selectedTask.priority}/10
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
