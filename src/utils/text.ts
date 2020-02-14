/**
 * @link http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html?id=l10n/pluralforms
 * @param few
 * @param one
 * @param two
 * @returns {function(*): *}
 */
interface CountWords {
  few: string
  one: string
  two: string
}

export function createCountFormatter ({few, one, two}: CountWords) {
  const titles = [one, two, few]

  return (number: number): string => {
    const cases = [2, 0, 1, 1, 1, 2]

    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
      ]
  }
}
