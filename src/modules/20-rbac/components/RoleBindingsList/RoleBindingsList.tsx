import React from 'react'
import { Tag, Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { Layout } from '@wings-software/uicore'
import { Link, useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import type { RoleAssignmentMetadataDTO, RoleBinding } from 'services/cd-ng'
import type { PipelineType, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import routes from '@common/RouteDefinitions'
import css from './RoleBindingsList.module.scss'

interface RoleBindingsListProps {
  data?: RoleAssignmentMetadataDTO[] | RoleBinding[]
  length?: number
}

const RoleBindingTag = ({ roleAssignment }: { roleAssignment: RoleBinding }): React.ReactElement => {
  const { accountId, orgIdentifier, projectIdentifier, module } = useParams<PipelineType<ProjectPathProps>>()
  return (
    <Tag
      className={roleAssignment.managedRole ? css.harnesstag : css.customtag}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <Link
        to={routes.toRoleDetails({
          accountId,
          orgIdentifier,
          projectIdentifier,
          module,
          roleIdentifier: roleAssignment.roleIdentifier
        })}
        className={css.link}
      >
        {roleAssignment.roleName}
      </Link>
      {` - `}
      <Link
        to={routes.toResourceGroupDetails({
          accountId,
          orgIdentifier,
          projectIdentifier,
          module,
          resourceGroupIdentifier: roleAssignment.resourceGroupIdentifier
        })}
        className={css.link}
      >
        {roleAssignment.resourceGroupName}
      </Link>
    </Tag>
  )
}

const RoleBindingsList: React.FC<RoleBindingsListProps> = ({ data, length = data?.length }) => {
  const baseData = data?.slice(0, length)
  const popoverData = data?.slice(length, data.length)
  const { getString } = useStrings()
  return (
    <>
      {baseData?.map(roleAssignment => (
        <RoleBindingTag
          key={`${roleAssignment.roleIdentifier} ${roleAssignment.resourceGroupIdentifier}`}
          roleAssignment={roleAssignment}
        />
      ))}
      {popoverData?.length ? (
        <Popover interactionKind={PopoverInteractionKind.HOVER}>
          <Layout.Horizontal flex={{ align: 'center-center' }} spacing="xsmall">
            <Tag className={css.tag}>{getString('common.plusNumber', { number: popoverData?.length })}</Tag>
          </Layout.Horizontal>
          <Layout.Vertical padding="small" spacing="small">
            {popoverData?.map(roleAssignment => (
              <RoleBindingTag
                key={`${roleAssignment.roleIdentifier} ${roleAssignment.resourceGroupIdentifier}`}
                roleAssignment={roleAssignment}
              />
            ))}
          </Layout.Vertical>
        </Popover>
      ) : null}
    </>
  )
}

export default RoleBindingsList
