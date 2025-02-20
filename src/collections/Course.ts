import { NextResponse } from 'next/server'
import { CollectionConfig } from 'payload'

const Course: CollectionConfig = {
  slug: 'course',
  labels: {
    plural: 'Kursus',
    singular: 'Kursus',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => {
      return true
    },
    create: ({ req: { user } }) => {
      if (user?.collection === 'admin') {
        return true
      } else return false
    },
    update: ({ req: { user } }) => {
      if (user?.collection === 'admin') {
        return true
      } else return false
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Nama Kursus',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      admin: {
        hidden: true,
      },
      unique: true,
      required: false,
      hooks: {
        beforeValidate: [
          ({ data, siblingData }) => {
            // If there's data for the referenced field, generate the slug
            if (siblingData['name']) {
              return siblingData['name']
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '')
            }

            // Return null if no data was found
            return null
          },
        ],
      },
      validate: (value) => {
        // Custom validation to ensure slug is properly formatted
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
        return true
      },
    },
    {
      name: 'description',
      label: 'Deskripsi',
      type: 'richText',
      required: true,
    },
    {
      name: 'short_description',
      label: 'Deskripsi Singkat',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      label: 'Harga',
      type: 'number',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subscription_allowed',
      label: 'Izinkan berlangganan',
      type: 'select',
      required: false,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Izinkan',
          value: 'yes',
        },
        {
          label: 'Tidak',
          value: 'no',
        },
      ],
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: ['category'],
      required: true,
    },
    {
      name: 'duration',
      label: 'Durasi',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'level',
      label: 'Level',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      hasMany: false,
      options: [
        {
          label: 'Pemula',
          value: 'beginner',
        },
        {
          label: 'Menengah',
          value: 'intermediate',
        },
        {
          label: 'Tingkat Lanjut',
          value: 'advanced',
        },
      ],
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail Kursus',
      type: 'upload',
      relationTo: 'upload-document',
    },
    {
      name: 'highlight',
      label: 'Sematkan',
      type: 'select',
      options: [
        {
          label: 'Iya',
          value: 'yes',
        },
        {
          label: 'Tidak',
          value: 'no',
        },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Dalam proses',
          value: 'COMING_SOON',
        },
        {
          label: 'Dipublikasikan',
          value: 'PUBLISHED',
        },
        {
          label: 'Diarsipkan',
          value: 'ARCHIVED',
        },
      ],
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        const getModules = await req.payload.find({
          collection: 'module',
          depth: 0,
          where: {
            course: {
              equals: doc.id,
            },
          },
        })

        const get_category = await req.payload.findByID({
          collection: 'category',
          id: `${doc.category?.value?.id || doc.category.value}`,
        })

        if (req.user?.collection === 'users') {
          const getUserCourse = await req.payload.find({
            collection: 'orders',
            depth: 0,
            where: {
              and: [
                {
                  user: {
                    equals: req.user?.id,
                  },
                },
                {
                  course_item: {
                    equals: doc.id,
                  },
                },
              ],
            },
          })

          if (getUserCourse.docs.length > 0) {
            const progress = await req.payload.find({
              collection: 'course-progresses',
              depth: 0,
              where: {
                course: {
                  equals: doc.id,
                },
              },
            })

            if (progress.docs.length > 0) {
              doc.progress = {
                lastAccessedAt: progress.docs[0].lastAccessedAt,
                progress_percentage: progress.docs[0].progressPercentage,
                completedContent: progress.docs[0].completedContent,
              }
            }

            doc.mine = true
          } else {
            doc.mine = false
          }
        } else {
          doc.mine = false
        }

        return {
          ...doc,
          category_name: get_category.name,
          modules: getModules.docs.sort((a, b) => a.order - b.order),
        }
      },
    ],
  },
  endpoints: [
    {
      path: '/done',
      method: 'get',
      handler: async (req) => {
        if (req.user) {
          const user = req.user.id
          const get_progress_data = await req.payload.find({
            collection: 'course-progresses',
            depth: 0,
            where: {
              and: [
                {
                  user: {
                    equals: user,
                  },
                },
                {
                  progressPercentage: {
                    equals: 100,
                  },
                },
              ],
            },
          })

          const course_ids = get_progress_data.docs.map((arr) => arr?.course as string)

          const courses = await req.payload.find({
            collection: 'course',
            user: req.user,
            where: {
              and: [
                {
                  id: {
                    in: course_ids,
                  },
                },
              ],
            },
          })

          return NextResponse.json({ ...courses }, { status: 200 })
        }

        return NextResponse.json(
          { message: 'Terjadi kesalahan, silahkan masuk dulu' },
          { status: 401 },
        )
      },
    },
    {
      path: '/ongoing',
      method: 'get',
      handler: async (req) => {
        if (req.user) {
          const user_id = req.user.id

          const get_progress_data = await req.payload.find({
            collection: 'course-progresses',
            user: req.user,
            depth: 0,
            where: {
              and: [
                {
                  user: {
                    equals: user_id,
                  },
                },
                {
                  progressPercentage: {
                    less_than: 100,
                  },
                },
              ],
            },
          })

          const course_ids = get_progress_data.docs.map((arr) => arr?.course as string)

          const courses = await req.payload.find({
            collection: 'course',
            user: req.user,
            where: {
              and: [
                {
                  id: {
                    in: course_ids,
                  },
                },
              ],
            },
          })

          return NextResponse.json({ ...courses }, { status: 200 })
        }

        return NextResponse.json(
          { message: 'Terjadi kesalahan, silahkan masuk dulu' },
          { status: 401 },
        )
      },
    },
    {
      path: '/me',
      method: 'get',
      handler: async (req) => {
        if (req.user) {
          const user = req.user.id
          const get_order = await req.payload.find({
            collection: 'orders',
            where: {
              and: [
                {
                  'user.id': {
                    equals: user,
                  },
                },
                {
                  status: {
                    equals: 'done',
                  },
                },
              ],
            },
          })

          const course_ids = get_order.docs.map((arr) => arr?.course_item?.id as string)

          const courses = await req.payload.find({
            collection: 'course',
            user: req.user,
            where: {
              and: [
                {
                  id: {
                    in: course_ids,
                  },
                },
              ],
            },
          })

          return NextResponse.json({ ...courses }, { status: 200 })
        }

        return NextResponse.json(
          { message: 'Terjadi kesalahan, silahkan masuk dulu' },
          { status: 401 },
        )
      },
    },
  ],
}

export default Course
