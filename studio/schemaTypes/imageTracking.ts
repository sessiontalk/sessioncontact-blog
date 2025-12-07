import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'imageTracking',
  title: 'Image Tracking',
  type: 'document',
  fields: [
    defineField({
      name: 'unsplashIds',
      title: 'Used Unsplash Image IDs',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of Unsplash image IDs that have been used in blog posts to prevent duplicates',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Used Unsplash Images',
      }
    },
  },
})
