// =============================================
// Entre Amigos — App.jsx
// Phase 1A complete: Auth + Roles + Admin/Home screens
// Stack: React + Vite + Tailwind + Supabase
// Roles: owner | manager | employee | vendor | customer
// Languages: Spanish (default) | English | Portuguese
// =============================================

import React, { useState, useEffect, createContext, useContext } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ---- Brand colors ----
// Navy: #1B3A6B  Red: #C8202F  Green: #1F8A4C  Cream: #FBF6EC

// ---- Translations ----
const T = {
  es: {
    tagline: 'Conectamos. Apoyamos. Crecemos Juntos.',
    welcomeBack: 'Bienvenido',
    welcomeSub: 'Inicia sesión para continuar',
    email: 'Correo',
    password: 'Contraseña',
    signIn: 'Iniciar Sesión',
    signOut: 'Salir',
    loading: 'Cargando...',
    errGeneric: 'Algo salió mal. Inténtalo de nuevo.',
    inviteOnly: 'Entre Amigos es por invitación. Si te invitaron, usa el enlace que recibiste.',
    goodDay: 'Hola,',
    friend: 'Amigo',
    searchServices: 'Buscar servicios...',
    services: 'Servicios',
    history: 'Historial',
    messages: 'Mensajes',
    profile: 'Perfil',
    active: 'Activos',
    pending: 'Pendiente',
    rating: 'Calificación',
    insurance: 'Seguros', insuranceSub: 'Salud · Auto · Vida',
    doctor: 'Médico', doctorSub: 'Atención cercana',
    buyHome: 'Comprar Casa', buyHomeSub: 'Préstamos · Agentes',
    renting: 'Rentar', rentingSub: 'Apartamentos · Casas',
    mechanic: 'Mecánico', mechanicSub: 'Reparación confiable',
    legal: 'Asesoría Legal', legalSub: 'Inmigración · Derechos',
    banking: 'Banca', bankingSub: 'Cuentas · Envíos',
    education: 'Educación', educationSub: 'Escuelas · ESL · GED',
    adminPanel: 'Panel de Administración',
    vendorPanel: 'Panel del Proveedor',
    users: 'Usuarios',
    noUsers: 'No hay usuarios todavía.',
    comingSoon: 'Próximamente',
  },
  en: {
    tagline: 'We Connect. We Support. We Grow Together.',
    welcomeBack: 'Welcome back',
    welcomeSub: 'Sign in to continue',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    loading: 'Loading...',
    errGeneric: 'Something went wrong. Please try again.',
    inviteOnly: 'Entre Amigos is invite-only. If you were invited, use the link you received.',
    goodDay: 'Hello,',
    friend: 'Friend',
    searchServices: 'Search services...',
    services: 'Services',
    history: 'History',
    messages: 'Messages',
    profile: 'Profile',
    active: 'Active',
    pending: 'Pending',
    rating: 'Rating',
    insurance: 'Insurance', insuranceSub: 'Health · Auto · Life',
    doctor: 'Doctor', doctorSub: 'Find care near you',
    buyHome: 'Buy a Home', buyHomeSub: 'Loans · Agents',
    renting: 'Renting', rentingSub: 'Apartments · Houses',
    mechanic: 'Mechanic', mechanicSub: 'Trusted auto repair',
    legal: 'Legal Help', legalSub: 'Immigration · Rights',
    banking: 'Banking', bankingSub: 'Accounts · Transfers',
    education: 'Education', educationSub: 'Schools · ESL · GED',
    adminPanel: 'Admin Dashboard',
    vendorPanel: 'Vendor Dashboard',
    users: 'Users',
    noUsers: 'No users yet.',
    comingSoon: 'Coming soon',
  },
  pt: {
    tagline: 'Conectamos. Apoiamos. Crescemos Juntos.',
    welcomeBack: 'Bem-vindo',
    welcomeSub: 'Entre para continuar',
    email: 'E-mail',
    password: 'Senha',
    signIn: 'Entrar',
    signOut: 'Sair',
    loading: 'Carregando...',
    errGeneric: 'Algo deu errado. Tente novamente.',
    inviteOnly: 'Entre Amigos é por convite. Se você foi convidado, use o link recebido.',
    goodDay: 'Olá,',
    friend: 'Amigo',
    searchServices: 'Buscar serviços...',
    services: 'Serviços',
    history: 'Histórico',
    messages: 'Mensagens',
    profile: 'Perfil',
    active: 'Ativos',
    pending: 'Pendente',
    rating: 'Avaliação',
    insurance: 'Seguro', insuranceSub: 'Saúde · Auto · Vida',
    doctor: 'Médico', doctorSub: 'Cuidado perto de você',
    buyHome: 'Comprar Casa', buyHomeSub: 'Empréstimos · Agentes',
    renting: 'Alugar', rentingSub: 'Apartamentos · Casas',
    mechanic: 'Mecânico', mechanicSub: 'Reparo confiável',
    legal: 'Ajuda Jurídica', legalSub: 'Imigração · Direitos',
    banking: 'Banco', bankingSub: 'Contas · Transferências',
    education: 'Educação', educationSub: 'Escolas · ESL · GED',
    adminPanel: 'Painel Administrativo',
    vendorPanel: 'Painel do Fornecedor',
    users: 'Usuários',
    noUsers: 'Nenhum usuário ainda.',
    comingSoon: 'Em breve',
  },
}

