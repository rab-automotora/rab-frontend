// assets/js/config.js — RAB Automotora
// Config central + helpers + renders de navbar/footer
// "base" es la ruta relativa hacia la raíz: '' en index, '../' en subcarpetas

const RAB = {
  // Backend URL — cambiar al desplegar
  API_URL: 'https://rab-backend.onrender.com',
  // API_URL: 'http://localhost:4000',


  WHATSAPP: '56964918228',
  ADDRESS:  'Panamericana Sur Km 1505, Buin (al lado del BuinZoo)',
  GMAPS:    'https://maps.google.com/?q=-33.716,-70.729',

  // ⚠️ Actualizar con el perfil real de la cuenta
  INSTAGRAM: {
    handle: '@rabautomotora',
    url:    'https://www.instagram.com/rabautomotora/',
  },

  SCHEDULE: [
    { day: 'Lunes a Viernes', hours: '9:00 – 19:00' },
    { day: 'Sábado',          hours: '9:00 – 14:00' },
    { day: 'Domingo',         hours: 'Cerrado' },
  ],

  CATEGORIES: ['Todos', 'Sedán', 'SUV', 'Pickup', 'Hatchback', 'Deportivo'],

  // ─── Datos fallback de lavado (se usa si la API no responde) ─
  WASHING: {
    Standard: {
      label: 'Lavado Standard',
      desc:  'Limpieza exterior y protección básica',
      features: ['Lavado exterior', 'Aspirado interior', 'Limpieza vidrios', 'Protección básica'],
      prices: [
        { size: 'Auto / Hatchback',                   price: 15000 },
        { size: 'SUV / Crossover',                    price: 17000 },
        { size: 'Extra Grande (SUV XL / Station)',    price: 21000 },
        { size: 'Super Grande (Pickup / Camioneta)',  price: 25000 },
      ],
    },
    Premium: {
      label: 'Lavado Premium',
      desc:  'Servicio integral con limpieza profunda',
      features: ['Lavado exterior detallado', 'Limpieza profunda interior', 'Limpieza de chasis', 'Encerado', 'Aromas'],
      prices: [
        { size: 'Auto / Hatchback',                   price: 20000 },
        { size: 'SUV / Crossover',                    price: 23000 },
        { size: 'Extra Grande (SUV XL / Station)',    price: 28000 },
        { size: 'Super Grande (Pickup / Camioneta)',  price: 31000 },
      ],
    },
  },

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
        const res = await fetch(self.API_URL + '/api/admin/refresh', {
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

  async api(path, opts) {
    opts = opts || {}
    // Refresh proactivo: si el access_token está por vencer, renuévalo antes de pedir.
    if (!opts._retry && this.getRefreshToken() && this._tokenExpiringSoon()) {
      try { await this.refreshSession() } catch (e) { /* el 401 de abajo lo maneja */ }
    }
    const token = this.getToken()
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {})
    if (token) headers['Authorization'] = 'Bearer ' + token
    const res = await fetch(this.API_URL + path, Object.assign({}, opts, { headers }))
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
  // opts: { title, message, confirmText, cancelText, danger, alert }
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

  // CTA "Síguenos en Instagram" — sin datos externos, botón con degradado de marca IG
  renderInstagram() {
    const ig = this.INSTAGRAM
    return '<div class="ig-cta reveal">' +
      '<div class="ig-media">' +
        '<div class="ig-glow"></div>' +
        '<div class="ig-reel">' +
          '<video src="/assets/videos/REEL.mp4" autoplay muted loop playsinline preload="metadata" disablepictureinpicture aria-label="Reel de Instagram de RAB Automotora"></video>' +
          '<button type="button" class="ig-mute" aria-label="Activar sonido" aria-pressed="false" onclick="RAB.toggleReelSound(this)">' + this.volumeSVG(false, 16) + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="ig-copy">' +
        '<div class="ig-glyph">' + this.igSVG(30) + '</div>' +
        '<p class="label-tag">Redes sociales</p>' +
        '<h2 class="section-title" style="margin-top:.4rem">Descubre nuestro Instagram</h2>' +
        '<p class="ig-message">Mira lo que compartimos día a día: nuevos ingresos, novedades y contenido exclusivo. Síguenos y no te pierdas el próximo vehículo que podría ser tuyo.</p>' +
        '<a href="' + ig.url + '" target="_blank" rel="noopener" class="btn-instagram">' + this.igSVG(18) + 'Seguir en Instagram</a>' +
        '<div class="ig-handle">' + ig.handle + '</div>' +
      '</div>' +
    '</div>'
  },

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
      return '<a href="' + l.href + '"' + (activePage === l.label ? ' style="color:#fff"' : '') + '>' + l.label + '</a>'
    }).join('')
    const mobileHtml = links.map(function (l) {
      return '<a href="' + l.href + '" onclick="document.getElementById(\'mobile-menu\').classList.remove(\'open\')">' + l.label + '</a>'
    }).join('')

    return '<nav class="navbar" id="navbar">' +
      '<a href="/index.html" class="navbar-logo"><img src="/assets/images/logo.png" alt="RAB Automotora"></a>' +
      '<div class="navbar-links">' + linksHtml +
        '<a href="' + self.wa() + '" target="_blank" class="btn-nav-cta">Contáctanos</a>' +
      '</div>' +
      '<button class="navbar-hamburger" onclick="document.getElementById(\'mobile-menu\').classList.toggle(\'open\')" aria-label="Menú">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
      '</button>' +
    '</nav>' +
    '<div class="navbar-mobile" id="mobile-menu">' + mobileHtml +
      '<a href="' + self.wa() + '" target="_blank" class="btn-nav-cta" style="justify-content:center;margin-top:8px">Contáctanos</a>' +
    '</div>'
  },

  renderFooter() {
    const self = this
    const schedHtml = this.SCHEDULE.map(function (s) {
      const color = s.hours === 'Cerrado' ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.7)'
      return '<div class="footer-schedule-row">' +
        '<span class="footer-schedule-day">' + s.day + '</span>' +
        '<span class="footer-schedule-hours" style="color:' + color + '">' + s.hours + '</span>' +
      '</div>'
    }).join('')

    return '<footer class="footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<img src="/assets/images/logo.png" alt="RAB" class="footer-logo">' +
          '<p class="footer-desc">Real Automotora Becerra. Vehículos seleccionados, servicio honesto y calidad garantizada en Buin.</p>' +
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
          '<a href="' + self.wa() + '" target="_blank" class="btn-whatsapp" style="margin-top:1rem;font-size:12px;padding:8px 16px">' + self.waSVG(13) + 'Cotizar ahora</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© ' + new Date().getFullYear() + ' Real Automotora Becerra. Todos los derechos reservados.</span>' +
        '<span>Buin, Región Metropolitana, Chile</span>' +
      '</div>' +
    '</div></footer>'
  },

  // Render sección completa de lavado
  // plans: optional array from DB [{title, subtitle, prices, features, sort_order, recommended}]
  // Falls back to static WASHING data if plans is not provided or has fewer than 2 items
  renderWashing(plans) {
    const self = this
    let planList

    if (plans && plans.length >= 2) {
      planList = plans.slice().sort(function (a, b) { return a.sort_order - b.sort_order })
        .map(function (p) {
          return { label: p.title, desc: p.subtitle, features: p.features || [], prices: p.prices || [], recommended: !!p.recommended }
        })
    } else {
      planList = [
        { label: self.WASHING.Standard.label, desc: self.WASHING.Standard.desc, features: self.WASHING.Standard.features, prices: self.WASHING.Standard.prices, recommended: false },
        { label: self.WASHING.Premium.label,  desc: self.WASHING.Premium.desc,  features: self.WASHING.Premium.features,  prices: self.WASHING.Premium.prices,  recommended: true  },
      ]
    }

    function renderCard(plan, isPremium) {
      const planKey = isPremium ? 'Premium' : 'Standard'
      const waMsg = 'Hola, quiero agendar un lavado *' + planKey + '*. ¿Tienen disponibilidad?'
      const waUrl = 'https://wa.me/' + self.WHATSAPP + '?text=' + encodeURIComponent(waMsg)
      const suffix = isPremium ? 'premium' : 'standard'

      const icon = isPremium
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>'

      const pricesHtml = plan.prices.map(function (row) {
        return '<div class="wash-price-row">' +
          '<span class="wash-price-size">' + row.size + '</span>' +
          '<span class="wash-price-value wash-price-value-' + suffix + '">' + self.price(row.price) + '</span>' +
        '</div>'
      }).join('')

      const featsHtml = plan.features.map(function (f) {
        return '<span class="wash-feature">' +
          '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5FC2DA" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' + f +
        '</span>'
      }).join('')

      return '<div class="wash-card reveal" style="--reveal-delay:' + (isPremium ? '120' : '0') + 'ms">' +
        '<div class="wash-header wash-header-' + suffix + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start">' +
            '<div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center">' + icon + '</div>' +
            (plan.recommended ? '<div class="badge-recommended"><div class="badge-dot"></div>Recomendado</div>' : '') +
          '</div>' +
          '<div class="wash-plan-name">' + plan.label + '</div>' +
          '<div class="wash-plan-desc wash-plan-desc-' + suffix + '">' + plan.desc + '</div>' +
        '</div>' +
        '<div class="wash-prices wash-prices-' + suffix + '">' +
          '<p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:rgba(255,255,255,.3);margin-bottom:.75rem">Precio por tamaño</p>' +
          pricesHtml +
        '</div>' +
        '<div class="wash-features">' + featsHtml + '</div>' +
        '<div class="wash-cta">' +
          '<a href="' + waUrl + '" target="_blank" class="' + (isPremium ? 'btn-gold' : 'btn-primary') + '" style="width:100%;justify-content:center;font-size:13px;padding:12px 20px">' +
            self.waSVG(15) + 'Agendar ' + planKey +
          '</a>' +
        '</div>' +
      '</div>'
    }

    return renderCard(planList[0], false) + renderCard(planList[1], true)
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
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
  else mount()
})()
