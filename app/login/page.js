"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      alert('Login successful!');
      setErrorMessage('');
      router.push('/homepage'); // Navigate to homepage
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">LOGIN/REGISTER</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="username" className="login-input-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="login-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="login-input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            Login Now
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <div className="mt-6">
          <button className="social-login-button google-button">
            Login with Google
          </button>
        </div>
        <div className="mt-4">
          <button className="social-login-button github-button">
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
