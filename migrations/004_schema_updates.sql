-- Add missing fields to organizations table
ALTER TABLE organizations
ADD COLUMN domain VARCHAR(255),
ADD COLUMN logo TEXT,
ADD COLUMN settings JSONB DEFAULT '{
  "branding": {
    "primaryColor": "#000000",
    "secondaryColor": "#ffffff"
  },
  "emailSettings": {
    "defaultSignatureTemplate": "",
    "allowCustomization": true
  }
}'::jsonb;

-- Add missing fields to locations table
ALTER TABLE locations
ADD COLUMN address TEXT,
ADD COLUMN city VARCHAR(255),
ADD COLUMN state VARCHAR(255),
ADD COLUMN country VARCHAR(255);

-- Add missing fields to groups table
ALTER TABLE groups
ADD COLUMN description TEXT,
ADD COLUMN parent_group_id UUID REFERENCES groups(id);

-- Add missing fields to profiles table
ALTER TABLE profiles
ADD COLUMN full_name VARCHAR(255),
ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE;

-- Create index for domain lookups
CREATE INDEX idx_organizations_domain ON organizations(domain);

-- Create index for group hierarchy
CREATE INDEX idx_groups_parent_group_id ON groups(parent_group_id);

-- Add constraint to ensure parent_group_id is not self-referential
ALTER TABLE groups
ADD CONSTRAINT groups_no_self_reference 
CHECK (id != parent_group_id);
