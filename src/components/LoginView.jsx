import { useState } from 'react';

export default function LoginView({ onLogin, modeLabel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const result = await onLogin(email, password);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <img src="/dld-logo.png" alt="DLD logo" className="login-logo" />
        <h1>DLD Members Directory</h1>
        <p className="muted">
          Private member access. {modeLabel}
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Log in</button>
        </form>
        <div className="login-note">
          Demo admin: <code>admin@dld.local</code> / <code>dld12345</code>
        </div>
      </div>
    </div>
  );
}