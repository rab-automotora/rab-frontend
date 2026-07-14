// bump-cache.js — Cache busting para sitio estático (sin build).
// Agrega/actualiza ?v=<versión> en las referencias a rab.css y config.js de todos
// los .html, para que el navegador descargue la versión nueva sin limpiar caché.
//
// Uso:  node bump-cache.js
// Corrélo ANTES de desplegar (o de commitear) cada vez que cambies CSS/JS.
const fs   = require('fs')
const path = require('path')

const ROOT    = __dirname
const ASSETS  = ['rab.css', 'config.js']   // assets compartidos y cacheados
const version = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) // YYYYMMDDHHMMSS

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walkHtml(p, out)
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

let changed = 0
for (const file of walkHtml(ROOT)) {
  const before = fs.readFileSync(file, 'utf8')
  let html = before
  for (const asset of ASSETS) {
    // Reemplaza "asset" o "asset?v=###" por "asset?v=<version>"
    const re = new RegExp(asset.replace('.', '\\.') + '(\\?v=[0-9]+)?', 'g')
    html = html.replace(re, asset + '?v=' + version)
  }
  if (html !== before) { fs.writeFileSync(file, html); changed++ }
}

console.log('Cache bump → v=' + version + '  (' + changed + ' archivos HTML actualizados)')
