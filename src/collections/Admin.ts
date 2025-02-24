import forgotPassword from '@/template/forgotPassword'
import { CollectionConfig } from 'payload'

const Admin: CollectionConfig = {
  slug: 'admin',
  auth: {
    forgotPassword: {
      generateEmailHTML: (arr) => {
        const resetPasswordUrl = `${process.env.CLIENT_HOST}/api/reset-password?token=${arr?.token}`

        return forgotPassword({
          user: arr?.user?.username as string,
          resetPasswordUrl: resetPasswordUrl,
        })
      },
      generateEmailSubject: (arr) => {
        return `${arr?.user.username}, Atur Ulang Kata Sandi Kamu!`
      },
    },
  },
  admin: {
    useAsTitle: 'username',
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'fullname',
      label: 'Nama Lengkap',
      type: 'text',
      required: false,
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: false,
    },
  ],
}

export default Admin
