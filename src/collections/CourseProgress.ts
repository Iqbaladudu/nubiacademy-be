import { CollectionConfig } from 'payload'

export const CourseProgress: CollectionConfig = {
  slug: 'course-progresses',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'course',
      required: true,
      unique: true,
    },
    {
      name: 'completedContent',
      type: 'array',
      fields: [
        {
          name: 'content',
          type: 'relationship',
          relationTo: 'course-content',
        },
        {
          name: 'completedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'lastAccessedAt',
      type: 'date',
    },
    {
      name: 'progressPercentage',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        data.lastAccessedAt = new Date()

        const lesson_count = await req.payload.count({
          collection: 'course-content',
          depth: 0,
          where: {
            'module.course': {
              equals: data.course,
            },
          },
        })

        data.progressPercentage = (data.completedContent.length / lesson_count.totalDocs) * 100

        return data
      },
    ],
  },
}
