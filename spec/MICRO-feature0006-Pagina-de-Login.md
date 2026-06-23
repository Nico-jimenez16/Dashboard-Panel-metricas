# Página de Login — Dashboard-Panel-metricas

## Contexto

Hoy la app no tiene página de login: `src/app/layout.tsx` monta `<Sidebar />` de forma fija para todas las rutas, y `src/app/page.tsx` (ruta `/`) muestra directamente el dashboard. No existe ningún mecanismo de autenticación real — no hay `middleware.ts`, ni sesión, ni librería de auth en `package.json`. El único "token" presente en el código es `GESTAR_API_TOKEN` (`src/server/env.ts`, `src/server/gestar/client.ts`), un token de servicio fijo server-side para la API de Gestar, no ligado a usuarios.

Se pidió agregar una página de Login que **se abra por defecto al iniciar el sistema**, en base a un mockup de referencia (`login.png`): panel izquierdo de marca + panel derecho con formulario Email/Contraseña y botón "Ingresar".

## Decisiones confirmadas

- **Alcance: solo UI/mock.** Validación básica de formulario (campos requeridos, formato de email); cualquier combinación válida redirige al dashboard. Sin backend de usuarios, sin sesión persistida (`localStorage`/cookies/JWT) y sin protección de rutas todavía — queda para una tarea futura de autenticación real.
- **Color de marca: verde institucional del proyecto** (`#0F4C3A`, ya usado en `Sidebar.tsx`) en el panel izquierdo, en vez del azul del mockup, para mantener consistencia visual con el resto de la app. Texto del panel izquierdo: "Microinformática / Banco de Córdoba" (mismo branding que `Sidebar.tsx`), no "GestiónCasos" del mockup.
- **El login ocupa la ruta raíz `/`.** Como no hay sesión que chequear, la única forma de que "se abra por defecto al iniciar el sistema" es que sea la página que se ve al entrar a la app. Esto implica mover el dashboard actual de `/` a `/dashboard` (`/casos` no cambia) y sacar el `<Sidebar />` del layout raíz para que no aparezca en el login.

## Cambios por capa

### 1. Reestructuración de rutas (route group para el Sidebar)
- Crear `src/app/(dashboard)/layout.tsx`: contiene lo que hoy está en `src/app/layout.tsx` (líneas 28-35) — `<Sidebar />` + `<div className="ml-60 flex flex-1 flex-col min-h-screen">{children}</div>`.
- Mover `src/app/page.tsx` (contenido actual del dashboard) → `src/app/(dashboard)/dashboard/page.tsx`, sin cambios de lógica (sigue usando `useDashboardMetrics`, `Header`, `KPICards`, etc.).
- Mover `src/app/casos/page.tsx` y `src/app/casos/[id]/page.tsx` → `src/app/(dashboard)/casos/page.tsx` y `src/app/(dashboard)/casos/[id]/page.tsx`, sin cambios de lógica. El route group `(dashboard)` no afecta la URL, así que `/casos` y `/casos/[id]` siguen resolviendo igual.
- Simplificar `src/app/layout.tsx`: queda solo `html`/`body`/fuentes Geist/`<Providers>`, sin `<Sidebar />` ni el wrapper `ml-60` (eso se movió al layout del route group).

### 2. `src/components/layout/Sidebar/Sidebar.tsx` — ajuste de navegación
- En `NAV_ITEMS`, cambiar el `href` de "Dashboard" de `'/'` a `'/dashboard'`.
- Ajustar el cálculo de `active` (línea ~41-42): el caso especial `href === '/' ? pathname === '/' : ...` ya no aplica; usar la misma lógica `pathname.startsWith(href)` para ambos items, o `pathname === '/dashboard'` para Dashboard.

### 3. `src/app/page.tsx` (nuevo) — página de Login
- `'use client'` (necesita `useState` para el formulario y `useRouter` de `next/navigation` para redirigir).
- Layout `flex h-screen` con dos columnas:
  - **Panel izquierdo** (`w-full md:w-2/5`, oculto en mobile o apilado arriba): fondo `bg-[#0F4C3A]`, ícono cuadrado blanco-sobre-verde igual al patrón de `Sidebar.tsx` (línea 28: `div bg-[#0F4C3A]` con letra), nombre "Microinformática" y subtítulo "Banco de Córdoba", más una descripción corta tipo "Accedé a la gestión de incidentes IT. Seguimiento, estados y casos centralizados."
  - **Panel derecho**: fondo claro (`bg-white` o `var(--background)`, consistente con el resto de la app — sin tema oscuro nuevo), centrado vertical/horizontal, título "Bienvenido de nuevo" y el formulario.
