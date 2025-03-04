import { CollectionConfig } from 'payload';

const Benefits: CollectionConfig = {
    slug: 'benefits',
    admin: {
        useAsTitle: 'event',
    },
    fields: [
        {
            name: "event",
            label: "Event",
            type: "relationship",
            relationTo: "events"
        },
        {
            name: 'benefits-item',
            type: 'array',
            label: 'Participant Benefits',
            admin: {
                description: 'Add custom benefits or bonuses for event participants',
            },
            fields: [
                {
                    name: 'benefitType',
                    type: 'select',
                    label: 'Benefit Type',
                    required: true,
                    options: [
                        { label: 'Link', value: 'link' },
                        { label: 'Voucher Code', value: 'voucher' },
                        { label: 'Custom Message', value: 'message' },
                    ],
                },
                {
                    name: 'benefitValue',
                    type: 'text',
                    label: 'Benefit Value',
                    required: true,
                    admin: {
                        condition: (data) => ['link', 'voucher', 'message'].includes(data?.benefitType),
                    },
                    validate: (value, { siblingData }) => {
                        if (siblingData.benefitType === 'link' && value && !value.match(/^https?:\/\/.+/)) {
                            return 'Please enter a valid URL starting with http:// or https://';
                        }
                        return true;
                    },
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Benefit Description',
                    admin: {
                        description: 'Optional description for this benefit',
                    },
                },
            ],
        },
    ],
};

export default Benefits;
