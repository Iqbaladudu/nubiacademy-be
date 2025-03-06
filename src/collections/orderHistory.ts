// src/collections/OrderHistory.ts
import { CollectionConfig } from 'payload'

const OrderHistory: CollectionConfig = {
  slug: 'order_history',
  labels: {
    plural: 'Riwayat Pemesanan',
    singular: 'Riwayat Pemesanan',
  },
  admin: {
    useAsTitle: 'order',
    defaultColumns: ['order', 'change_type', 'timestamp'],
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: false,
      label: 'Order',
    },
    {
      name: 'order_number',
      type: 'text',
      label: 'order_number',
      required: true,
    },
    {
      name: 'coupon',
      type: 'relationship',
      relationTo: 'coupons',
      label: 'Kupon',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Selesai', value: 'done' },
        { label: 'Pending', value: 'pending' },
        { label: 'Dibatalkan', value: 'cancelled' },
      ],
    },
    {
      name: 'change_type',
      type: 'select',
      options: [
        { label: 'Created', value: 'create' },
        { label: 'Updated', value: 'update' },
        { label: 'Deleted', value: 'delete' },
        // Add more types if needed
      ],
      required: true,
      label: 'Change Type',
    },
    {
      name: 'original_price',
      type: 'number',
      label: 'Original Price',
    },
    {
      name: 'discounted_price',
      type: 'number',
      label: 'Discounted Price',
    },
    {
      name: 'timestamp',
      type: 'date',
      // required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Timestamp',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
      admin: {
        description: 'User who made the change',
      },
    },
    {
      name: 'details',
      type: 'text',
      label: 'Details',
      admin: {
        description: 'Additional details about the change',
      },
    },
  ],
}

export default OrderHistory
