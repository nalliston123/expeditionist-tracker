export function compareCountryLists(mapCountries: string[], listCountries: string[]) {
  const mapSet = new Set(mapCountries)
  const listSet = new Set(listCountries)

  const onlyInMap = mapCountries.filter((country) => !listSet.has(country))
  const onlyInList = listCountries.filter((country) => !mapSet.has(country))

  return { onlyInMap, onlyInList }
}

