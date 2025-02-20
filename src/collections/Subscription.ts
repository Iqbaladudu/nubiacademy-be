import { CollectionConfig } from 'payload'

const Subscription: CollectionConfig = {
  slug: 'subscription',
  labels: {
    singular: 'Jenis Langganan',
    plural: 'Jenis Langganan',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Nama Langganan',
      type: 'text',
      required: true,
    },
    {
      name: 'duration',
      label: 'Durasi',
      type: 'text',
      required: true,
    },
    {
      name: 'student',
      label: 'Siswa',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'base_price',
      label: 'Harga Dasar',
      type: 'number',
      required: true,
    },
    {
      name: 'discounted_price',
      label: 'Harga Diskon',
      type: 'number',
      required: true,
    },
  ],
}

export default Subscription
