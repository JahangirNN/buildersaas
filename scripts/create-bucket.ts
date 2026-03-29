import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data, error } = await supabase.storage.createBucket('user-assets', {
    public: true,
    fileSizeLimit: 10485760 // 10MB
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Bucket already exists.')
    } else {
      console.error('Error creating bucket:', error)
    }
  } else {
    console.log('Bucket created:', data)
  }
}

main()
