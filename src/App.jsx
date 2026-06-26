// =============================================
// Entre Amigos — App.jsx
// Phase 2E: Quote system
//   - Vendors build quotes with line items (qty × unit price = total)
//   - Quotes can be revised (new quote supersedes the old)
//   - Customer sees quote with Accept / Decline buttons
//   - Optional notes and valid-until date
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
    welcomeBack: 'Bienvenido', welcomeSub: 'Inicia sesión para continuar',
    email: 'Correo', password: 'Contraseña',
    signIn: 'Iniciar Sesión', signOut: 'Salir',
    loading: 'Cargando...', errGeneric: 'Algo salió mal. Inténtalo de nuevo.',
    inviteOnly: 'Entre Amigos es por invitación. Si te invitaron, usa el enlace que recibiste.',
    goodDay: 'Hola,', friend: 'Amigo',
    searchServices: 'Buscar servicios...',
    services: 'Servicios', history: 'Historial', messages: 'Mensajes', profile: 'Perfil',
    active: 'Activos', pending: 'Pendiente', rating: 'Calificación',
    insurance: 'Seguros', insuranceSub: 'Salud · Auto · Vida',
    doctor: 'Médico', doctorSub: 'Atención cercana',
    buyHome: 'Comprar Casa', buyHomeSub: 'Préstamos · Agentes',
    renting: 'Rentar', rentingSub: 'Apartamentos · Casas',
    mechanic: 'Mecánico', mechanicSub: 'Reparación confiable',
    legal: 'Asesoría Legal', legalSub: 'Inmigración · Derechos',
    banking: 'Banca', bankingSub: 'Cuentas · Envíos',
    education: 'Educación', educationSub: 'Escuelas · ESL · GED',
    adminPanel: 'Panel de Administración', vendorPanel: 'Panel del Proveedor',
    users: 'Usuarios', noUsers: 'No hay usuarios todavía.',
    comingSoon: 'Próximamente',
    inviteUser: 'Invitar Usuario', selectRole: 'Selecciona el rol',
    generateInvite: 'Generar Invitación', inviteLink: 'Enlace de Invitación',
    copyLink: 'Copiar Enlace', copied: '¡Copiado!',
    activeInvites: 'Invitaciones Activas', noInvites: 'No hay invitaciones activas.',
    used: 'Usado', expired: 'Expirado',
    invalidInvite: 'Invitación inválida o expirada.',
    fullName: 'Nombre Completo', completeSignup: 'Completar Registro',
    invitedAs: 'Invitado como', welcomeNew: '¡Bienvenido a Entre Amigos!',
    checkEmail: 'Revisa tu correo para confirmar tu cuenta.',
    roleOwner: 'Dueño', roleManager: 'Gerente', roleEmployee: 'Empleado',
    roleVendor: 'Proveedor', roleCustomer: 'Cliente',
    myCategories: 'Mis Categorías', requestCategory: 'Solicitar Categorías',
    requestNewCategory: 'Solicitar Categorías',
    selectCategories: 'Selecciona las categorías que ofreces',
    selectedCount: 'seleccionadas', submitRequest: 'Enviar Solicitud',
    pendingApproval: 'Pendiente', approved: 'Aprobado', denied: 'Denegado',
    noCategoriesYet: 'Aún no has solicitado categorías. Solicita una para empezar a recibir clientes.',
    cancelRequest: 'Cancelar', approvalQueue: 'Aprobaciones',
    noApprovals: 'No hay solicitudes pendientes.',
    approveBtn: 'Aprobar', denyBtn: 'Denegar',
    requestedAt: 'Solicitado', vendor: 'Proveedor', vendors: 'Proveedores',
    category: 'Categoría', dashboard: 'Inicio',
    cancel: 'Cancelar', done: 'Hecho', back: '← Regresar',
    joinedOn: 'Se unió', noPending: 'Sin solicitudes pendientes',
    noApprovedYet: 'Sin categorías aprobadas', noDeniedYet: 'Sin categorías denegadas',
    revoke: 'Revocar', confirmRevoke: '¿Estás seguro de revocar esta categoría?',
    requestService: 'Solicitar Servicio',
    yourName: 'Tu Nombre', yourPhone: 'Teléfono',
    tellUsMore: 'Cuéntanos qué necesitas',
    detailsPlaceholder: 'Por ejemplo: Busco seguro para mi auto Honda Civic 2018...',
    submitLead: 'Enviar Solicitud', leadSent: '¡Solicitud enviada!',
    leadSentDesc: 'Hemos asignado un proveedor que te contactará pronto.',
    noVendorsAvailable: 'No hay proveedores aprobados para esta categoría todavía.',
    botPlaceholder: 'Próximamente: chat con asistente IA',
    myLeads: 'Mis Leads', leads: 'Leads',
    noLeads: 'No tienes leads asignados todavía.',
    noLeadsCustomer: 'No has solicitado ningún servicio todavía.',
    statusNew: 'Nuevo', statusAssigned: 'Asignado',
    statusClaimed: 'En Progreso', statusQuoted: 'Cotizado',
    statusCompleted: 'Completado', statusExpired: 'Expirado', statusBroadcast: 'Disponible',
    claimLead: 'Aceptar', sendQuote: 'Enviar Cotización',
    markCompleted: 'Marcar Completado',
    customer: 'Cliente', assignedTo: 'Asignado a',
    requiredField: 'Campo obligatorio',
    markUrgent: 'Marcar como urgente',
    urgentNote: '⚡ Urgente: el proveedor tendrá 30 minutos en vez de 60',
    urgent: 'URGENTE',
    timeRemaining: 'Tiempo restante', expiredLabel: 'Tiempo agotado',
    availableLeads: 'Leads Disponibles',
    noAvailable: 'No hay leads disponibles ahora.',
    claimNowDesc: 'Acepta rápido — el primero gana',
    claimNow: 'Aceptar Ahora', claimedByOther: 'Otro proveedor lo aceptó',
    missedLeads: 'Leads Perdidos', noMissed: 'Sin leads perdidos',
    missedAt: 'Perdido el', minutes: 'min', hours: 'hrs',
    leaveReview: 'Calificar Servicio',
    leaveReviewDesc: 'Tu opinión ayuda a otros clientes',
    starsLabel: 'Calificación',
    commentLabel: 'Comentario (opcional)',
    commentPlaceholder: 'Cuéntanos sobre tu experiencia...',
    submitReview: 'Enviar Calificación',
    reviewSent: '¡Gracias por tu calificación!',
    reviewSentDesc: 'Tu calificación está en revisión y aparecerá pronto.',
    reviewPending: 'Calificación pendiente', rateNow: 'Calificar Ahora',
    reviews: 'Calificaciones', reviewsTab: 'Reseñas',
    noReviews: 'Sin calificaciones aprobadas todavía.',
    noReviewsPending: 'Sin calificaciones pendientes.',
    moderationQueue: 'Cola de Moderación',
    rejectReview: 'Rechazar', publishReview: 'Aprobar',
    flagged: 'Calificación baja',
    avgRating: 'Promedio', basedOn: 'basado en',
    review: 'reseña', reviewsPlural: 'reseñas',
    star: 'estrella', stars: 'estrellas',
    flaggedVendorWarning: '⚠ Este proveedor tiene calificación baja. Revisa su perfil.',
    onLead: 'Sobre el servicio',
    // ---- Quotes (Phase 2E) ----
    quote: 'Cotización', quotes: 'Cotizaciones',
    createQuote: 'Crear Cotización', editQuote: 'Editar Cotización',
    viewQuote: 'Ver Cotización', revising: 'Revisando',
    sendQuoteBtn: 'Enviar Cotización',
    quoteSent: '¡Cotización enviada!',
    revisedQuote: 'Cotización Revisada',
    lineItems: 'Conceptos', addItem: '+ Agregar Concepto',
    itemDescription: 'Descripción', itemQty: 'Cant.', itemPrice: 'Precio',
    itemDescPlaceholder: 'Ej: Póliza anual de seguro',
    removeItem: 'Eliminar',
    quoteTotal: 'TOTAL',
    quoteNotes: 'Notas (términos, qué incluye, etc.)',
    notesPlaceholder: 'Por ejemplo: Esta cotización incluye instalación y garantía de 1 año...',
    validUntil: 'Válida hasta',
    acceptQuote: 'Aceptar Cotización',
    declineQuote: 'Rechazar',
    quoteAccepted: '¡Cotización aceptada!',
    quoteDeclined: 'Cotización rechazada',
    quoteFromVendor: 'Cotización de',
    quoteStatus_sent: 'Pendiente',
    quoteStatus_accepted: 'Aceptada',
    quoteStatus_declined: 'Rechazada',
    quoteStatus_expired: 'Expirada',
    quoteStatus_superseded: 'Reemplazada',
    quoteStatus_draft: 'Borrador',
    confirmDecline: '¿Estás seguro de rechazar esta cotización?',
    noQuotes: 'Sin cotizaciones todavía',
    quoteRevisedNote: 'Enviar una nueva cotización reemplaza la anterior',
    needsItems: 'Agrega al menos un concepto',
    needsDescAndPrice: 'Cada concepto necesita descripción y precio',
    viewLineItems: 'Ver conceptos',
  },
  en: {
    tagline: 'We Connect. We Support. We Grow Together.',
    welcomeBack: 'Welcome back', welcomeSub: 'Sign in to continue',
    email: 'Email', password: 'Password',
    signIn: 'Sign In', signOut: 'Sign Out',
    loading: 'Loading...', errGeneric: 'Something went wrong. Please try again.',
    inviteOnly: 'Entre Amigos is invite-only. If you were invited, use the link you received.',
    goodDay: 'Hello,', friend: 'Friend',
    searchServices: 'Search services...',
    services: 'Services', history: 'History', messages: 'Messages', profile: 'Profile',
    active: 'Active', pending: 'Pending', rating: 'Rating',
    insurance: 'Insurance', insuranceSub: 'Health · Auto · Life',
    doctor: 'Doctor', doctorSub: 'Find care near you',
    buyHome: 'Buy a Home', buyHomeSub: 'Loans · Agents',
    renting: 'Renting', rentingSub: 'Apartments · Houses',
    mechanic: 'Mechanic', mechanicSub: 'Trusted auto repair',
    legal: 'Legal Help', legalSub: 'Immigration · Rights',
    banking: 'Banking', bankingSub: 'Accounts · Transfers',
    education: 'Education', educationSub: 'Schools · ESL · GED',
    adminPanel: 'Admin Dashboard', vendorPanel: 'Vendor Dashboard',
    users: 'Users', noUsers: 'No users yet.',
    comingSoon: 'Coming soon',
    inviteUser: 'Invite User', selectRole: 'Select role',
    generateInvite: 'Generate Invite', inviteLink: 'Invite Link',
    copyLink: 'Copy Link', copied: 'Copied!',
    activeInvites: 'Active Invites', noInvites: 'No active invites.',
    used: 'Used', expired: 'Expired',
    invalidInvite: 'Invalid or expired invite.',
    fullName: 'Full Name', completeSignup: 'Complete Signup',
    invitedAs: 'Invited as', welcomeNew: 'Welcome to Entre Amigos!',
    checkEmail: 'Check your email to confirm your account.',
    roleOwner: 'Owner', roleManager: 'Manager', roleEmployee: 'Employee',
    roleVendor: 'Vendor', roleCustomer: 'Customer',
    myCategories: 'My Categories', requestCategory: 'Request Categories',
    requestNewCategory: 'Request Categories',
    selectCategories: 'Select the categories you offer',
    selectedCount: 'selected', submitRequest: 'Submit Request',
    pendingApproval: 'Pending', approved: 'Approved', denied: 'Denied',
    noCategoriesYet: 'You haven\'t requested any categories yet. Request one to start receiving leads.',
    cancelRequest: 'Cancel', approvalQueue: 'Approvals',
    noApprovals: 'No pending requests.',
    approveBtn: 'Approve', denyBtn: 'Deny',
    requestedAt: 'Requested', vendor: 'Vendor', vendors: 'Vendors',
    category: 'Category', dashboard: 'Dashboard',
    cancel: 'Cancel', done: 'Done', back: '← Back',
    joinedOn: 'Joined', noPending: 'No pending requests',
    noApprovedYet: 'No approved categories', noDeniedYet: 'No denied categories',
    revoke: 'Revoke', confirmRevoke: 'Are you sure you want to revoke this category?',
    requestService: 'Request Service',
    yourName: 'Your Name', yourPhone: 'Phone',
    tellUsMore: 'Tell us what you need',
    detailsPlaceholder: 'For example: I\'m looking for insurance for my 2018 Honda Civic...',
    submitLead: 'Submit Request', leadSent: 'Request sent!',
    leadSentDesc: 'We\'ve assigned a vendor who will contact you soon.',
    noVendorsAvailable: 'No approved vendors for this category yet.',
    botPlaceholder: 'Coming soon: chat with AI assistant',
    myLeads: 'My Leads', leads: 'Leads',
    noLeads: 'No leads assigned to you yet.',
    noLeadsCustomer: 'You haven\'t requested any services yet.',
    statusNew: 'New', statusAssigned: 'Assigned',
    statusClaimed: 'In Progress', statusQuoted: 'Quoted',
    statusCompleted: 'Completed', statusExpired: 'Expired', statusBroadcast: 'Available',
    claimLead: 'Accept', sendQuote: 'Send Quote',
    markCompleted: 'Mark Completed',
    customer: 'Customer', assignedTo: 'Assigned to',
    requiredField: 'Required field',
    markUrgent: 'Mark as urgent',
    urgentNote: '⚡ Urgent: vendor has 30 minutes instead of 60',
    urgent: 'URGENT',
    timeRemaining: 'Time left', expiredLabel: 'Time expired',
    availableLeads: 'Available Leads',
    noAvailable: 'No available leads right now.',
    claimNowDesc: 'Claim fast — first one wins',
    claimNow: 'Claim Now', claimedByOther: 'Another vendor claimed it',
    missedLeads: 'Missed Leads', noMissed: 'No missed leads',
    missedAt: 'Missed on', minutes: 'min', hours: 'hrs',
    leaveReview: 'Rate Service', leaveReviewDesc: 'Your feedback helps other customers',
    starsLabel: 'Rating',
    commentLabel: 'Comment (optional)',
    commentPlaceholder: 'Tell us about your experience...',
    submitReview: 'Submit Review',
    reviewSent: 'Thanks for your review!',
    reviewSentDesc: 'Your review is under review and will appear soon.',
    reviewPending: 'Review pending', rateNow: 'Rate Now',
    reviews: 'Reviews', reviewsTab: 'Reviews',
    noReviews: 'No approved reviews yet.',
    noReviewsPending: 'No pending reviews.',
    moderationQueue: 'Moderation Queue',
    rejectReview: 'Reject', publishReview: 'Approve',
    flagged: 'Low rating',
    avgRating: 'Average', basedOn: 'based on',
    review: 'review', reviewsPlural: 'reviews',
    star: 'star', stars: 'stars',
    flaggedVendorWarning: '⚠ This vendor has a low rating. Review their profile.',
    onLead: 'On lead',
    // ---- Quotes (Phase 2E) ----
    quote: 'Quote', quotes: 'Quotes',
    createQuote: 'Create Quote', editQuote: 'Edit Quote',
    viewQuote: 'View Quote', revising: 'Revising',
    sendQuoteBtn: 'Send Quote',
    quoteSent: 'Quote sent!',
    revisedQuote: 'Revised Quote',
    lineItems: 'Line Items', addItem: '+ Add Item',
    itemDescription: 'Description', itemQty: 'Qty', itemPrice: 'Price',
    itemDescPlaceholder: 'e.g. Annual insurance policy',
    removeItem: 'Remove',
    quoteTotal: 'TOTAL',
    quoteNotes: 'Notes (terms, what\'s included, etc.)',
    notesPlaceholder: 'For example: This quote includes installation and 1-year warranty...',
    validUntil: 'Valid until',
    acceptQuote: 'Accept Quote',
    declineQuote: 'Decline',
    quoteAccepted: 'Quote accepted!',
    quoteDeclined: 'Quote declined',
    quoteFromVendor: 'Quote from',
    quoteStatus_sent: 'Pending',
    quoteStatus_accepted: 'Accepted',
    quoteStatus_declined: 'Declined',
    quoteStatus_expired: 'Expired',
    quoteStatus_superseded: 'Superseded',
    quoteStatus_draft: 'Draft',
    confirmDecline: 'Are you sure you want to decline this quote?',
    noQuotes: 'No quotes yet',
    quoteRevisedNote: 'Sending a new quote replaces the previous one',
    needsItems: 'Add at least one item',
    needsDescAndPrice: 'Each item needs description and price',
    viewLineItems: 'View items',
  },
  pt: {
    tagline: 'Conectamos. Apoiamos. Crescemos Juntos.',
    welcomeBack: 'Bem-vindo', welcomeSub: 'Entre para continuar',
    email: 'E-mail', password: 'Senha',
    signIn: 'Entrar', signOut: 'Sair',
    loading: 'Carregando...', errGeneric: 'Algo deu errado. Tente novamente.',
    inviteOnly: 'Entre Amigos é por convite. Se você foi convidado, use o link recebido.',
    goodDay: 'Olá,', friend: 'Amigo',
    searchServices: 'Buscar serviços...',
    services: 'Serviços', history: 'Histórico', messages: 'Mensagens', profile: 'Perfil',
    active: 'Ativos', pending: 'Pendente', rating: 'Avaliação',
    insurance: 'Seguro', insuranceSub: 'Saúde · Auto · Vida',
    doctor: 'Médico', doctorSub: 'Cuidado perto de você',
    buyHome: 'Comprar Casa', buyHomeSub: 'Empréstimos · Agentes',
    renting: 'Alugar', rentingSub: 'Apartamentos · Casas',
    mechanic: 'Mecânico', mechanicSub: 'Reparo confiável',
    legal: 'Ajuda Jurídica', legalSub: 'Imigração · Direitos',
    banking: 'Banco', bankingSub: 'Contas · Transferências',
    education: 'Educação', educationSub: 'Escolas · ESL · GED',
    adminPanel: 'Painel Administrativo', vendorPanel: 'Painel do Fornecedor',
    users: 'Usuários', noUsers: 'Nenhum usuário ainda.',
    comingSoon: 'Em breve',
    inviteUser: 'Convidar Usuário', selectRole: 'Selecione a função',
    generateInvite: 'Gerar Convite', inviteLink: 'Link de Convite',
    copyLink: 'Copiar Link', copied: 'Copiado!',
    activeInvites: 'Convites Ativos', noInvites: 'Nenhum convite ativo.',
    used: 'Usado', expired: 'Expirado',
    invalidInvite: 'Convite inválido ou expirado.',
    fullName: 'Nome Completo', completeSignup: 'Completar Cadastro',
    invitedAs: 'Convidado como', welcomeNew: 'Bem-vindo ao Entre Amigos!',
    checkEmail: 'Verifique seu e-mail para confirmar sua conta.',
    roleOwner: 'Dono', roleManager: 'Gerente', roleEmployee: 'Funcionário',
    roleVendor: 'Fornecedor', roleCustomer: 'Cliente',
    myCategories: 'Minhas Categorias', requestCategory: 'Solicitar Categorias',
    requestNewCategory: 'Solicitar Categorias',
    selectCategories: 'Selecione as categorias que você oferece',
    selectedCount: 'selecionadas', submitRequest: 'Enviar Solicitação',
    pendingApproval: 'Pendente', approved: 'Aprovado', denied: 'Negado',
    noCategoriesYet: 'Você ainda não solicitou categorias. Solicite uma para começar a receber clientes.',
    cancelRequest: 'Cancelar', approvalQueue: 'Aprovações',
    noApprovals: 'Nenhuma solicitação pendente.',
    approveBtn: 'Aprovar', denyBtn: 'Negar',
    requestedAt: 'Solicitado', vendor: 'Fornecedor', vendors: 'Fornecedores',
    category: 'Categoria', dashboard: 'Início',
    cancel: 'Cancelar', done: 'Pronto', back: '← Voltar',
    joinedOn: 'Entrou em', noPending: 'Sem solicitações pendentes',
    noApprovedYet: 'Sem categorias aprovadas', noDeniedYet: 'Sem categorias negadas',
    revoke: 'Revogar', confirmRevoke: 'Tem certeza que deseja revogar esta categoria?',
    requestService: 'Solicitar Serviço',
    yourName: 'Seu Nome', yourPhone: 'Telefone',
    tellUsMore: 'Conte-nos o que precisa',
    detailsPlaceholder: 'Por exemplo: Procuro seguro para meu Honda Civic 2018...',
    submitLead: 'Enviar Solicitação', leadSent: 'Solicitação enviada!',
    leadSentDesc: 'Atribuímos um fornecedor que entrará em contato em breve.',
    noVendorsAvailable: 'Nenhum fornecedor aprovado para esta categoria ainda.',
    botPlaceholder: 'Em breve: chat com assistente de IA',
    myLeads: 'Minhas Solicitações', leads: 'Solicitações',
    noLeads: 'Nenhuma solicitação atribuída a você ainda.',
    noLeadsCustomer: 'Você ainda não solicitou nenhum serviço.',
    statusNew: 'Novo', statusAssigned: 'Atribuído',
    statusClaimed: 'Em Andamento', statusQuoted: 'Cotado',
    statusCompleted: 'Concluído', statusExpired: 'Expirado', statusBroadcast: 'Disponível',
    claimLead: 'Aceitar', sendQuote: 'Enviar Cotação',
    markCompleted: 'Marcar Concluído',
    customer: 'Cliente', assignedTo: 'Atribuído a',
    requiredField: 'Campo obrigatório',
    markUrgent: 'Marcar como urgente',
    urgentNote: '⚡ Urgente: fornecedor terá 30 minutos em vez de 60',
    urgent: 'URGENTE',
    timeRemaining: 'Tempo restante', expiredLabel: 'Tempo esgotado',
    availableLeads: 'Leads Disponíveis',
    noAvailable: 'Nenhum lead disponível agora.',
    claimNowDesc: 'Aceite rápido — o primeiro ganha',
    claimNow: 'Aceitar Agora', claimedByOther: 'Outro fornecedor aceitou',
    missedLeads: 'Leads Perdidos', noMissed: 'Nenhum lead perdido',
    missedAt: 'Perdido em', minutes: 'min', hours: 'hrs',
    leaveReview: 'Avaliar Serviço',
    leaveReviewDesc: 'Sua opinião ajuda outros clientes',
    starsLabel: 'Avaliação',
    commentLabel: 'Comentário (opcional)',
    commentPlaceholder: 'Conte-nos sobre sua experiência...',
    submitReview: 'Enviar Avaliação',
    reviewSent: 'Obrigado pela sua avaliação!',
    reviewSentDesc: 'Sua avaliação está em revisão e aparecerá em breve.',
    reviewPending: 'Avaliação pendente', rateNow: 'Avaliar Agora',
    reviews: 'Avaliações', reviewsTab: 'Avaliações',
    noReviews: 'Sem avaliações aprovadas ainda.',
    noReviewsPending: 'Sem avaliações pendentes.',
    moderationQueue: 'Fila de Moderação',
    rejectReview: 'Rejeitar', publishReview: 'Aprovar',
    flagged: 'Avaliação baixa',
    avgRating: 'Média', basedOn: 'baseado em',
    review: 'avaliação', reviewsPlural: 'avaliações',
    star: 'estrela', stars: 'estrelas',
    flaggedVendorWarning: '⚠ Este fornecedor tem avaliação baixa. Revise o perfil.',
    onLead: 'Sobre o serviço',
    // ---- Quotes (Phase 2E) ----
    quote: 'Cotação', quotes: 'Cotações',
    createQuote: 'Criar Cotação', editQuote: 'Editar Cotação',
    viewQuote: 'Ver Cotação', revising: 'Revisando',
    sendQuoteBtn: 'Enviar Cotação',
    quoteSent: 'Cotação enviada!',
    revisedQuote: 'Cotação Revisada',
    lineItems: 'Itens', addItem: '+ Adicionar Item',
    itemDescription: 'Descrição', itemQty: 'Qtd', itemPrice: 'Preço',
    itemDescPlaceholder: 'Ex: Apólice anual de seguro',
    removeItem: 'Remover',
    quoteTotal: 'TOTAL',
    quoteNotes: 'Notas (termos, o que inclui, etc.)',
    notesPlaceholder: 'Por exemplo: Esta cotação inclui instalação e garantia de 1 ano...',
    validUntil: 'Válida até',
    acceptQuote: 'Aceitar Cotação',
    declineQuote: 'Recusar',
    quoteAccepted: 'Cotação aceita!',
    quoteDeclined: 'Cotação recusada',
    quoteFromVendor: 'Cotação de',
    quoteStatus_sent: 'Pendente',
    quoteStatus_accepted: 'Aceita',
    quoteStatus_declined: 'Recusada',
    quoteStatus_expired: 'Expirada',
    quoteStatus_superseded: 'Substituída',
    quoteStatus_draft: 'Rascunho',
    confirmDecline: 'Tem certeza que deseja recusar esta cotação?',
    noQuotes: 'Sem cotações ainda',
    quoteRevisedNote: 'Enviar uma nova cotação substitui a anterior',
    needsItems: 'Adicione pelo menos um item',
    needsDescAndPrice: 'Cada item precisa de descrição e preço',
    viewLineItems: 'Ver itens',
  },
}

