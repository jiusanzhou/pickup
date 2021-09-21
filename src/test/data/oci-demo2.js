export default {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            tags: {
                type: 'array',
                items: {
                    type: 'string',
                }
            }
        },
    },
}