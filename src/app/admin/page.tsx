import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

async function togglePaidStatus(id: string, currentStatus: boolean) {
  'use server'
  await supabaseAdmin.from('websites').update({ is_paid: !currentStatus }).eq('id', id);
  revalidatePath('/admin');
}

export default async function AdminDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ pw?: string }> 
}) {
  const sp = await searchParams;
  const pw = sp.pw;

  if (pw !== 'admin123') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form className="p-8 bg-white shadow-xl rounded-lg max-w-md w-full">
          <h1 className="text-2xl mb-4 font-bold text-center text-gray-800">Admin Login</h1>
          <div className="flex flex-col gap-4">
            <input 
              name="pw" 
              type="password" 
              placeholder="Enter password..." 
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" 
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-semibold">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  const { data: websites } = await supabaseAdmin
    .from('websites')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="text-sm bg-gray-200 px-3 py-1 rounded text-gray-600 font-mono">
            {websites?.length || 0} Sites Total
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Site Slug</th>
                <th className="p-4 font-semibold text-gray-600">Type</th>
                <th className="p-4 font-semibold text-gray-600">WhatsApp</th>
                <th className="p-4 font-semibold text-gray-600">Paid Status</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {websites?.map(site => (
                <tr key={site.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <a href={`/${site.slug}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                      /{site.slug}
                    </a>
                  </td>
                  <td className="p-4 capitalize">{site.type}</td>
                  <td className="p-4">{site.whatsapp_number}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${site.is_paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {site.is_paid ? 'PAID' : 'PENDING'}
                    </span>
                  </td>
                  <td className="p-4">
                    <form action={togglePaidStatus.bind(null, site.id, site.is_paid)}>
                      <button type="submit" className="text-sm bg-gray-800 text-white hover:bg-gray-900 px-3 py-1.5 rounded-md transition-colors shadow-sm">
                        Toggle Paid Status
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {!websites?.length && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                    No websites generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
