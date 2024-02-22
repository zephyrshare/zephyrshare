import { getOrganizationById } from '@/lib/actions';
import { Organization } from '@prisma/client';

export default async function CustomerPage({ params }: { params: { id: string } }) {
  const customer: Organization | null = await getOrganizationById(params.id);

  if (!customer) {
    return <div>No customer found or loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{customer.name}</h1>
      <p className="mt-8">{customer.description}</p>
    </div>
  );
}
