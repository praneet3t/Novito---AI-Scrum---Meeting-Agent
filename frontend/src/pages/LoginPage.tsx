interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const quickLogin = (user: string) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Novito</h1>
        <p className="text-center text-gray-600 mb-6">AI Meeting Assistant & Task Manager</p>
        <p className="text-center text-gray-700 mb-6 font-medium">Select Your Role:</p>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => quickLogin('admin')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium"
          >
            👤 Administrator
          </button>
          <button
            onClick={() => quickLogin('manager')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium"
          >
            📊 Manager
          </button>
          <button
            onClick={() => quickLogin('member')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
          >
            ✅ Team Member
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Demo Mode - Works for any organization: Healthcare, Construction, Education, Ocean Services, and more
          </p>
        </div>
      </div>
    </div>
  );
}
