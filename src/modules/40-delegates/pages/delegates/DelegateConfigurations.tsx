import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Classes, Menu } from '@blueprintjs/core'
import { Card, Text, Layout, Container, Button, FlexExpander, Color, Heading, Utils } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/components/Toaster/useToaster'
import { DelegateProfileDetails, EmbeddedUser, useGetDelegateProfilesV2 } from 'services/portal'
import { useDeleteDelegateProfile } from 'services/portal/index'
import { useStrings } from 'framework/exports'
import { TimeAgo } from '@common/exports'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { PageError } from '@common/components/Page/PageError'
import { TagsViewer } from '@common/components/TagsViewer/TagsViewer'
import useDeleteDelegateConfigModal from '../../modals/DelegateModal/useDeleteDelegateConfigModal'
import css from './DelegatesPage.module.scss'

const formatProfileList = (data: any) => {
  const profiles: Array<DelegateProfileDetails> = data?.resource?.response
  return profiles
}

const fullSizeContentStyle: React.CSSProperties = {
  position: 'fixed',
  top: '135px',
  left: '270px',
  width: 'calc(100% - 270px)',
  height: 'calc(100% - 135px)'
}

export default function DelegateConfigurations(): JSX.Element {
  const { getString } = useStrings()
  const history = useHistory()
  const { accountId } = useParams<Record<string, string>>()
  const { data, loading, error, refetch } = useGetDelegateProfilesV2({ queryParams: { accountId } })
  const { showSuccess, showError } = useToaster()
  const profiles: Array<DelegateProfileDetails> = formatProfileList(data)
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
        } catch (e) {
          showError(e.message)
        }
      }
    }
  })
  const gotoDetailPage = (profile: DelegateProfileDetails): void => {
    history.push(
      routes.toResourcesDelegateConfigsDetails({
        accountId,
        delegateConfigId: profile.uuid as string
      })
    )
  }

  if (loading) {
    return (
      <Container style={fullSizeContentStyle}>
        <ContainerSpinner />
      </Container>
    )
  }

  if (error) {
    return (
      <Container style={fullSizeContentStyle}>
        <PageError message={error.message} onClick={() => refetch()} />
      </Container>
    )
  }

  return (
    <Container background={Color.GREY_100}>
      <Layout.Horizontal className={css.header} background={Color.WHITE}>
        {/** TODO: Implement add configuration */}
        <Button intent="primary" text={getString('delegate.newConfiguration')} icon="plus" disabled />
        <FlexExpander />
        <Layout.Horizontal spacing="xsmall">
          <Button minimal icon="main-search" disabled />
          <Button minimal icon="settings" disabled />
        </Layout.Horizontal>
      </Layout.Horizontal>
      <Container
        style={{ width: 'calc(100vw - 270px)', overflow: 'hidden', minHeight: 'calc(100vh - 205px)' }}
        padding="xxlarge"
      >
        <Layout.Masonry
          center
          padding="xsmall"
          gutter={25}
          items={((data?.resource as unknown) as { response: DelegateProfileDetails[] })?.response || []}
          renderItem={(profile: DelegateProfileDetails) => (
            <Card elevation={2} interactive={true} onClick={() => gotoDetailPage(profile)}>
              <Container width={250} style={{ borderRadius: '5px', margin: '-20px' }} padding="large">
                <Layout.Horizontal>
                  <Heading
                    level={2}
                    style={{ fontSize: '16px', fontWeight: 500, color: '#22222A' }}
                    padding={{ bottom: 'medium' }}
                  >
                    {profile.name}
                  </Heading>
                  <FlexExpander />
                  <Container style={{ transform: 'translate(12px, -10px)' }} onClick={Utils.stopEvent}>
                    <Button
                      minimal
                      icon="more"
                      tooltip={
                        <Menu style={{ minWidth: 'unset' }}>
                          <Menu.Item icon="edit" text={getString('edit')} onClick={() => gotoDetailPage(profile)} />
                          <Menu.Item
                            icon="cross"
                            text={getString('delete')}
                            onClick={openDialog}
                            className={Classes.POPOVER_DISMISS}
                          />
                        </Menu>
                      }
                      tooltipProps={{ isDark: true, interactionKind: 'click' }}
                      style={{ color: 'var(--grey-400)', transform: 'rotate(90deg)' }}
                    />
                  </Container>
                </Layout.Horizontal>
                <Layout.Vertical spacing="small" style={{ marginBottom: '100px' }}>
                  {profile.description && <Text>{profile.description}</Text>}
                  <TagsViewer tags={profile.selectors} style={{ background: '#CDF4FE' }} />
                </Layout.Vertical>
                <Container
                  flex
                  style={{
                    margin: '-20px',
                    borderTop: '1px solid #D9DAE6',
                    padding: 'var(--spacing-large) var(--spacing-xlarge) var(--spacing-large)'
                  }}
                >
                  <FlexExpander />
                  <Container>
                    <Text
                      style={{ fontSize: '8px', color: '#6B6D85', letterSpacing: '0.285714px', fontWeight: 500 }}
                      margin={{ bottom: 'small' }}
                    >
                      {getString('lastUpdated').toUpperCase()}
                    </Text>
                    <Container flex={{ align: 'center-center' }}>
                      <Text
                        icon="person"
                        tooltip={(profile as { lastUpdatedBy: EmbeddedUser })?.lastUpdatedBy?.name}
                        iconProps={{ size: 16 }}
                      />
                      {/** TODO: Backend currently does not send back lastUpdated */}
                      <TimeAgo
                        icon={undefined}
                        time={1612094928765}
                        style={{ color: '#9293AB', fontSize: '10px', letterSpacing: '0.375px', paddingLeft: '3px' }}
                      />
                    </Container>
                  </Container>
                </Container>
              </Container>
            </Card>
          )}
          keyOf={(profile: DelegateProfileDetails) => profile.uuid}
        />
      </Container>
    </Container>
  )
}
