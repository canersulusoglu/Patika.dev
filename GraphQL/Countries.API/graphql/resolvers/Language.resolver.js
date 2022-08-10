module.exports = {
    Query: {
        languages: (_, __, { db: { Languages }}) => {
            return Object.entries(Languages).map(({0:key, 1:value}, _index) => {
                return {
                    code: key,
                    ...value
                }
            })
        },
        language: (_, { code }, { db: { Languages } }) => {
            code = code.toUpperCase();
            const language = Languages[code];
            if(language){
                return {
                    code,
                    ...language
                }
            }
        }
    }
}