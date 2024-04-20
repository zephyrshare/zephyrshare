
export default function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex max-w-screen-2xl flex-col space-y-12 py-10 px-10 md:p-8">{children}</div>;
}
