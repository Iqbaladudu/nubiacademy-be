import { CollectionConfig } from 'payload'

const Admin: CollectionConfig = {
  slug: 'admin',
  auth: true,
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
