import BuilderForm from '@/app/BuilderForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Done-For-You AI Builder</h1>
        <BuilderForm />
      </div>
    </main>
  );
}
