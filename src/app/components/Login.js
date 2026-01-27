export default function Login({ name, setName, onLogin }) {
  return (
    <main className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded w-80 space-y-3">
        <h2 className="text-xl font-bold text-white">Login</h2>
        <input
          className="w-full border border-gray-400 p-2 rounded text-white"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={onLogin}
          className="bg-blue-600 w-full p-2 rounded text-white"
        >
          Enter Chat
        </button>
      </div>
    </main>
  );
}
