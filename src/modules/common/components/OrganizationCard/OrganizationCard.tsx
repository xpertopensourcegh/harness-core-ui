import { Card, Color, Container, Icon, Layout, Tag, Text, CardBody } from '@wings-software/uikit'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Menu, Classes } from '@blueprintjs/core'

import { useDeleteOrganization } from 'services/cd-ng'
import type { OrganizationDTO } from 'services/cd-ng'

import i18n from './OrganizationCard.i18n'

interface OrganizationCardProps {
  data: OrganizationDTO
  width?: number
  isPreview?: boolean
  className?: string
  reloadOrgs?: () => void
  editOrg?: () => void
  onClick?: () => void
}

export const OrganizationCard: React.FC<OrganizationCardProps> = props => {
  const { data = {}, width = 250, isPreview, className, onClick, editOrg, reloadOrgs } = props
  const { accountId } = useParams()

  const { mutate: deleteOrg } = useDeleteOrganization({ accountIdentifier: accountId })

  const handleEdit = (e: React.MouseEvent): void => {
    e.stopPropagation()
    editOrg?.()
  }

  const handleDelete = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation()
    const sure = confirm(`Are you sure you want to delete the organization '${data.name}'?`)
    if (!sure) return
    try {
      const deleted = await deleteOrg(data.identifier || '', { headers: { 'content-type': 'application/json' } })
      if (!deleted) {
        // TODO: show error
      } else {
        reloadOrgs?.()
      }
    } catch (_) {
      // TODO: handle error
    }
  }

  return (
    <Card elevation={2} interactive={!isPreview} className={className} onClick={onClick}>
      {!isPreview ? (
        <CardBody.Menu
          menuContent={
            <Menu>
              <Menu.Item icon="edit" text={i18n.edit} onClick={handleEdit} />
              <Menu.Item icon="trash" text={i18n.delete} onClick={handleDelete} />
            </Menu>
          }
          menuPopoverProps={{
            className: Classes.DARK
          }}
        />
      ) : null}
      <Container width={width}>
        <Layout.Vertical spacing="small" padding={{ right: isPreview ? 'large' : undefined }}>
          <Text font="medium" color={Color.BLACK}>
            {data?.name || i18n.placeholder.name}
          </Text>
          {data?.description ? (
            <Text style={{ color: 'var(--grey-350)' }} lineClamp={isPreview ? 5 : undefined}>
              {data.description}
            </Text>
          ) : isPreview ? (
            <Text style={{ color: 'var(--grey-350)' }} lineClamp={isPreview ? 5 : undefined}>
              {i18n.placeholder.description}
            </Text>
          ) : null}
          {(data?.tags && data.tags.length > 0) || isPreview ? (
            <Layout.Horizontal width={'50%'} spacing="small">
              {data?.tags && data.tags.length > 0 ? (
                data?.tags.map((tag: string) => (
                  <Tag minimal key={tag}>
                    {tag}
                  </Tag>
                ))
              ) : isPreview ? (
                <>
                  <Tag minimal>sample</Tag>
                  <Tag minimal>tags</Tag>
                </>
              ) : null}
            </Layout.Horizontal>
          ) : null}
          <Icon size={24} name="user" />
        </Layout.Vertical>
      </Container>
    </Card>
  )
}
