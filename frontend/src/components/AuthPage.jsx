import { useState } from 'react'
import { authApi, saveAuth } from '../api/authApi'

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let res
      if (mode === 'login') {
        res = await authApi.login(form.username, form.password)
      } else {
        if (!form.username || !form.email || !form.password) {
          setError('All fields are required')
          setLoading(false)
          return
        }
        res = await authApi.register(form.username, form.email, form.password)
      }

      const { token, username, email } = res.data
      saveAuth(token, username, email)
      onAuthSuccess(username)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">
            Todo Microservices
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-6">

          {/* Tab switcher */}
          <div className="flex rounded-xl overflow-hidden border border-zinc-800 mb-6">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2.5 text-sm font-medium transition-all duration-150 ${
                mode === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 py-2.5 text-sm font-medium transition-all duration-150 ${
                mode === 'register'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Username
              </label>
              <input
                className="input-field"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Email — only on register */}
            {mode === 'register' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Email
                </label>
                <input
                  className="input-field"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                className="input-field"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-zinc-600 mt-6 font-mono">
          Spring Boot · Eureka · JWT · MySQL
        </p>
      </div>
    </div>
  )
}
