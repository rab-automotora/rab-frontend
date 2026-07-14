# Subir el sitio al hosting

Guía para publicar cambios del frontend de **RAB Automotora** copiando los archivos al servidor.

---

## Pasos

### 1. Actualizar la versión de caché (importante)

Antes de subir nada, en la carpeta `frontend` ejecuta:

```bash
node bump-cache.js
```

Esto cambia el `?v=<versión>` de `rab.css` y `config.js` en todos los `.html`.
Sin este paso, el navegador de los usuarios podría seguir mostrando la versión **vieja** de los estilos/scripts.

> Si cambiaste **solo HTML** (no CSS ni JS), igual puedes correrlo: no molesta.

### 2. Copiar los archivos al servidor

Sube al hosting **la raíz del sitio** (donde está `index.html`), manteniendo la misma estructura de carpetas:

```
index.html
.htaccess              ← ¡no olvidar! controla el caché del HTML
admin/
assets/
inventario/
nosotros/
```

- El `.htaccess` va en la **raíz** del sitio (junto a `index.html`).
- Sube siempre `assets/` cuando cambies estilos, scripts o imágenes.

### 3. Verificar

Abre el sitio y confirma que se ven los cambios. Ya **no** deberías necesitar limpiar caché ni historial.

---

## Qué NO subir

- `bump-cache.js` y este archivo (`SUBIR-AL-HOSTING.md`) son solo para desarrollo. Puedes subirlos o no; no afectan al sitio.
- No subas archivos comprimidos (`.zip`) ni `node_modules`.

---

## Notas

- **`.htaccess` es para Apache/cPanel** (la mayoría de los hostings compartidos). Si tu hosting es Nginx, ese archivo no tiene efecto; pídele al proveedor las cabeceras equivalentes (`Cache-Control: no-cache` para `.html`).
- **Probando en tu PC:** abre DevTools (F12) → pestaña **Network** → marca **"Disable cache"** mientras DevTools esté abierto. Así ves los cambios al instante sin depender del `?v`.

---

## Resumen rápido

```bash
# 1. en la carpeta frontend
node bump-cache.js

# 2. copiar al servidor (raíz del sitio):
#    index.html, .htaccess, admin/, assets/, inventario/, nosotros/
```
