import { getOrganizationById } from '@/lib/actions';
import { Organization } from '@/lib/types';

export default async function OrganizationPage({ params }: { params: { id: string } }) {
  const organization: Organization | null = await getOrganizationById(params.id);

  if (!organization) {
    return <div>No organization found or loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{organization.name}</h1>
      <p className="mt-2">{organization.description}</p>
    </div>
  );
}
