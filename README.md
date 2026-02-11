# Fixxo Sipahi Admin Panel

A premium, lightweight admin panel for managing Fixxo riders and requests.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. **Environment Variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. **Supabase Config**:
   - Enable **Google OAuth** in your Supabase Auth settings.
   - Add `http://localhost:3000/auth/callback` to the redirect URLs.
   - Ensure the database schema provided is applied to your Supabase project.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Locally**:
   ```bash
   npm run dev
   ```

## Key Features
- **Secure Login**: Strict authentication using Google OAuth.
- **Rider Management**: Add and view rider details with real-time feedback.
- **Dashboard**: High-level overview of system requests and rider availability.
- **Premium UI**: Glassmorphic design with smooth transitions and responsive layout.