const LangContext = createContext({ lang: 'es', t: T.es, setLang: () => {} })
const useLang = () => useContext(LangContext)

// ---- Service tiles config ----
const TILES = [
  { key: 'insurance', icon: '🛡️' },
  { key: 'doctor', icon: '🩺' },
  { key: 'buyHome', icon: '🏠' },
  { key: 'renting', icon: '🏢' },
  { key: 'mechanic', icon: '🔧' },
  { key: 'legal', icon: '⚖️' },
  { key: 'banking', icon: '🏦' },
  { key: 'education', icon: '🎓' },
]

// ---- LOGO COMPONENT (your real logo) ----
function Logo({ size = 'large' }) {
  const dim = size === 'large' ? 'w-32 h-32' : size === 'medium' ? 'w-20 h-20' : 'w-14 h-14'
  return (
    <div className={`${dim} mx-auto`}>
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
// =============================================
// AUTH SCREEN (login only — invite-only signup comes in Phase 1B)
// =============================================
function AuthScreen() {
  const { lang, t, setLang } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSignIn() {
    setMsg('')
    if (!email || !password) return
    setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (e) {
      setMsg(e.message || t.errGeneric)
    } finally {
      setBusy(false)
    }
  }

  const langs = [
    { code: 'es', label: '🇲🇽 ES' },
    { code: 'en', label: '🇺🇸 EN' },
    { code: 'pt', label: '🇧🇷 PT' },
  ]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: '#FBF6EC' }}
    >
      {/* Brand */}
      <div className="text-center mb-6">
        <Logo size="medium" />
        <div
          className="mt-2"
          style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1B3A6B' }}
        >
          entre amigos
        </div>
        <div className="text-xs font-semibold tracking-wide mt-1">
          <span style={{ color: '#C8202F' }}>CONECTAMOS.</span>
          <span className="mx-1.5" style={{ color: '#1B3A6B' }}>|</span>
          <span style={{ color: '#1F8A4C' }}>APOYAMOS.</span>
          <span className="mx-1.5" style={{ color: '#1B3A6B' }}>|</span>
          <span style={{ color: '#1B3A6B' }}>CRECEMOS JUNTOS.</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-bold mb-1" style={{ color: '#1B3A6B' }}>{t.welcomeBack}</h2>
        <p className="text-sm text-gray-500 mb-5">{t.welcomeSub}</p>

        {/* Language switch */}
        <div className="flex gap-1.5 mb-5">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition"
              style={
                lang === l.code
                  ? { background: '#FBF6EC', border: '1.5px solid #1B3A6B', color: '#1B3A6B' }
                  : { background: '#fafafa', border: '1.5px solid #e0e0e0', color: '#666' }
              }
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>
            {t.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }}
            placeholder="tucorreo@email.com"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>
            {t.password}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }}
            placeholder="••••••••"
          />
        </div>

        {msg && (
          <div className="text-xs text-center mb-3 px-2 py-2 rounded-lg" style={{ background: '#FDECEA', color: '#9B1C10' }}>
            {msg}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={busy}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
          style={{ backgroundColor: '#1B3A6B' }}
        >
          {busy ? t.loading : t.signIn}
        </button>

        {/* Invite-only notice */}
        <p className="text-xs text-center text-gray-500 mt-5 leading-relaxed">{t.inviteOnly}</p>
      </div>
    </div>
  )
}

