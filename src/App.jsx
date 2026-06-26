// =============================================
// Entre Amigos — App.jsx
// Phase 2A: Vendor profile + category requests + admin approval queue
// + Language switcher on logged-in screens
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
    inviteUser: 'Invitar Usuario',
    selectRole: 'Selecciona el rol',
    generateInvite: 'Generar Invitación',
    inviteLink: 'Enlace de Invitación',
    copyLink: 'Copiar Enlace',
    copied: '¡Copiado!',
    activeInvites: 'Invitaciones Activas',
    noInvites: 'No hay invitaciones activas.',
    used: 'Usado',
    expired: 'Expirado',
    invalidInvite: 'Invitación inválida o expirada.',
    fullName: 'Nombre Completo',
    completeSignup: 'Completar Registro',
    invitedAs: 'Invitado como',
    welcomeNew: '¡Bienvenido a Entre Amigos!',
    checkEmail: 'Revisa tu correo para confirmar tu cuenta.',
    roleOwner: 'Dueño',
    roleManager: 'Gerente',
    roleEmployee: 'Empleado',
    roleVendor: 'Proveedor',
    roleCustomer: 'Cliente',
    myCategories: 'Mis Categorías',
    requestCategory: 'Solicitar Categoría',
    requestNewCategory: 'Solicitar Nueva Categoría',
    pendingApproval: 'Pendiente',
    approved: 'Aprobado',
    denied: 'Denegado',
    noCategoriesYet: 'Aún no has solicitado categorías. Solicita una para empezar a recibir clientes.',
    available: 'Disponibles',
    requestSent: 'Solicitud enviada',
    cancelRequest: 'Cancelar',
    approvalQueue: 'Aprobaciones',
    noApprovals: 'No hay solicitudes pendientes.',
    approveBtn: 'Aprobar',
    denyBtn: 'Denegar',
    requestedAt: 'Solicitado',
    vendor: 'Proveedor',
    category: 'Categoría',
    dashboard: 'Inicio',
    cancel: 'Cancelar',
    done: 'Hecho',
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
    inviteUser: 'Invite User',
    selectRole: 'Select role',
    generateInvite: 'Generate Invite',
    inviteLink: 'Invite Link',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    activeInvites: 'Active Invites',
    noInvites: 'No active invites.',
    used: 'Used',
    expired: 'Expired',
    invalidInvite: 'Invalid or expired invite.',
    fullName: 'Full Name',
    completeSignup: 'Complete Signup',
    invitedAs: 'Invited as',
    welcomeNew: 'Welcome to Entre Amigos!',
    checkEmail: 'Check your email to confirm your account.',
    roleOwner: 'Owner',
    roleManager: 'Manager',
    roleEmployee: 'Employee',
    roleVendor: 'Vendor',
    roleCustomer: 'Customer',
    myCategories: 'My Categories',
    requestCategory: 'Request Category',
    requestNewCategory: 'Request New Category',
    pendingApproval: 'Pending',
    approved: 'Approved',
    denied: 'Denied',
    noCategoriesYet: 'You haven\'t requested any categories yet. Request one to start receiving leads.',
    available: 'Available',
    requestSent: 'Request sent',
    cancelRequest: 'Cancel',
    approvalQueue: 'Approvals',
    noApprovals: 'No pending requests.',
    approveBtn: 'Approve',
    denyBtn: 'Deny',
    requestedAt: 'Requested',
    vendor: 'Vendor',
    category: 'Category',
    dashboard: 'Dashboard',
    cancel: 'Cancel',
    done: 'Done',
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
    inviteUser: 'Convidar Usuário',
    selectRole: 'Selecione a função',
    generateInvite: 'Gerar Convite',
    inviteLink: 'Link de Convite',
    copyLink: 'Copiar Link',
    copied: 'Copiado!',
    activeInvites: 'Convites Ativos',
    noInvites: 'Nenhum convite ativo.',
    used: 'Usado',
    expired: 'Expirado',
    invalidInvite: 'Convite inválido ou expirado.',
    fullName: 'Nome Completo',
    completeSignup: 'Completar Cadastro',
    invitedAs: 'Convidado como',
    welcomeNew: 'Bem-vindo ao Entre Amigos!',
    checkEmail: 'Verifique seu e-mail para confirmar sua conta.',
    roleOwner: 'Dono',
    roleManager: 'Gerente',
    roleEmployee: 'Funcionário',
    roleVendor: 'Fornecedor',
    roleCustomer: 'Cliente',
    myCategories: 'Minhas Categorias',
    requestCategory: 'Solicitar Categoria',
    requestNewCategory: 'Solicitar Nova Categoria',
    pendingApproval: 'Pendente',
    approved: 'Aprovado',
    denied: 'Negado',
    noCategoriesYet: 'Você ainda não solicitou categorias. Solicite uma para começar a receber clientes.',
    available: 'Disponíveis',
    requestSent: 'Solicitação enviada',
    cancelRequest: 'Cancelar',
    approvalQueue: 'Aprovações',
    noApprovals: 'Nenhuma solicitação pendente.',
    approveBtn: 'Aprovar',
    denyBtn: 'Negar',
    requestedAt: 'Solicitado',
    vendor: 'Fornecedor',
    category: 'Categoria',
    dashboard: 'Início',
    cancel: 'Cancelar',
    done: 'Pronto',
  },
}

