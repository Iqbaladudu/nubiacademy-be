import { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  auth: true,
  admin: {
    useAsTitle: 'username',
  },
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'fullname',
      label: 'Nama Lengkap',
      type: 'text',
      required: true,
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      label: 'Nomor Telepon/WhatsApp',
      type: 'text',
      unique: true,
    },
    {
      name: 'dateofbirth',
      label: 'Date of Birth',
      type: 'date',
    },
    {
      name: 'province',
      label: 'Provinsi',
      type: 'text',
    },
    {
      name: 'regency',
      label: 'Kabupaten',
      type: 'text',
    },
    {
      name: 'startDate',
      label: 'Tanggal Mulai Langganan',
      type: 'date',
    },
    {
      name: 'endDate',
      label: 'Tanggal Selesai Langganan',
      type: 'date',
    },
    {
      name: 'subscription_status',
      label: 'Status Langganan',
      type: 'select',
      hasMany: false,
      options: [
        {
          label: 'Aktif',
          value: 'active',
        },
        {
          label: 'Tidak Aktif',
          value: 'inactive',
        },
      ],
    },
  ],
}

export default Users
