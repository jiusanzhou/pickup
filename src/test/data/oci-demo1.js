
const _demoData = {
    type: 'object',
    name: '', // root have no name
    properties: {
        field1: { type: 'string' },
        field2: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    arrayfield1: { type: 'string' },
                    arrayfield2: { type: 'string' },
                },
            },
        },
        field3: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        field4: {
            type: 'object',
            properties: {
                objectfield1: { type: 'string' },
                objectfield2: { type: 'string' },
            },
        },
        field5: {
            type: 'array',
            items: {
                type: 'string',
                description: 'Array\' item'
            },
        },
        field6: {
            type: 'object',
            properties: {
                objectfield1: { type: 'string' },
                objectfield2: { type: 'string' },
            },
        },
    },
};

export default _demoData;