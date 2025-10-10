import { useState } from 'react';

const allTasks = [
  { id: 1, title: 'Implement OAuth2 login', description: 'Add OAuth2 authentication with Google and GitHub', status: 'in_progress', assignee: 'dev1', priority: 9, progress: 60 },
  { id: 2, title: 'Write test cases for login', description: 'Comprehensive test coverage', status: 'todo', assignee: 'qa1', priority: 7, progress: 0 },
  { id: 3, title: 'Design dashboard wireframes', description: 'Create wireframes for analytics', status: 'done', assignee: 'product_owner', priority: 8, progress: 100 },
  { id: 4, title: 'Implement burndown chart', description: 'Build interactive chart', status: 'qa', assignee: 'dev1', priority: 6, progress: 100 },
  { id: 5, title: 'Fix database migration', description: 'Resolve schema conflicts', status: 'in_progress', assignee: 'dev1', priority: 10, progress: 30, blocked: true },
  { id: 6, title: 'Refactor API endpoints', description: 'Large refactoring task', status: 'todo', assignee: 'dev1', priority: 5, progress: 0 },
];

export default function TasksPage() {
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [tasks, setTasks] = useState(allTasks);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const handleUpdateProgress = (taskId: number, progress: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, progress } : t));
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, progress });
    }
  };

  const handleUpdateStatus = (taskId: number, status: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    setSelectedTask(null);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      qa: 'bg-yellow-100 text-yellow-800',
      done: 'bg-green-100 text-green-800',
      released: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <div className="flex space-x-2">
          {['all', 'todo', 'in_progress', 'qa', 'done'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-600">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    {task.is_blocked && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        🚫 Blocked
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.priority && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        P{task.priority}
                      </span>
                    )}
                    {task.effort_tag && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {task.effort_tag}
                      </span>
                    )}
                    {task.story_points && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {task.story_points} pts
                      </span>
                    )}
                  </div>

                  {task.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
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
                  className="text-gray-500 hover:text-gray-700"
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
                    <option value="qa">QA</option>
                    <option value="done">Done</option>
                    <option value="released">Released</option>
                  </select>
                </div>

                {selectedTask.is_blocked && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm font-medium text-red-800">Blocker:</p>
                    <p className="text-sm text-red-700">{selectedTask.blocker_reason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