const LangContext = createContext({ lang: 'es', t: T.es, setLang: () => {} })
const useLang = () => useContext(LangContext)

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

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// ---- LOGO ----
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
        <path d="M 115 110 Q 130 95 145 110 L 115 125 L 115 125 Z" fill="#FBF6EC" />
        <circle cx="100" cy="78" r="9" fill="#FBF6EC" />
        <path d="M 83 108 Q 100 90 117 108 L 117 125 L 83 125 Z" fill="#FBF6EC" />
      </svg>
    </div>
  )
}

// ---- Language Switcher (compact, for headers) ----
// Shows current language as a flag button. Clicking opens a small menu.
function LangSwitcher({ inverted = false }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const langs = [
    { code: 'es', label: 'ES', flag: '🇲🇽' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
  ]
  const current = langs.find((l) => l.code === lang)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
        style={inverted
          ? { background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }
          : { background: '#FBF6EC', border: '1px solid #e0e0e0', color: '#1B3A6B' }}>
        {current.flag}
      </button>
      {open && (
        <>
          {/* Click backdrop to close */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown menu */}
          <div className="absolute right-0 top-11 z-50 bg-white rounded-xl shadow-lg border overflow-hidden" style={{ borderColor: '#e0e0e0', minWidth: 120 }}>
            {langs.map((l) => (
              <button key={l.code} onClick={() => { setLang(l.code); setOpen(false) }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                style={{ color: lang === l.code ? '#C8202F' : '#1B3A6B', fontWeight: lang === l.code ? 700 : 500 }}>
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {lang === l.code && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ---- Shared header used on logged-in screens ----
function AppHeader({ profile, subtitle }) {
  const { t } = useLang()
  return (
    <div className="px-5 pt-5 pb-10" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #C8202F 100%)' }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Logo size="small" />
          <div className="text-white" style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700 }}>entre amigos</div>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitcher inverted={true} />
          <button onClick={() => supabase.auth.signOut()} className="text-white text-sm font-semibold bg-white/20 border border-white/25 px-3 py-1.5 rounded-lg">
            {t.signOut}
          </button>
        </div>
      </div>
      <div className="text-white/85 text-sm">{t.goodDay}</div>
      <div className="text-white" style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700 }}>
        {profile?.full_name || profile?.email}
      </div>
      <div className="text-white/70 text-xs mt-1">{subtitle}</div>
    </div>
  )
}

// =============================================
// AUTH SCREEN
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#FBF6EC' }}>
      <div className="text-center mb-6">
        <Logo size="medium" />
        <div className="mt-2" style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1B3A6B' }}>
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

      <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-bold mb-1" style={{ color: '#1B3A6B' }}>{t.welcomeBack}</h2>
        <p className="text-sm text-gray-500 mb-5">{t.welcomeSub}</p>

        <div className="flex gap-1.5 mb-5">
          {langs.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition"
              style={lang === l.code
                ? { background: '#FBF6EC', border: '1.5px solid #1B3A6B', color: '#1B3A6B' }
                : { background: '#fafafa', border: '1.5px solid #e0e0e0', color: '#666' }}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.email}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }} placeholder="tucorreo@email.com" />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.password}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }} placeholder="••••••••" />
        </div>

        {msg && (
          <div className="text-xs text-center mb-3 px-2 py-2 rounded-lg" style={{ background: '#FDECEA', color: '#9B1C10' }}>
            {msg}
          </div>
        )}

        <button onClick={handleSignIn} disabled={busy}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
          style={{ backgroundColor: '#1B3A6B' }}>
          {busy ? t.loading : t.signIn}
        </button>

        <p className="text-xs text-center text-gray-500 mt-5 leading-relaxed">{t.inviteOnly}</p>
      </div>
    </div>
  )
}

