import { Card, Color, Container, Icon, Layout, Tag, Text, CardBody } from '@wings-software/uikit'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Menu, Classes } from '@blueprintjs/core'

import { useDeleteOrganization } from 'services/cd-ng'
import type { Organization } from 'services/cd-ng'
import { useConfirmationDialog } from 'modules/common/modals/ConfirmDialog/useConfirmationDialog'

import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import { useToaster } from 'modules/common/exports'
import i18n from './OrganizationCard.i18n'
import css from './OrganizationCard.module.scss'

interface OrganizationCardProps {
  data: Organization
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
  const { organisationsMap } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()
  const { showSuccess, showError } = useToaster()

  const { mutate: deleteOrg } = useDeleteOrganization({ queryParams: { accountIdentifier: accountId } })

  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.delete,
    cancelButtonText: i18n.cancelButton,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteOrg(data.identifier || '', { headers: { 'content-type': 'application/json' } })
          if (deleted) showSuccess(i18n.successMessage(data.name || ''))
          organisationsMap.delete(data.identifier || '')
          updateAppStore({ organisationsMap: organisationsMap })
          reloadOrgs?.()
        } catch (err) {
          showError(err)
        }
      }
    }
  })
  const handleEdit = (e: React.MouseEvent): void => {
    e.stopPropagation()
    editOrg?.()
  }

  const handleDelete = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation()
    if (!data?.identifier) return
    openDialog()
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
      <Container width={width} className={css.overflow}>
        <div className={css.colorBar} style={{ backgroundColor: data?.color || 'var(--blue-500)' }} />
        <Layout.Vertical spacing="small" padding={{ right: isPreview ? 'large' : undefined }}>
          <Text font="medium" color={Color.BLACK}>
            {data?.name || i18n.placeholder.name}
          </Text>
          {data?.description ? (
            <Text color={Color.GREY_350} lineClamp={5}>
              {data.description}
            </Text>
          ) : isPreview ? (
            <Text color={Color.GREY_350} lineClamp={5}>
              {i18n.placeholder.description}
            </Text>
          ) : null}
          <Layout.Horizontal padding={{ top: 'xxxlarge' }}>
            <Layout.Horizontal width={'80%'} className={css.wrap}>
              {data?.tags?.length
                ? data?.tags.map((tag: string) => (
                    <Tag minimal key={tag} className={css.cardTags}>
                      {tag}
                    </Tag>
                  ))
                : null}
            </Layout.Horizontal>
            <Layout.Horizontal width={'20%'} className={css.user}>
              <Icon size={24} name="user" />
            </Layout.Horizontal>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Container>
    </Card>
  )
}