const LangContext = createContext({ lang: 'es', t: T.es, setLang: () => {} })
const useLang = () => useContext(LangContext)

const TILES = [
  { key: 'insurance', icon: '🛡️' }, { key: 'doctor', icon: '🩺' },
  { key: 'buyHome', icon: '🏠' }, { key: 'renting', icon: '🏢' },
  { key: 'mechanic', icon: '🔧' }, { key: 'legal', icon: '⚖️' },
  { key: 'banking', icon: '🏦' }, { key: 'education', icon: '🎓' },
]

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

function fmtDate(d) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function fmtMoney(n) {
  const num = Number(n) || 0
  return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtCountdown(deadlineIso, t) {
  if (!deadlineIso) return ''
  const diff = new Date(deadlineIso) - new Date()
  if (diff <= 0) return t.expiredLabel
  const totalMin = Math.floor(diff / 60000)
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  const secs = Math.floor((diff % 60000) / 1000)
  if (hours > 0) return `${hours}${t.hours} ${mins}${t.minutes}`
  if (mins > 0) return `${mins}${t.minutes} ${secs}s`
  return `${secs}s`
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

function StarRating({ value, onChange, size = 'md', readonly = false }) {
  const sizes = { sm: 14, md: 24, lg: 36 }
  const fs = sizes[size]
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n}
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(n)}
          className={readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition'}
          style={{ fontSize: fs, color: n <= value ? '#E8A020' : '#d0d0d0', background: 'none', border: 'none', padding: 0 }}>
          ★
        </button>
      ))}
    </div>
  )
}

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
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
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

