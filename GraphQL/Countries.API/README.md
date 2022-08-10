# Countries API

This API includes continents, countries, languages informations and each have relation with other types.
- Developed using GraphQL.
- You can access all data with these files:
  - All continents: [continents.json](./src/data/continents.json).
  - All languages: [languages.json](./src/data/languages.json).
  - All countries: [countries.json](./src/data/countries.json).

## Example Operation

### Listing all informations about countries

```graphql
query Countries {
  countries {
    code
    name
    native
    phone
    continentCode
    capital
    currencyCodes
    languageCodes
    continent {
      code
      name
    }
    languages {
      native
      name
      code
    }
  }
}
```