// =============================================
// INVITE SIGNUP SCREEN
// =============================================
function InviteSignupScreen({ inviteCode }) {
  const { lang, t, setLang } = useLang()
  const [invite, setInvite] = useState(null)
  const [checking, setChecking] = useState(true)
  const [valid, setValid] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function check() {
      const { data } = await supabase
        .from('invites')
        .select('*')
        .eq('code', inviteCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single()
      if (data) { setInvite(data); setValid(true) }
      setChecking(false)
    }
    check()
  }, [inviteCode])

  async function handleSignup() {
    setMsg('')
    if (!email || !password || !fullName) return
    setBusy(true)
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, invite_code: inviteCode } },
      })
      if (error) throw error
      setSuccess(true)
    } catch (e) {
      setMsg(e.message || t.errGeneric)
    } finally {
      setBusy(false)
    }
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBF6EC' }}>
      <div className="text-gray-400">{t.loading}</div>
    </div>
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#FBF6EC' }}>
        <Logo size="medium" />
        <div className="text-center mt-4 max-w-sm">
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#C8202F' }}>{t.invalidInvite}</div>
          <p className="text-sm text-gray-500 mt-3">{t.inviteOnly}</p>
          <button onClick={() => (window.location.href = '/')}
            className="mt-6 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
            style={{ backgroundColor: '#1B3A6B' }}>{t.signIn}</button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#FBF6EC' }}>
        <Logo size="medium" />
        <div className="text-center mt-4 max-w-sm">
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1F8A4C' }}>{t.welcomeNew}</div>
          <p className="text-sm text-gray-500 mt-3">{t.checkEmail}</p>
          <button onClick={() => (window.location.href = '/')}
            className="mt-6 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
            style={{ backgroundColor: '#1B3A6B' }}>{t.signIn}</button>
        </div>
      </div>
    )
  }

  const roleLabel = t['role' + invite.role.charAt(0).toUpperCase() + invite.role.slice(1)]
  const langs = [{ code: 'es', label: '🇲🇽 ES' }, { code: 'en', label: '🇺🇸 EN' }, { code: 'pt', label: '🇧🇷 PT' }]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#FBF6EC' }}>
      <div className="text-center mb-6">
        <Logo size="medium" />
        <div className="mt-2" style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1B3A6B' }}>entre amigos</div>
      </div>

      <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-bold mb-1" style={{ color: '#1B3A6B' }}>{t.completeSignup}</h2>
        <p className="text-sm mb-5">
          <span className="text-gray-500">{t.invitedAs}: </span>
          <span className="font-semibold" style={{ color: '#1F8A4C' }}>{roleLabel}</span>
        </p>

        <div className="flex gap-1.5 mb-5">
          {langs.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition"
              style={lang === l.code
                ? { background: '#FBF6EC', border: '1.5px solid #1B3A6B', color: '#1B3A6B' }
                : { background: '#fafafa', border: '1.5px solid #e0e0e0', color: '#666' }}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.fullName}</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }} placeholder="María García" />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.email}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }} placeholder="tucorreo@email.com" />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.password}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }} placeholder="••••••••" />
        </div>

        {msg && <div className="text-xs text-center mb-3 px-2 py-2 rounded-lg" style={{ background: '#FDECEA', color: '#9B1C10' }}>{msg}</div>}

        <button onClick={handleSignup} disabled={busy}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
          style={{ backgroundColor: '#C8202F' }}>
          {busy ? t.loading : t.completeSignup}
        </button>
      </div>
    </div>
  )
}

