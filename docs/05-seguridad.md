---
title: Seguridad y Producción
nav_order: 5
---

# 🔐 Seguridad (Producción)

Actualmente el sistema usa **localStorage**, por lo tanto:

⚠️ Cada usuario ve solo sus datos

## Para producción se recomienda:

- Autenticación real (Firebase Auth / Supabase)
- Base de datos centralizada
- HTTPS obligatorio
- Roles (admin, captura, lectura)
- Backups automáticos
- Logs de auditoría
