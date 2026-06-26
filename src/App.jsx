import React, { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

/* ============================================================
   ENTRE AMIGOS  —  single-file app
   Stack: React + Vite + Tailwind + Supabase
   Roles: consumer | owner | vendor
   Languages: English / Español / Português
   ============================================================ */

/* ---------- Supabase client ---------- */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/* ---------- Translations ---------- */
const T = {
  en: {
    tagline: "Your community, your resources",
    welcomeBack: "Welcome back",
    createAccount: "Create account",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    signIn: "Sign In",
    signUp: "Sign Up",
    newHere: "New here?",
    haveAccount: "Already have an account?",
    iAmA: "I am a...",
    consumer: "Consumer",
    owner: "Owner",
    vendor: "Vendor",
    consumerDesc: "I'm looking for services",
    ownerDesc: "I manage the platform",
    vendorDesc: "I offer services",
    goodDay: "Hello,",
    friend: "Friend",
    searchServices: "Search services...",
    services: "Services",
    history: "History",
    messages: "Messages",
    profile: "Profile",
    active: "Active",
    pending: "Pending",
    rating: "Rating",
    signOut: "Sign Out",
    insurance: "Insurance",
    insuranceSub: "Health · Auto · Life",
    doctor: "Doctor",
    doctorSub: "Find care near you",
    buyHome: "Buy a Home",
    buyHomeSub: "Loans · Agents",
    renting: "Renting",
    rentingSub: "Apartments · Houses",
    mechanic: "Mechanic",
    mechanicSub: "Trusted auto repair",
    legal: "Legal Help",
    legalSub: "Immigration · Rights",
    banking: "Banking",
    bankingSub: "Accounts · Transfers",
    education: "Education",
    educationSub: "Schools · ESL · GED",
    ownerPanel: "Owner Dashboard",
    vendorPanel: "Vendor Dashboard",
    comingSoon: "Coming soon — we'll build this out next",
    loading: "Loading...",
    errGeneric: "Something went wrong. Please try again.",
    checkEmail: "Check your email to confirm your account, then sign in.",
  },
  es: {
    tagline: "Tu comunidad, tus recursos",
    welcomeBack: "Bienvenido",
    createAccount: "Crear cuenta",
    email: "Correo",
    password: "Contraseña",
    fullName: "Nombre completo",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    newHere: "¿Nuevo aquí?",
    haveAccount: "¿Ya tienes cuenta?",
    iAmA: "Soy un...",
    consumer: "Cliente",
    owner: "Dueño",
    vendor: "Proveedor",
    consumerDesc: "Busco servicios",
    ownerDesc: "Administro la plataforma",
    vendorDesc: "Ofrezco servicios",
    goodDay: "Hola,",
    friend: "Amigo",
    searchServices: "Buscar servicios...",
    services: "Servicios",
    history: "Historial",
    messages: "Mensajes",
    profile: "Perfil",
    active: "Activos",
    pending: "Pendiente",
    rating: "Calificación",
    signOut: "Cerrar sesión",
    insurance: "Seguros",
    insuranceSub: "Salud · Auto · Vida",
    doctor: "Médico",
    doctorSub: "Atención cercana",
    buyHome: "Comprar Casa",
    buyHomeSub: "Préstamos · Agentes",
    renting: "Rentar",
    rentingSub: "Apartamentos · Casas",
    mechanic: "Mecánico",
    mechanicSub: "Reparación confiable",
    legal: "Asesoría Legal",
    legalSub: "Inmigración · Derechos",
    banking: "Banca",
    bankingSub: "Cuentas · Envíos",
    education: "Educación",
    educationSub: "Escuelas · ESL · GED",
    ownerPanel: "Panel del Dueño",
    vendorPanel: "Panel del Proveedor",
    comingSoon: "Próximamente — lo construiremos a continuación",
    loading: "Cargando...",
    errGeneric: "Algo salió mal. Inténtalo de nuevo.",
    checkEmail: "Revisa tu correo para confirmar tu cuenta, luego inicia sesión.",
  },
  pt: {
    tagline: "Sua comunidade, seus recursos",
    welcomeBack: "Bem-vindo",
    createAccount: "Criar conta",
    email: "E-mail",
    password: "Senha",
    fullName: "Nome completo",
    signIn: "Entrar",
    signUp: "Cadastrar",
    newHere: "Novo aqui?",
    haveAccount: "Já tem uma conta?",
    iAmA: "Eu sou um...",
    consumer: "Cliente",
    owner: "Dono",
    vendor: "Fornecedor",
    consumerDesc: "Procuro serviços",
    ownerDesc: "Administro a plataforma",
    vendorDesc: "Ofereço serviços",
    goodDay: "Olá,",
    friend: "Amigo",
    searchServices: "Buscar serviços...",
    services: "Serviços",
    history: "Histórico",
    messages: "Mensagens",
    profile: "Perfil",
    active: "Ativos",
    pending: "Pendente",
    rating: "Avaliação",
    signOut: "Sair",
    insurance: "Seguro",
    insuranceSub: "Saúde · Auto · Vida",
    doctor: "Médico",
    doctorSub: "Cuidado perto de você",
    buyHome: "Comprar Casa",
    buyHomeSub: "Empréstimos · Agentes",
    renting: "Alugar",
    rentingSub: "Apartamentos · Casas",
    mechanic: "Mecânico",
    mechanicSub: "Reparo confiável",
    legal: "Ajuda Jurídica",
    legalSub: "Imigração · Direitos",
    banking: "Banco",
    bankingSub: "Contas · Transferências",
    education: "Educação",
    educationSub: "Escolas · ESL · GED",
    ownerPanel: "Painel do Dono",
    vendorPanel: "Painel do Fornecedor",
    comingSoon: "Em breve — vamos construir isso a seguir",
    loading: "Carregando...",
    errGeneric: "Algo deu errado. Tente novamente.",
    checkEmail: "Verifique seu e-mail para confirmar sua conta, depois entre.",
  },
};

const LangContext = createContext({ lang: "en", t: T.en, setLang: () => {} });
const useLang = () => useContext(LangContext);

/* ---------- Service tiles config ---------- */
const TILES = [
  { key: "insurance", icon: "🛡️", color: "#E8A020", bg: "#FFF3DC" },
  { key: "doctor", icon: "🩺", color: "#C0392B", bg: "#FDECEA" },
  { key: "buyHome", icon: "🏠", color: "#1565C0", bg: "#E8F0FE" },
  { key: "renting", icon: "🏢", color: "#1E7D4A", bg: "#E6F5ED" },
  { key: "mechanic", icon: "🔧", color: "#D4500A", bg: "#FEF0E7" },
  { key: "legal", icon: "⚖️", color: "#0E7C6B", bg: "#E0F4F1" },
  { key: "banking", icon: "🏦", color: "#6B3FA0", bg: "#F3EEF9" },
  { key: "education", icon: "🎓", color: "#B5006E", bg: "#FCE8F3" },
];

/* ============================================================
   AUTH SCREEN
   ============================================================ */
function AuthScreen() {
  const { lang, t, setLang } = useLang();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("consumer");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit() {
    setMsg("");
    if (!email || !password) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name, role } },
        });
        if (error) throw error;
        setMsg(t.checkEmail);
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (e) {
      setMsg(e.message || t.errGeneric);
    } finally {
      setBusy(false);
    }
  }

  const langs = [
    { code: "en", label: "🇺🇸 English" },
    { code: "es", label: "🇲🇽 Español" },
    { code: "pt", label: "🇧🇷 Português" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(160deg, #7B2D0A 0%, #C0392B 45%, #E8A020 100%)",
      }}
    >
      {/* Brand */}
      <div className="text-center mb-8">
        <div
          className="w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{
            width: 72,
            height: 72,
            background: "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.35)",
          }}
        >
          <span style={{ fontSize: 36 }}>🤝</span>
        </div>
        <div
          className="text-white"
          style={{ fontFamily: "Georgia, serif", fontSize: 34, fontWeight: 700 }}
        >
          Entre Amigos
        </div>
        <div className="text-white/75 text-sm mt-1">{t.tagline}</div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-7 w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {mode === "signin" ? t.welcomeBack : t.createAccount}
        </h2>

        {/* Language switch */}
        <div className="flex gap-1.5 mb-5">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition"
              style={
                lang === l.code
                  ? {
                      background: "#FFF3DC",
                      border: "1.5px solid #E8A020",
                      color: "#7A5000",
                    }
                  : {
                      background: "#fafafa",
                      border: "1.5px solid #e0e0e0",
                      color: "#666",
                    }
              }
            >
              {l.label}
            </button>
          ))}
        </div>

        {mode === "signup" && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              {t.fullName}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-sm outline-none focus:border-amber-500"
              placeholder="María García"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            {t.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-sm outline-none focus:border-amber-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            {t.password}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-sm outline-none focus:border-amber-500"
            placeholder="••••••••"
          />
        </div>

        {/* Role picker (signup only) */}
        {mode === "signup" && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              {t.iAmA}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { v: "consumer", label: t.consumer },
                { v: "owner", label: t.owner },
                { v: "vendor", label: t.vendor },
              ].map((r) => (
                <button
                  key={r.v}
                  onClick={() => setRole(r.v)}
                  className="py-2 rounded-lg text-xs font-medium transition"
                  style={
                    role === r.v
                      ? {
                          background: "#FDECEA",
                          border: "1.5px solid #C0392B",
                          color: "#9B1C10",
                        }
                      : {
                          background: "#fafafa",
                          border: "1.5px solid #e0e0e0",
                          color: "#666",
                        }
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {msg && (
          <div className="text-xs text-center mb-3 px-2 py-2 rounded-lg bg-amber-50 text-amber-800">
            {msg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={busy}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #C0392B, #E8A020)",
          }}
        >
          {busy ? t.loading : mode === "signin" ? t.signIn : t.signUp}
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">
          {mode === "signin" ? (
            <>
              {t.newHere}{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setMsg("");
                }}
                className="text-red-700 font-semibold"
              >
                {t.createAccount}
              </button>
            </>
          ) : (
            <>
              {t.haveAccount}{" "}
              <button
                onClick={() => {
                  setMode("signin");
                  setMsg("");
                }}
                className="text-red-700 font-semibold"
              >
                {t.signIn}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONSUMER HOME
   ============================================================ */
function ConsumerHome({ profile }) {
  const { t } = useLang();
  const [tab, setTab] = useState("services");
  const displayName = profile?.full_name || t.friend;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFBF4" }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-10 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #7B2D0A 0%, #C0392B 60%, #E8A020 100%)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div
            className="text-white"
            style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700 }}
          >
            Entre Amigos
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
        <div
          className="text-white"
          style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700 }}
        >
          {displayName}
        </div>
        <div className="bg-white/15 border border-white/30 rounded-xl px-3.5 py-2.5 flex items-center gap-2 mt-4">
          <span className="text-white/70">🔍</span>
          <span className="text-white/70 text-sm">{t.searchServices}</span>
        </div>
      </div>

      {/* Content */}
      <div
        className="-mt-5 rounded-t-3xl px-5 py-6 flex-1"
        style={{ background: "#FFFBF4" }}
      >
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[
            { num: "3", lbl: t.active, bg: "#FFF3DC", icon: "✓", c: "#C07000" },
            { num: "1", lbl: t.pending, bg: "#E8F0FE", icon: "◷", c: "#1565C0" },
            { num: "4.8", lbl: t.rating, bg: "#E6F5ED", icon: "★", c: "#1E7D4A" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-3 text-center border border-black/5"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5"
                style={{ background: s.bg, color: s.c }}
              >
                {s.icon}
              </div>
              <div className="text-lg font-bold text-gray-900 leading-none">
                {s.num}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
          {t.services}
        </div>

        {/* Tiles */}
        <div className="grid grid-cols-2 gap-3">
          {TILES.map((tile) => (
            <button
              key={tile.key}
              onClick={() => alert(t[tile.key])}
              className="bg-white rounded-2xl p-4 border border-black/5 text-left relative overflow-hidden hover:-translate-y-0.5 transition"
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: tile.color }}
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5"
                style={{ background: tile.bg, fontSize: 22 }}
              >
                {tile.icon}
              </div>
              <div className="text-sm font-semibold text-gray-900 leading-tight">
                {t[tile.key]}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {t[tile.key + "Sub"]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex bg-white border-t border-black/5 pt-2.5 pb-3.5">
        {[
          { k: "services", icon: "▦", label: t.services },
          { k: "history", icon: "◷", label: t.history },
          { k: "messages", icon: "💬", label: t.messages },
          { k: "profile", icon: "👤", label: t.profile },
        ].map((n) => (
          <button
            key={n.k}
            onClick={() => setTab(n.k)}
            className="flex-1 flex flex-col items-center gap-0.5 py-1"
            style={{ color: tab === n.k ? "#C0392B" : "#bbb" }}
          >
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span className="text-[10px] font-medium">{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   OWNER / VENDOR PLACEHOLDER DASHBOARDS
   ============================================================ */
function RolePlaceholder({ title }) {
  const { t } = useLang();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{ background: "#FFFBF4" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "#F3EEF9", fontSize: 30 }}
      >
        🚧
      </div>
      <div
        style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700 }}
        className="text-gray-900"
      >
        {title}
      </div>
      <div className="text-gray-500 text-sm mt-2 max-w-xs">{t.comingSoon}</div>
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-6 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
        style={{ background: "linear-gradient(135deg, #C0392B, #E8A020)" }}
      >
        {t.signOut}
      </button>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [lang, setLang] = useState("en");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Watch auth state */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  /* Load profile (role + name) from user metadata */
  useEffect(() => {
    if (session?.user) {
      const meta = session.user.user_metadata || {};
      setProfile({
        full_name: meta.full_name || "",
        role: meta.role || "consumer",
      });
    } else {
      setProfile(null);
    }
  }, [session]);

  const t = T[lang];

  let screen;
  if (loading) {
    screen = (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFFBF4" }}
      >
        <div className="text-gray-400">{t.loading}</div>
      </div>
    );
  } else if (!session) {
    screen = <AuthScreen />;
  } else if (profile?.role === "owner") {
    screen = <RolePlaceholder title={t.ownerPanel} />;
  } else if (profile?.role === "vendor") {
    screen = <RolePlaceholder title={t.vendorPanel} />;
  } else {
    screen = <ConsumerHome profile={profile} />;
  }

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {screen}
    </LangContext.Provider>
  );
}
