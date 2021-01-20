import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Menu } from '@blueprintjs/core'
import { Card, Text, CardBody, Layout, Tag, Intent, Container } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/components/Toaster/useToaster'
import { useGetDelegateProfilesV2 } from 'services/portal'
import { useDeleteDelegateProfile } from 'services/portal/index'
import { useStrings } from 'framework/exports'
import useDeleteDelegateConfigModal from '../../modals/DelegateModal/useDeleteDelegateConfigModal'
import css from './DelegatesPage.module.scss'

interface DelegateProfile {
  uuid: string
  accountId?: string
  name?: string
  description?: string
  primary?: boolean
  approvalRequired?: boolean
  startupScript?: string
  selectors?: string[]
  lastUpdatedAt?: string
}
const renderTags = (tags: string[]) => {
  /* istanbul ignore next */
  if (!tags) {
    return null
  }
  /* istanbul ignore next */
  return (
    <>
      {tags.map((tag: string) => {
        return (
          <Tag key={tag} intent={Intent.PRIMARY}>
            {tag}
          </Tag>
        )
      })}
    </>
  )
}

const formatProfileList = (data: any) => {
  const profiles: Array<DelegateProfile> = data?.resource?.response
  return profiles
}

export default function DelegateConfigurations(): JSX.Element {
  const { getString } = useStrings()
  const history = useHistory()
  const { accountId } = useParams()
  const { data } = useGetDelegateProfilesV2({ queryParams: { accountId } })
  const { showSuccess, showError } = useToaster()
  const profiles: Array<DelegateProfile> = formatProfileList(data)
  const { mutate: deleteDelegateProfile } = useDeleteDelegateProfile({
    queryParams: { accountId: accountId }
  })
  const { openDialog } = useDeleteDelegateConfigModal({
    delegateConfigName: 'profiles.name',
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteDelegateProfile('profiles.accountId')

          if (deleted) {
            showSuccess(getString('delegate.deleteDelegateConfigurationSuccess'))
            ;(profiles as any).reload?.()
          }
        } catch (error) {
          showError(error.message)
        }
      }
    }
  })
  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    openDialog()
  }
  /* istanbul ignore next */
  if (data) {
    const { resource } = data
    if (resource) {
      return (
        <Container className={css.profileContainer}>
          {profiles.map((item: DelegateProfile) => {
            return (
              <Card
                interactive={false}
                elevation={0}
                selected={false}
                className={css.profileCard}
                key={item.name}
                onClick={() => {
                  history.push(
                    routes.toResourcesDelegateConfigsDetails({
                      accountId,
                      delegateConfigId: item.uuid
                    })
                  )
                }}
              >
                <CardBody.Menu
                  menuContent={
                    <Menu>
                      <Menu.Item icon="edit" text={getString('edit')} />
                      <Menu.Item icon="cross" text={getString('delete')} onClick={handleDelete} />
                    </Menu>
                  }
                >
                  <Text font={{ size: 'medium', weight: 'bold' }}>{item.name}</Text>

                  <Layout.Vertical spacing="medium" padding={{ top: 'medium' }} className={css.content}>
                    <div>
                      <Text style={{ marginTop: '5px' }} font="small">
                        {item.description}
                      </Text>
                    </div>
                    {item.selectors && <div>{renderTags(item?.selectors)}</div>}
                  </Layout.Vertical>

                  {item.lastUpdatedAt && (
                    <div>
                      <hr />
                      <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                        {getString('tableColumnNames.lastUpdatedOn')}
                      </Text>
                      <Text font="small">{item.lastUpdatedAt}</Text>
                    </div>
                  )}
                </CardBody.Menu>
              </Card>
            )
          })}
        </Container>
      )
    }
  }
  /* istanbul ignore next */
  return <div />
}