- Formulario controlado con `useState<{ email: string; password: string }>` y `useState` para errores (no existe `src/components/ui/forms` en el proyecto, así que no hay wrapper genérico que reusar):
  - Campo Email: `<div className="relative">` + ícono `Mail` (`lucide-react`) `absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400` + `<Input type="email" className="pl-9" />`, mismo patrón que `CaseFilters.tsx:25-30`.
  - Campo Contraseña: mismo patrón con ícono `Lock` y `<Input type="password" className="pl-9" />`.
  - Validación al submit (`onSubmit`, `e.preventDefault()`): email no vacío y con `@`; contraseña no vacía. Si falla, guardar mensaje de error por campo y mostrarlo en texto rojo pequeño debajo del input (sin alertas ni toasts nuevos).
  - Si la validación pasa: `router.push('/dashboard')` (mock — sin llamada a API ni loading state real).
- Botón "Ingresar": `<Button type="submit">` variant `default` (ya es verde institucional `bg-verde-principal`, no se necesita variante oscura nueva).

## Explícitamente fuera de alcance

- Autenticación real, backend/API de usuarios, hashing de contraseñas, sesión persistida y protección de rutas (`middleware.ts`) — queda para una tarea futura.
- Logout, "recordarme", recuperación de contraseña, multi-factor.
- Cambios visuales en `Header`, `Breadcrumbs`, o en el contenido de `/dashboard` y `/casos` más allá de moverlos de carpeta.
- `src/server/`, `src/server/gestar` y `GESTAR_API_TOKEN` no se tocan.

## Verificación

1. `npm run dev` y abrir `/` → debe verse la página de Login (sin Sidebar), con panel izquierdo verde y panel derecho con el formulario.
2. Dejar Email o Contraseña vacíos (o un email sin `@`) y enviar → aparecen los errores inline debajo de cada campo, no navega.
3. Completar ambos campos con valores válidos y enviar → redirige a `/dashboard`, que muestra el dashboard de siempre con el Sidebar, y el item "Dashboard" queda marcado como activo.
4. Navegar a `/casos` desde el Sidebar → sigue funcionando igual que antes (mismo Sidebar, misma página, misma URL).
5. `npm run lint` y `npm run build` sin errores de tipos ni de rutas (en particular por el route group `(dashboard)` y los archivos movidos).

## Prompt para pegar en Claude Code

```
Quiero implementar una página de Login que se abra por defecto al iniciar el sistema, en `/`. Es solo UI/mock: sin backend de usuarios, sin sesión persistida ni protección de rutas (eso queda para una tarea futura).

1. Reestructurá las rutas con un route group para mover el Sidebar fuera del layout raíz:
   - Creá `src/app/(dashboard)/layout.tsx` con lo que hoy tiene `src/app/layout.tsx` (el `<Sidebar />` + el div `ml-60 flex flex-1 flex-col min-h-screen` que envuelve `{children}`).
   - Movés el contenido actual de `src/app/page.tsx` (el dashboard) a `src/app/(dashboard)/dashboard/page.tsx`, sin tocar su lógica.
   - Movés `src/app/casos/page.tsx` y `src/app/casos/[id]/page.tsx` a `src/app/(dashboard)/casos/page.tsx` y `src/app/(dashboard)/casos/[id]/page.tsx`, sin tocar su lógica (el route group no cambia la URL).
   - Dejás `src/app/layout.tsx` solo con `html`/`body`/fuentes/`<Providers>`, sin Sidebar.

2. En `src/components/layout/Sidebar/Sidebar.tsx`, cambiá el `href` de "Dashboard" en `NAV_ITEMS` de `'/'` a `'/dashboard'`, y ajustá el cálculo de `active` para que use `pathname.startsWith(href)` (o `pathname === '/dashboard'`) en vez del caso especial para `'/'`.

3. Creá `src/app/page.tsx` como la nueva página de Login (`'use client'`, con `useState` y `useRouter` de `next/navigation`):
   - Layout `flex h-screen` con panel izquierdo `bg-[#0F4C3A]` (mismo branding que el Sidebar: ícono cuadrado + "Microinformática" / "Banco de Córdoba" + descripción corta) y panel derecho claro centrado con título "Bienvenido de nuevo".
   - Formulario controlado con campos Email y Contraseña usando el componente `Input` (`@/components/ui`) con el patrón de ícono absoluto que ya se usa en `CaseFilters.tsx` (`Mail` y `Lock` de `lucide-react`, `<Input className="pl-9" />`).
   - Validación simple al submit: email no vacío con `@`, contraseña no vacía; si falla, mostrar el error en texto rojo debajo del campo. Si pasa, `router.push('/dashboard')`.
   - Botón "Ingresar" con `<Button type="submit">` (variant `default`, ya es verde institucional).

No agregues backend de auth, sesión, middleware de protección de rutas, logout ni recuperación de contraseña — eso es para más adelante. Al terminar, corré `npm run lint` y `npm run build`, y navegá `/` (login), enviá el form vacío (debe mostrar errores), completalo y confirmá que redirige a `/dashboard` con el Sidebar funcionando y "Dashboard" activo, y que `/casos` sigue andando igual.
```
