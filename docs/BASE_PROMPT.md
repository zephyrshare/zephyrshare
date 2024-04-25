# Your Task

[Task for the LLM or description of the feature you're trying to build goes here]

# Development Guidelines for Our Next.js 14 React Application

As we embark on developing this web application, it's crucial to adhere to our selected technology stack and coding practices. Please try to follow a code style and structure that is consistent with the existing project. Unless otherwise specified, please ensure the integration of the following technologies:

## Technologies

- **Styling**: Use **Tailwind CSS** for a utility-first approach to design.
- **Package Management**: Use **PNPM** for efficient dependency management and disk space usage.
- **Framework**: Develop with **Next.js 14**, leveraging the **App Router** for all routing needs. Refrain from using the legacy Next.js Pages Router. Also refrain from using getServerSideProps, as it is a data fetching method specific to Pages Router.
- **Programming Language**: Implement solutions in **TypeScript** for type safety and an improved development experience.
- **ORM (Object-Relational Mapping)**: Use **Prisma** with a **PostgreSQL** database for our data layer.
- **Authentication**: Integrate **NextAuth** (Also known as NextAuth.js and is soon becoming Auth.js, https://authjs.dev/) for secure and flexible authentication solutions.

## Important Reminders

### Code Comments

- Clear, concise, and meaningful code comments are a critical piece of well functioning code. If comments exist with a provided file input, you may make them clearer if you choose but please do NOT remove them unless explicitly asked to remove them in the prompt.

### External NPM packages

- Please try to not add new npm packages unless I specifically ask to add new npm packages elsewhere in the prompt. Please find a solution that prefers the existing set of components and features.

### React components

- For functional component declarations where the component is the default export, prefer the syntax "export default function myFunction() {"

### UI Component Library

- Please prefer using component from the shadcn/ui component library (https://ui.shadcn.com/) unless specified in the prompt (of course, if shadcn/ui does not have the component, look to find the most popular and well documented component to meet the needs of the feature being built. You may evaluate this by number of GitHub stars, age of the most recently merged pull request, age of the most recent project commit, number of contributors, among other methods)

### Next.js Component Types

- **Server Components** are rendered on the server using the `server` directive and cannot utilize React hooks - this means that `useState` and `useEffect` CANNOT be used in a server component. If `useState` and `useEffect` would like to be used, they can be written in a Client Component that is then imported into the server component. As a note, it's assumed that Next.js components are server components unless otherwise specified. Note, server components must have the "use server" directive at the top of the file. Another note, server components can be defined as async functions and can use the `await` keyword within them to fetch data.

- **Client Components** are rendered on the client using the `client` directive and can use React hooks - this means that `useState` and `useEffect` CAN be used in a client component. If `useState` and `useEffect` are not used, the component can usually be written as a Server Component. Note, client components must have the "use client" directive at the top of the file.

### Linking

- Use the `<Link>` component from `next/link` for internal navigation, avoiding raw HTML `<a>` tags within `<Link>` for SPA-like behavior.

### Asynchronous Operations

- Adopt `async`/`await` syntax for handling JavaScript promises. Any function using `await` must be declared `async`.

### Database Migrations

- Utilize Prisma schema migrations when adding or modifying database tables or columns, ensuring organized and version-controlled changes.

### Deployments and CI/CD

- Utilize **Vercel** (or **GitHub Actions** if needed for something that Vercel cannot do) for CI/CD processes, enhancing workflow efficiency with automated testing and preview deployments.

## Conclusion

This guideline aims to standardize our development process, ensuring efficiency and quality in our web application's development. Staying abreast of the latest updates in our chosen technologies and adopting industry best practices will be key to delivering a robust, user-friendly application.
