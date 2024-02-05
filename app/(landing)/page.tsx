import WindIcon from '@/components/icons/wind-icon';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold text-center">Zephyr Share</h1>
          <WindIcon className="ml-1" size={34}/>
        </div>
        <p className="text-xl text-center mt-4">Platform to securely share your company's data</p>
      </div>
    </main>
  );
}