function AppHeader({ profile, subtitle, onBack }) {
  const { t } = useLang()
  return (
    <div className="px-5 pt-5 pb-10" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #C8202F 100%)' }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="text-white text-sm font-semibold bg-white/20 border border-white/25 px-2 py-1 rounded-lg mr-1">
              {t.back}
            </button>
          )}
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

function leadStatusBadge(status, t) {
  const map = {
    new: { label: t.statusNew, color: '#6B7280' },
    assigned: { label: t.statusAssigned, color: '#E8A020' },
    claimed: { label: t.statusClaimed, color: '#1B3A6B' },
    quoted: { label: t.statusQuoted, color: '#1F8A4C' },
    completed: { label: t.statusCompleted, color: '#1F8A4C' },
    expired: { label: t.statusExpired, color: '#C8202F' },
    broadcast: { label: t.statusBroadcast, color: '#C8202F' },
  }
  return map[status] || { label: status, color: '#6B7280' }
}

function quoteStatusBadge(status, t) {
  const colors = {
    sent: '#E8A020', accepted: '#1F8A4C', declined: '#C8202F',
    expired: '#6B7280', superseded: '#6B7280', draft: '#6B7280',
  }
  return { label: t['quoteStatus_' + status] || status, color: colors[status] || '#6B7280' }
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
    } catch (e) { setMsg(e.message || t.errGeneric) }
    finally { setBusy(false) }
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
      const { data } = await supabase.from('invites').select('*')
        .eq('code', inviteCode).eq('used', false)
        .gt('expires_at', new Date().toISOString()).single()
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
    } catch (e) { setMsg(e.message || t.errGeneric) }
    finally { setBusy(false) }
  }

  if (checking) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBF6EC' }}><div className="text-gray-400">{t.loading}</div></div>

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
// QUOTE BUILDER MODAL — vendor creates / revises a quote
// =============================================
function QuoteBuilderModal({ lead, profile, existingQuote, onClose, onSuccess }) {
  const { t } = useLang()
  // Items state: array of { description, quantity, unit_price }
  const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0 }])
  const [notes, setNotes] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // If we're "revising" an existing quote, prefill its values
  useEffect(() => {
    if (existingQuote) {
      // Load the quote's line items
      supabase.from('quote_items').select('*').eq('quote_id', existingQuote.id).order('sort_order')
        .then(({ data }) => {
          if (data && data.length > 0) {
            setItems(data.map((i) => ({
              description: i.description, quantity: i.quantity, unit_price: i.unit_price
            })))
          }
        })
      setNotes(existingQuote.notes || '')
      if (existingQuote.valid_until) {
        // Convert ISO to yyyy-mm-dd for the date input
        setValidUntil(existingQuote.valid_until.split('T')[0])
      }
    }
  }, [existingQuote])

  // Calculate total live
  const total = items.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)
  }, 0)

  function updateItem(index, field, value) {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    setItems(next)
  }

  function addItem() {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }])
  }

  function removeItem(index) {
    if (items.length === 1) return // Always keep at least one item
    setItems(items.filter((_, i) => i !== index))
  }

  async function submitQuote() {
    setError('')
    // Validation
    if (items.length === 0) { setError(t.needsItems); return }
    for (const item of items) {
      if (!item.description || Number(item.unit_price) <= 0) {
        setError(t.needsDescAndPrice); return
      }
    }

    setBusy(true)
    try {
      // Step 1: create the new quote row (the supersede trigger handles old ones)
      const { data: newQuote, error: qErr } = await supabase.from('quotes').insert({
        lead_id: lead.id,
        vendor_id: profile.id,
        customer_id: lead.customer_id,
        total: total,
        notes: notes || null,
        valid_until: validUntil ? new Date(validUntil).toISOString() : null,
        status: 'sent',
      }).select().single()
      if (qErr) throw qErr

      // Step 2: insert the line items
      const itemRows = items.map((item, idx) => ({
        quote_id: newQuote.id,
        description: item.description,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.unit_price) || 0,
        line_total: (Number(item.quantity) || 1) * (Number(item.unit_price) || 0),
        sort_order: idx,
      }))
      const { error: iErr } = await supabase.from('quote_items').insert(itemRows)
      if (iErr) throw iErr

      // Step 3: update lead status to 'quoted'
      await supabase.from('leads').update({ status: 'quoted' }).eq('id', lead.id)

      onSuccess()
    } catch (e) {
      setError(e.message || t.errGeneric)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[92vh] flex flex-col">
        <h3 className="text-lg font-bold mb-1" style={{ color: '#1B3A6B' }}>
          {existingQuote ? t.revisedQuote : t.createQuote}
        </h3>
        {existingQuote && (
          <p className="text-xs italic text-gray-500 mb-3">{t.quoteRevisedNote}</p>
        )}

        <div className="overflow-y-auto flex-1 -mx-1 px-1">
          {/* Line Items */}
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#1B3A6B' }}>
            {t.lineItems}
          </label>
          <div className="space-y-3 mb-4">
            {items.map((item, idx) => (
              <div key={idx} className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                {/* Description full width */}
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(idx, 'description', e.target.value)}
                  placeholder={t.itemDescPlaceholder}
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-sm outline-none mb-2"
                  style={{ borderColor: '#e0e0e0' }}
                />
                {/* Qty + price side by side */}
                <div className="flex gap-2 items-end">
                  <div className="w-16">
                    <label className="block text-[10px] text-gray-500 mb-0.5">{t.itemQty}</label>
                    <input
                      type="number"
                      min="1" step="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border bg-gray-50 text-sm outline-none text-center"
                      style={{ borderColor: '#e0e0e0' }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-0.5">{t.itemPrice}</label>
                    <input
                      type="number"
                      min="0" step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-2 py-1.5 rounded-lg border bg-gray-50 text-sm outline-none"
                      style={{ borderColor: '#e0e0e0' }}
                    />
                  </div>
                  <div className="text-right" style={{ minWidth: 70 }}>
                    <label className="block text-[10px] text-gray-500 mb-0.5">=</label>
                    <p className="text-sm font-bold py-1.5" style={{ color: '#1F8A4C' }}>
                      {fmtMoney((Number(item.quantity) || 0) * (Number(item.unit_price) || 0))}
                    </p>
                  </div>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(idx)}
                      className="text-lg pb-1" style={{ color: '#C8202F' }}>✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button onClick={addItem}
            className="w-full py-2 rounded-xl border-2 border-dashed text-sm font-semibold mb-4"
            style={{ borderColor: '#1B3A6B', color: '#1B3A6B' }}>
            {t.addItem}
          </button>

          {/* TOTAL */}
          <div className="border-t-2 pt-3 mb-4 flex justify-between items-center" style={{ borderColor: '#1B3A6B' }}>
            <span className="font-bold text-sm" style={{ color: '#1B3A6B' }}>{t.quoteTotal}</span>
            <span className="text-2xl font-bold" style={{ color: '#1F8A4C' }}>{fmtMoney(total)}</span>
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.quoteNotes}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-sm outline-none resize-none"
              style={{ borderColor: '#e0e0e0' }} placeholder={t.notesPlaceholder} />
          </div>

          {/* Valid until */}
          <div className="mb-3">
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.validUntil}</label>
            <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-sm outline-none"
              style={{ borderColor: '#e0e0e0' }} />
          </div>
        </div>

        {error && (
          <div className="text-xs text-center mb-2 px-2 py-2 rounded-lg" style={{ background: '#FDECEA', color: '#9B1C10' }}>{error}</div>
        )}

        <button onClick={submitQuote} disabled={busy || total <= 0}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40 mb-2"
          style={{ backgroundColor: '#C8202F' }}>
          {busy ? t.loading : t.sendQuoteBtn + ' — ' + fmtMoney(total)}
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm" style={{ color: '#1B3A6B' }}>{t.cancel}</button>
      </div>
    </div>
  )
}

