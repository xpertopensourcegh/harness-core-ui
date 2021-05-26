import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import type { ResourceScope } from 'services/rbac/index'
import RbacFactory from '@rbac/factories/RbacFactory'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { Scope } from '@common/interfaces/SecretsInterface'
import type { StringsMap } from 'stringTypes'
import css from './RBACTooltip.module.scss'

interface Props {
  permission: PermissionIdentifier
  resourceType: ResourceType
  resourceScope?: ResourceScope
}

const RBACTooltip: React.FC<Props> = ({ permission, resourceType, resourceScope }) => {
  const { getString } = useStrings()
  const { selectedProject } = useAppStore()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const resourceTypeHandler = RbacFactory.getResourceTypeHandler(resourceType)
  const currentScope = getScopeFromDTO(
    resourceScope || {
      projectIdentifier,
      orgIdentifier,
      accountIdentifier: accountId
    }
  )

  const getProjectScopeSuffix = (): string => {
    if (
      selectedProject?.identifier === resourceScope?.projectIdentifier ||
      selectedProject?.identifier === projectIdentifier
    ) {
      return selectedProject?.name || resourceScope?.projectIdentifier || projectIdentifier
    } else {
      return resourceScope?.projectIdentifier || projectIdentifier
    }
  }

  const getScopeSuffix = (): string => {
    switch (currentScope) {
      case Scope.PROJECT: {
        return getProjectScopeSuffix()
      }
      case Scope.ORG: {
        return resourceScope?.orgIdentifier || orgIdentifier
      }
      case Scope.ACCOUNT: {
        return resourceScope?.accountIdentifier || accountId
      }
    }
  }

  return (
    <Container padding="small">
      <Text>
        {`${getString('rbac.youAreNotAuthorizedTo')} `}
        <span className={css.textToLowercase}>{resourceTypeHandler?.permissionLabels?.[permission] || permission}</span>
        <span className={css.textToLowercase}>
          {` ${resourceTypeHandler?.label && getString(resourceTypeHandler?.label)}.`}
        </span>
      </Text>
      <Text>{getString('rbac.youAreMissingTheFollowingPermission')}</Text>
      <Text>
        {'"'}
        {resourceTypeHandler?.permissionLabels?.[permission] || permission}
        <span className={css.textToLowercase}>
          {` ${resourceTypeHandler?.label && getString(resourceTypeHandler?.label)}`}
        </span>
        {'"'}
        <span>{` ${getString('rbac.in')} ${getString(`rbac.${currentScope}` as keyof StringsMap)} `}</span>
        {/* TODO: Need to replace account and org ids with names*/}
        {`"${getScopeSuffix()}"`}
      </Text>
    </Container>
  )
}

export default RBACTooltip
