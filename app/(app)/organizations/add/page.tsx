import Form from "@/components/form";
import { addOrganization } from "@/lib/actions";

export default async function AddOrganizationPage() {

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Add Organization
        </h1>
        <Form
          title="Organization Name"
          description="The name of the organization."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "name",
            type: "text",
            placeholder: "Organization Name",
            defaultValue: "",
          }}
          handleSubmit={addOrganization}
        />
        <Form
          title="Description"
          description="A brief description of the organization."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "description",
            type: "text",
            placeholder: "A short description",
            defaultValue: "",
          }}
          handleSubmit={addOrganization}
        />
        {/* <Form
          title="Logo"
          description="URL of the organization's logo."
          helpText="Please use a valid URL."
          inputAttrs={{
            name: "logo",
            type: "text",
            placeholder: "https://example.com/logo.png",
            defaultValue: "https://example.com/logo.png",
          }}
          handleSubmit={addOrganization}
        /> */}
      </div>
    </div>
  );
}