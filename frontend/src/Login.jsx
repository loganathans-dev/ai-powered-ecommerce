import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import { api } from './services/api'
import { toast } from 'react-toastify'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAppContext()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    const form = e.target
    const email = form.email.value
    const password = form.password.value

    setLoading(true)
    try {
      const { user } = await api.login(email, password)
      login(user)
      navigate('/home')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-5 box-border bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 shadow-xl animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h2 className="m-0 mb-2 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="m-0 text-slate-500 dark:text-slate-400 text-sm">Sign in to your account</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email ID</label>
            <input type="email" id="email" name="email" placeholder="Enter your email ID" required defaultValue="john.doe@example.com"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required defaultValue="password"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
          </div>
          <button type="submit" disabled={loading} className="mt-2.5 p-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex flex-col gap-2 mt-4 text-center text-sm">
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account? <span onClick={() => navigate('/signup')} className="text-indigo-600 font-semibold cursor-pointer hover:underline">Sign up</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