// =============================================
// QUOTE VIEWER MODAL — customer or vendor views a quote
// Customer sees Accept/Decline buttons; vendor sees read-only
// =============================================
function QuoteViewerModal({ quote, profile, role, onClose, onResponded }) {
  const { t } = useLang()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('quote_items').select('*')
        .eq('quote_id', quote.id).order('sort_order')
      if (data) setItems(data)
      setLoading(false)
    }
    load()
  }, [quote.id])

  async function acceptQuote() {
    setBusy(true)
    await supabase.from('quotes')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .eq('id', quote.id)
    setBusy(false)
    onResponded('accepted')
  }

  async function declineQuote() {
    if (!window.confirm(t.confirmDecline)) return
    setBusy(true)
    await supabase.from('quotes')
      .update({ status: 'declined', responded_at: new Date().toISOString() })
      .eq('id', quote.id)
    setBusy(false)
    onResponded('declined')
  }

  const badge = quoteStatusBadge(quote.status, t)
  const isCustomer = role === 'customer'
  const canRespond = isCustomer && quote.status === 'sent'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[92vh] flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold" style={{ color: '#1B3A6B' }}>{t.quote}</h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: badge.color }}>
            {badge.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">{fmtDate(quote.created_at)}</p>

        <div className="overflow-y-auto flex-1 -mx-1 px-1">
          {loading ? (
            <p className="text-center text-gray-400 py-6">{t.loading}</p>
          ) : (
            <>
              {/* Line items */}
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-xl p-3 flex items-center gap-3" style={{ borderColor: '#e0e0e0' }}>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: '#1B3A6B' }}>{item.description}</p>
                      <p className="text-xs text-gray-500">{item.quantity} × {fmtMoney(item.unit_price)}</p>
                    </div>
                    <p className="font-bold text-sm" style={{ color: '#1F8A4C' }}>{fmtMoney(item.line_total)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t-2 pt-3 mb-4 flex justify-between items-center" style={{ borderColor: '#1B3A6B' }}>
                <span className="font-bold" style={{ color: '#1B3A6B' }}>{t.quoteTotal}</span>
                <span className="text-2xl font-bold" style={{ color: '#1F8A4C' }}>{fmtMoney(quote.total)}</span>
              </div>

              {/* Notes */}
              {quote.notes && (
                <div className="rounded-xl p-3 mb-3 text-sm" style={{ background: '#FBF6EC', color: '#1B3A6B' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide mb-1 text-gray-500">{t.quoteNotes.split(' (')[0]}</p>
                  <p className="whitespace-pre-wrap">{quote.notes}</p>
                </div>
              )}

              {/* Valid until */}
              {quote.valid_until && (
                <p className="text-xs text-gray-500 text-center mb-3">
                  {t.validUntil}: {new Date(quote.valid_until).toLocaleDateString()}
                </p>
              )}
            </>
          )}
        </div>

        {/* Action buttons */}
        {canRespond && (
          <div className="flex gap-2 mt-2 mb-2">
            <button onClick={acceptQuote} disabled={busy}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
              style={{ backgroundColor: '#1F8A4C' }}>
              ✓ {t.acceptQuote}
            </button>
            <button onClick={declineQuote} disabled={busy}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
              style={{ backgroundColor: '#C8202F' }}>
              ✕ {t.declineQuote}
            </button>
          </div>
        )}
        <button onClick={onClose} className="w-full py-2 text-sm" style={{ color: '#1B3A6B' }}>
          {canRespond ? t.cancel : t.done}
        </button>
      </div>
    </div>
  )
}

// =============================================
// REVIEW MODAL (from Phase 2D)
// =============================================
function ReviewModal({ lead, profile, onClose, onSuccess }) {
  const { t } = useLang()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (rating === 0) { setError(t.requiredField); return }
    setError('')
    setBusy(true)
    const { error } = await supabase.from('reviews').insert({
      lead_id: lead.id, vendor_id: lead.assigned_vendor_id,
      customer_id: profile.id, rating, comment: comment || null, status: 'pending',
    })
    setBusy(false)
    if (error) { setError(error.message); return }
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-1" style={{ color: '#1B3A6B' }}>{t.leaveReview}</h3>
        <p className="text-xs text-gray-500 mb-4">{t.leaveReviewDesc}</p>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#1B3A6B' }}>{t.starsLabel}</label>
          <div className="flex justify-center py-2">
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.commentLabel}</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none resize-none"
            style={{ borderColor: '#e0e0e0' }} placeholder={t.commentPlaceholder} />
        </div>

        {error && <div className="text-xs text-center mb-3 px-2 py-2 rounded-lg" style={{ background: '#FDECEA', color: '#9B1C10' }}>{error}</div>}

        <button onClick={submit} disabled={busy || rating === 0}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40 mb-2"
          style={{ backgroundColor: '#C8202F' }}>
          {busy ? t.loading : t.submitReview}
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm" style={{ color: '#1B3A6B' }}>{t.cancel}</button>
      </div>
    </div>
  )
}

