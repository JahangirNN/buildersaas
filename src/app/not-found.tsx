import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <h1 className="text-4xl font-black mb-4">404</h1>
      <p className="text-gray-500 mb-8">This website has not been created yet or the link is incorrect.</p>
      <Link href="/" className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition">
        Go Back Home
      </Link>
    </div>
  )
}
