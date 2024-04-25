import WindIcon from '@/components/icons/wind-icon';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold text-center">ZephyrShare</h1>
          <WindIcon className="ml-1" size={34} />
        </div>
        <p className="text-lg text-center mt-8">AI-powered data licensing platform for</p>
        <p className="text-lg text-center mt-1">commodity derivatives market data files</p>
      </div>
    </main>
  );
}
