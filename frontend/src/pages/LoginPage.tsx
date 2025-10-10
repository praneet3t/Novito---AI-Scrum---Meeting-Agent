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
        <p className="text-center text-gray-600 mb-6">AI Scrum Master & Meeting Agent</p>
        <p className="text-center text-gray-700 mb-6 font-medium">Select Demo Account:</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => quickLogin('admin')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium"
          >
            👤 Admin
          </button>
          <button
            onClick={() => quickLogin('dev1')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
          >
            💻 Developer
          </button>
          <button
            onClick={() => quickLogin('product_owner')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium"
          >
            📋 Product Owner
          </button>
          <button
            onClick={() => quickLogin('qa1')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium"
          >
            🧪 QA Engineer
          </button>
        </div>
      </div>
    </div>
  );
}
