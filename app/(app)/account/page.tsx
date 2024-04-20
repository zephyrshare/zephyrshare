import PageContainer from '@/components/ui/page-container';
import Form from '@/components/form';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { updateUser } from '@/lib/actions';
import APITokenForm from '@/components/api-token-form';

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <PageContainer>
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-xl font-medium dark:text-white">Account</h1>
        <Form
          title="Name"
          description="Your name"
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: 'name',
            type: 'text',
            defaultValue: session.user.name!,
            placeholder: 'Brendon Urie',
            maxLength: 32,
          }}
          handleSubmit={updateUser}
        />
        <Form
          title="Email"
          description="Your email on this app."
          helpText="Please enter a valid email."
          inputAttrs={{
            name: 'email',
            type: 'email',
            defaultValue: session.user.email!,
            placeholder: 'panic@thedis.co',
          }}
          handleSubmit={updateUser}
        />
        <APITokenForm initialToken={session.user.apiToken} />
      </div>
    </PageContainer>
  );
}
