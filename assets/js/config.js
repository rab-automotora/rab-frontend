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

  wa(msg) {
    const text = msg || 'Hola, quiero cotizar un vehículo en RAB Automotora.'
    return 'https://wa.me/' + this.WHATSAPP + '?text=' + encodeURIComponent(text)
  },

  // Alias para compatibilidad con detalle.html y otros archivos
  whatsappUrl(msg) { return this.wa(msg) },

  async api(path, opts) {
    opts = opts || {}
    const token = localStorage.getItem('rab_token')
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {})
    if (token) headers['Authorization'] = 'Bearer ' + token
    const res = await fetch(this.API_URL + path, Object.assign({}, opts, { headers }))
    if (!res.ok) {
      if (res.status === 401 && token) {
        localStorage.removeItem('rab_token')
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

  carSVG() {
    return '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>'
  },

  waSVG(s) {
    s = s || 14
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>'
  },

  // Vehicle card — rutas absolutas, sin parámetro base
  vehicleCard(v, idx) {
    const cover = (v.vehicle_images || []).find(function (i) { return i.is_cover }) || (v.vehicle_images || [])[0]
    const status = v.status || 'Disponible'
    const badgeMap = { 'Disponible': 'available', 'Vendido': 'sold', 'Próximo Ingreso': 'upcoming' }
    const badge = badgeMap[status] || 'available'
    const msg = 'Hola, me interesa cotizar el ' + v.brand + ' ' + v.model + ' ' + v.year + ' — ' + this.price(v.price) + '. ¿Tienen disponibilidad?'
    const href = '/inventario/detalle.html?id=' + v.id
    const delay = typeof idx === 'number' ? Math.min(idx, 5) * 70 : 0

    return '<div class="vehicle-card reveal" style="--reveal-delay:' + delay + 'ms">' +
      '<a href="' + href + '" class="card-img">' +
        (cover
          ? '<img src="' + cover.public_url + '" alt="' + v.brand + ' ' + v.model + '" loading="lazy">'
          : '<div class="card-img-placeholder">' + this.carSVG() + '<span style="font-size:12px">Sin foto</span></div>') +
        '<span class="card-badge badge-' + badge + '">' + status + '</span>' +
        (v.featured ? '<span class="badge-featured">Destacado</span>' : '') +
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
        '<a href="' + self.wa() + '" target="_blank" class="btn-whatsapp">' + self.waSVG(14) + 'Cotizar</a>' +
      '</div>' +
      '<button class="navbar-hamburger" onclick="document.getElementById(\'mobile-menu\').classList.toggle(\'open\')" aria-label="Menú">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
      '</button>' +
    '</nav>' +
    '<div class="navbar-mobile" id="mobile-menu">' + mobileHtml +
      '<a href="' + self.wa() + '" target="_blank" class="btn-whatsapp" style="justify-content:center;margin-top:8px">Cotizar por WhatsApp</a>' +
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
