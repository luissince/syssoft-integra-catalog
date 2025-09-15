# 🛍️ SysSoft Integra — Catálogo de Productos (Next.js 14)

Catálogo web construido con **Next.js 14 (App Router)** que consume la API del sistema principal **SysSoft Integra** para listar, buscar y detallar productos.

> Entorno por defecto: `development` • Auth: deshabilitado

---

## ✨ Características

- **Next.js 14** con App Router (`/src/app`)
- **SSR / SSG** y **Incremental Static Regeneration**
- **Fetch en servidor** con caché controlada (revalidación)
- **Paginación, búsqueda y filtros** (parámetros de consulta)
- Preparado para **Tailwind CSS**
- Cliente API centralizado
- Flags para **autenticación** (ON/OFF) desde `.env`

---

## ⚙️ Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
APP_BACK_END="http://localhost:5002"
NEXT_PUBLIC_APP_BACK_END="http://localhost:5002"
AUTH_ENABLED=false
NEXT_PUBLIC_ENV=development
ENV=development
````

**Qué hace cada una:**

* `APP_BACK_END`: Base URL para peticiones **del servidor** (SSR/acciones).
* `NEXT_PUBLIC_APP_BACK_END`: Base URL para peticiones **del cliente** (expuesta).
* `AUTH_ENABLED`: Activan o desactivan autenticación (server/client).
* `ENV` / `NEXT_PUBLIC_ENV`: Modo de ejecución/etiquetado del entorno.

> En producción usa HTTPS y dominio real en `*_APP_BACK_END`.

---

## 📦 Requisitos

* Node.js 18+ (recomendado 20+)
* npm o pnpm

---

## 🚀 Scripts

```bash
# Instalar dependencias
npm install

# Dev (http://localhost:3000)
npm run dev

# Build + Start
npm run build
npm run start

# Lint (opcional si se incluye eslint)
npm run lint
```

---

## 📂 Estructura sugerida

```
.
├─ public/
└─ src/
   ├─ app/
   │  ├─ page.tsx               # Home: listado de productos
   │  ├─ products/
   │  │  ├─ page.tsx            # Listado con filtros/paginación
   │  │  └─ [id]/page.tsx       # Detalle de producto
   │  └─ api/                   # (opcional) proxies internos
   ├─ components/               # UI reutilizable
   ├─ lib/
   │  ├─ api.ts                 # Cliente API central
   │  └─ types.ts               # Tipos/Interfaces
   └─ styles/
      └─ globals.css
```

---

## 🔗 Consumo de API (convención)

Endpoints esperados del backend (ajústalos a tu realidad):

* `GET /api/productos?search=&page=1&limit=12&category=` → Listado con paginación
* `GET /api/productos/:id` → Detalle
* `GET /api/categorias` → Categorías

### Cliente API central (`src/lib/api.ts`)

```ts
// src/lib/api.ts
export const API_BASE = process.env.APP_BACK_END ?? process.env.NEXT_PUBLIC_APP_BACK_END ?? "";

type FetchOptions = RequestInit & { auth?: boolean; };

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(opts.headers);

  // Auth opcional
  const AUTH_ENABLED = String(process.env.AUTH_ENABLED) === "true";
  if (opts.auth && AUTH_ENABLED) {
    // Ejemplo: token por cookie o header
    // headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...opts,
    headers,
    // Next.js caché controlada: revalidate 60s por defecto
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
```

### Tipos básicos (`src/lib/types.ts`)

```ts
// src/lib/types.ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  categoryId?: string;
  stock?: number;
  // agrega campos reales de tu API
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

### Listado en página (SSR con revalidación)

```tsx
// src/app/products/page.tsx
import { apiFetch } from "@/lib/api";
import { Paginated, Product } from "@/lib/types";

export const metadata = { title: "Productos | Catálogo" };

async function getProducts(search: string, page: number, limit: number) {
  const q = new URLSearchParams({ search, page: String(page), limit: String(limit) });
  return apiFetch<Paginated<Product>>(`/api/productos?${q.toString()}`);
}

export default async function ProductsPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const search = searchParams.search ?? "";
  const page = Number(searchParams.page ?? "1");
  const limit = Number(searchParams.limit ?? "12");

  const { data, total } = await getProducts(search, page, limit);

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="text-2xl font-semibold mb-4">Productos</h1>
      {/* Aquí renderiza tarjetas de producto */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map(p => (
          <a key={p.id} href={`/products/${p.id}`} className="border rounded-xl p-3 hover:shadow">
            <img src={p.image ?? "/placeholder.png"} alt={p.name} className="w-full h-40 object-cover rounded-lg" />
            <div className="mt-2">
              <h2 className="font-medium">{p.name}</h2>
              {p.price != null && <p className="text-sm">S/ {p.price.toFixed(2)}</p>}
            </div>
          </a>
        ))}
      </div>

      {/* Paginación mínima */}
      <div className="flex gap-2 mt-6">
        {page > 1 && (
          <a className="px-3 py-1 border rounded" href={`?search=${search}&page=${page-1}&limit=${limit}`}>Anterior</a>
        )}
        {(page * limit) < total && (
          <a className="px-3 py-1 border rounded" href={`?search=${search}&page=${page+1}&limit=${limit}`}>Siguiente</a>
        )}
      </div>
    </main>
  );
}
```

### Detalle de producto

```tsx
// src/app/products/[id]/page.tsx
import { apiFetch } from "@/lib/api";
import { Product } from "@/lib/types";

export const revalidate = 120; // revalidar cada 2 min

async function getProduct(id: string) {
  return apiFetch<Product>(`/api/productos/${id}`);
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <main className="mx-auto max-w-4xl p-4">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={product.image ?? "/placeholder.png"} alt={product.name} className="w-full rounded-xl" />
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {product.price != null && <p className="mt-2 text-xl">S/ {product.price.toFixed(2)}</p>}
          {product.description && <p className="mt-4 text-sm leading-6">{product.description}</p>}
        </div>
      </div>
    </main>
  );
}
```

---

## 🧪 Probar la API (curl)

```bash
# Listado con paginación
curl "$NEXT_PUBLIC_APP_BACK_END/api/productos?page=1&limit=12"

# Búsqueda
curl "$NEXT_PUBLIC_APP_BACK_END/api/productos?search=manzana"

# Detalle
curl "$NEXT_PUBLIC_APP_BACK_END/api/productos/123"
```

---

## 🎨 Tailwind (opcional)

Instala y configura Tailwind si aún no está incluido:

```bash
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

`src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Incluye en `src/app/layout.tsx`:

```tsx
import "@/styles/globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

---

## 🔐 Autenticación (flag)

* Con `AUTH_ENABLED=false`, el cliente **no** enviará tokens.
* Si el backend exige auth:

  1. Pon `AUTH_ENABLED=true` y agrega el header `Authorization` en `apiFetch`.
  2. Maneja refresh/token storage (cookies HttpOnly recomendadas).

---

## 🚀 Deploy

* **Vercel**: define variables de entorno en el panel (`APP_BACK_END`, `NEXT_PUBLIC_APP_BACK_END`, etc.).
* **Servidor propio**: `npm run build && npm run start`.
* Ajusta `revalidate`/caché según tus necesidades (tráfico, frescura de inventario).

---

## 🐞 Troubleshooting

* **CORS**: habilita orígenes del front en tu API SysSoft Integra.
* **URLs**: revisa que `APP_BACK_END` y `NEXT_PUBLIC_APP_BACK_END` apunten al mismo backend/base.
* **Imágenes**: permite dominios en `next.config.js` (`images.domains = [...]`).

---

## 📄 Licencia

MIT