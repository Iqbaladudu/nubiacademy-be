import { CollectionConfig } from 'payload'

const Module: CollectionConfig = {
  slug: 'module',
  labels: {
    plural: 'Modul',
    singular: 'Modul',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Judul',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Deskripsi',
      type: 'text',
    },
    {
      name: 'course',
      label: 'Kursus',
      type: 'relationship',
      relationTo: 'course',
      hasMany: false,
    },
    {
      name: 'order',
      label: 'Urutan',
      type: 'number',
      required: true,
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        const getContents = await req.payload.find({
          collection: 'course-content',
          depth: 0,
          where: {
            module: {
              equals: doc.id,
            },
          },
        })

        const getOrder = await req.payload.find({
          collection: 'orders',
          depth: 0,
          where: {
            and: [
              {
                item_to_purchase: {
                  equals: doc.course,
                },
              },
              {
                user: {
                  equals: req.user?.id || req.user,
                },
              },
            ],
          },
        })

        return {
          ...doc,
          contents: getContents.docs.map((arr) => {
            if (getOrder.totalDocs === 0) {
              if ((arr.videoUrl?.length as number) > 0) {
                return { id: arr.id, title: arr.title, contain_video: true }
              } else {
                return { id: arr.id, title: arr.title }
              }
            } else {
              return arr
            }
          }),
        }
      },
    ],
  },
}

export default Module
