import xhr from '@wings-software/xhr-async'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import type { OrganizationDTO } from '../types/dto/OrganizationDTO'
import { pick } from 'lodash-es'

export function getOrganizations({
  accountId,
  xhrGroup
}: {
  accountId: string
  xhrGroup: string
}): ServiceResponse<OrganizationDTO[]> {
  return xhr.get(`/cd/api/organizations?accountId=${accountId}`, { xhrGroup })
}

export function createOrganization({
  organization,
  xhrGroup
}: {
  organization: OrganizationDTO
  xhrGroup: string
}): ServiceResponse<OrganizationDTO> {
  return xhr.post(`/cd/api/organizations`, { xhrGroup, data: organization })
}

export function updateOrganization({
  id,
  organization,
  xhrGroup
}: {
  id: string
  organization: OrganizationDTO
  xhrGroup: string
}): ServiceResponse<OrganizationDTO> {
  return xhr.put(`/cd/api/organizations/${id}`, {
    xhrGroup,
    data: pick(organization, ['name', 'description', 'color', 'tags', 'icon', 'collaborators'])
  })
}
