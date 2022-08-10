module.exports = {
    Query: {
        continents: (_, __, { db: { Continents }}) => {
            return Object.entries(Continents).map(({0:key, 1:value}, _index) => {
                return {
                  code: key,
                  ...value
                }
            })
        },
        continent: (_, { code }, { db: { Continents } }) => {
            code = code.toUpperCase();
            const continent = Continents[code];
            if(continent){
                return {
                    code,
                    ...continent
                }
            }
        }
    }
}