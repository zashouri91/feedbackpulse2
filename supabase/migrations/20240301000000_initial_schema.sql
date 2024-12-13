-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Organizations
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text unique,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Groups
create table groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  organization_id uuid references organizations(id) on delete cascade not null,
  parent_group_id uuid references groups(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Locations
create table locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  country text not null,
  organization_id uuid references organizations(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  role text check (role in ('admin', 'manager', 'user')) default 'user'::text,
  organization_id uuid references organizations(id) on delete cascade not null,
  group_id uuid references groups(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  permissions text[] default array[]::text[],
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Surveys
create table surveys (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  questions jsonb not null,
  branding jsonb default '{}'::jsonb,
  is_active boolean default false,
  organization_id uuid references organizations(id) on delete cascade not null,
  created_by uuid references profiles(id) on delete set null not null,
  assigned_to jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Signatures
create table signatures (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  survey_id uuid references surveys(id) on delete cascade not null,
  tracking_code text unique not null,
  style jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Feedback Responses
create table feedback_responses (
  id uuid primary key default uuid_generate_v4(),
  survey_id uuid references surveys(id) on delete cascade not null,
  signature_id uuid references signatures(id) on delete set null,
  rating integer check (rating between 1 and 5) not null,
  reason text,
  comment text,
  answers jsonb default '{}'::jsonb,
  contact boolean default false,
  email text,
  user_id uuid references profiles(id) on delete set null,
  group_id uuid references groups(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  tracking_code text references signatures(tracking_code) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table organizations enable row level security;
alter table groups enable row level security;
alter table locations enable row level security;
alter table profiles enable row level security;
alter table surveys enable row level security;
alter table signatures enable row level security;
alter table feedback_responses enable row level security;

-- Indexes
create index idx_profiles_organization on profiles(organization_id);
create index idx_groups_organization on groups(organization_id);
create index idx_locations_organization on locations(organization_id);
create index idx_surveys_organization on surveys(organization_id);
create index idx_signatures_user on signatures(user_id);
create index idx_feedback_survey on feedback_responses(survey_id);
create index idx_feedback_created_at on feedback_responses(created_at);

-- Functions
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger set_updated_at
  before update on organizations
  for each row
  execute function handle_updated_at();

create trigger set_updated_at
  before update on groups
  for each row
  execute function handle_updated_at();

create trigger set_updated_at
  before update on locations
  for each row
  execute function handle_updated_at();

create trigger set_updated_at
  before update on profiles
  for each row
  execute function handle_updated_at();

create trigger set_updated_at
  before update on surveys
  for each row
  execute function handle_updated_at();

create trigger set_updated_at
  before update on signatures
  for each row
  execute function handle_updated_at();