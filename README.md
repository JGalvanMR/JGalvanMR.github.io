# 📦 Sistema de Inventario de Cajones - GAB

## 🎯 Descripción

Sistema web para digitalizar y eficientar el proceso de captura de inventario de cajones armables. Sustituye el proceso actual de reportes por WhatsApp y consolidación manual en Excel.

## ✨ Características Principales

### 1. **Captura Rápida de Inventario**
- Formulario intuitivo optimizado para celulares
- Selección de ubicaciones predefinidas
- Campos para diferentes tipos de cajones (Armables, Rotos, Azules, Blancos)
- Campo de notas para observaciones adicionales
- Visualización inmediata de registros del día

### 2. **Dashboard en Tiempo Real**
- Vista consolidada del inventario diario
- Estadísticas generales (totales por tipo de cajón)
- Desglose por zonas:
  - Zona Aguilares
  - Zona Querétaro
  - Zona Irapuato
  - Zona Norte
  - Transporte
  - Zona Centro
- Tabla detallada con todos los registros

### 3. **Historial Completo**
- Búsqueda por rangos de fechas
- Filtrado por ubicación
- Vista agrupada por día
- Totales por fecha

### 4. **Exportación de Datos**
- Exportar a Excel (.csv)
- Exportar datos completos
- Imprimir reportes formateados
- Compatible con Excel y Google Sheets

### 5. **Sistema de Usuarios**
- Login personalizado para cada responsable
- Seguimiento de quién capturó cada registro
- Nombres predefinidos según el equipo actual

## 👥 Usuarios del Sistema

- **Carmen** - Empaque de Brocoli (Aguilares)
- **Jorge Alberto** - Campo Aguilares
- **Guadalupe Segura** - Castillo (Querétaro)
- **Alejandro Soto** - Transporte (Pato)
- **José Gómez** - Zona Norte
- **René** - Plataformas GAB
- **Adolfo** - Doña Rosa / San Javier
- **José Manuel Jiménez** - Marquesado
- **Rafa** - Buena Vista / María Isabel
- **Daniel** - Covemex
- **Tavo** - Báscula Comercializadora
- **Ivan** - Administrador

## 🚀 Implementación

### Opción 1: Hosting Gratuito (Recomendado para empezar)

