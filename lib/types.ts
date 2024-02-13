

export type Organization = {
  id: string; // or number, depending on your database ID type
  name: string;
  description: string | null; // Assuming description is optional
};
