// assets/js/config.js — RAB Automotora
// Config central + helpers + renders de navbar/footer
// "base" es la ruta relativa hacia la raíz: '' en index, '../' en subcarpetas
console.log("V1.1.0");
const RAB = {

  // Backend URL — cambiar al desplegar
  API_URL: 'https://rab-backend.onrender.com',
  // API_URL: 'http://localhost:4000',


  WHATSAPP: '56964918228',
  ADDRESS:  'Panamericana Sur Km 1505, Buin (al lado del BuinZoo)',
  GMAPS:    'https://maps.google.com/?q=-33.716,-70.729',

  // ─── Redes sociales ─────────────────────────────────────────
  // Se dibujan en orden. Para agregar otra red (facebook, youtube) basta con
  // sumar un objeto { key, label, handle, url }. 'video' muestra un reel en la sección.
  // ⚠️ Confirmar el usuario real de TikTok antes de publicar.
  SOCIALS: [
    { key: 'instagram', label: 'Instagram',   handle: '@rabautomotora', url: 'https://www.instagram.com/rabautomotora/', video: '/assets/videos/REEL.mp4' },
    { key: 'tiktok',    label: 'TikTok',      handle: '@rabautomotora', url: 'https://www.tiktok.com/@rabautomotora' },
    { key: 'whatsapp',  label: 'WhatsApp',    handle: '+56 9 6491 8228' },
    { key: 'maps',      label: 'Cómo llegar', handle: 'Panamericana Sur Km 1505, Buin' },
  ],

  SCHEDULE: [
    { day: 'Lunes a Viernes', hours: '9:00 – 19:00' },
    { day: 'Sábado',          hours: '9:00 – 14:00' },
    { day: 'Domingo',         hours: 'Cerrado' },
  ],

  CATEGORIES: ['Todos', 'Sedán', 'SUV', 'Pickup', 'Hatchback', 'Deportivo'],

  // ─── Helpers ──────────────────────────────────────────────
  price(n) { return '$' + Number(n).toLocaleString('es-CL') },

  // ─── Imágenes optimizadas (backend genera thumb/medium/full WebP) ──
  // Devuelve la URL en el tamaño pedido ('thumb'|'medium'|'full') con
  // fallback a public_url para fotos antiguas sin variantes.
  imgUrl(img, size) {
    if (!img) return ''
    return img[size + '_url'] || img.public_url || ''
  },
  // srcset responsive con los tamaños disponibles; '' si no hay variantes.
  imgSrcset(img) {
    if (!img) return ''
    var parts = []
    if (img.thumb_url)  parts.push(img.thumb_url + ' 400w')
    if (img.medium_url) parts.push(img.medium_url + ' 1280w')
    if (img.full_url)   parts.push(img.full_url + ' 1920w')
    return parts.join(', ')
  },

  wa(msg) {
    const text = msg || 'Hola, quiero cotizar un vehículo en RAB Automotora.'
    return 'https://wa.me/' + this.WHATSAPP + '?text=' + encodeURIComponent(text)
  },

  // Alias para compatibilidad con detalle.html y otros archivos
  whatsappUrl(msg) { return this.wa(msg) },

  // Botón flotante de WhatsApp (FAB) — se auto-inyecta al final del archivo
  renderWhatsappFloat() {
    return '<a class="wa-fab" href="' + this.wa('Hola RAB, ¿me pueden ayudar? Escribo desde la web.') + '" target="_blank" rel="noopener" aria-label="Contáctanos por WhatsApp">' +
      '<span class="wa-fab-tip">¿Necesitas ayuda? Escríbenos por WhatsApp.</span>' +
      '<span class="wa-fab-btn"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg></span>' +
    '</a>'
  },

  // ─── Sesión / tokens ──────────────────────────────────────
  getToken()        { return localStorage.getItem('rab_token') },
  getRefreshToken() { return localStorage.getItem('rab_refresh') },
  getExpiresAt()    { return Number(localStorage.getItem('rab_expires') || 0) },

  // Guarda la sesión completa devuelta por /login o /refresh.
  // ⚠️ El refresh_token rota: siempre se reemplazan los dos tokens.
  setSession(data) {
    if (!data) return
    if (data.access_token)  localStorage.setItem('rab_token',   data.access_token)
    if (data.refresh_token) localStorage.setItem('rab_refresh', data.refresh_token)
    if (data.expires_at)    localStorage.setItem('rab_expires', String(data.expires_at))
  },
  clearSession() {
    localStorage.removeItem('rab_token')
    localStorage.removeItem('rab_refresh')
    localStorage.removeItem('rab_expires')
  },

  // Epoch (seg) de expiración del access_token: usa expires_at guardado y,
  // como respaldo (sesiones antiguas), el claim 'exp' del propio JWT.
  _tokenExp() {
    const stored = this.getExpiresAt()
    if (stored) return stored
    const t = this.getToken()
    if (!t) return 0
    try {
      const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      return payload.exp || 0
    } catch (e) { return 0 }
  },
  // ¿El access_token venció o le quedan < 60s?
  _tokenExpiringSoon() {
    const exp = this._tokenExp()
    if (!exp) return false
    return (exp - 60) <= Math.floor(Date.now() / 1000)
  },
  // ¿Hay una sesión con token aún vigente?
  hasValidSession() {
    return !!this.getToken() && !this._tokenExpiringSoon()
  },

  // Renueva la sesión con el refresh_token. Single-flight: llamadas
  // concurrentes comparten la misma promesa. Lanza error si /refresh falla.
  _refreshPromise: null,
  refreshSession() {
    if (this._refreshPromise) return this._refreshPromise
    const self = this
    const refresh = this.getRefreshToken()
    this._refreshPromise = (async function () {
      try {
        if (!refresh) throw new Error('sin refresh token')
        const res = await self._fetchColdStart(self.API_URL + '/api/admin/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refresh })
        })
        if (!res.ok) {
          self.clearSession()                 // refresh inválido → sesión terminada
          const e = new Error('refresh falló'); e.status = res.status; throw e
        }
        self.setSession(await res.json())      // rota ambos tokens
      } finally {
        self._refreshPromise = null
      }
    })()
    return this._refreshPromise
  },

  // Espera entre reintentos por cold-start (backend dormido tras inactividad,
  // ej. Render free tier). Suma ~51s, tiempo típico para que el contenedor levante.
  _COLD_START_DELAYS: [1000, 2000, 4000, 6000, 8000, 10000, 10000, 10000],
  _coldStartNotified: false,

  // fetch() con reintento automático cuando el backend está "dormido":
  // - la petición falla a nivel de red (contenedor aún no acepta conexiones), o
  // - responde 502/503/504 (el proxy contesta mientras el contenedor levanta).
  // En esos casos el request nunca llegó a ejecutarse en la app, así que
  // reintentar es seguro (no duplica efectos de POST/PUT/DELETE).
  async _fetchColdStart(url, fetchOpts, attempt) {
    attempt = attempt || 0
    let res
    try {
      res = await fetch(url, fetchOpts)
    } catch (networkErr) {
      if (attempt >= this._COLD_START_DELAYS.length) throw networkErr
      this._notifyColdStart()
      await new Promise(function (r) { setTimeout(r, RAB._COLD_START_DELAYS[attempt]) })
      return this._fetchColdStart(url, fetchOpts, attempt + 1)
    }
    if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < this._COLD_START_DELAYS.length) {
      this._notifyColdStart()
      await new Promise(function (r) { setTimeout(r, RAB._COLD_START_DELAYS[attempt]) })
      return this._fetchColdStart(url, fetchOpts, attempt + 1)
    }
    this._coldStartNotified = false
    return res
  },

  _notifyColdStart() {
    if (this._coldStartNotified) return
    this._coldStartNotified = true
    this.toast('El servidor estaba inactivo, despertando… puede tardar unos segundos', 'success')
  },

  async api(path, opts) {
    opts = opts || {}
    // Refresh proactivo: si el access_token está por vencer, renuévalo antes de pedir.
    if (!opts._retry && this.getRefreshToken() && this._tokenExpiringSoon()) {
      try { await this.refreshSession() } catch (e) { /* el 401 de abajo lo maneja */ }
    }
    const token = this.getToken()
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {})
    if (token) headers['Authorization'] = 'Bearer ' + token
    const res = await this._fetchColdStart(this.API_URL + path, Object.assign({}, opts, { headers }))
    if (!res.ok) {
      if (res.status === 401 && token) {
        // Refresh reactivo: intenta renovar UNA vez y reintenta la misma petición.
        if (!opts._retry && this.getRefreshToken()) {
          try {
            await this.refreshSession()
            return this.api(path, Object.assign({}, opts, { _retry: true }))
          } catch (e) { /* cae al cierre de sesión de abajo */ }
        }
        this.clearSession()
        document.dispatchEvent(new CustomEvent('rab:unauthorized'))
      }
      const err = await res.json().catch(function () { return {} })
      throw new Error(err.error || 'Error ' + res.status)
    }
    return res.json()
  },

  capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str
  },

  toast(msg, type) {
    type = type || 'success'
    const el = document.getElementById('toast')
    if (!el) return
    el.textContent = msg
    el.className = 'show ' + type
    clearTimeout(el._t)
    el._t = setTimeout(function () { el.className = '' }, 3000)
  },

  // Modal de confirmación/alerta estándar del sitio.
  // Devuelve Promise<boolean>: true = confirmar, false = cancelar.
  // opts: { title, message, confirmText, cancelText, altText, danger, alert }
  // Con altText se muestra un tercer botón y la promesa resuelve 'alt' al elegirlo.
  confirm(opts) {
    opts = opts || {}
    return new Promise(function (resolve) {
      var prev = document.querySelector('.rab-modal-overlay')
      if (prev) prev.remove()

      var danger  = !!opts.danger
      var isAlert = !!opts.alert
      var icon = danger
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'

      var overlay = document.createElement('div')
      overlay.className = 'rab-modal-overlay'
      overlay.innerHTML =
        '<div class="rab-modal" role="dialog" aria-modal="true">' +
          '<div class="rab-modal-icon' + (danger ? ' danger' : '') + '">' + icon + '</div>' +
          '<h3 class="rab-modal-title">' + (opts.title || '¿Estás seguro?') + '</h3>' +
          (opts.message ? '<p class="rab-modal-msg">' + opts.message + '</p>' : '') +
          '<div class="rab-modal-actions">' +
            (isAlert ? '' : '<button type="button" class="rab-modal-btn rab-modal-cancel">' + (opts.cancelText || 'Cancelar') + '</button>') +
            (opts.altText ? '<button type="button" class="rab-modal-btn rab-modal-alt">' + opts.altText + '</button>' : '') +
            '<button type="button" class="rab-modal-btn rab-modal-confirm' + (danger ? ' danger' : '') + '">' + (opts.confirmText || (isAlert ? 'Entendido' : 'Confirmar')) + '</button>' +
          '</div>' +
        '</div>'
      document.body.appendChild(overlay)
      overlay.offsetHeight   // reflow para animar la entrada
      overlay.classList.add('show')

      function close(result) {
        overlay.classList.remove('show')
        document.removeEventListener('keydown', onKey)
        setTimeout(function () { overlay.remove() }, 220)
        resolve(result)
      }
      function onKey(e) {
        if (e.key === 'Escape') close(false)
        else if (e.key === 'Enter') close(true)
      }
      var cancelBtn = overlay.querySelector('.rab-modal-cancel')
      if (cancelBtn) cancelBtn.addEventListener('click', function () { close(false) })
      var altBtn = overlay.querySelector('.rab-modal-alt')
      if (altBtn) altBtn.addEventListener('click', function () { close('alt') })
      overlay.querySelector('.rab-modal-confirm').addEventListener('click', function () { close(true) })
      overlay.addEventListener('click', function (e) { if (e.target === overlay) close(false) })
      document.addEventListener('keydown', onKey)
      setTimeout(function () { overlay.querySelector('.rab-modal-confirm').focus() }, 60)
    })
  },

  // Alerta informativa con el mismo estándar visual (sin botón cancelar)
  alert(opts) {
    if (typeof opts === 'string') opts = { message: opts }
    return this.confirm(Object.assign({ alert: true, title: 'Aviso' }, opts))
  },

  carSVG() {
    return '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>'
  },

  waSVG(s) {
    s = s || 14
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>'
  },

  // Vehicle card — rutas absolutas, sin parámetro base
  vehicleCard(v, idx) {
    const self = this
    // Orden: portada primero, luego por sort_order. Máx 5 para el carrusel.
    const imgs = (v.vehicle_images || []).slice().sort(function (a, b) {
      var ca = a.is_cover ? 1 : 0, cb = b.is_cover ? 1 : 0
      if (cb !== ca) return cb - ca
      return (a.sort_order || 0) - (b.sort_order || 0)
    })
    const slides = imgs.slice(0, 5)

    var mediaHtml, hoverAttrs = ''
    if (!slides.length) {
      mediaHtml = '<div class="card-img-placeholder">' + this.carSVG() + '<span style="font-size:12px">Sin foto</span></div>'
    } else if (slides.length === 1) {
      var only = slides[0]
      mediaHtml = '<img src="' + this.imgUrl(only, 'thumb') + '"' +
        (this.imgSrcset(only) ? ' srcset="' + this.imgSrcset(only) + '" sizes="(max-width:600px) 100vw, 400px"' : '') +
        ' alt="' + v.brand + ' ' + v.model + '" loading="lazy" decoding="async">'
    } else {
      var slidesHtml = slides.map(function (im) {
        return '<img class="card-slide" src="' + self.imgUrl(im, 'thumb') + '"' +
          (self.imgSrcset(im) ? ' srcset="' + self.imgSrcset(im) + '" sizes="(max-width:600px) 100vw, 400px"' : '') +
          ' alt="" loading="lazy" decoding="async">'
      }).join('')
      // Clon de la primera al final → el loop vuelve al inicio sin salto visible
      slidesHtml += '<img class="card-slide" aria-hidden="true" src="' + self.imgUrl(slides[0], 'thumb') + '" alt="" loading="lazy" decoding="async">'
      var dotsHtml = slides.map(function (_, i) { return '<span class="card-dot' + (i === 0 ? ' active' : '') + '"></span>' }).join('')
      mediaHtml = '<div class="card-slider" data-count="' + slides.length + '">' + slidesHtml + '</div>' +
                  '<div class="card-dots">' + dotsHtml + '</div>'
      hoverAttrs = ' onmouseenter="RAB.cardHoverStart(this)" onmouseleave="RAB.cardHoverStop(this)"'
    }

    const status = v.status || 'Disponible'
    const badgeMap = { 'Disponible': 'available', 'Vendido': 'sold', 'Próximo Ingreso': 'upcoming' }
    const badge = badgeMap[status] || 'available'
    const msg = 'Hola, me interesa cotizar el ' + v.brand + ' ' + v.model + ' ' + v.year + ' — ' + this.price(v.price) + '. ¿Tienen disponibilidad?'
    const href = '/inventario/detalle.html?id=' + v.id
    const delay = typeof idx === 'number' ? Math.min(idx, 5) * 70 : 0

    return '<div class="vehicle-card reveal" style="--reveal-delay:' + delay + 'ms">' +
      '<a href="' + href + '" class="card-img"' + hoverAttrs + '>' +
        mediaHtml +
        '<span class="card-badge badge-' + badge + '">' + status + '</span>' +
        (v.featured ? '<span class="badge-featured"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z"/></svg>Destacado</span>' : '') +
      '</a>' +
      '<div class="card-body">' +
        '<a href="' + href + '" class="card-name">' + v.brand + ' ' + v.model + ' ' + v.year + '</a>' +
        '<div class="card-price">' + this.price(v.price) + '</div>' +
        '<div class="card-meta">' +
          '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' + Number(v.mileage).toLocaleString('es-CL') + ' km</span>' +
          '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4"/></svg>' + v.transmission + '</span>' +
          '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M3 3l3 9 3-3 3 3 3-9"/></svg>' + v.fuel + '</span>' +
        '</div>' +
        '<hr class="card-divider">' +
        '<div class="card-footer">' +
          '<span class="card-category">' + v.category + '</span>' +
          '<div class="card-actions">' +
            (status === 'Disponible' ? '<a href="' + this.wa(msg) + '" target="_blank" class="btn-card-wa">' + this.waSVG(14) + '</a>' : '') +
            '<a href="' + href + '" class="btn-card-detail">Ver más →</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  },

  // ── Carrusel de la tarjeta: rota las fotos mientras el mouse está encima ──
  cardHoverStart(cardImg) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const slider = cardImg.querySelector('.card-slider')
    if (!slider || slider._timer) return
    const count = parseInt(slider.dataset.count, 10) || 0
    if (count < 2) return
    const dots = cardImg.querySelectorAll('.card-dot')
    let idx = 0
    const DUR = 420   // debe coincidir con la transición CSS (.card-slider)
    slider._timer = setInterval(function () {
      idx++
      slider.classList.remove('no-anim')
      slider.style.transform = 'translateX(-' + (idx * 100) + '%)'
      const real = idx % count
      dots.forEach(function (d, i) { d.classList.toggle('active', i === real) })
      if (idx === count) {
        // llegamos al clon (= primera): al terminar la transición, saltar al inicio sin animar
        setTimeout(function () {
          if (!slider._timer) return
          slider.classList.add('no-anim')
          slider.style.transform = 'translateX(0)'
          idx = 0
        }, DUR)
      }
    }, 1100)
  },
  cardHoverStop(cardImg) {
    const slider = cardImg.querySelector('.card-slider')
    if (!slider) return
    clearInterval(slider._timer)
    slider._timer = null
    slider.classList.add('no-anim')
    slider.style.transform = 'translateX(0)'
    cardImg.querySelectorAll('.card-dot').forEach(function (d, i) { d.classList.toggle('active', i === 0) })
    requestAnimationFrame(function () { requestAnimationFrame(function () { slider.classList.remove('no-anim') }) })
  },

  // Ícono de Instagram (glifo oficial simplificado)
  igSVG(s) {
    s = s || 20
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>'
  },

  // Ícono de volumen (on = con sonido, off = silenciado)
  volumeSVG(on, s) {
    s = s || 16
    const base = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    const speaker = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>'
    const extra = on
      ? '<path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>'
      : '<line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>'
    return base + speaker + extra + '</svg>'
  },

  // Activa/silencia el audio del reel (el clic del usuario habilita el sonido)
  toggleReelSound(btn) {
    const video = btn.parentElement.querySelector('video')
    if (!video) return
    video.muted = !video.muted
    if (!video.muted) {
      video.volume = 1
      const p = video.play()
      if (p && p.catch) p.catch(function () {})
    }
    btn.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar')
    btn.setAttribute('aria-pressed', String(!video.muted))
    btn.innerHTML = this.volumeSVG(!video.muted, 16)
  },

  // Íconos de marca (TikTok, mapa) — rellenos con currentColor
  brandSVG(key, s) {
    s = s || 20
    if (key === 'instagram') return this.igSVG(s)
    if (key === 'whatsapp')  return this.waSVG(s)
    var paths = {
      tiktok:   'M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z',
      maps:     'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z',
      facebook: 'M14 8h3V4h-3c-2.76 0-5 2.24-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9c0-.55.45-1 1-1z',
      youtube:  'M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.5 31 31 0 0 0-.4-4.5zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
    }
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + (paths[key] || paths.maps) + '"/></svg>'
  },

  // URL final de cada red (WhatsApp y Maps salen de la config general)
  socialUrl(s) {
    if (s.key === 'whatsapp') return this.wa('Hola RAB, ¿me pueden ayudar? Escribo desde la web.')
    if (s.key === 'maps')     return this.GMAPS
    return s.url
  },

  // Sección unificada de redes: reel de Instagram + tarjeta de TikTok + botones grandes
  renderSocials() {
    const self = this
    const ig = this.SOCIALS.find(function (s) { return s.key === 'instagram' })
    const tt = this.SOCIALS.find(function (s) { return s.key === 'tiktok' })
    const arrow = '<svg class="soc-go" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

    function phone(s, cls) {
      if (!s) return ''
      if (s.video) {
        return '<div class="phone ' + cls + '">' +
          '<span class="phone-tag">' + s.label + '</span>' +
          '<video src="' + s.video + '" autoplay muted loop playsinline preload="metadata" disablepictureinpicture aria-label="Video de ' + s.label + ' de RAB Automotora"></video>' +
          '<button type="button" class="ig-mute" aria-label="Activar sonido" aria-pressed="false" onclick="RAB.toggleReelSound(this)">' + self.volumeSVG(false, 16) + '</button>' +
        '</div>'
      }
      return '<a class="phone ' + cls + '" href="' + s.url + '" target="_blank" rel="noopener" aria-label="Ver ' + s.label + ' de RAB">' +
        '<span class="phone-screen">' +
          '<span class="phone-tag">' + s.label + '</span>' +
          '<span class="tt-glitch">Antes / Después</span>' +
          '<span class="tt-car" aria-hidden="true"></span>' +
          '<span class="tt-who">' + self.brandSVG(s.key, 14) + s.handle + '</span>' +
          '<span class="tt-cap">Lavados, entregas y nuevos ingresos.</span>' +
        '</span>' +
      '</a>'
    }

    const buttons = this.SOCIALS.map(function (s) {
      return '<a class="soc soc-' + s.key + '" href="' + self.socialUrl(s) + '" target="_blank" rel="noopener">' +
        '<span class="soc-ic">' + self.brandSVG(s.key, 22) + '</span>' +
        '<span class="soc-t"><b>' + s.label + '</b><span>' + s.handle + '</span></span>' + arrow +
      '</a>'
    }).join('')

    return '<div class="social-wrap">' +
      '<div class="phones reveal">' + phone(ig, 'phone-ig') + phone(tt, 'phone-tt') + '</div>' +
      '<div class="reveal" style="--reveal-delay:100ms">' +
        '<p class="label-tag">Redes sociales</p>' +
        '<h2 class="section-title">Síguenos en todas</h2>' +
        '<p class="section-lead">Nuevos ingresos en Instagram, el antes y después de cada lavado en TikTok, y respuesta directa por WhatsApp.</p>' +
        '<div class="soc-buttons">' + buttons + '</div>' +
      '</div>' +
    '</div>'
  },

  // Compatibilidad: páginas antiguas que aún llamen a renderInstagram()
  renderInstagram() { return this.renderSocials() },

  // Navbar — activePage: 'Inicio'|'Inventario'|'Lavado'|'Nosotros'
  // Rutas absolutas — funcionan igual desde cualquier subcarpeta
  renderNavbar(activePage) {
    const self = this
    const links = [
      { label: 'Inicio',     href: '/index.html' },
      { label: 'Inventario', href: '/inventario/index.html' },
      { label: 'Lavado',     href: '/index.html#lavado' },
      { label: 'Nosotros',   href: '/nosotros/index.html' },
    ]
    const linksHtml = links.map(function (l) {
      return '<a href="' + l.href + '"' + (activePage === l.label ? ' aria-current="page"' : '') + '>' + l.label + '</a>'
    }).join('')
    const mobileHtml = links.map(function (l) {
      return '<a href="' + l.href + '" onclick="document.getElementById(\'mobile-menu\').classList.remove(\'open\')">' + l.label + '</a>'
    }).join('')

    return '<nav class="navbar" id="navbar">' +
      '<a href="/index.html" class="navbar-logo"><img src="/assets/images/logo.png" alt="RAB Automotora"></a>' +
      '<div class="navbar-links">' + linksHtml +
        '<a href="' + self.wa() + '" target="_blank" rel="noopener" class="btn-nav-wa" aria-label="Escríbenos por WhatsApp">' + self.waSVG(18) + '</a>' +
        '<a href="/index.html#lavado" class="btn-nav-cta">Agendar lavado</a>' +
      '</div>' +
      '<button class="navbar-hamburger" onclick="document.getElementById(\'mobile-menu\').classList.toggle(\'open\')" aria-label="Menú">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>' +
      '</button>' +
    '</nav>' +
    '<div class="navbar-mobile" id="mobile-menu">' + mobileHtml +
      '<a href="/index.html#lavado" class="btn-nav-cta" style="margin-top:10px" onclick="document.getElementById(\'mobile-menu\').classList.remove(\'open\')">Agendar lavado</a>' +
    '</div>'
  },

  renderFooter() {
    const self = this
    const schedHtml = this.SCHEDULE.map(function (s) {
      const color = s.hours === 'Cerrado' ? 'rgba(255,255,255,.35)' : 'var(--white)'
      return '<div class="footer-schedule-row">' +
        '<span class="footer-schedule-day">' + s.day + '</span>' +
        '<span class="footer-schedule-hours" style="color:' + color + '">' + s.hours + '</span>' +
      '</div>'
    }).join('')
    const socialHtml = this.SOCIALS.filter(function (s) { return s.key !== 'maps' }).map(function (s) {
      return '<a href="' + self.socialUrl(s) + '" target="_blank" rel="noopener" aria-label="' + s.label + '">' + self.brandSVG(s.key, 18) + '</a>'
    }).join('')

    return '<footer class="footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<img src="/assets/images/logo.png" alt="RAB" class="footer-logo">' +
          '<p class="footer-desc">Real Automotora Becerra. Vehículos seleccionados, servicio honesto y lavado de detalle en Buin.</p>' +
          '<div class="footer-social">' + socialHtml + '</div>' +
        '</div>' +
        '<div>' +
          '<p class="footer-heading">Navegación</p>' +
          '<ul class="footer-links">' +
            '<li><a href="/index.html">Inicio</a></li>' +
            '<li><a href="/inventario/index.html">Inventario</a></li>' +
            '<li><a href="/index.html#lavado">Lavado</a></li>' +
            '<li><a href="/nosotros/index.html">Nosotros</a></li>' +
            '<li style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.06)">' +
              '<a href="/admin/index.html" class="footer-link-admin">Backoffice →</a>' +
            '</li>' +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<p class="footer-heading">Horarios</p>' +
          '<div class="footer-schedule">' + schedHtml + '</div>' +
        '</div>' +
        '<div>' +
          '<p class="footer-heading">Contacto</p>' +
          '<div class="footer-contact">' +
            '<div class="footer-contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>' + self.ADDRESS + '</span></div>' +
            '<div class="footer-contact-item">' + self.waSVG(14) + '<span>+56 9 6491 8228</span></div>' +
          '</div>' +
          '<a href="' + self.wa() + '" target="_blank" rel="noopener" class="btn-whatsapp" style="margin-top:1.1rem">' + self.waSVG(14) + 'Cotizar ahora</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© ' + new Date().getFullYear() + ' Real Automotora Becerra. Todos los derechos reservados.</span>' +
        '<span>Buin, Región Metropolitana, Chile</span>' +
      '</div>' +
    '</div></footer>'
  },

  // ─── Catálogo de lavados (dinámico, N tipos) ────────────────
  // Íconos disponibles para un tipo sin imagen. Deben coincidir con ICONS del backend.
  WASH_ICONS: {
    drop:    '<path d="M12 2.5S5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    bolt:    '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    seat:    '<path d="M7 4h6a2 2 0 0 1 2 2v7H7z"/><path d="M5 13h12l2 4H5z"/><path d="M7 17v3M17 17v3"/>',
    shield:  '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    wheel:   '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>',
    engine:  '<path d="M4 9h3l2-2h5l2 2h2v3h2v-2h1v6h-1v-2h-2v3h-3l-2 2H9l-2-2H4z"/>',
    sun:     '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    star:    '<path d="M12 2l2.9 6.3 6.9.9-5 4.8 1.3 6.9L12 17.6 5.9 20.9 7.2 14l-5-4.8 6.9-.9z"/>',
  },
  washIcon(key, s) {
    s = s || 24
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (this.WASH_ICONS[key] || this.WASH_ICONS.drop) + '</svg>'
  },
  esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  },
  duration(min) {
    var h = Math.floor(min / 60), m = min % 60
    return h ? h + ' h' + (m ? ' ' + m + ' min' : '') : m + ' min'
  },
  DEPOSIT_TEXT: 'Requiere abono',

  // Tarjeta de un tipo de lavado.
  // t: { id, name, description, duration_minutes, prices{size:price}, features[], icon, image_url,
  //      badge, featured, requires_deposit }  ·  size: { id, name }
  // opts: { index, expanded, preview }  (preview = sin enlaces, para el editor del backoffice)
  washCard(t, size, opts) {
    opts = opts || {}
    var self = this, esc = this.esc
    var price = (t.prices && t.prices[size.id]) || 0
    var feats = t.features || []
    var shown = opts.expanded ? feats : feats.slice(0, 4)
    var more  = feats.length - shown.length
    var check = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'
    var clock = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
    var ribbonCls = t.badge === 'Más popular' ? ' hot' : t.badge === 'Nuevo' ? ' new' : ''
    var media = t.image_url
      ? '<img src="' + esc(t.image_url) + '" alt="" loading="lazy" decoding="async">'
      : '<span class="wash-ico">' + this.washIcon(t.icon, 76) + '</span>'
    var msg = 'Hola, quiero agendar un lavado *' + t.name + '* para ' + size.name + '. ¿Tienen disponibilidad?'
    var cta = opts.preview
      ? '<span class="btn-turbo btn-sm">Agendar</span>'
      : '<a class="btn-turbo btn-sm" href="' + this.wa(msg) + '" target="_blank" rel="noopener" data-wash-cta="' + esc(t.id) + '">' + this.waSVG(14) + 'Agendar</a>'

    return '<article class="wash-card' + (t.featured ? ' is-featured' : '') + (opts.preview ? '' : ' reveal') + '"' +
        ' style="--reveal-delay:' + (Math.min(opts.index || 0, 5) * 70) + 'ms" data-wash-id="' + esc(t.id) + '">' +
      '<div class="wash-media' + (t.image_url ? ' has-img' : '') + '">' +
        (t.badge ? '<span class="wash-ribbon' + ribbonCls + '">' + esc(t.badge) + '</span>' : '') + media +
        '<span class="wash-dur">' + clock + esc(this.duration(t.duration_minutes || 60)) + '</span>' +
      '</div>' +
      '<div class="wash-body">' +
        '<h3 class="wash-name">' + (esc(t.name) || 'Sin nombre') + '</h3>' +
        '<p class="wash-desc">' + esc(t.description) + '</p>' +
        (t.requires_deposit ? '<span class="wash-chip">' + this.DEPOSIT_TEXT + '</span>' : '') +
        '<ul class="wash-feats">' + shown.map(function (f) { return '<li>' + check + '<span>' + esc(f) + '</span></li>' }).join('') + '</ul>' +
        (more > 0 ? '<button type="button" class="wash-more" data-wash-more="' + esc(t.id) + '">+' + more + ' más incluido' + (more > 1 ? 's' : '') + '</button>' : '') +
        '<div class="wash-foot">' +
          '<div class="wash-price"><small>' + esc(size.name) + '</small><strong data-v="' + price + '">' + self.price(price) + '</strong></div>' +
          cta +
        '</div>' +
      '</div>' +
    '</article>'
  },

  // Monta la sección de lavados: pide GET /api/wash-types y dibuja selector de tamaño + tarjetas.
  // els: { grid, seg, label, swipe } (ids). El tipo elegido llega al agendamiento por WhatsApp
  // con su nombre y el tamaño seleccionado.
  async mountWashTypes(els) {
    var self = this
    var grid  = document.getElementById(els.grid)
    var seg   = document.getElementById(els.seg)
    var label = document.getElementById(els.label)
    var swipe = els.swipe && document.getElementById(els.swipe)
    if (!grid) return
    var state = { types: [], sizes: [], size: null, expanded: {} }
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    grid.innerHTML = Array(3).fill('<div class="skeleton-card"><div class="skeleton" style="height:150px;border-radius:0"></div><div style="padding:1.1rem"><div class="skeleton" style="height:20px;width:60%;margin-bottom:10px"></div><div class="skeleton" style="height:12px;margin-bottom:8px"></div><div class="skeleton" style="height:12px;width:80%"></div></div></div>').join('')

    function sizeObj() { return state.sizes.find(function (s) { return s.id === state.size }) || state.sizes[0] }
    function cols(n) { return n <= 3 ? n : (n === 4 || n === 7 || n === 8) ? 4 : 3 }

    function render() {
      var list = state.types
      grid.classList.toggle('one', list.length === 1)
      if (swipe) swipe.classList.toggle('on', list.length > 1)
      if (!list.length || !state.sizes.length) {
        grid.style.removeProperty('--cols')
        if (seg) seg.parentNode.style.display = 'none'
        grid.innerHTML = '<div class="wash-empty">' +
          '<span class="drop">' + self.washIcon('drop', 72) + '</span>' +
          '<h3 class="display" style="font-size:1.6rem">Estamos preparando nuevos lavados</h3>' +
          '<p>Por ahora no hay lavados publicados. Escríbenos y te ayudamos a coordinar el tuyo.</p>' +
          '<a class="btn-whatsapp" href="' + self.wa('Hola RAB, quiero consultar por un lavado.') + '" target="_blank" rel="noopener">' + self.waSVG(15) + 'Consultar por WhatsApp</a>' +
        '</div>'
        return
      }
      if (seg) seg.parentNode.style.display = ''
      grid.style.setProperty('--cols', cols(list.length))
      var s = sizeObj()
      grid.innerHTML = list.map(function (t, i) { return self.washCard(t, s, { index: i, expanded: state.expanded[t.id] }) }).join('')
      self.initReveal()
    }

    function renderSeg() {
      if (!seg) return
      seg.innerHTML = '<span class="seg-ind"></span>' + state.sizes.map(function (s) {
        return '<button type="button" data-size="' + self.esc(s.id) + '" aria-pressed="' + (s.id === state.size) + '" title="' + self.esc(s.name) + '">' + self.esc(s.short_name || s.name) + '</button>'
      }).join('')
      moveInd()
    }
    function moveInd() {
      if (!seg) return
      var b = seg.querySelector('[aria-pressed="true"]'), ind = seg.querySelector('.seg-ind')
      if (b && ind) { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = 'translateX(' + b.offsetLeft + 'px)' }
      if (label && sizeObj()) label.innerHTML = 'Precios para <b>' + self.esc(sizeObj().name) + '</b>'
    }

    // Cambio de tamaño: actualiza precios con animación y los enlaces de agendar
    function updatePrices() {
      var s = sizeObj()
      grid.querySelectorAll('.wash-card').forEach(function (card) {
        var t = state.types.find(function (x) { return String(x.id) === card.getAttribute('data-wash-id') })
        if (!t) return
        var el = card.querySelector('.wash-price strong'), small = card.querySelector('.wash-price small')
        var cta = card.querySelector('[data-wash-cta]')
        var to = t.prices[s.id] || 0, from = Number(el.getAttribute('data-v')) || 0
        small.textContent = s.name
        el.setAttribute('data-v', to)
        if (cta) cta.href = self.wa('Hola, quiero agendar un lavado *' + t.name + '* para ' + s.name + '. ¿Tienen disponibilidad?')
        if (reduced || from === to) { el.textContent = self.price(to); return }
        var t0 = performance.now()
        ;(function step(now) {
          var k = Math.min(1, (now - t0) / 420), e = 1 - Math.pow(1 - k, 3)
          el.textContent = self.price(Math.round((from + (to - from) * e) / 100) * 100)
          if (k < 1) requestAnimationFrame(step); else el.textContent = self.price(to)
        })(t0)
      })
    }

    if (seg) seg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-size]'); if (!b) return
      state.size = b.getAttribute('data-size')
      seg.querySelectorAll('[data-size]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
      moveInd(); updatePrices()
    })
    grid.addEventListener('click', function (e) {
      var m = e.target.closest('[data-wash-more]'); if (!m) return
      state.expanded[m.getAttribute('data-wash-more')] = true
      render()
    })
    window.addEventListener('resize', moveInd)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInd)

    try {
      var res = await this.api('/api/wash-types')
      state.types = res.data || []
      state.sizes = res.sizes || []
    } catch (e) {
      state.types = []; state.sizes = []
    }
    state.size = state.sizes[0] && state.sizes[0].id
    renderSeg(); render()
  },

  initNavbarScroll() {
    const nav = document.getElementById('navbar')
    if (!nav) return
    const update = function () { nav.classList.toggle('scrolled', window.scrollY > 40) }
    window.addEventListener('scroll', update, { passive: true })
    update()
  },

  initReveal() {
    const els = document.querySelectorAll('.reveal:not(.visible)')
    if (!window.IntersectionObserver) {
      els.forEach(function (el) { el.classList.add('visible') })
      return
    }
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
    els.forEach(function (el) { obs.observe(el) })
  },
}

// ── Auto-inyección del botón flotante de WhatsApp en las páginas públicas ──
;(function () {
  if (typeof document === 'undefined') return
  if (location.pathname.indexOf('/admin') !== -1) return   // no en el backoffice
  function mount() {
    if (document.querySelector('.wa-fab')) return
    var holder = document.createElement('div')
    holder.innerHTML = RAB.renderWhatsappFloat()
    document.body.appendChild(holder.firstChild)
    // Barra inferior en celular: Agendar lavado + WhatsApp (reemplaza al botón flotante)
    holder.innerHTML = '<div class="mobile-cta"><a class="btn-turbo" href="/index.html#lavado">Agendar lavado</a>' +
      '<a class="btn-whatsapp" href="' + RAB.wa('Hola RAB, ¿me pueden ayudar? Escribo desde la web.') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + RAB.waSVG(18) + '</a></div>'
    document.body.appendChild(holder.firstChild)
    document.body.classList.add('has-mobile-cta')
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
  else mount()
})()
