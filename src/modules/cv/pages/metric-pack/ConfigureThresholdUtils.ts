export function mapCriteriaToRequest(criteria: any, criteriaOption: any): string {
  return criteriaOption === 'GREATER_THAN' ? '> ' + criteria : '< ' + criteria
}

export function mapCriteriaSignToForm(criteria: string): string {
  return criteria.split(' ')[0] === '>' ? 'GREATER_THAN' : 'LESS_THAN'
}
