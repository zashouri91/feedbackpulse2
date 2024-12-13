export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  parentGroupId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  settings: {
    branding: {
      primaryColor: string;
      secondaryColor: string;
      logo?: string;
    };
    emailSettings: {
      defaultSignatureTemplate: string;
      allowCustomization: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}