import type { Breadcrumb } from '@wings-software/uicore'
import type { UseStringsReturn } from 'framework/strings'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import { Scope } from '@common/interfaces/SecretsInterface'
import routes from '@common/RouteDefinitions'

interface GetLinkForAccountResourcesProps {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
  getString: UseStringsReturn['getString']
}

export const getLinkForAccountResources = ({
  accountId,
  orgIdentifier,
  projectIdentifier,
  getString
}: GetLinkForAccountResourcesProps): Breadcrumb[] => {
  return getScopeFromDTO({ orgIdentifier, projectIdentifier }) === Scope.ACCOUNT
    ? [{ label: getString('common.accountResources'), url: routes.toAccountResources({ accountId }) }]
    : []
}
