export interface Option {
  label: string
  value: string
}

export const sortOptions = (options: Option[]): Option[] =>
  options.sort(({ label: a }, { label: b }) => a.localeCompare(b))
