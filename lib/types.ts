
export interface Customer {
  id: string; // or number, depending on your database ID type
  name: string;
  description: string | null; // Assuming description is optional
  logo: string | null; // Assuming logo is optional
  createdAt: Date; // Assuming createdAt is a date
};


export interface Agreement {
  id: string; // or number, depending on your database ID type
  name: string;
  description: string | null; // Assuming description is optional
  file: string; // Assuming file is required
  contentType: string | null; // Assuming contentType is optional
  owner: string; // User // Assuming owner is a User
  ownerId: string; // Assuming ownerId is a string
  createdAt: Date; // Assuming createdAt is a date
  updatedAt: Date; // Assuming updatedAt is a date
};