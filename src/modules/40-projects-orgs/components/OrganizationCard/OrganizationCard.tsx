import { Card, Color, Container, Icon, Layout, Tag, Text, CardBody } from '@wings-software/uikit'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Menu, Classes } from '@blueprintjs/core'
import { useDeleteOrganization } from 'services/cd-ng'
import type { Organization } from 'services/cd-ng'
import { useConfirmationDialog } from '@common/modals/ConfirmDialog/useConfirmationDialog'

import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import { useToaster } from '@common/exports'
import i18n from './OrganizationCard.i18n'
import css from './OrganizationCard.module.scss'

interface OrganizationCardProps {
  data: Organization
  width?: number
  isPreview?: boolean
  reloadOrgs?: () => void
  editOrg?: () => void
  onClick?: () => void
}

export const OrganizationCard: React.FC<OrganizationCardProps> = props => {
  const { data, isPreview, onClick, editOrg, reloadOrgs } = props
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
    <Card elevation={2} interactive={!isPreview} className={css.card} onClick={onClick}>
      <Container className={css.overflow}>
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
            className={css.cardMenu}
          />
        ) : null}
        <Layout.Vertical className={css.title} padding={{ right: isPreview ? 'large' : undefined }}>
          <Text font="medium" color={Color.BLACK} lineClamp={1}>
            {data?.name || i18n.placeholder.name}
          </Text>
          <Layout.Horizontal className={css.description}>
            {data?.description ? (
              <Text color={Color.GREY_350} lineClamp={2}>
                {data.description}
              </Text>
            ) : null}
          </Layout.Horizontal>
          <Layout.Horizontal spacing="xsmall" className={css.tags}>
            {data.tags
              ? Object.keys(data.tags).map(key => {
                  const value = data.tags?.[key]
                  return (
                    <Tag className={css.cardTags} key={key}>
                      {value ? `${key}:${value}` : key}
                    </Tag>
                  )
                })
              : null}
          </Layout.Horizontal>
          <Layout.Horizontal padding={{ top: 'xlarge' }}>
            <Layout.Vertical spacing="small">
              <Layout.Horizontal spacing="small" flex={{ align: 'center-center' }}>
                <Icon name="nav-project" size={25}></Icon>
                <Text font="medium">{i18n.numberOfProjects}</Text>
              </Layout.Horizontal>
              <Text font="xsmall">{i18n.projects.toUpperCase()}</Text>
            </Layout.Vertical>
            <Layout.Vertical padding={{ left: 'huge' }} spacing="small" flex={{ align: 'center-center' }}>
              <Icon name="main-user-groups" size={25} />
              <Text font="xsmall">{i18n.orgMembers.toUpperCase()}</Text>
            </Layout.Vertical>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Container>
    </Card>
  )
}
