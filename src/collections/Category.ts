import { CollectionConfig } from 'payload'

const Category: CollectionConfig = {
  slug: 'category',
  labels: {
    singular: 'Kategori',
    plural: 'Kategori',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [{ name: 'name', label: 'Nama Kategori', type: 'text', required: true }],
}

export default Category
