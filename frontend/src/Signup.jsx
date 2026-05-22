import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import { api } from './services/api'
import { toast } from 'react-toastify'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAppContext()
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    const form = e.target
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { user } = await api.signup({
        name: form.name.value,
        email: form.email.value,
        password,
        phone: form.phone?.value || '',
      })
      login(user)
      navigate('/home')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-5 box-border">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 shadow-xl animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h2 className="m-0 mb-2 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Create Account</h2>
          <p className="m-0 text-slate-500 dark:text-slate-400 text-sm">Join us today</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSignup}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" required
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Mail ID</label>
            <input type="email" id="email" name="email" placeholder="Enter your mail ID" required
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone (optional)</label>
            <input type="tel" id="phone" name="phone" placeholder="+91 98765 43210"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Enter Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400" />
          </div>
          <button type="submit" disabled={loading} className="mt-2.5 p-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Signup'}
          </button>
          <p className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400">
            Already have an account? <span onClick={() => navigate('/login')} className="text-indigo-600 font-semibold cursor-pointer hover:underline">Sign in</span>
          </p>
        </form>
      </div>
      
    </div>
  )
}
