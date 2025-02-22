import { CollectionConfig } from 'payload'

const UploadDocument: CollectionConfig = {
  slug: 'upload-document',
  labels: {
    singular: 'Upload Document',
    plural: 'Upload Document',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: '/assets/documents',
    mimeTypes: ['*'],
    disableLocalStorage: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],

  hooks: {
    afterRead: [
      async ({ doc }) => {
        doc.url = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${doc._key}`

        return { ...doc }
      },
    ],
  },
}

export default UploadDocument