// =============================================
// LEAD REQUEST MODAL (from earlier phases)
// =============================================
function LeadRequestModal({ profile, category, onClose, onSuccess }) {
  const { t } = useLang()
  const [name, setName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    setError('')
    if (!name || !phone || !details) { setError(t.requiredField); return }
    setBusy(true)
    try {
      const { data: vendorId, error: rpcErr } = await supabase
        .rpc('assign_next_vendor', { p_category_id: category.id })
      if (rpcErr) throw rpcErr

      const leadRow = {
        customer_id: profile.id, category_id: category.id,
        customer_name: name, customer_phone: phone, details: details, urgent: urgent,
        assigned_vendor_id: vendorId || null,
        assigned_at: vendorId ? new Date().toISOString() : null,
        status: vendorId ? 'assigned' : 'new',
      }
      const { error: insertErr } = await supabase.from('leads').insert(leadRow)
      if (insertErr) throw insertErr
      onSuccess(vendorId)
    } catch (e) { setError(e.message || t.errGeneric) }
    finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <span style={{ fontSize: 28 }}>{category.icon}</span>
          <h3 className="text-lg font-bold" style={{ color: '#1B3A6B' }}>
            {t.requestService}: {t[category.key]}
          </h3>
        </div>

        <div className="text-xs italic text-gray-500 mb-4 p-2 rounded-lg" style={{ background: '#FBF6EC' }}>
          💬 {t.botPlaceholder}
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.yourName}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }} />
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.yourPhone}</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none"
            style={{ borderColor: '#e0e0e0' }} placeholder="555-555-5555" />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1B3A6B' }}>{t.tellUsMore}</label>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] bg-gray-50 text-sm outline-none resize-none"
            style={{ borderColor: '#e0e0e0' }} placeholder={t.detailsPlaceholder} />
        </div>

        <button onClick={() => setUrgent(!urgent)}
          className="w-full border rounded-xl p-3 flex items-center gap-3 text-left transition mb-2"
          style={urgent ? { borderColor: '#C8202F', background: '#FDECEA', borderWidth: 2 } : { borderColor: '#e0e0e0', borderWidth: 1.5 }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={urgent ? { background: '#C8202F', color: 'white' } : { background: 'white', border: '2px solid #d0d0d0' }}>
            {urgent && '✓'}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: urgent ? '#9B1C10' : '#1B3A6B' }}>⚡ {t.markUrgent}</p>
            {urgent && <p className="text-xs mt-0.5" style={{ color: '#9B1C10' }}>{t.urgentNote}</p>}
          </div>
        </button>

        {error && <div className="text-xs text-center mb-3 px-2 py-2 rounded-lg" style={{ background: '#FDECEA', color: '#9B1C10' }}>{error}</div>}

        <button onClick={submit} disabled={busy}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 mb-2 mt-2"
          style={{ backgroundColor: urgent ? '#C8202F' : '#1B3A6B' }}>
          {busy ? t.loading : t.submitLead}
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm" style={{ color: '#1B3A6B' }}>{t.cancel}</button>
      </div>
    </div>
  )
}

