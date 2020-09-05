import type { Organization } from 'services/cd-ng'

export interface OrganizationModalInteraction {
  backToSelections: () => void
  onSuccess?: () => void
  edit?: boolean
  data?: Organization
}
