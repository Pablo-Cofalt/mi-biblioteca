// Case and accent insensitive form of a text, so "garcia" matches "García".
export const normalize = (text: string) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

export const matches = (value: string, search: string) =>
  normalize(value).includes(normalize(search)) ? 1 : 0
