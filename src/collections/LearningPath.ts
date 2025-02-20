import { CollectionConfig } from 'payload'

const LearningPath: CollectionConfig = {
  slug: 'learning-path',
  labels: {
    plural: 'Learning Path',
    singular: 'Learning Path',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Deskripsi',
      type: 'richText',
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
      name: 'courses',
      label: 'Kursus',
      type: 'array',
      admin: {
        initCollapsed: false,
      },
      labels: {
        singular: 'Kursus',
        plural: 'Kursus',
      },

      fields: [
        {
          name: 'course_item',
          label: 'Pilih Kursus',
          hasMany: false,
          type: 'relationship',
          relationTo: 'course',
          required: true,
        },
      ],
    },
  ],
}

export default LearningPath
