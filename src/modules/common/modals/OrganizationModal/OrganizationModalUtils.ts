import type { OrganizationDTO } from 'modules/common/types/dto/OrganizationDTO'

export interface OrganizationModalInteraction {
  backToSelections: () => void
  onSuccess?: (org: OrganizationDTO) => void
  edit?: boolean
  data?: OrganizationDTO
}
