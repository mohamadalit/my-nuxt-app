# Copilot Instructions for Latelier de GZ

## Project Overview
This is a multilingual restaurant menu management system built with Nuxt 4, Supabase, and Cloudflare Workers. It supports Persian (default), English, and French with RTL/LTR text direction handling.

## Architecture & Key Patterns

### Database Structure
- **Categories**: Multilingual category management (`categories` table)
- **Menu Items**: Full menu with pricing and availability (`menu_items` table) 
- **Hours**: Restaurant hours in all languages (`hours` table)
- **File Storage**: R2 bucket for images via Cloudflare

### Multilingual Implementation
- **Default locale**: Persian (`fa`) with RTL support
- **Strategy**: `prefix_except_default` - Persian has no prefix, EN/FR use `/en/` and `/fr/`
- **Field naming**: Database fields use `name_fa`, `name_en`, `name_fr` pattern
- **Component access**: Use `item[`name_${locale}`]` for dynamic locale access
- **Fonts**: Vazir for Persian (`font-vazir`), Sans for Latin scripts

### Data Flow & State Management
- **Cart**: Session-based cart using `useCart()` composable with sessionStorage persistence
- **Type System**: Supabase auto-generated types in `shared/types/database.types.ts`
- **Common Types**: Extended types in `shared/types/common.types.ts` (e.g., `CartItem` adds `qty` to menu items)

## Development Workflows

### Database Types Generation
```bash
npm run db  # Regenerates types from Supabase schema
```
Uses `gen-db-types.js` - requires `SUPABASE_TOKEN` and `SUPABASE_PROJECT_ID` in `.env.local`

### Environment Setup
- **Development**: `.env.local` (Nuxt dev server)
- **Production**: `.env.production` (Cloudflare deployment)
- **Key vars**: Supabase credentials, R2 storage keys, OpenAI API key

### Deployment
```bash
npm run deploy  # Uses Wrangler to deploy to Cloudflare Workers
```

## Component Architecture

### Layout System
- **Admin Layout**: Dashboard with sidebar (`layouts/admin.vue`)
- **Default Layout**: Public-facing with header/footer
- **Auth Layout**: Login/authentication flows

### Admin Panel Patterns
- **Modals**: All CRUD operations use modal components in `components/admin/modals/`
- **Drag & Drop**: Uses `@vueuse/integrations/useSortable` for item reordering
- **Real-time Data**: All admin pages use `useFetch` with refresh functions for immediate UI updates

### API Patterns
- **Server Routes**: Follow `/api/v1/` versioning in `server/api/v1/`
- **Supabase Integration**: Use `serverSupabaseServiceRole(event)` for server-side database access
- **Client Queries**: Use `useSupabaseClient()` for client-side operations

## Key Conventions

### File Organization
- **Components**: Feature-based folders (`main/`, `admin/`, `admin/modals/`)
- **Types**: Shared types in `/shared/types/` for cross-app usage
- **Composables**: Domain-specific composables in `app/composables/`

### UI Framework (Nuxt UI)
- **Icons**: Primarily HugeIcons (`i-hugeicons:*`) with some Lucide
- **Color Scheme**: Red primary, stone neutral
- **Responsive**: Mobile-first with RTL-aware layouts

### Translation Integration
- **AI Translation**: OpenAI GPT-4o-mini with Zod schema validation (`server/utils/aiTranslate.ts`)
- **API Endpoint**: `POST /api/v1/translate` for both categories and menu items
- **Auto-fill Logic**: Detects missing language fields and translates from available ones (typically from Persian)
- **Schema**: Uses Zod v4's `toJSONSchema()` for OpenAI structured output

## Critical Integration Points

### Supabase Configuration
- **Auth**: Redirects to `/login`, callback to `/confirm`
- **Protected Routes**: `/editor/*` requires authentication
- **RLS**: Uses service role for server-side operations, standard client for user operations

### Cloudflare Workers Setup
- **Static Assets**: Served from `.output/public/` via ASSETS binding
- **R2 Storage**: Configured for image uploads with `R2_BUCKET` binding
- **Environment Variables**: Defined in `nuxt.config.ts` cloudflare.wrangler.vars

### Image Handling
- **Upload Path**: Server API at `/api/v1/upload` (PUT method)
- **Storage**: R2 bucket with CDN delivery
- **Display**: Direct URL references in database `img` fields

## Development Notes

- **Hot Reload**: Nuxt dev server with automatic type checking
- **Linting**: ESLint with stylistic rules enabled
- **TypeScript**: Strict mode with auto-generated Supabase types
- **Testing**: No test framework currently configured (opportunity for addition)