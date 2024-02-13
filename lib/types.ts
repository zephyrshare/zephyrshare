

export type Organization = {
  id: string; // or number, depending on your database ID type
  name: string;
  description: string | null; // Assuming description is optional
  logo: string | null; // Assuming logo is optional
  createdAt: Date; // Assuming createdAt is a date
};
