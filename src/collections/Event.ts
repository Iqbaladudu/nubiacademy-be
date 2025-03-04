import { CollectionConfig } from 'payload'

const Events: CollectionConfig = {
    slug: 'events',
    admin: {
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Event Title',
            required: true,
        },
        {
            name: 'category',
            type: 'select',
            label: 'Event Category',
            options: [
                {
                    label: 'Workshop',
                    value: 'workshop',
                },
                {
                    label: 'Bootcamp',
                    value: 'bootcamp',
                },
            ],
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Description',
        },
        {
            name: "description_long",
            type: "richText",
            label: "Full description"
        },
        {
            name: 'date',
            type: 'date',
            label: 'Event Date',
            required: true,
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'location',
            type: 'text',
            label: 'Location',
        },
        {
            name: 'pricing',
            type: 'group',
            label: 'Pricing',
            fields: [
                {
                    name: 'originalPrice',
                    type: 'number',
                    label: 'Original Price (in IDR)',
                    required: true,
                    min: 0,
                    admin: {
                        step: 1000,
                    },
                },
                {
                    name: 'discountedPrice',
                    type: 'number',
                    label: 'Discounted Price (in IDR)',
                    min: 0,
                    admin: {
                        step: 1000,
                        description: 'Leave empty if no discount applies',
                    },
                },
                {
                    name: 'isDiscounted',
                    type: 'checkbox',
                    label: 'Enable Discount',
                    defaultValue: false,
                },
            ],
        },
        {
            name: 'capacity',
            type: 'number',
            label: 'Maximum Capacity',
            min: 1,
            admin: {
                step: 1,
            },
        },
        {
            name: 'image',
            type: 'upload',
            label: 'Event Poster',
            relationTo: "upload-document",
        },
        {
            name: 'status',
            type: 'select',
            label: 'Event Status',
            options: [
                {label: 'Draft', value: 'draft'},
                {label: 'Published', value: 'published'},
                {label: 'Cancelled', value: 'cancelled'},
            ],
            defaultValue: 'draft',
        },
        {
            name: 'highlights',
            type: 'array',
            label: 'Event Highlights',
            fields: [
                {
                    name: 'highlight',
                    type: 'text',
                    label: 'Highlight Item',
                    required: true,
                },
            ],
            admin: {
                description: 'Add key features or highlights of the event',
            },
        },
        {
            name: 'rounds',
            type: 'array',
            label: 'Event Rounds/Sessions/Topics',
            fields: [
                {
                    name: 'roundName',
                    type: 'text',
                    label: 'Round Name',
                    required: true,
                },
                {
                    name: 'startTime',
                    type: 'date',
                    label: 'Start Time',
                    required: true,
                    admin: {
                        date: {
                            pickerAppearance: 'dayAndTime',
                        },
                    },
                },
                {
                    name: 'endTime',
                    type: 'date',
                    label: 'End Time',
                    admin: {
                        date: {
                            pickerAppearance: 'dayAndTime',
                        },
                    },
                },
            ],
            admin: {
                description: 'Add rounds or sessions for the event with their schedules',
            },
        },
    ],
}

export default Events;
