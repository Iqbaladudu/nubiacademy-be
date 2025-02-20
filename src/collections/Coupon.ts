import { CollectionConfig } from 'payload'

const Coupon: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Coupon Code',
    },
    {
      name: 'discount_type',
      type: 'select',
      options: [
        {
          label: 'Percentage',
          value: 'percentage',
        },
        {
          label: 'Fixed Amount',
          value: 'fixed',
        },
      ],
      required: true,
      defaultValue: 'percentage',
      label: 'Discount Type',
    },
    {
      name: 'discount_value',
      type: 'number',
      required: true,
      min: 0,
      label: 'Discount Value',
      admin: {
        description:
          'For percentage, enter as whole number (e.g., 20 for 20%). For fixed, enter amount.',
      },
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    {
      name: 'end_date',
      type: 'date',
      label: 'End Date',
      required: true,
    },
    {
      name: 'max_uses',
      type: 'number',
      label: 'Max Uses',
      min: 1,
      admin: {
        description: 'Leave blank for unlimited uses',
      },
    },
    {
      name: 'uses',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
}

export default Coupon
