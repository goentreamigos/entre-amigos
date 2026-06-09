// =============================================
// Entre Amigos — App.jsx
// Main app file — all screens live here
// Theme: Navy, Red, Green on Cream background
// =============================================

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// ---- Supabase connection ----
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ---- Brand colors (from logo) ----
// Navy: #1B3A6B   Red: #C8202F   Green: #1F8A4C   Cream: #FBF6EC

export default function App() {
  const [screen, setScreen] = useState('landing')

  // ---- LOGO COMPONENT ----
  // Reusable logo: three speech bubbles with people
  function Logo({ size = 'large' }) {
    const dim = size === 'large' ? 'w-40 h-40' : 'w-20 h-20'
    return (
      <div className={`${dim} mx-auto mb-4`}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Sparkle lines on top */}
          <g stroke="#1B3A6B" strokeWidth="3" strokeLinecap="round">
            <line x1="100" y1="10" x2="100" y2="25" />
            <line x1="80" y1="15" x2="86" y2="28" />
            <line x1="120" y1="15" x2="114" y2="28" />
            <line x1="65" y1="25" x2="75" y2="35" />
            <line x1="135" y1="25" x2="125" y2="35" />
          </g>
          {/* Red speech bubble (left) */}
          <circle cx="70" cy="90" r="45" fill="#C8202F" />
          <polygon points="55,125 50,145 75,130" fill="#C8202F" />
          {/* Green speech bubble (right) */}
          <circle cx="130" cy="90" r="45" fill="#1F8A4C" />
          <polygon points="145,125 150,145 125,130" fill="#1F8A4C" />
          {/* Navy speech bubble (center) */}
          <circle cx="100" cy="85" r="40" fill="#1B3A6B" />
          {/* Three people figures (cream) */}
          <circle cx="70" cy="85" r="8" fill="#FBF6EC" />
          <path d="M 55 110 Q 70 95 85 110 L 85 125 L 55 125 Z" fill="#FBF6EC" />
          <circle cx="130" cy="85" r="8" fill="#FBF6EC" />
          <path d="M 115 110 Q 130 95 145 110 L 145 125 L 115 125 Z" fill="#FBF6EC" />
          <circle cx="100" cy="78" r="9" fill="#FBF6EC" />
          <path d="M 83 108 Q 100 90 117 108 L 117 125 L 83 125 Z" fill="#FBF6EC" />
        </svg>
      </div>
    )
  }

  // ---- LANDING SCREEN ----
  if (screen === 'landing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#FBF6EC' }}>
        {/* Logo */}
        <Logo size="large" />

        {/* Wordmark */}
        <h1 className="text-5xl font-serif font-bold mb-2" style={{ color: '#1B3A6B' }}>
          entre amigos
        </h1>

        {/* Tagline */}
        <div className="text-center mb-10 text-sm font-semibold tracking-wide">
          <span style={{ color: '#C8202F' }}>CONECTAMOS.</span>
          <span className="mx-2" style={{ color: '#1B3A6B' }}>|</span>
          <span style={{ color: '#1F8A4C' }}>APOYAMOS.</span>
          <span className="mx-2" style={{ color: '#1B3A6B' }}>|</span>
          <span style={{ color: '#1B3A6B' }}>CRECEMOS JUNTOS.</span>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-4">
          <button
            onClick={() => setScreen('login')}
            className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow-lg"
            style={{ backgroundColor: '#1B3A6B' }}
          >
            Iniciar Sesión / Login
          </button>
          <button
            onClick={() => setScreen('signup')}
            className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow-lg"
            style={{ backgroundColor: '#C8202F' }}
          >
            Crear Cuenta / Sign Up
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs mt-10" style={{ color: '#1B3A6B' }}>
          Hecho con ❤️ para la comunidad Latina
        </p>
      </div>
    )
  }

  // ---- LOGIN SCREEN ----
  if (screen === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#FBF6EC' }}>
        <div className="w-full max-w-sm">
          <Logo size="small" />
          <h2 className="text-3xl font-serif font-bold mb-1 text-center" style={{ color: '#1B3A6B' }}>Bienvenido</h2>
          <p className="text-gray-500 mb-8 text-center">Welcome back</p>

          <div className="mb-4">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Correo / Email</label>
            <input
              type="email"
              placeholder="tucorreo@email.com"
              className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none"
              style={{ borderColor: '#1B3A6B' }}
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Contraseña / Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none"
              style={{ borderColor: '#1B3A6B' }}
            />
          </div>

          <button className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow" style={{ backgroundColor: '#1B3A6B' }}>
            Entrar / Login
          </button>

          <button onClick={() => setScreen('landing')} className="w-full text-center mt-4 text-sm" style={{ color: '#C8202F' }}>
            ← Regresar / Back
          </button>
        </div>
      </div>
    )
  }

  // ---- SIGNUP SCREEN ----
  if (screen === 'signup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#FBF6EC' }}>
        <div className="w-full max-w-sm">
          <Logo size="small" />
          <h2 className="text-3xl font-serif font-bold mb-1 text-center" style={{ color: '#1B3A6B' }}>Crear Cuenta</h2>
          <p className="text-gray-500 mb-8 text-center">Create your account</p>

          <div className="mb-4">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Nombre / Name</label>
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none"
              style={{ borderColor: '#1B3A6B' }}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Correo / Email</label>
            <input
              type="email"
              placeholder="tucorreo@email.com"
              className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none"
              style={{ borderColor: '#1B3A6B' }}
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Contraseña / Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none"
              style={{ borderColor: '#1B3A6B' }}
            />
          </div>

          <button className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow" style={{ backgroundColor: '#C8202F' }}>
            Crear Cuenta / Sign Up
          </button>

          <button onClick={() => setScreen('landing')} className="w-full text-center mt-4 text-sm" style={{ color: '#1B3A6B' }}>
            ← Regresar / Back
          </button>
        </div>
      </div>
    )
  }
}
