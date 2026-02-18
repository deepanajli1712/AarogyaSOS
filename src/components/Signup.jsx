import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Logo } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { User, Mail, Lock, Phone, Heart, Calendar, Eye, EyeOff } from 'lucide-react'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const create = async (data) => {
    setError('')
    setLoading(true)
    try {
      const userData = await authService.createAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      if (userData) {
        // Store extra profile fields in localStorage so Settings can read them
        const profile = {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          bloodGroup: data.bloodGroup || 'O+',
          dob: data.dob || '',
        }
        localStorage.setItem('aarogya_profile', JSON.stringify(profile))

        const currentUser = await authService.getCurrentUser()
        if (currentUser) dispatch(login({ userData: currentUser }))
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center w-full px-4 min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <div className="mx-auto w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/30">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <span className="font-black text-2xl text-white">Aarogya SOS</span>
        </div>

        <h2 className="text-center text-xl font-bold text-white mb-1">Create your account</h2>
        <p className="text-center text-sm text-white/60 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-300 hover:text-white font-medium transition">
            Sign In
          </Link>
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(create)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Arjun Sharma"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                {...register('name', { required: 'Full name is required' })}
              />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message: 'Invalid email' },
                })}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone + Blood Group */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  {...register('phone')}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Blood Group</label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent appearance-none"
                  {...register('bloodGroup')}
                >
                  {BLOOD_GROUPS.map((g) => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="date"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent [color-scheme:dark]"
                {...register('dob')}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-red-900/30 disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup
