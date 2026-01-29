export default function Login({ name, setName, onLogin }) {
  return (
    <main className="h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-80 bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700 space-y-4">
        <h2 className="text-2xl font-bold text-white text-center">Welcome</h2>
        <p className="text-sm text-gray-400 text-center">
          Enter your name to start chatting
        </p>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
          className="space-y-4"
        >
          <input
            className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            disabled={!name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 disabled:cursor-not-allowed py-2 rounded-lg text-white font-semibold transition"
          >
            Enter Chat
          </button>
        </form>
      </div>
    </main>
  );
}
