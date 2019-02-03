module.exports = {
    name: {
    	type: 'string',
    	index: true
    },
    link: {
    	type: 'relationship',
    	relationships: 'link',
        direction: 'out',
    	eager: true,
    	properties: {
            name: {
                type: 'string'
            },
        },
    }
};