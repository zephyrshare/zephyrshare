import { getOrganizationById } from '@/lib/actions';
import { Customer } from '@/lib/types';

export default async function CustomerPage({ params }: { params: { id: string } }) {
  const customer: Customer | null = await getCustomerById(params.id);

  if (!customer) {
    return <div>No customer found or loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{customer.name}</h1>
      <p className="mt-2">{customer.description}</p>
    </div>
  );
}
