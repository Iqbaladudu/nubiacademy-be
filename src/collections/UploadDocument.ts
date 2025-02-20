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
    staticURL: '/assets/documents',
    mimeTypes: ['*'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}

export default UploadDocument
