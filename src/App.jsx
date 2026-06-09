// =============================================
// Entre Amigos — App.jsx
// Phase 1A: Real auth + roles + admin screen
// =============================================

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

console.log('Supabase URL loaded:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key loaded:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'YES' : 'NO')

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id) }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id) }
      else { setUser(null); setProfile(null); setScreen('landing') }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    console.log('Loading profile for user:', userId)
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) console.log('Profile load error:', error)
    if (data) {
      console.log('Profile loaded:', data)
      setProfile(data)
      if (['owner', 'manager', 'employee'].includes(data.role)) setScreen('admin')
      else setScreen('home')
    }
  }

  async function handleLogin() {
    console.log('Login clicked!', { email })
    setLoading(true); setMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    console.log('Login result:', { data, error })
    if (error) setMessage('Error: ' + error.message)
    setLoading(false)
  }

  async function handleSignup() {
    console.log('Signup clicked!', { email, fullName })
    setLoading(true); setMessage('')
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } }
    })
    console.log('Signup result:', { data, error })
    if (error) setMessage('Error: ' + error.message)
    else setMessage('¡Cuenta creada! Revisa tu correo para confirmar.')
    setLoading(false)
  }

  async function handleLogout() { await supabase.auth.signOut() }

  async function loadAllUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setAllUsers(data)
  }

  useEffect(() => { if (screen === 'admin') loadAllUsers() }, [screen])

  function Logo({ size = 'large' }) {
    const dim = size === 'large' ? 'w-40 h-40' : 'w-20 h-20'
    return (
      <div className={`${dim} mx-auto mb-4`}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#1B3A6B" strokeWidth="3" strokeLinecap="round">
            <line x1="100" y1="10" x2="100" y2="25" />
            <line x1="80" y1="15" x2="86" y2="28" />
            <line x1="120" y1="15" x2="114" y2="28" />
            <line x1="65" y1="25" x2="75" y2="35" />
            <line x1="135" y1="25" x2="125" y2="35" />
          </g>
          <circle cx="70" cy="90" r="45" fill="#C8202F" />
          <polygon points="55,125 50,145 75,130" fill="#C8202F" />
          <circle cx="130" cy="90" r="45" fill="#1F8A4C" />
          <polygon points="145,125 150,145 125,130" fill="#1F8A4C" />
          <circle cx="100" cy="85" r="40" fill="#1B3A6B" />
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
  if (screen === 'landing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#FBF6EC' }}>
        <Logo size="large" />
        <h1 className="text-5xl font-serif font-bold mb-2" style={{ color: '#1B3A6B' }}>entre amigos</h1>
        <div className="text-center mb-10 text-sm font-semibold tracking-wide">
          <span style={{ color: '#C8202F' }}>CONECTAMOS.</span>
          <span className="mx-2" style={{ color: '#1B3A6B' }}>|</span>
          <span style={{ color: '#1F8A4C' }}>APOYAMOS.</span>
          <span className="mx-2" style={{ color: '#1B3A6B' }}>|</span>
          <span style={{ color: '#1B3A6B' }}>CRECEMOS JUNTOS.</span>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-4">
          <button onClick={() => { setScreen('login'); setMessage('') }} className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow-lg" style={{ backgroundColor: '#1B3A6B' }}>
            Iniciar Sesión / Login
          </button>
          <button onClick={() => { setScreen('signup'); setMessage('') }} className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow-lg" style={{ backgroundColor: '#C8202F' }}>
            Crear Cuenta / Sign Up
          </button>
        </div>
        <p className="text-xs mt-10" style={{ color: '#1B3A6B' }}>Hecho con ❤️ para la comunidad Latina</p>
      </div>
    )
  }

  if (screen === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#FBF6EC' }}>
        <div className="w-full max-w-sm">
          <Logo size="small" />
          <h2 className="text-3xl font-serif font-bold mb-1 text-center" style={{ color: '#1B3A6B' }}>Bienvenido</h2>
          <p className="text-gray-500 mb-8 text-center">Welcome back</p>
          <div className="mb-4">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Correo / Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@email.com" className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none" style={{ borderColor: '#1B3A6B' }} />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Contraseña / Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none" style={{ borderColor: '#1B3A6B' }} />
          </div>
          {message && <p className="mb-4 text-sm text-center" style={{ color: '#C8202F' }}>{message}</p>}
          <button onClick={handleLogin} disabled={loading} className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow" style={{ backgroundColor: '#1B3A6B' }}>
            {loading ? 'Cargando...' : 'Entrar / Login'}
          </button>
          <button onClick={() => setScreen('landing')} className="w-full text-center mt-4 text-sm" style={{ color: '#C8202F' }}>← Regresar / Back</button>
        </div>
      </div>
    )
  }

  if (screen === 'signup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#FBF6EC' }}>
        <div className="w-full max-w-sm">
          <Logo size="small" />
          <h2 className="text-3xl font-serif font-bold mb-1 text-center" style={{ color: '#1B3A6B' }}>Crear Cuenta</h2>
          <p className="text-gray-500 mb-8 text-center">Create your account</p>
          <div className="mb-4">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Nombre / Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Tu nombre" className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none" style={{ borderColor: '#1B3A6B' }} />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Correo / Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@email.com" className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none" style={{ borderColor: '#1B3A6B' }} />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-1" style={{ color: '#1B3A6B' }}>Contraseña / Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none" style={{ borderColor: '#1B3A6B' }} />
          </div>
          {message && <p className="mb-4 text-sm text-center" style={{ color: message.startsWith('Error') ? '#C8202F' : '#1F8A4C' }}>{message}</p>}
          <button onClick={handleSignup} disabled={loading} className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow" style={{ backgroundColor: '#C8202F' }}>
            {loading ? 'Cargando...' : 'Crear Cuenta / Sign Up'}
          </button>
          <button onClick={() => setScreen('landing')} className="w-full text-center mt-4 text-sm" style={{ color: '#1B3A6B' }}>← Regresar / Back</button>
        </div>
      </div>
    )
  }
  if (screen === 'admin') {
    return (
      <div className="min-h-screen px-6 py-8" style={{ backgroundColor: '#FBF6EC' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold" style={{ color: '#1B3A6B' }}>Panel de Administración</h2>
            <p className="text-sm text-gray-500">Hola, {profile?.full_name || profile?.email} ({profile?.role})</p>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold" style={{ color: '#C8202F' }}>Salir / Logout</button>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>Usuarios ({allUsers.length})</h3>
          {allUsers.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay usuarios todavía.</p>
          ) : (
            <div className="space-y-2">
              {allUsers.map((u) => (
                <div key={u.id} className="border rounded-xl p-3 flex justify-between items-center" style={{ borderColor: '#1B3A6B' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#1B3A6B' }}>{u.full_name || '(sin nombre)'}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: u.role === 'owner' ? '#C8202F' : u.role === 'vendor' ? '#1F8A4C' : '#1B3A6B' }}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-center mt-8" style={{ color: '#1B3A6B' }}>Próximamente: invitar usuarios</p>
      </div>
    )
  }

  if (screen === 'home') {
    return (
      <div className="min-h-screen px-6 py-8" style={{ backgroundColor: '#FBF6EC' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold" style={{ color: '#1B3A6B' }}>Hola, {profile?.full_name || 'Amigo'}</h2>
            <p className="text-sm text-gray-500">Rol: {profile?.role}</p>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold" style={{ color: '#C8202F' }}>Salir / Logout</button>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p style={{ color: '#1B3A6B' }}>Bienvenido a Entre Amigos. Pantalla principal en construcción.</p>
        </div>
      </div>
    )
  }
}
