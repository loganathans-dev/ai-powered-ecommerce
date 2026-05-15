import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { api } from '../services/api'
import { toast } from 'react-toastify'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { adminLogin } = useAppContext()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    const form = e.target
    const username = form.adminId.value
    const password = form.password.value

    setLoading(true)
    try {
      await api.adminLogin(username, password)
      adminLogin()
      navigate('/admin')
    } catch (err) {
      toast.error(err.message || 'Admin login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-5 box-border bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-500">
            <span className="text-2xl text-indigo-400">🛡️</span>
          </div>
          <h2 className="m-0 mb-2 text-2xl font-bold text-white">Admin Portal</h2>
          <p className="m-0 text-slate-400 text-sm">Secure access required</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label htmlFor="adminId" className="text-sm font-medium text-slate-300">Admin ID</label>
            <input type="text" id="adminId" name="adminId" placeholder="Enter admin ID" required defaultValue="admin"
              className="p-3.5 rounded-xl border border-slate-700 bg-slate-900 text-white transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter password" required defaultValue="admin123"
              className="p-3.5 rounded-xl border border-slate-700 bg-slate-900 text-white transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" disabled={loading} className="mt-2.5 p-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Access Dashboard'}
          </button>

          <div className="text-center mt-4">
            <span onClick={() => navigate('/login')} className="text-sm text-slate-400 hover:text-white cursor-pointer transition-colors">
              Return to Customer Login
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