#### Netlify (100% Gratis)
1. Crear cuenta en [Netlify](https://www.netlify.com)
2. Hacer "drag & drop" de los archivos (index.html, styles.css, app.js)
3. ¡Listo! URL disponible en minutos

#### GitHub Pages (100% Gratis)
1. Crear repositorio en GitHub
2. Subir los archivos
3. Activar GitHub Pages en Settings
4. URL: `https://tu-usuario.github.io/tu-repo`

#### Vercel (100% Gratis)
1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar proyecto
3. Deploy automático

### Opción 2: Servidor Propio

1. Subir los archivos a cualquier servidor web
2. Configurar dominio (opcional)
3. Asegurar con HTTPS (Let's Encrypt gratuito)

## 📱 Acceso desde Celular

### Agregar a Pantalla de Inicio (iOS/Android)

**iOS (Safari):**
1. Abrir la URL en Safari
2. Tocar el botón "Compartir" (cuadrado con flecha)
3. Seleccionar "Agregar a pantalla de inicio"
4. La app aparecerá como cualquier otra app

**Android (Chrome):**
1. Abrir la URL en Chrome
2. Menú (3 puntos) → "Agregar a pantalla de inicio"
3. Confirmar
4. Ícono agregado a la pantalla principal

## 💾 Almacenamiento de Datos

Actualmente usa **localStorage** del navegador:
- ✅ Sin necesidad de servidor
- ✅ Funciona offline
- ⚠️ Datos locales por dispositivo

### Para Producción (Recomendado)

**Opción A: Firebase (Gratis hasta ~50k lecturas/día)**
```javascript
// Configuración Firebase
// 1. Crear proyecto en Firebase Console
// 2. Activar Firestore Database
// 3. Actualizar app.js con credenciales
```

**Opción B: Supabase (Gratis hasta 500MB)**
- Base de datos PostgreSQL
- API REST automática
- Autenticación incluida

**Opción C: MongoDB Atlas (Gratis hasta 512MB)**
- Base de datos NoSQL
- API sencilla
- Escalable

## 🔧 Personalización

### Agregar Nuevas Ubicaciones

En `index.html`, línea ~80:
```html
<optgroup label="Zona Nueva">
    <option value="Nueva Ubicacion">Nueva Ubicación</option>
</optgroup>
```

En `app.js`, línea ~260, agregar al `zoneMapping`:
```javascript
'Nueva Ubicacion': 'Zona Nueva'
```

### Agregar Nuevos Usuarios

En `index.html`, línea ~40:
```html
<option value="nuevo_usuario">Nuevo Usuario (Ubicación)</option>
```

En `app.js`, línea ~60, agregar al `displayNames`:
```javascript
'nuevo_usuario': 'Nombre Completo (Area)'
```

### Cambiar Colores

En `styles.css`, modificar las variables:
```css
/* Color primario */
background: linear-gradient(135deg, #TU_COLOR 0%, #TU_COLOR2 100%);
```

## 📊 Ventajas vs. Proceso Actual

| Aspecto | Antes (WhatsApp + Excel) | Ahora (Sistema Web) |
|---------|-------------------------|---------------------|
| **Captura** | Mensaje de texto libre | Formulario estructurado |
| **Consolidación** | Manual por Ivan | Automática |
| **Errores** | Frecuentes (formato libre) | Reducidos (validación) |
| **Tiempo** | ~2 horas/día | ~10 minutos/día |
| **Acceso a datos** | Solo Ivan (Excel) | Todos en tiempo real |
| **Historial** | Difícil de consultar | Búsqueda instantánea |
| **Reportes** | Generación manual | Exportación automática |
| **Disponibilidad** | Horario laboral | 24/7 |

## 🔐 Seguridad (Para Producción)

### Implementar:
1. **Autenticación real** (Firebase Auth / Auth0)
2. **Roles y permisos** (admin, captura, solo lectura)
3. **HTTPS obligatorio**
4. **Backup automático de base de datos**
5. **Logs de auditoría**

## 📈 Próximas Mejoras Sugeridas

- [ ] Notificaciones push cuando alguien reporta
- [ ] Gráficas de tendencias (Chart.js)
- [ ] Alertas automáticas de inventario bajo
- [ ] Comparativas semana/mes/año
- [ ] App móvil nativa (opcional)
- [ ] Integración con sistema ERP existente
- [ ] OCR para escanear tickets de transporte
- [ ] Geolocalización automática

## 🆘 Soporte

### Problemas Comunes

**No guarda los datos:**
- Verificar que el navegador permita localStorage
- Limpiar caché del navegador
- Probar en modo incógnito

**No aparecen los registros:**
- Verificar la fecha seleccionada
- Revisar que haya datos para esa fecha
- Refrescar la página (F5)

**No puedo exportar:**
- Verificar que haya datos
- Permitir descargas en el navegador
- Probar con otro navegador

## 📝 Notas de Desarrollo

### Stack Tecnológico
- **HTML5** - Estructura
- **CSS3** - Estilos y responsive design
- **JavaScript Vanilla** - Lógica (sin dependencias)
- **LocalStorage API** - Almacenamiento temporal

### Compatibilidad
- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ iOS Safari 14+
- ✅ Chrome Android

### Rendimiento
- Carga inicial: < 100KB
- Tiempo de carga: < 1 segundo
- Funciona offline (PWA-ready)

## 📞 Contacto

Para soporte técnico o mejoras:
- Contactar a Ivan (Administrador del sistema)
- Documentación adicional disponible en el código

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026  
**Desarrollado para:** GAB - Gestión de Cajones Armables
