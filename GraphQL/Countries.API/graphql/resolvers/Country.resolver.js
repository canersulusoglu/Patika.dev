module.exports = {
    Query: {
        countries: (_, __, { db: { Countries }}) => {
            return Object.entries(Countries).map(({0:key, 1:value}, _index) => {
                return {
                    code: key,
                    ...value
                }
            })
        },
        country: (_, { code }, { db: { Countries } }) => {
            code = code.toUpperCase();
            const country = Countries[code];
            if(country){
                return {
                    code,
                    ...country
                }
            }
        }
    },
    Country: {
        continent: (parent, __, { db: { Continents } }) => {
            return {
                code: parent.continentCode,
                ...Continents[parent.continentCode]
            }
        },
        languages: (parent, __, { db: { Languages } }) => {
            return parent.languageCodes.map(langCode => {
                return {
                    code: langCode,
                    ...Languages[langCode]
                }
            })
        }
    }
}