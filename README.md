# DLD Members Directory

This is a clean modern React app for your DLD member directory.

## What it already includes

- login screen
- filter section at the top
- member list underneath
- each row shows only:
  - full name
  - WhatsApp number used in the group
  - Verified badge
  - Business Owner badge
- click a member to open a popup digital passport on the same page
- admin panel to add, edit, and delete members
- your uploaded DLD logo
- seed data generated from your latest Excel sheet

## Important note about the latest Excel file

Your latest uploaded workbook contains these member fields:
- Whatsapp Display Name
- Number used in DLD
- Other Number
- Full Name (PDF)
- Age
- Area in UAE
- City/Town UK
- Profession
- With Family?
- Social Media / LinkedIn
- EID Uploaded
- Verified

I did **not** find a visible `Business Owner` column in the latest uploaded sheet.  
Because of that, the seed data in this project uses a fallback rule for the initial import:

- if profession contains words like `owner`, `director`, `founder`, or `self-employed`, the Business Owner badge is set to true

Inside the app admin panel, you can manually correct any Business Owner badges and, once you move to Supabase, store them explicitly in the database.

## Run locally

```bash
npm install
npm run dev
```

## Demo login

Until you connect Supabase, the app runs in demo mode using local browser storage.

Admin:
- email: `admin@dld.local`
- password: `dld12345`

Viewer:
- email: `viewer@dld.local`
- password: `dld12345`

## How the app behaves

### Member list
The main list shows only:
- name
- WhatsApp number
- Verified badge
- Business Owner badge

### Digital passport popup
Click any member and a popup opens on the same page showing:
- WhatsApp Display Name
- Number used in group
- Other Number
- Full Name
- Age
- Area in UAE
- City/Town UK
- Profession
- Living status
- Social media link, or `EID uploaded` if no social media is provided

## Filters included

- Verified
- UK Location
- Search by number
- Search by profession

## Supabase setup

1. Create a new Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Create at least one auth user in Supabase Auth.
4. In the `profiles` table, make that user `admin`.
5. Import `supabase/seed_members.csv` into the `members` table.
6. Copy `.env.example` to `.env` and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Restart the app.

When Supabase environment variables are present, the app switches from demo mode to live Supabase mode.

## Files

- `src/App.jsx` — main app
- `src/components/*` — UI pieces
- `src/data/members.json` — seed data from your Excel
- `supabase/schema.sql` — database schema and policies
- `supabase/seed_members.csv` — CSV import file for Supabase
- `public/dld-logo.png` — your logo

## Deploy for free

### Vercel
1. Push the project to GitHub.
2. Import it into Vercel.
3. Add the two Supabase environment variables in Vercel.
4. Deploy.

### Cloudflare Pages
1. Push the project to GitHub.
2. Create a Pages project.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add the two Supabase environment variables.
6. Deploy.

## Suggested next upgrade

The next useful upgrade would be:
- invite-only sign-up
- profile pictures
- Excel re-import admin tool
- export filtered members
- audit log for admin changes