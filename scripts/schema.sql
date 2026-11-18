-- Marketers Buffet database schema. Safe to run more than once.
-- Tables live in their own "mb" schema: Supabase's public Data API doesn't
-- expose it, so the browser can never read these tables directly. Only the
-- site's server routes (with the database password) can.

create schema if not exists mb;
create extension if not exists pgcrypto;

-- Newsletter subscribers (own copy of the list; Brevo is synced from here)
create table if not exists mb.subscribers (
  email text primary key,
  source text not null,
  utm jsonb,
  brevo_synced boolean not null default false,
  unsubscribed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Comments: every comment waits for approval (status = 'pending')
create table if not exists mb.comments (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('blog','automations','ai-edge')),
  slug text not null,
  name text not null,
  position text,
  company text,
  body text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  user_id uuid,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists comments_page_idx on mb.comments (kind, slug, status, created_at);

-- Rate limiting: one row per form submission, per IP hash and per device
create table if not exists mb.rate_events (
  id bigserial primary key,
  bucket text not null,
  key text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_events_idx on mb.rate_events (bucket, key, created_at);

-- Blocked commenters / spammers (IP hash or device id)
create table if not exists mb.blocked (
  key text primary key,
  reason text,
  created_at timestamptz not null default now()
);

-- Template orders (Razorpay)
create table if not exists mb.orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  template_slug text not null,
  amount integer not null, -- paise
  currency text not null default 'INR',
  email text,
  user_id uuid,
  status text not null default 'created' check (status in ('created','paid','failed','refunded')),
  emailed boolean not null default false,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists orders_user_idx on mb.orders (user_id, status);
create index if not exists orders_email_idx on mb.orders (lower(email), status);

-- Free downloads
create table if not exists mb.downloads (
  id bigserial primary key,
  template_slug text not null,
  email text,
  user_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists downloads_user_idx on mb.downloads (user_id, created_at desc);

-- Account features
create table if not exists mb.bookmarks (
  user_id uuid not null,
  kind text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, slug)
);
create table if not exists mb.views (
  user_id uuid not null,
  kind text not null,
  slug text not null,
  viewed_at timestamptz not null default now(),
  primary key (user_id, kind, slug)
);
create table if not exists mb.profiles (
  user_id uuid primary key,
  name text,
  position text,
  company text,
  newsletter boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Booked calls, filled by the Cal ID webhook (Account › My calls)
create table if not exists mb.calls (
  uid text primary key,
  email text not null,
  name text,
  title text,
  start_at timestamptz,
  end_at timestamptz,
  status text not null default 'booked' check (status in ('booked','rescheduled','cancelled')),
  updated_at timestamptz not null default now()
);
create index if not exists calls_email_idx on mb.calls (lower(email), start_at desc);

-- Daily ping target so the free Supabase project never pauses
create table if not exists mb.keepalive (
  id integer primary key default 1,
  pinged_at timestamptz not null default now()
);
insert into mb.keepalive (id) values (1) on conflict (id) do nothing;

-- Belt and braces: block the public API roles from this schema entirely.
revoke all on schema mb from anon, authenticated;
revoke all on all tables in schema mb from anon, authenticated;
