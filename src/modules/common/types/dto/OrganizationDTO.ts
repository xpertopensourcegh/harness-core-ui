export interface OrganizationDTO {
  id?: string
  icon?: string /** TODO: API does not support icon yet */
  accountId?: string
  identifier?: string
  name?: string
  color?: string
  description?: string
  tags?: Array<string>
}
