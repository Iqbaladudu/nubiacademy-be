import { APIError, CollectionConfig } from 'payload'
import { splitName } from 'utils'

const Order: CollectionConfig = {
  slug: 'orders',
  labels: {
    plural: 'Orders',
    singular: 'Order',
  },
  admin: {
    useAsTitle: 'order_number',
  },
  fields: [
    {
      name: 'order_number',
      label: 'Order Number',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        readOnly: false,
      },
    },
    {
      name: 'subscription_type',
      label: 'Jenis Langganan',
      type: 'relationship',
      relationTo: 'subscription',
    },
    {
      name: 'course_item',
      label: 'Nama Kursus',
      type: 'relationship',
      relationTo: 'course',
      access: {
        read: ({ req }) => {
          return Boolean(req.user)
        },
        create: ({ req: { user } }) => {
          return Boolean(user)
        },
        update: ({ req: { user } }) => {
          return Boolean(user)
        },
      },
    },
    {
      name: 'user',
      label: 'Pengguna',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: {
        read: ({ req }) => {
          return Boolean(req.user)
        },
        create: ({ req: { user } }) => {
          return Boolean(user)
        },
        update: ({ req: { user } }) => {
          return Boolean(user)
        },
      },
    },
    {
      name: 'coupon_code',
      label: 'Kode Kupon',
      type: 'relationship',
      relationTo: 'coupons',
      access: {
        read: ({ req }) => {
          return Boolean(req.user)
        },
        create: ({ req: { user } }) => {
          return Boolean(user)
        },
        update: ({ req: { user } }) => {
          return Boolean(user)
        },
      },
    },
    {
      name: 'original_price',
      type: 'number',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'total_amount',
      type: 'number',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'Selesai', value: 'done' },
        { label: 'Pending', value: 'pending' },
        { label: 'Dibatalkan', value: 'cancelled' },
      ],
    },
    {
      name: 'payment_token',
      label: 'Token Pembayaran',
      type: 'text',
      admin: {
        readOnly: true,
      },
      access: {
        create: () => {
          return false
        },
        update: () => {
          return false
        },
      },
    },
    {
      name: 'payment_redirect_url',
      label: 'Tautan Pengalihan Pembayaran',
      type: 'text',
      admin: {
        readOnly: true,
      },
      access: {
        create: () => {
          return false
        },
        update: () => {
          return false
        },
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (req.user?.collection === 'users') {
          return {
            ...doc,
            course_item: {
              id: doc.course_item.id,
            },
            user: {
              id: doc.user.id,
            },
            coupon_code: {
              id: doc.coupon_code,
            },
          }
        }

        return { ...doc }
      },
    ],
    beforeChange: [
      async ({ data, operation, context, req }) => {
        if (operation === 'create') {
          data.user =
            req.user?.collection === 'admin'
              ? data.user.id
                ? data.user.id
                : data.user
              : req.user?.id
                ? req.user.id
                : req.user
          const order = req.payload.find({
            collection: 'orders',
            where: {
              and: [
                {
                  'user.id': {
                    equals: data.user,
                  },
                },
                {
                  'course_item.id': {
                    equals: data.course_item,
                  },
                },
              ],
            },
          })

          if ((await order).totalDocs > 0)
            throw new APIError('Kamu telah membeli kursus ini', 500, {
              details: {
                message: 'Kamu telah membeli kursus ini',
              },
            })

          let total = 0
          let discount = 0
          let coupon
          context.discount = null
          context.user_id = data.user
          if (data.course_item) {
            const course = await req.payload.findByID({
              collection: 'course',
              id: `${data.course_item}`,
            })

            data.original_price = course?.price

            if (course && course.price) {
              total += course.price
            }

            if (data.coupon_code) {
              coupon = await req.payload.findByID({
                collection: 'coupons',
                id: data.coupon_code,
              })
            }

            const now = new Date()
            let isCouponExpired
            if (coupon) {
              isCouponExpired = new Date(coupon.start_date) < now && new Date(coupon.end_date) > now
            }

            if (coupon && coupon.is_active && isCouponExpired) {
              discount =
                coupon.discount_type === 'fixed'
                  ? coupon.discount_value
                  : total * (coupon.discount_value / 100)
              total -= discount

              if (operation === 'create') {
                await req.payload.update({
                  collection: 'coupons',
                  where: {
                    id: { equals: coupon.id },
                  },
                  data: {
                    uses: coupon.uses + 1,
                  },
                  overwriteExistingFiles: true,
                  overrideAccess: true,
                })
              }
            } else {
              data.total_amount = total
            }
          }
          data.total_amount = total
          context.discount = discount || 0

          const usr = await req.payload.findByID({
            collection: 'users',
            id: data.user,
          })

          if (data.order_number && data.total_amount > 0) {
            const res = await fetch(`${process.env.MIDTRANS_API_URL}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                Authorization: `Basic ${process.env.AUTH_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transaction_details: {
                  order_id: `${data.order_number}`,
                  gross_amount: Number(data.total_amount),
                },
                customer_details: {
                  first_name: `${splitName(usr.fullname)}`,
                  last_name: `${splitName(usr.fullname)}`,
                  email: `${usr.email}`,
                  phone: `${usr.phone}`,
                },
              }),
            }).then((res) => {
              return res.json()
            })

            data.payment_token = res.token
            data.payment_redirect_url = res.redirect_url
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, context, operation, req: { payload, user } }) => {
        if (operation === 'create') {
          await payload.create({
            collection: 'order_history',
            data: {
              order: doc.id,
              order_number: doc.order_number,
              coupon: doc.coupon_code.id || '',
              change_type: operation,
              original_price: doc.total_amount + context.discount,
              discounted_price: context.discount || 0,
              user: context.user_id,
              status: doc.status,
            },
          })
        } else if (operation === 'update') {
          await payload.create({
            collection: 'order_history',
            data: {
              order: doc.id,
              order_number: doc.order_number,
              coupon: doc.coupon_code.id || '',
              change_type: operation,
              original_price: doc.original_price,
              discounted_price: doc.original_price - doc.total_amount,
              user: doc.user,
              status: doc.status,
            },
          })
        }
      },
    ],
  },
  access: {
    create: ({ req }) => {
      return Boolean(req.user)
    },
    read: () => true,
    update: () => true,
    delete: ({ req }) => {
      return true
    },
  },
}

export default Order
