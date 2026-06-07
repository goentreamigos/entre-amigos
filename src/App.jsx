// =============================================
// Entre Amigos — App.jsx
// Main app file — all screens live here
// Current: Landing screen with login/signup
// =============================================

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// ---- Supabase connection ----
// These values come from your .env file
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App() {
  // Track which screen we're on
  const [screen, setScreen] = useState('landing')

  // ---- LANDING SCREEN ----
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-blue-700 flex flex-col items-center justify-center px-6">

        {/* Logo / App name */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-2">Entre Amigos</h1>
          <p className="text-blue-200 text-lg">Tu comunidad, un solo lugar</p>
          <p className="text-blue-300 text-sm mt-1">Your community, one place</p>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-4">

          {/* Login button */}
          <button
            onClick={() => setScreen('login')}
            className="w-full bg-white text-blue-700 font-bold py-4 rounded-2xl text-lg shadow-lg"
          >
            Iniciar Sesión / Login
          </button>

          {/* Sign up button */}
          <button
            onClick={() => setScreen('signup')}
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg border border-blue-300"
          >
            Crear Cuenta / Sign Up
          </button>

        </div>

        {/* Footer */}
        <p className="text-blue-300 text-xs mt-10">
          Hecho con ❤️ para la comunidad Latina
        </p>

      </div>
    )
  }

  // ---- LOGIN SCREEN ----
  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">

        <div className="w-full max-w