// =============================================
// CUSTOMER HOME (the nice tile layout)
// =============================================
function CustomerHome({ profile }) {
  const { t } = useLang()
  const [tab, setTab] = useState('services')
  const displayName = profile?.full_name || t.friend

  // Tile color schemes (cycling through brand colors)
  const tileStyles = [
    { color: '#C8202F', bg: '#FDECEA' }, // red
    { color: '#1F8A4C', bg: '#E6F5ED' }, // green
    { color: '#1B3A6B', bg: '#E8EEF7' }, // navy
    { color: '#E8A020', bg: '#FFF3DC' }, // gold accent
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FBF6EC' }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #C8202F 100%)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Logo size="small" />
            <div className="text-white" style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700 }}>
              entre amigos
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-lg bg-white/20 border border-white/25 flex items-center justify-center text-white">
              🔔
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-9 h-9 rounded-lg bg-white/20 border border-white/25 flex items-center justify-center text-white"
              title={t.signOut}
            >
              ⎋
            </button>
          </div>
        </div>
        <div className="text-white/85 text-sm">{t.goodDay}</div>
        <div className="text-white" style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700 }}>
          {displayName}
        </div>
        <div className="bg-white/15 border border-white/30 rounded-xl px-3.5 py-2.5 flex items-center gap-2 mt-4">
          <span className="text-white/70">🔍</span>
          <span className="text-white/70 text-sm">{t.searchServices}</span>
        </div>
      </div>

      {/* Content */}
      <div className="-mt-5 rounded-t-3xl px-5 py-6 flex-1" style={{ background: '#FBF6EC' }}>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[
            { num: '0', lbl: t.active, bg: '#FDECEA', c: '#C8202F', icon: '✓' },
            { num: '0', lbl: t.pending, bg: '#E8EEF7', c: '#1B3A6B', icon: '◷' },
            { num: '—', lbl: t.rating, bg: '#E6F5ED', c: '#1F8A4C', icon: '★' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center border border-black/5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ background: s.bg, color: s.c }}>
                {s.icon}
              </div>
              <div className="text-lg font-bold leading-none" style={{ color: '#1B3A6B' }}>{s.num}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
          {t.services}
        </div>

        {/* Tiles */}
        <div className="grid grid-cols-2 gap-3">
          {TILES.map((tile, i) => {
            const s = tileStyles[i % tileStyles.length]
            return (
              <button
                key={tile.key}
                onClick={() => alert(t[tile.key] + ' — ' + t.comingSoon)}
                className="bg-white rounded-2xl p-4 border border-black/5 text-left relative overflow-hidden hover:-translate-y-0.5 transition"
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: s.color }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5" style={{ background: s.bg, fontSize: 22 }}>
                  {tile.icon}
                </div>
                <div className="text-sm font-semibold leading-tight" style={{ color: '#1B3A6B' }}>{t[tile.key]}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{t[tile.key + 'Sub']}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex bg-white border-t border-black/5 pt-2.5 pb-3.5">
        {[
          { k: 'services', icon: '▦', label: t.services },
          { k: 'history', icon: '◷', label: t.history },
          { k: 'messages', icon: '💬', label: t.messages },
          { k: 'profile', icon: '👤', label: t.profile },
        ].map((n) => (
          <button key={n.k} onClick={() => setTab(n.k)} className="flex-1 flex flex-col items-center gap-0.5 py-1" style={{ color: tab === n.k ? '#C8202F' : '#bbb' }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span className="text-[10px] font-medium">{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
// =============================================
// ADMIN DASHBOARD (owner / manager / employee)
// =============================================
function AdminDashboard({ profile }) {
  const { t } = useLang()
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setAllUsers(data)
  }

  // Role badge color
  function roleColor(role) {
    if (role === 'owner') return '#C8202F'
    if (role === 'manager') return '#1B3A6B'
    if (role === 'employee') return '#6B7280'
    if (role === 'vendor') return '#1F8A4C'
    return '#E8A020' // customer
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FBF6EC' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-10" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #C8202F 100%)' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Logo size="small" />
            <div className="text-white" style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700 }}>
              entre amigos
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-white text-sm font-semibold bg-white/20 border border-white/25 px-3 py-1.5 rounded-lg">
            {t.signOut}
          </button>
        </div>
        <div className="text-white/85 text-sm">{t.goodDay}</div>
        <div className="text-white" style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700 }}>
          {profile?.full_name || profile?.email}
        </div>
        <div className="text-white/70 text-xs mt-1">
          {t.adminPanel} · <span className="font-semibold">{profile?.role}</span>
        </div>
      </div>

      {/* Content */}
      <div className="-mt-5 rounded-t-3xl px-5 py-6 flex-1" style={{ background: '#FBF6EC' }}>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>
            {t.users} ({allUsers.length})
          </h3>
          {allUsers.length === 0 ? (
            <p className="text-gray-500 text-sm">{t.noUsers}</p>
          ) : (
            <div className="space-y-2">
              {allUsers.map((u) => (
                <div key={u.id} className="border rounded-xl p-3 flex justify-between items-center" style={{ borderColor: '#e0e0e0' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#1B3A6B' }}>{u.full_name || '(sin nombre)'}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: roleColor(u.role) }}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-center mt-8 text-gray-500">{t.comingSoon}: invitar usuarios</p>
      </div>
    </div>
  )
}

// =============================================
// VENDOR DASHBOARD (placeholder for now)
// =============================================
function VendorDashboard({ profile }) {
  const { t } = useLang()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: '#FBF6EC' }}>
      <Logo size="medium" />
      <div className="mt-4" style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#1B3A6B' }}>
        {t.vendorPanel}
      </div>
      <div className="text-gray-500 text-sm mt-2 max-w-xs">
        {profile?.full_name} · {t.comingSoon}
      </div>
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-6 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
        style={{ backgroundColor: '#C8202F' }}
      >
        {t.signOut}
      </button>
    </div>
  )
}

// =============================================
// ROOT APP
// =============================================
export default function App() {
  const [lang, setLang] = useState('es')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Watch auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) loadProfile(data.session.user.id)
      else setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess)
      if (sess?.user) loadProfile(sess.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Load profile from profiles table (has the real role)
  async function loadProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
    setLoading(false)
  }

  const t = T[lang]

  let screen
  if (loading) {
    screen = (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBF6EC' }}>
        <div className="text-gray-400">{t.loading}</div>
      </div>
    )
  } else if (!session) {
    screen = <AuthScreen />
  } else if (!profile) {
    screen = (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBF6EC' }}>
        <div className="text-gray-400">{t.loading}</div>
      </div>
    )
  } else if (['owner', 'manager', 'employee'].includes(profile.role)) {
    screen = <AdminDashboard profile={profile} />
  } else if (profile.role === 'vendor') {
    screen = <VendorDashboard profile={profile} />
  } else {
    screen = <CustomerHome profile={profile} />
  }

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {screen}
    </LangContext.Provider>
  )
}