// =============================================
// CUSTOMER HOME — now with "View Quote" button on quoted leads
// =============================================
function CustomerHome({ profile }) {
  const { t } = useLang()
  const [tab, setTab] = useState('services')
  const [categories, setCategories] = useState([])
  const [myLeads, setMyLeads] = useState([])
  const [myReviewLeadIds, setMyReviewLeadIds] = useState([])
  const [latestQuotes, setLatestQuotes] = useState({}) // map leadId → latest sent quote
  const [leadModalCategory, setLeadModalCategory] = useState(null)
  const [reviewLead, setReviewLead] = useState(null)
  const [viewQuote, setViewQuote] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const displayName = profile?.full_name || t.friend

  const tileStyles = [
    { color: '#C8202F', bg: '#FDECEA' },
    { color: '#1F8A4C', bg: '#E6F5ED' },
    { color: '#1B3A6B', bg: '#E8EEF7' },
    { color: '#E8A020', bg: '#FFF3DC' },
  ]

  useEffect(() => { loadCategories(); loadLeads(); loadMyReviews() }, [])

  async function loadCategories() {
    const { data } = await supabase.from('categories').select('*').eq('active', true)
    if (data) setCategories(data)
  }

  async function loadLeads() {
    const { data } = await supabase.from('leads')
      .select('*, categories(*)').eq('customer_id', profile.id)
      .order('created_at', { ascending: false })
    if (data) {
      setMyLeads(data)
      // Load latest 'sent' or 'accepted' quote per lead so we can show a button
      const leadIds = data.map((l) => l.id)
      if (leadIds.length > 0) {
        const { data: quotes } = await supabase.from('quotes')
          .select('*').in('lead_id', leadIds)
          .in('status', ['sent', 'accepted', 'declined'])
          .order('created_at', { ascending: false })
        if (quotes) {
          const map = {}
          quotes.forEach((q) => {
            // Only keep the most recent quote per lead (since they're ordered desc)
            if (!map[q.lead_id]) map[q.lead_id] = q
          })
          setLatestQuotes(map)
        }
      }
    }
  }

  async function loadMyReviews() {
    const { data } = await supabase.from('reviews').select('lead_id').eq('customer_id', profile.id)
    if (data) setMyReviewLeadIds(data.map((r) => r.lead_id))
  }

  function handleTileClick(tileKey) {
    const cat = categories.find((c) => c.key === tileKey)
    if (cat) setLeadModalCategory(cat)
  }

  function handleLeadSuccess(vendorId) {
    setLeadModalCategory(null)
    setSuccessMsg({ vendorId })
    loadLeads()
  }

  function handleReviewSuccess() {
    setReviewLead(null)
    setReviewSuccess(true)
    loadMyReviews()
  }

  function handleQuoteResponded(action) {
    setViewQuote(null)
    loadLeads()
    alert(action === 'accepted' ? t.quoteAccepted : t.quoteDeclined)
  }

  const activeCount = myLeads.filter(l => ['assigned', 'claimed', 'quoted'].includes(l.status)).length
  const pendingCount = myLeads.filter(l => l.status === 'new' || l.status === 'broadcast').length

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

        {tab === 'services' && (
          <>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {[
                { num: activeCount, lbl: t.active, bg: '#FDECEA', c: '#C8202F', icon: '✓' },
                { num: pendingCount, lbl: t.pending, bg: '#E8EEF7', c: '#1B3A6B', icon: '◷' },
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
                  <button key={tile.key} onClick={() => handleTileClick(tile.key)}
                    className="bg-white rounded-2xl p-4 border border-black/5 text-left relative overflow-hidden hover:-translate-y-0.5 transition">
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: s.color }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5" style={{ background: s.bg, fontSize: 22 }}>{tile.icon}</div>
                    <div className="text-sm font-semibold leading-tight" style={{ color: '#1B3A6B' }}>{t[tile.key]}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{t[tile.key + 'Sub']}</div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {tab === 'history' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.myLeads} ({myLeads.length})</h3>
            {myLeads.length === 0 ? (
              <p className="text-gray-500 text-sm">{t.noLeadsCustomer}</p>
            ) : (
              <div className="space-y-2">
                {myLeads.map((lead) => {
                  const catKey = lead.categories?.key
                  const badge = leadStatusBadge(lead.status, t)
                  const canReview = lead.status === 'completed' && lead.assigned_vendor_id && !myReviewLeadIds.includes(lead.id)
                  const alreadyReviewed = myReviewLeadIds.includes(lead.id)
                  const quote = latestQuotes[lead.id]
                  return (
                    <div key={lead.id} className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 22 }}>{lead.categories?.icon}</span>
                          <div>
                            <p className="font-semibold text-sm flex items-center gap-2" style={{ color: '#1B3A6B' }}>
                              {catKey ? t[catKey] : '?'}
                              {lead.urgent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: '#C8202F' }}>⚡ {t.urgent}</span>}
                            </p>
                            <p className="text-xs text-gray-500">{fmtDate(lead.created_at)}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: badge.color }}>{badge.label}</span>
                      </div>
                      {lead.details && <p className="text-xs text-gray-600 mt-1 mb-2">{lead.details}</p>}

                      {/* View Quote button — visible if a quote exists */}
                      {quote && (
                        <button onClick={() => setViewQuote(quote)}
                          className="w-full py-2 rounded-lg text-white text-xs font-semibold mt-2 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#1B3A6B' }}>
                          💰 {t.viewQuote} — {fmtMoney(quote.total)}
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: quoteStatusBadge(quote.status, t).color }}>
                            {quoteStatusBadge(quote.status, t).label}
                          </span>
                        </button>
                      )}

                      {canReview && (
                        <button onClick={() => setReviewLead(lead)}
                          className="w-full py-2 rounded-lg text-white text-xs font-semibold mt-2"
                          style={{ backgroundColor: '#E8A020' }}>
                          ⭐ {t.rateNow}
                        </button>
                      )}
                      {alreadyReviewed && lead.status === 'completed' && (
                        <p className="text-xs text-center mt-2" style={{ color: '#1F8A4C' }}>✓ {t.reviewPending}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {(tab === 'messages' || tab === 'profile') && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-500">{t.comingSoon}</p>
          </div>
        )}
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

      {leadModalCategory && (
        <LeadRequestModal profile={profile} category={leadModalCategory}
          onClose={() => setLeadModalCategory(null)} onSuccess={handleLeadSuccess} />
      )}

      {reviewLead && (
        <ReviewModal lead={reviewLead} profile={profile}
          onClose={() => setReviewLead(null)} onSuccess={handleReviewSuccess} />
      )}

      {viewQuote && (
        <QuoteViewerModal quote={viewQuote} profile={profile} role="customer"
          onClose={() => setViewQuote(null)} onResponded={handleQuoteResponded} />
      )}

      {reviewSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-3xl" style={{ background: '#1F8A4C' }}>✓</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1B3A6B' }}>{t.reviewSent}</h3>
            <p className="text-sm text-gray-500 mb-4">{t.reviewSentDesc}</p>
            <button onClick={() => setReviewSuccess(false)}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm"
              style={{ backgroundColor: '#1B3A6B' }}>{t.done}</button>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-3xl"
              style={{ background: successMsg.vendorId ? '#1F8A4C' : '#E8A020' }}>
              {successMsg.vendorId ? '✓' : '!'}
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1B3A6B' }}>
              {successMsg.vendorId ? t.leadSent : t.noVendorsAvailable}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{successMsg.vendorId ? t.leadSentDesc : ''}</p>
            <button onClick={() => { setSuccessMsg(null); setTab('history') }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm"
              style={{ backgroundColor: '#1B3A6B' }}>{t.done}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Countdown({ deadline }) {
  const { t } = useLang()
  const [_, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(interval)
  }, [])
  const text = fmtCountdown(deadline, t)
  const isExpired = text === t.expiredLabel
  return (
    <span className="text-xs font-bold" style={{ color: isExpired ? '#C8202F' : '#E8A020' }}>
      ⏱ {text}
    </span>
  )
}

// =============================================
// VENDOR DASHBOARD — now with Quote builder hooked up
// =============================================
function VendorDashboard({ profile }) {
  const { t } = useLang()
  const [tab, setTab] = useState('leads')
  const [myCategories, setMyCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [myLeads, setMyLeads] = useState([])
  const [broadcastLeads, setBroadcastLeads] = useState([])
  const [myStats, setMyStats] = useState(null)
  // Map leadId → latest quote (for showing "View / Edit" instead of "Send Quote")
  const [leadQuotes, setLeadQuotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [submitting, setSubmitting] = useState(false)
  // Quote modal state
  const [quoteBuilder, setQuoteBuilder] = useState(null) // { lead, existingQuote? }
  const [viewQuote, setViewQuote] = useState(null)

  async function loadMyCategories() {
    const { data } = await supabase.from('vendor_categories')
      .select('*, categories(*)').eq('vendor_id', profile.id)
      .order('requested_at', { ascending: false })
    if (data) setMyCategories(data)
  }
  async function loadAllCategories() {
    const { data } = await supabase.from('categories').select('*').eq('active', true)
    if (data) setAllCategories(data)
  }
  async function loadMyLeads() {
    const { data } = await supabase.from('leads')
      .select('*, categories(*), profiles!leads_customer_id_fkey(full_name, email)')
      .eq('assigned_vendor_id', profile.id)
      .order('created_at', { ascending: false })
    if (data) {
      setMyLeads(data)
      // Load latest quote per lead (sent, accepted, declined — skip superseded)
      const leadIds = data.map((l) => l.id)
      if (leadIds.length > 0) {
        const { data: quotes } = await supabase.from('quotes')
          .select('*').in('lead_id', leadIds).eq('vendor_id', profile.id)
          .in('status', ['sent', 'accepted', 'declined'])
          .order('created_at', { ascending: false })
        if (quotes) {
          const map = {}
          quotes.forEach((q) => { if (!map[q.lead_id]) map[q.lead_id] = q })
          setLeadQuotes(map)
        }
      }
    }
  }
  async function loadBroadcastLeads() {
    const { data } = await supabase.from('leads')
      .select('*, categories(*), profiles!leads_customer_id_fkey(full_name, email)')
      .eq('status', 'broadcast').order('broadcast_at', { ascending: false })
    if (data) setBroadcastLeads(data)
  }
  async function loadMyStats() {
    const { data } = await supabase.rpc('get_vendor_stats', { p_vendor_id: profile.id })
    if (data && data.length > 0) setMyStats(data[0])
  }

  useEffect(() => {
    Promise.all([loadMyCategories(), loadAllCategories(), loadMyLeads(), loadBroadcastLeads(), loadMyStats()])
      .then(() => setLoading(false))
    const refresh = setInterval(() => { loadMyLeads(); loadBroadcastLeads() }, 30000)
    return () => clearInterval(refresh)
  }, [])

  function toggleSelected(catId) {
    setSelectedIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    )
  }

  async function submitRequests() {
    if (selectedIds.length === 0) return
    setSubmitting(true)
    const rows = selectedIds.map((catId) => ({
      vendor_id: profile.id, category_id: catId, status: 'pending',
    }))
    const { error } = await supabase.from('vendor_categories').insert(rows)
    if (error) { alert('Error: ' + error.message) }
    else { await loadMyCategories(); setSelectedIds([]); setShowRequestModal(false) }
    setSubmitting(false)
  }

  async function cancelRequest(reqId) {
    const { error } = await supabase.from('vendor_categories').delete().eq('id', reqId)
    if (!error) loadMyCategories()
  }

  async function claimLead(leadId) {
    await supabase.from('leads').update({ status: 'claimed' }).eq('id', leadId)
    loadMyLeads()
  }
  async function completeLead(leadId) {
    await supabase.from('leads').update({ status: 'completed' }).eq('id', leadId)
    loadMyLeads()
  }

  async function claimBroadcastLead(leadId) {
    const { data, error } = await supabase.rpc('claim_broadcast_lead', { p_lead_id: leadId })
    if (error) { alert('Error: ' + error.message); return }
    if (data === true) { loadMyLeads(); loadBroadcastLeads() }
    else { alert(t.claimedByOther); loadBroadcastLeads() }
  }

  function handleQuoteSuccess() {
    setQuoteBuilder(null)
    loadMyLeads()
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

        {myStats && myStats.review_count > 0 && (
          <div className="bg-white rounded-2xl shadow p-4 mb-4 flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: myStats.below_threshold ? '#C8202F' : '#1F8A4C' }}>
                {parseFloat(myStats.avg_rating).toFixed(1)}
              </div>
              <StarRating value={Math.round(parseFloat(myStats.avg_rating))} readonly size="sm" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold" style={{ color: '#1B3A6B' }}>{t.avgRating}</p>
              <p className="text-gray-500">{t.basedOn} {myStats.review_count} {myStats.review_count === 1 ? t.review : t.reviewsPlural}</p>
              {myStats.below_threshold && (
                <p className="mt-1" style={{ color: '#C8202F' }}>⚠ {t.flagged}</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-1 flex mb-5 shadow-sm">
          {[
            { k: 'leads', label: t.myLeads, count: myLeads.length },
            { k: 'categories', label: t.myCategories, count: myCategories.length },
          ].map((tabItem) => (
            <button key={tabItem.k} onClick={() => setTab(tabItem.k)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition"
              style={tab === tabItem.k ? { background: '#1B3A6B', color: 'white' } : { color: '#666' }}>
              {tabItem.label} ({tabItem.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">{t.loading}</div>
        ) : (
          <>
            {tab === 'leads' && (
              <>
                {broadcastLeads.length > 0 && (
                  <div className="bg-white rounded-2xl shadow p-4 mb-4 border-2" style={{ borderColor: '#C8202F' }}>
                    <h3 className="font-bold mb-1 flex items-center gap-2" style={{ color: '#C8202F' }}>
                      📢 {t.availableLeads} ({broadcastLeads.length})
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{t.claimNowDesc}</p>
                    <div className="space-y-3">
                      {broadcastLeads.map((lead) => {
                        const catKey = lead.categories?.key
                        return (
                          <div key={lead.id} className="border rounded-xl p-3" style={{ borderColor: '#FDECEA', background: '#FFF9F8' }}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: 22 }}>{lead.categories?.icon}</span>
                                <div>
                                  <p className="font-semibold text-sm flex items-center gap-2" style={{ color: '#1B3A6B' }}>
                                    {catKey ? t[catKey] : '?'}
                                    {lead.urgent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: '#C8202F' }}>⚡ {t.urgent}</span>}
                                  </p>
                                  <p className="text-xs text-gray-500">{fmtDate(lead.created_at)}</p>
                                </div>
                              </div>
                            </div>
                            {lead.details && <p className="text-xs text-gray-600 mt-2 mb-2">{lead.details}</p>}
                            <button onClick={() => claimBroadcastLead(lead.id)}
                              className="w-full py-2 rounded-lg text-white text-xs font-semibold"
                              style={{ backgroundColor: '#C8202F' }}>📢 {t.claimNow}</button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow p-4">
                  <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.myLeads} ({myLeads.length})</h3>
                  {myLeads.length === 0 ? (
                    <p className="text-gray-500 text-sm">{t.noLeads}</p>
                  ) : (
                    <div className="space-y-3">
                      {myLeads.map((lead) => {
                        const catKey = lead.categories?.key
                        const badge = leadStatusBadge(lead.status, t)
                        const showTimer = lead.status === 'assigned' && lead.claim_deadline
                        const quote = leadQuotes[lead.id]
                        return (
                          <div key={lead.id} className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: 22 }}>{lead.categories?.icon}</span>
                                <div>
                                  <p className="font-semibold text-sm flex items-center gap-2" style={{ color: '#1B3A6B' }}>
                                    {catKey ? t[catKey] : '?'}
                                    {lead.urgent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: '#C8202F' }}>⚡ {t.urgent}</span>}
                                  </p>
                                  <p className="text-xs text-gray-500">{fmtDate(lead.created_at)}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: badge.color }}>{badge.label}</span>
                            </div>

                            {showTimer && (
                              <div className="mb-2 p-2 rounded-lg flex items-center justify-between" style={{ background: '#FFF3DC' }}>
                                <span className="text-xs text-gray-600">{t.timeRemaining}:</span>
                                <Countdown deadline={lead.claim_deadline} />
                              </div>
                            )}

                            <div className="text-xs space-y-1 mb-2">
                              <p><span className="text-gray-500">{t.customer}:</span> <span className="font-semibold" style={{ color: '#1B3A6B' }}>{lead.customer_name}</span></p>
                              <p><span className="text-gray-500">{t.yourPhone}:</span> <a href={`tel:${lead.customer_phone}`} className="font-semibold" style={{ color: '#1F8A4C' }}>{lead.customer_phone}</a></p>
                              {lead.details && <p className="text-gray-600 mt-2">{lead.details}</p>}
                            </div>

                            {/* Quote summary bar if quote exists */}
                            {quote && (
                              <button onClick={() => setViewQuote(quote)}
                                className="w-full py-2 mb-2 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-2"
                                style={{ backgroundColor: '#1B3A6B' }}>
                                💰 {t.viewQuote} — {fmtMoney(quote.total)}
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: quoteStatusBadge(quote.status, t).color }}>
                                  {quoteStatusBadge(quote.status, t).label}
                                </span>
                              </button>
                            )}

                            <div className="flex gap-2 mt-2">
                              {lead.status === 'assigned' && (
                                <button onClick={() => claimLead(lead.id)}
                                  className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                                  style={{ backgroundColor: '#1F8A4C' }}>
                                  ✓ {t.claimLead}
                                </button>
                              )}
                              {(lead.status === 'claimed' || lead.status === 'quoted') && (
                                <button onClick={() => setQuoteBuilder({ lead, existingQuote: quote })}
                                  className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                                  style={{ backgroundColor: '#1B3A6B' }}>
                                  💰 {quote ? t.editQuote : t.createQuote}
                                </button>
                              )}
                              {(lead.status === 'quoted' || lead.status === 'claimed') && (
                                <button onClick={() => completeLead(lead.id)}
                                  className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                                  style={{ backgroundColor: '#6B7280' }}>
                                  ✓ {t.markCompleted}
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === 'categories' && (
              <div className="bg-white rounded-2xl shadow p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold" style={{ color: '#1B3A6B' }}>{t.myCategories} ({myCategories.length})</h3>
                  <button onClick={() => { setShowRequestModal(true); setSelectedIds([]) }}
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
            )}
          </>
        )}
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[85vh] flex flex-col">
            <h3 className="text-lg font-bold mb-1" style={{ color: '#1B3A6B' }}>{t.requestNewCategory}</h3>
            <p className="text-xs text-gray-500 mb-4">{t.selectCategories}</p>

            {availableCategories.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">—</p>
            ) : (
              <div className="space-y-2 mb-4 overflow-y-auto flex-1">
                {availableCategories.map((cat) => {
                  const isSelected = selectedIds.includes(cat.id)
                  return (
                    <button key={cat.id} onClick={() => toggleSelected(cat.id)}
                      className="w-full border rounded-xl p-3 flex items-center gap-3 text-left transition"
                      style={isSelected ? { borderColor: '#1F8A4C', background: '#E6F5ED', borderWidth: 2 } : { borderColor: '#e0e0e0', borderWidth: 1.5 }}>
                      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                        style={isSelected ? { background: '#1F8A4C', color: 'white' } : { background: 'white', border: '2px solid #d0d0d0' }}>
                        {isSelected && '✓'}
                      </div>
                      <span style={{ fontSize: 22 }}>{cat.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>{t[cat.key]}</p>
                        <p className="text-xs text-gray-500">{t[cat.key + 'Sub']}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {selectedIds.length > 0 && (
              <div className="text-center text-xs mb-3" style={{ color: '#1F8A4C', fontWeight: 600 }}>
                {selectedIds.length} {t.selectedCount}
              </div>
            )}
            <button onClick={submitRequests} disabled={selectedIds.length === 0 || submitting}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40 mb-2"
              style={{ backgroundColor: '#C8202F' }}>
              {submitting ? t.loading : t.submitRequest} {selectedIds.length > 0 && `(${selectedIds.length})`}
            </button>
            <button onClick={() => setShowRequestModal(false)}
              className="w-full py-2 text-sm" style={{ color: '#1B3A6B' }}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Quote builder modal */}
      {quoteBuilder && (
        <QuoteBuilderModal lead={quoteBuilder.lead} existingQuote={quoteBuilder.existingQuote}
          profile={profile} onClose={() => setQuoteBuilder(null)} onSuccess={handleQuoteSuccess} />
      )}

      {/* Vendor's view of their own quote (read-only) */}
      {viewQuote && (
        <QuoteViewerModal quote={viewQuote} profile={profile} role="vendor"
          onClose={() => setViewQuote(null)} onResponded={() => setViewQuote(null)} />
      )}
    </div>
  )
}

// =============================================
// VENDOR DETAIL (admin) — unchanged from Phase 2D
// =============================================
function VendorDetail({ vendorId, profile, onBack }) {
  const { t } = useLang()
  const [vendor, setVendor] = useState(null)
  const [vendorCats, setVendorCats] = useState([])
  const [missedLeads, setMissedLeads] = useState([])
  const [vendorReviews, setVendorReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    const { data: v } = await supabase.from('profiles').select('*').eq('id', vendorId).single()
    if (v) setVendor(v)
    const { data: cats } = await supabase.from('vendor_categories')
      .select('*, categories(*)').eq('vendor_id', vendorId)
      .order('requested_at', { ascending: false })
    if (cats) setVendorCats(cats)
    const { data: missed } = await supabase.from('missed_leads')
      .select('*, leads(*, categories(*))').eq('vendor_id', vendorId)
      .order('missed_at', { ascending: false })
    if (missed) setMissedLeads(missed)
    const { data: reviews } = await supabase.from('reviews')
      .select('*, profiles!reviews_customer_id_fkey(full_name, email)')
      .eq('vendor_id', vendorId).order('created_at', { ascending: false })
    if (reviews) setVendorReviews(reviews)
    const { data: s } = await supabase.rpc('get_vendor_stats', { p_vendor_id: vendorId })
    if (s && s.length > 0) setStats(s[0])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [vendorId])

  async function approveRequest(reqId) {
    await supabase.from('vendor_categories')
      .update({ status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reqId)
    loadData()
  }
  async function denyRequest(reqId) {
    await supabase.from('vendor_categories')
      .update({ status: 'denied', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reqId)
    loadData()
  }
  async function revokeApproved(reqId) {
    if (!window.confirm(t.confirmRevoke)) return
    await supabase.from('vendor_categories')
      .update({ status: 'denied', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reqId)
    loadData()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#FBF6EC' }}>
      <div className="text-gray-400">{t.loading}</div>
    </div>
  }

  const pending = vendorCats.filter((c) => c.status === 'pending')
  const approved = vendorCats.filter((c) => c.status === 'approved')
  const denied = vendorCats.filter((c) => c.status === 'denied')

  function CatRow({ cat, actions }) {
    const catKey = cat.categories?.key
    return (
      <div className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: 20 }}>{cat.categories?.icon}</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>{catKey ? t[catKey] : '?'}</p>
            <p className="text-xs text-gray-500">{t.requestedAt}: {fmtDate(cat.requested_at)}</p>
          </div>
        </div>
        {actions}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FBF6EC' }}>
      <AppHeader profile={profile} subtitle={`${t.adminPanel} · ${profile?.role}`} onBack={onBack} />

      <div className="-mt-5 rounded-t-3xl px-5 py-6 flex-1" style={{ background: '#FBF6EC' }}>

        {stats?.below_threshold && (
          <div className="rounded-2xl p-3 mb-4 text-center text-xs font-semibold"
            style={{ background: '#FDECEA', color: '#9B1C10', border: '1.5px solid #C8202F' }}>
            {t.flaggedVendorWarning}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-5 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: '#1F8A4C' }}>
              {(vendor?.full_name || vendor?.email || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg" style={{ color: '#1B3A6B' }}>{vendor?.full_name || '(sin nombre)'}</h2>
              <p className="text-xs text-gray-500">{vendor?.email}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white mt-1 inline-block"
                style={{ backgroundColor: '#1F8A4C' }}>{vendor?.role}</span>
            </div>
            {stats && stats.review_count > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: stats.below_threshold ? '#C8202F' : '#1F8A4C' }}>
                  {parseFloat(stats.avg_rating).toFixed(1)}
                </div>
                <StarRating value={Math.round(parseFloat(stats.avg_rating))} readonly size="sm" />
                <p className="text-[10px] text-gray-500">{stats.review_count} {stats.review_count === 1 ? t.review : t.reviewsPlural}</p>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            <p>{t.joinedOn}: {new Date(vendor?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1B3A6B' }}>
            <span style={{ color: '#E8A020' }}>●</span> {t.pendingApproval} ({pending.length})
          </h3>
          {pending.length === 0 ? <p className="text-gray-500 text-sm">{t.noPending}</p> : (
            <div className="space-y-2">
              {pending.map((c) => (
                <CatRow key={c.id} cat={c} actions={
                  <div className="flex gap-2">
                    <button onClick={() => approveRequest(c.id)}
                      className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                      style={{ backgroundColor: '#1F8A4C' }}>✓ {t.approveBtn}</button>
                    <button onClick={() => denyRequest(c.id)}
                      className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                      style={{ backgroundColor: '#C8202F' }}>✕ {t.denyBtn}</button>
                  </div>
                } />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1B3A6B' }}>
            <span style={{ color: '#1F8A4C' }}>●</span> {t.approved} ({approved.length})
          </h3>
          {approved.length === 0 ? <p className="text-gray-500 text-sm">{t.noApprovedYet}</p> : (
            <div className="space-y-2">
              {approved.map((c) => (
                <CatRow key={c.id} cat={c} actions={
                  <button onClick={() => revokeApproved(c.id)}
                    className="w-full py-2 rounded-lg text-xs font-semibold"
                    style={{ background: '#FDECEA', color: '#9B1C10' }}>{t.revoke}</button>
                } />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1B3A6B' }}>
            <span style={{ color: '#C8202F' }}>●</span> {t.denied} ({denied.length})
          </h3>
          {denied.length === 0 ? <p className="text-gray-500 text-sm">{t.noDeniedYet}</p> : (
            <div className="space-y-2">
              {denied.map((c) => (
                <CatRow key={c.id} cat={c} actions={
                  <button onClick={() => approveRequest(c.id)}
                    className="w-full py-2 rounded-lg text-xs font-semibold"
                    style={{ background: '#E6F5ED', color: '#0F5A33' }}>✓ {t.approveBtn}</button>
                } />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1B3A6B' }}>
            <span style={{ color: '#E8A020' }}>●</span> {t.reviews} ({vendorReviews.length})
          </h3>
          {vendorReviews.length === 0 ? <p className="text-gray-500 text-sm">{t.noReviews}</p> : (
            <div className="space-y-2">
              {vendorReviews.map((r) => (
                <div key={r.id} className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                  <div className="flex justify-between items-start mb-1">
                    <StarRating value={r.rating} readonly size="sm" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: r.status === 'approved' ? '#1F8A4C' : r.status === 'rejected' ? '#C8202F' : '#E8A020' }}>
                      {r.status}
                    </span>
                  </div>
                  {r.comment && <p className="text-xs text-gray-700 mt-1">"{r.comment}"</p>}
                  <p className="text-[10px] text-gray-400 mt-1">— {r.profiles?.full_name || r.profiles?.email} · {fmtDate(r.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1B3A6B' }}>
            <span style={{ color: '#C8202F' }}>●</span> {t.missedLeads} ({missedLeads.length})
          </h3>
          {missedLeads.length === 0 ? <p className="text-gray-500 text-sm">{t.noMissed}</p> : (
            <div className="space-y-2">
              {missedLeads.map((m) => {
                const catKey = m.leads?.categories?.key
                return (
                  <div key={m.id} className="border rounded-xl p-3" style={{ borderColor: '#FDECEA', background: '#FFF9F8' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 18 }}>{m.leads?.categories?.icon}</span>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#9B1C10' }}>{catKey ? t[catKey] : '?'}</p>
                        <p className="text-xs text-gray-500">{t.missedAt}: {fmtDate(m.missed_at)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================
// ADMIN DASHBOARD — leads tab now shows quote info
// =============================================
function AdminDashboard({ profile }) {
  const { t } = useLang()
  const [tab, setTab] = useState('users')
  const [allUsers, setAllUsers] = useState([])
  const [invites, setInvites] = useState([])
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [allLeads, setAllLeads] = useState([])
  const [allLeadQuotes, setAllLeadQuotes] = useState({}) // leadId → latest quote
  const [pendingReviews, setPendingReviews] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [newRole, setNewRole] = useState('customer')
  const [generating, setGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [viewQuote, setViewQuote] = useState(null)

  const allowedRoles = profile.role === 'owner'
    ? ['owner', 'manager', 'employee', 'vendor', 'customer']
    : ['vendor', 'customer']

  useEffect(() => {
    loadUsers(); loadInvites(); loadApprovals(); loadAllLeads(); loadPendingReviews()
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
    const { data } = await supabase.from('vendor_categories')
      .select('*, categories(*), profiles!vendor_categories_vendor_id_fkey(*)')
      .eq('status', 'pending').order('requested_at', { ascending: false })
    if (data) setPendingApprovals(data)
  }
  async function loadAllLeads() {
    const { data } = await supabase.from('leads')
      .select(`*, categories(*),
        customer:profiles!leads_customer_id_fkey(full_name, email),
        vendor:profiles!leads_assigned_vendor_id_fkey(full_name, email)`)
      .order('created_at', { ascending: false })
    if (data) {
      setAllLeads(data)
      // Load latest quote per lead
      const leadIds = data.map((l) => l.id)
      if (leadIds.length > 0) {
        const { data: quotes } = await supabase.from('quotes')
          .select('*').in('lead_id', leadIds)
          .in('status', ['sent', 'accepted', 'declined'])
          .order('created_at', { ascending: false })
        if (quotes) {
          const map = {}
          quotes.forEach((q) => { if (!map[q.lead_id]) map[q.lead_id] = q })
          setAllLeadQuotes(map)
        }
      }
    }
  }
  async function loadPendingReviews() {
    const { data } = await supabase.from('reviews')
      .select(`*, customer:profiles!reviews_customer_id_fkey(full_name, email),
        vendor:profiles!reviews_vendor_id_fkey(full_name, email),
        leads(*, categories(*))`)
      .eq('status', 'pending').order('created_at', { ascending: false })
    if (data) setPendingReviews(data)
  }

  async function approveRequest(reqId) {
    await supabase.from('vendor_categories')
      .update({ status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reqId)
    loadApprovals()
  }
  async function denyRequest(reqId) {
    await supabase.from('vendor_categories')
      .update({ status: 'denied', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reqId)
    loadApprovals()
  }
  async function approveReview(reviewId) {
    await supabase.from('reviews')
      .update({ status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reviewId)
    loadPendingReviews()
  }
  async function rejectReview(reviewId) {
    await supabase.from('reviews')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString(), reviewed_by: profile.id })
      .eq('id', reviewId)
    loadPendingReviews()
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
    } else { alert('Error: ' + error.message) }
    setGenerating(false)
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch (e) { alert(generatedLink) }
  }

  function roleColor(role) {
    if (role === 'owner') return '#C8202F'
    if (role === 'manager') return '#1B3A6B'
    if (role === 'employee') return '#6B7280'
    if (role === 'vendor') return '#1F8A4C'
    return '#E8A020'
  }
  function inviteStatusBadge(inv) {
    if (inv.used) return { label: t.used, color: '#6B7280' }
    if (new Date(inv.expires_at) < new Date()) return { label: t.expired, color: '#C8202F' }
    return { label: t.active, color: '#1F8A4C' }
  }

  if (selectedVendorId) {
    return <VendorDetail vendorId={selectedVendorId} profile={profile}
      onBack={() => { setSelectedVendorId(null); loadApprovals(); loadUsers(); loadAllLeads(); loadPendingReviews() }} />
  }

  const vendors = allUsers.filter((u) => u.role === 'vendor')

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FBF6EC' }}>
      <AppHeader profile={profile} subtitle={`${t.adminPanel} · ${profile?.role}`} />

      <div className="-mt-5 rounded-t-3xl px-5 py-6 flex-1" style={{ background: '#FBF6EC' }}>

        <div className="bg-white rounded-2xl p-1 flex mb-5 shadow-sm overflow-x-auto">
          {[
            { k: 'users', label: t.users, count: allUsers.length },
            { k: 'vendors', label: t.vendors, count: vendors.length },
            { k: 'leads', label: t.leads, count: allLeads.length },
            { k: 'reviews', label: t.reviewsTab, count: pendingReviews.length },
            { k: 'invites', label: t.activeInvites.split(' ')[0], count: invites.filter(i => !i.used && new Date(i.expires_at) > new Date()).length },
            { k: 'approvals', label: t.approvalQueue, count: pendingApprovals.length },
          ].map((tabItem) => (
            <button key={tabItem.k} onClick={() => setTab(tabItem.k)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap px-2"
              style={tab === tabItem.k ? { background: '#1B3A6B', color: 'white' } : { color: '#666' }}>
              {tabItem.label} ({tabItem.count})
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.users} ({allUsers.length})</h3>
            {allUsers.length === 0 ? <p className="text-gray-500 text-sm">{t.noUsers}</p> : (
              <div className="space-y-2">
                {allUsers.map((u) => {
                  const isVendor = u.role === 'vendor'
                  return (
                    <div key={u.id} onClick={isVendor ? () => setSelectedVendorId(u.id) : undefined}
                      className={`border rounded-xl p-3 flex justify-between items-center ${isVendor ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                      style={{ borderColor: '#e0e0e0' }}>
                      <div>
                        <p className="font-semibold" style={{ color: '#1B3A6B' }}>{u.full_name || '(sin nombre)'}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: roleColor(u.role) }}>{u.role}</span>
                        {isVendor && <span className="text-gray-400">›</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'vendors' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.vendors} ({vendors.length})</h3>
            {vendors.length === 0 ? <p className="text-gray-500 text-sm">No vendors yet.</p> : (
              <div className="space-y-2">
                {vendors.map((v) => (
                  <button key={v.id} onClick={() => setSelectedVendorId(v.id)}
                    className="w-full border rounded-xl p-3 flex items-center gap-3 hover:bg-gray-50 text-left"
                    style={{ borderColor: '#e0e0e0' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: '#1F8A4C' }}>
                      {(v.full_name || v.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>{v.full_name || '(sin nombre)'}</p>
                      <p className="text-xs text-gray-500">{v.email}</p>
                    </div>
                    <span className="text-gray-400">›</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'leads' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.leads} ({allLeads.length})</h3>
            {allLeads.length === 0 ? <p className="text-gray-500 text-sm">{t.noLeads}</p> : (
              <div className="space-y-3">
                {allLeads.map((lead) => {
                  const catKey = lead.categories?.key
                  const badge = leadStatusBadge(lead.status, t)
                  const quote = allLeadQuotes[lead.id]
                  return (
                    <div key={lead.id} className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 22 }}>{lead.categories?.icon}</span>
                          <div>
                            <p className="font-semibold text-sm flex items-center gap-2" style={{ color: '#1B3A6B' }}>
                              {catKey ? t[catKey] : '?'}
                              {lead.urgent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: '#C8202F' }}>⚡ {t.urgent}</span>}
                            </p>
                            <p className="text-xs text-gray-500">{fmtDate(lead.created_at)}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: badge.color }}>{badge.label}</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <p><span className="text-gray-500">{t.customer}:</span> <span className="font-semibold" style={{ color: '#1B3A6B' }}>{lead.customer_name}</span> ({lead.customer_phone})</p>
                        <p><span className="text-gray-500">{t.assignedTo}:</span> <span className="font-semibold" style={{ color: '#1F8A4C' }}>{lead.vendor?.full_name || lead.vendor?.email || '—'}</span></p>
                        {lead.details && <p className="text-gray-600 mt-1">{lead.details}</p>}
                      </div>
                      {quote && (
                        <button onClick={() => setViewQuote(quote)}
                          className="w-full py-2 mt-2 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#1B3A6B' }}>
                          💰 {t.viewQuote} — {fmtMoney(quote.total)}
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: quoteStatusBadge(quote.status, t).color }}>
                            {quoteStatusBadge(quote.status, t).label}
                          </span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-bold mb-3" style={{ color: '#1B3A6B' }}>{t.moderationQueue} ({pendingReviews.length})</h3>
            {pendingReviews.length === 0 ? (
              <p className="text-gray-500 text-sm">{t.noReviewsPending}</p>
            ) : (
              <div className="space-y-3">
                {pendingReviews.map((r) => {
                  const catKey = r.leads?.categories?.key
                  return (
                    <div key={r.id} className="border rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                      <div className="flex justify-between items-start mb-2">
                        <StarRating value={r.rating} readonly size="sm" />
                        <span className="text-[10px] text-gray-400">{fmtDate(r.created_at)}</span>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-gray-700 mt-1 mb-2 italic">"{r.comment}"</p>
                      )}
                      <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                        <p>{t.customer}: <span className="font-semibold" style={{ color: '#1B3A6B' }}>{r.customer?.full_name || r.customer?.email}</span></p>
                        <p>{t.vendor}: <button onClick={() => setSelectedVendorId(r.vendor_id)} className="underline" style={{ color: '#1F8A4C' }}>{r.vendor?.full_name || r.vendor?.email}</button></p>
                        {catKey && <p>{t.onLead}: {t[catKey]}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveReview(r.id)}
                          className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                          style={{ backgroundColor: '#1F8A4C' }}>✓ {t.publishReview}</button>
                        <button onClick={() => rejectReview(r.id)}
                          className="flex-1 py-2 rounded-lg text-white text-xs font-semibold"
                          style={{ backgroundColor: '#C8202F' }}>✕ {t.rejectReview}</button>
                      </div>
                    </div>
                  )
                })}
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
              {invites.length === 0 ? <p className="text-gray-500 text-sm">{t.noInvites}</p> : (
                <div className="space-y-2">
                  {invites.slice(0, 20).map((inv) => {
                    const status = inviteStatusBadge(inv)
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
            {pendingApprovals.length === 0 ? <p className="text-gray-500 text-sm">{t.noApprovals}</p> : (
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
                            <button onClick={() => setSelectedVendorId(vendor?.id)}
                              className="text-xs underline" style={{ color: '#1F8A4C' }}>
                              {t.vendor}: {vendor?.full_name || vendor?.email || '(?)'}
                            </button>
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

      {/* Admin's read-only view of a quote */}
      {viewQuote && (
        <QuoteViewerModal quote={viewQuote} profile={profile} role="admin"
          onClose={() => setViewQuote(null)} onResponded={() => setViewQuote(null)} />
      )}
    </div>
  )
}

// =============================================
// ROOT APP
// =============================================
export default function App() {
  const detectLang = () => {
    const stored = localStorage.getItem('ea_lang')
    if (stored && ['es', 'en', 'pt'].includes(stored)) return stored
    const browser = (navigator.language || 'es').toLowerCase().slice(0, 2)
    if (['es', 'en', 'pt'].includes(browser)) return browser
    return 'es'
  }

  const [lang, setLangState] = useState(detectLang)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inviteCode, setInviteCode] = useState(null)

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
