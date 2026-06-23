# Estado de seguridad

Este proyecto es un **mockup funcional**. La autenticación y la autorización
**no están aplicadas a propósito** en los endpoints del BFF en esta fase. Lo
que sigue es una descripción honesta del estado actual del código, no una
auditoría completa.

## Ausencia de autenticación en el BFF

No existe un `middleware.ts` en el proyecto. Esto significa que todos los
endpoints bajo `src/app/api/**` (excepto `src/app/api/auth/login`) son
accesibles sin ninguna sesión válida: cualquiera que conozca la URL puede
invocarlos directamente.

## Flujo de token incompleto

El login (`src/features/auth/hooks/useLogin.ts`) guarda el token recibido en
`sessionStorage` tras un login exitoso, pero ese token nunca se vuelve a leer.
`src/lib/api-client.ts` no lo recupera ni lo reenvía en ninguna request
posterior: las llamadas a `/api/casos`, `/api/metricas/dashboard`, etc. salen
sin ningún header de autorización.

## Llamadas servidor→Gestar

Las llamadas del servidor hacia la API de Gestar (`src/server/gestar/client.ts`)
usan un `GESTAR_API_TOKEN` estático leído de variables de entorno, no la
sesión del usuario que está usando la app. Es el mismo token para todos los
usuarios, independientemente de quién haya iniciado sesión (o si nadie lo
hizo).

## Antes de producción

Como mínimo, antes de cualquier despliegue real habría que resolver:

- Aplicar autenticación en el BFF (middleware o guard por endpoint) para que
  `src/app/api/**` rechace requests sin sesión válida.
- Conectar el token de sesión guardado en `sessionStorage` al `api-client`
  para que se reenvíe en cada request.
- Reemplazar o asegurar el `GESTAR_API_TOKEN` estático por una credencial
  ligada a la sesión del usuario (o, al menos, gestionarlo como secreto real).