// =============================================
// CUSTOMER HOME (now uses LangSwitcher in header)
// =============================================
function CustomerHome({ profile }) {
  const { t } = useLang()
  const [tab, setTab] = useState('services')
  const displayName = profile?.full_name || t.friend

  const tileStyles = [
    { color: '#C8202F', bg: '#FDECEA' },
    { color: '#1F8A4C', bg: '#E6F5ED' },
    { color: '#1B3A6B', bg: '#E8EEF7' },
    { color: '#E8A020', bg: '#FFF3DC' },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FBF6EC' }}>
      <div className="px-5 pt-5 pb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #C8202F 100%)' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Logo size="small" />
            <div className="text-white" style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700 }}>entre amigos</div>
          </div>
          <div className="flex gap-2 items-center">
            <LangSwitcher inverted={true} />
            <button className="w-9 h-9 rounded-lg bg-white/20 border border-white/25 flex items-center justify-center text-white">🔔</button>
            <button onClick={() => supabase.auth.signOut()}
              className="w-9 h-9 rounded-lg bg-white/20 border border-white/25 flex items-center justify-center text-white"
              title={t.signOut}>⎋</button>
          </div>
        </div>
        <div className="text-white/85 text-sm">{t.goodDay}</div>
        <div className="text-white" style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700 }}>{displayName}</div>
        <div className="bg-white/15 border border-white/30 rounded-xl px-3.5 py-2.5 flex items-center gap-2 mt-4">
          <span className="text-white/70">🔍</span>
          <span className="text-white/70 text-sm">{t.searchServices}</span>
        </div>
      </div>

      <div className="-mt-5 rounded-t-3xl px-5 py-6 flex-1" style={{ background: '#FBF6EC' }}>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[
            { num: '0', lbl: t.active, bg: '#FDECEA', c: '#C8202F', icon: '✓' },
            { num: '0', lbl: t.pending, bg: '#E8EEF7', c: '#1B3A6B', icon: '◷' },
            { num: '—', lbl: t.rating, bg: '#E6F5ED', c: '#1F8A4C', icon: '★' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center border border-black/5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ background: s.bg, color: s.c }}>{s.icon}</div>
              <div className="text-lg font-bold leading-none" style={{ color: '#1B3A6B' }}>{s.num}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">{t.services}</div>

        <div className="grid grid-cols-2 gap-3">
          {TILES.map((tile, i) => {
            const s = tileStyles[i % tileStyles.length]
            return (
              <button key={tile.key} onClick={() => alert(t[tile.key] + ' — ' + t.comingSoon)}
                className="bg-white rounded-2xl p-4 border border-black/5 text-left relative overflow-hidden hover:-translate-y-0.5 transition">
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: s.color }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5" style={{ background: s.bg, fontSize: 22 }}>{tile.icon}</div>
                <div className="text-sm font-semibold leading-tight" style={{ color: '#1B3A6B' }}>{t[tile.key]}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{t[tile.key + 'Sub']}</div>
              </button>
            )
          })}
        </div>
      </div>

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
// VENDOR DASHBOARD
// =============================================
function VendorDashboard({ profile }) {
  const { t } = useLang()
  const [myCategories, setMyCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)

  async function loadMyCategories() {
    const { data } = await supabase
      .from('vendor_categories')
      .select('*, categories(*)')
      .eq('vendor_id', profile.id)
      .order('requested_at', { ascending: false })
    if (data) setMyCategories(data)
  }

  async function loadAllCategories() {
    const { data } = await supabase.from('categories').select('*').eq('active', true)
    if (data) setAllCategories(data)
  }

  useEffect(() => {
    Promise.all([loadMyCategories(), loadAllCategories()]).then(() => setLoading(false))
  }, [])

  async function requestCategory(categoryId) {
    const { error } = await supabase.from('vendor_categories').insert({
      vendor_id: profile.id, category_id: categoryId, status: 'pending',
    })
    if (error) { alert('Error: ' + error.message) }
    else { await loadMyCategories(); setShowRequestModal(false) }
  }

  async function cancelRequest(reqId) {
    const { error } = await supabase.from('vendor_categories').delete().eq('id', reqId)
    if (!error) loadMyCategories()
  }

  const myCategoryIds = myCategories.map((mc) => mc.category_id)
  const availableCategories = allCategories.filter((c) => !myCategoryIds.includes(c.id))

  function statusBadge(status) {
    if (status === 'approved') return { label: t.approved, color: '#1F8A4C' }
    if (status === 'denied') return { label: t.denied, color: '#C8202F' }
    return { label: t.pendingApproval, color: '#E8A020' }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FBF6EC' }}>
      <AppHeader profile={profile} subtitle={t.vendorPanel} />

      <div className="-mt-5 rounded-t-3xl px-5 py-6 flex-1" style={{ background: '#FBF6EC' }}>
        {loading ? (
          <div className="text-center text-gray-400 py-10">{t.loading}</div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow p-4 mb-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold" style={{ color: '#1B3A6B' }}>{t.myCategories} ({myCategories.length})</h3>
                <button onClick={() => setShowRequestModal(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: '#C8202F' }}>
                  + {t.requestCategory}
                </button>
              </div>
              {myCategories.length === 0 ? (
                <p className="text-gray-500 text-sm">{t.noCategoriesYet}</p>
              ) : (
                <div className="space-y-2">
                  {myCategories.map((mc) => {
                    const badge = statusBadge(mc.status)
                    const catKey = mc.categories?.key
                    return (
                      <div key={mc.id} className="border rounded-xl p-3 flex justify-between items-center" style={{ borderColor: '#e0e0e0' }}>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 20 }}>{mc.categories?.icon}</span>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>{catKey ? t[catKey] : '?'}</p>
                            {mc.notes && <p className="text-xs text-gray-500">{mc.notes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: badge.color }}>{badge.label}</span>
                          {mc.status === 'pending' && (
                            <button onClick={() => cancelRequest(mc.id)} className="text-xs" style={{ color: '#C8202F' }}>✕</button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <p className="text-xs text-center text-gray-500">{t.comingSoon}: leads & quotes</p>
          </>
        )}
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1B3A6B' }}>{t.requestNewCategory}</h3>
            {availableCategories.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">—</p>
            ) : (
              <div className="space-y-2 mb-4">
                {availableCategories.map((cat) => (
                  <button key={cat.id} onClick={() => requestCategory(cat.id)}
                    className="w-full border rounded-xl p-3 flex items-center gap-3 hover:bg-gray-50 text-left"
                    style={{ borderColor: '#e0e0e0' }}>
                    <span style={{ fontSize: 22 }}>{cat.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>{t[cat.key]}</p>
                      <p className="text-xs text-gray-500">{t[cat.key + 'Sub']}</p>
                    </div>
                    <span className="text-xs" style={{ color: '#C8202F' }}>+</span>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setShowRequestModal(false)}
              className="w-full py-2 text-sm" style={{ color: '#1B3A6B' }}>{t.cancel}</button>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================
// ADMIN DASHBOARD
// =============================================
function AdminDashboard({ profile }) {
  const { t } = useLang()
  const [tab, setTab] = useState('users')
  const [allUsers, setAllUsers] = useState([])
  const [invites, setInvites] = useState([])
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [newRole, setNewRole] = useState('customer')
  const [generating, setGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)

  const allowedRoles = profile.role === 'owner'
    ? ['owner', 'manager', 'employee', 'vendor', 'customer']
    : ['vendor', 'customer']

  useEffect(() => {
    loadUsers(); loadInvites(); loadApprovals()
  }, [])

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setAllUsers(data)
  }

  async function loadInvites() {
    const { data } = await supabase.from('invites').select('*').order('created_at', { ascending: false })
    if (data) setInvites(data)
  }

  async function loadApprovals() {
    const { data } = await supabase
      .from('vendor_categories')
      .select('*, categories(*), profiles!vendor_categories_vendor_id_fkey(*)')
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })
    if (data) setPendingApprovals(data)
  }

  async function approveRequest(reqId) {
    const { error } = await supabase
      .from('vendor_categories')
      .update({ status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reqId)
    if (!error) loadApprovals()
  }

  async function denyRequest(reqId) {
    const { error } = await supabase
      .from('vendor_categories')
      .update({ status: 'denied', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reqId)
    if (!error) loadApprovals()
  }

  async function handleGenerateInvite() {
    setGenerating(true); setCopied(false)
    const code = generateInviteCode()
    const { error } = await supabase.from('invites').insert({
      code, role: newRole, invited_by: profile.id,
    })
    if (!error) {
      const link = `${window.location.origin}/?invite=${code}`
      setGeneratedLink(link); loadInvites()
    } else {
      alert('Error: ' + error.message)
    }
    setGenerating(false)
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) { alert(generatedLink) }
  }

  function roleColor(role) {
    if (role === 'owner') return '#C8202F'
    if (role === 'manager') return '#1B3A6B'
    if (role === 'employee') return '#6B7280'
    if (role === 'vendor') return '#1F8A4C'
    return '#E8A020'
  }

  function inviteStatus(inv) {
    if (inv.used) return { label: t.used, color: '#6B7280' }
    if (new Date(inv.expires_at) < new Date()) return { label: t.expired, color: '#C8202F' }
    return { label: t.active, color: '#1F8A4C' }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FBF6EC' }}>
      <AppHeader profile={profile} subtitle={`${t.adminPanel} · ${profile?.role}`} />

      <div className="-mt-5 rounded-t-3xl px-5 py-6 flex-1" style={{ background: '#FBF6EC' }}>

        <div className="bg-white rounded-2xl p-1 flex mb-5 shadow-sm">
          {[
            { k: 'users', label: t.users, count: allUsers.length },
            { k: 'invites', label: t.activeInvites.split(' ')[0], count: invites.filter(i => !i.used && new Date(i.expires_at) > new Date()).length },
            { k: 'approvals', label: t.approvalQueue, count: pendingApprovals.length },
          ].map((tabItem) => (
            <button key={tabItem.k} onClick={() => setTab(tabItem.k)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition"
              style={tab === tabItem.k ? { background: '#1B3A6B', color: 'white' } : { color: '#666' }}>
              {tabItem.label} ({tabItem.count})
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.users} ({allUsers.length})</h3>
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
                    <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: roleColor(u.role) }}>{u.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'invites' && (
          <>
            <button onClick={() => { setShowInviteModal(true); setGeneratedLink(''); setNewRole('customer') }}
              className="w-full py-3 rounded-2xl text-white font-semibold text-sm mb-4 shadow"
              style={{ backgroundColor: '#C8202F' }}>
              + {t.inviteUser}
            </button>
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.activeInvites}</h3>
              {invites.length === 0 ? (
                <p className="text-gray-500 text-sm">{t.noInvites}</p>
              ) : (
                <div className="space-y-2">
                  {invites.slice(0, 20).map((inv) => {
                    const status = inviteStatus(inv)
                    const link = `${window.location.origin}/?invite=${inv.code}`
                    return (
                      <div key={inv.id} className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-mono font-bold text-sm" style={{ color: '#1B3A6B' }}>{inv.code}</p>
                            <p className="text-xs text-gray-500">Role: <span className="font-semibold">{inv.role}</span></p>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: status.color }}>{status.label}</span>
                        </div>
                        {!inv.used && (
                          <button onClick={() => { navigator.clipboard.writeText(link); alert(t.copied) }}
                            className="text-xs mt-1" style={{ color: '#C8202F' }}>📋 {t.copyLink}</button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'approvals' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.approvalQueue} ({pendingApprovals.length})</h3>
            {pendingApprovals.length === 0 ? (
              <p className="text-gray-500 text-sm">{t.noApprovals}</p>
            ) : (
              <div className="space-y-2">
                {pendingApprovals.map((req) => {
                  const catKey = req.categories?.key
                  const vendor = req.profiles
                  return (
                    <div key={req.id} className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 22 }}>{req.categories?.icon}</span>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>{catKey ? t[catKey] : '?'}</p>
                            <p className="text-xs text-gray-500">{t.vendor}: {vendor?.full_name || vendor?.email || '(?)'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => approveRequest(req.id)}
                          className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                          style={{ backgroundColor: '#1F8A4C' }}>✓ {t.approveBtn}</button>
                        <button onClick={() => denyRequest(req.id)}
                          className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                          style={{ backgroundColor: '#C8202F' }}>✕ {t.denyBtn}</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1B3A6B' }}>{t.inviteUser}</h3>
            {!generatedLink ? (
              <>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#1B3A6B' }}>{t.selectRole}</label>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {allowedRoles.map((r) => (
                    <button key={r} onClick={() => setNewRole(r)}
                      className="py-2 rounded-lg text-xs font-medium transition"
                      style={newRole === r
                        ? { background: '#FDECEA', border: '1.5px solid #C8202F', color: '#9B1C10' }
                        : { background: '#fafafa', border: '1.5px solid #e0e0e0', color: '#666' }}>
                      {t['role' + r.charAt(0).toUpperCase() + r.slice(1)]}
                    </button>
                  ))}
                </div>
                <button onClick={handleGenerateInvite} disabled={generating}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 mb-2"
                  style={{ backgroundColor: '#C8202F' }}>
                  {generating ? t.loading : t.generateInvite}
                </button>
                <button onClick={() => setShowInviteModal(false)}
                  className="w-full py-2 text-sm" style={{ color: '#1B3A6B' }}>{t.cancel}</button>
              </>
            ) : (
              <>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#1B3A6B' }}>{t.inviteLink}</label>
                <div className="bg-gray-50 border rounded-xl p-3 mb-3 text-xs break-all" style={{ borderColor: '#e0e0e0', color: '#1B3A6B' }}>
                  {generatedLink}
                </div>
                <button onClick={copyToClipboard}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm mb-2"
                  style={{ backgroundColor: copied ? '#1F8A4C' : '#1B3A6B' }}>
                  {copied ? '✓ ' + t.copied : '📋 ' + t.copyLink}
                </button>
                <button onClick={() => setShowInviteModal(false)}
                  className="w-full py-2 text-sm" style={{ color: '#C8202F' }}>{t.done}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================
// ROOT APP — Detects browser language on first load
// =============================================
export default function App() {
  // Detect browser language on first load (en/es/pt only)
  const detectLang = () => {
    const stored = localStorage.getItem('ea_lang')
    if (stored && ['es', 'en', 'pt'].includes(stored)) return stored
    const browser = (navigator.language || 'es').toLowerCase().slice(0, 2)
    if (['es', 'en', 'pt'].includes(browser)) return browser
    return 'es' // default to Spanish (target audience)
  }

  const [lang, setLangState] = useState(detectLang)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inviteCode, setInviteCode] = useState(null)

  // Save language preference whenever it changes
  const setLang = (newLang) => {
    setLangState(newLang)
    localStorage.setItem('ea_lang', newLang)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('invite')
    if (code) setInviteCode(code)
  }, [])

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

  async function loadProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
    setLoading(false)
  }

  const t = T[lang]

  let screen
  if (loading) {
    screen = <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBF6EC' }}>
      <div className="text-gray-400">{t.loading}</div>
    </div>
  } else if (inviteCode && !session) {
    screen = <InviteSignupScreen inviteCode={inviteCode} />
  } else if (!session) {
    screen = <AuthScreen />
  } else if (!profile) {
    screen = <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBF6EC' }}>
      <div className="text-gray-400">{t.loading}</div>
    </div>
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
