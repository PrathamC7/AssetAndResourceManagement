import React, { useState } from 'react';

export function LoginScreen({ onNavigate, user, onAction }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (typeof onAction === 'function') {
        if (isSignup) {
          await onAction('signup', { name, email, password });
        } else {
          await onAction('submit', { email, password });
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto p-6">
      {/* Login Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-[0_12px_30px_rgba(0,0,0,0.04)] flex flex-col text-slate-800">
        
        {/* Logo Branding */}
        <div className="flex justify-center mb-3">
          <img src="/logo_full.png" alt="AssetFlow Logo" className="h-28 w-auto object-contain" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold">
            {error}
          </div>
        )}

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          {/* Name input (signup only) */}
          {isSignup && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block" htmlFor="name">
                Full Name
              </label>
              <input
                className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-slate-500 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none"
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-slate-500 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none"
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-slate-500 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none"
              id="password"
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isSignup && (
              <div className="text-right">
                <a className="text-xs font-medium text-slate-500 hover:underline" href="#">
                  Forgot password
                </a>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-all text-sm cursor-pointer shadow-sm disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>

          <hr className="border-slate-200 my-2.5" />

          {/* Toggle between login/signup */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-medium text-center">
              {isSignup ? 'Already have an account?' : 'New here?'}
            </div>
            {!isSignup && (
              <div className="w-full border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-600 bg-slate-50/50 leading-relaxed">
                Sign up creates an employee account admin roles assigned later
              </div>
            )}
            <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-all text-sm cursor-pointer border border-slate-300"
            >
              {isSignup ? 'Back to Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
