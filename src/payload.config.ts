// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import Users from './collections/Users'
import UploadDocument from './collections/UploadDocument'
import Subscription from './collections/Subscription'
import Order from './collections/Order'
import LearningPath from './collections/LearningPath'
import Course from './collections/Course'
import Category from './collections/Category'
import Admin from './collections/Admin'
import { SlateToLexicalFeature } from '@payloadcms/richtext-lexical/migrate'
import Coupon from './collections/Coupon'
import OrderHistory from './collections/orderHistory'
import Module from './collections/Module'
import CourseContent from './collections/CourseContent'

import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { CourseProgress } from './collections/CourseProgress'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'

export default buildConfig({
  admin: {
    user: Admin.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Nubi Academy',
    },
  },
  localization: {
    locales: ['id'],
    defaultLocale: 'id',
  },
  plugins: [
    uploadthingStorage({
      collections: {
        'upload-document': true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
  csrf: [process.env.SERVER_HOST!, process.env.CLIENT_HOST!],
  cors: [process.env.SERVER_HOST!, process.env.CLIENT_HOST!],
  collections: [
    Users,
    UploadDocument,
    Subscription,
    Order,
    LearningPath,
    Course,
    Category,
    Admin,
    Coupon,
    OrderHistory,
    Module,
    CourseContent,
    CourseProgress,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, SlateToLexicalFeature({})],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  endpoints: [
    {
      path: '/check-coupon/:code',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const params = req.routeParams
        try {
          if (params?.code) {
            const code = params.code
            const get_coupon = await req.payload.find({
              collection: 'coupons',
              where: {
                and: [
                  {
                    code: {
                      equals: code,
                    },
                  },
                  {
                    is_active: {
                      equals: true,
                    },
                  },
                ],
              },
            })
            if (get_coupon.totalDocs > 0) {
              return NextResponse.json({ ...get_coupon }, { status: 200 })
            } else {
              return NextResponse.json({ message: 'Kode kupon tidak ditemukan' }, { status: 404 })
            }
          }

          return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 401 })
        } catch (error) {
          return NextResponse.json({ message: 'Terjadi kesalahan', error }, { status: 401 })
        }
      },
    },
    {
      path: '/payment-notification',
      method: 'post',
      handler: async (req: PayloadRequest) => {
        const data = await req.json!()
        // const signature_key = notification.signature_ke
        const generated_signature = crypto
          .createHash('sha512')
          .update(data.order_id + data.gross_amount + process.env.MIDTRANS_SERVER_KEY)
          .digest('hex')

        if (generated_signature !== generated_signature) {
          return Response.json({ message: 'Failed to verify signature' })
        }

        if (data.transaction_status === 'settlement' || data.transaction_status === 'capture') {
          try {
            await req.payload.update({
              collection: 'orders',
              where: {
                order_number: {
                  equals: data.order_id,
                },
              },
              data: {
                status: 'done',
              },
            })
          } catch {
            throw Error('Ada kesalahan')
          }
        }

        return Response.json({ message: 'Berhasil' })
      },
    },
  ],
  email: nodemailerAdapter({
    defaultFromAddress: 'noreply@nubiacademy.id',
    defaultFromName: 'Nubi Academy',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})
