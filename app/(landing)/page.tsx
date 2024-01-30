import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <Image src="/logo.png" alt="ZephyrShare Logo" width={200} height={200} />
        <h1 className="text-4xl font-bold text-center mt-8">ZephyrShare</h1>
        <p className="text-xl text-center mt-4">Platform to securely share your company's data</p>
      </div>
    </main>
  );
}
