import type { OrganizationDTO } from 'services/cd-ng'

export interface OrganizationModalInteraction {
  backToSelections: () => void
  onSuccess?: (org: OrganizationDTO) => void
  edit?: boolean
  data?: OrganizationDTO
}
