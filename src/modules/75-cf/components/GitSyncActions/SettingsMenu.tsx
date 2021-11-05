import React, { ReactElement } from 'react'
import { Text, Layout, Color, Container, Switch } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'

interface SettingsMenuProps {
  isAutoCommitEnabled: boolean
  isGitSyncPaused: boolean
  handleToggleAutoCommit: (setAutoCommit: boolean) => void
  handleGitPause: (newGitPauseValue: boolean) => void
  isLoading: boolean
}

const SettingsMenu = ({
  isAutoCommitEnabled,
  isGitSyncPaused,
  handleToggleAutoCommit,
  handleGitPause,
  isLoading
}: SettingsMenuProps): ReactElement => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical padding="medium" spacing="small" flex={{ alignItems: 'flex-start' }}>
      <Container flex={{ alignItems: 'start' }}>
        <Switch
          data-testid="toggle-git-sync-pause-switch"
          alignIndicator="left"
          checked={!isGitSyncPaused}
          onChange={async event => {
            handleGitPause(event.currentTarget.checked)
          }}
          disabled={isLoading}
        />
        <Text color={Color.BLACK}>{getString('cf.gitSync.toggleGitSyncPause')}</Text>
      </Container>
      <Container flex={{ alignItems: 'start' }}>
        <Switch
          data-testid="auto-commit-switch"
          alignIndicator="left"
          checked={isAutoCommitEnabled}
          onChange={async event => {
            handleToggleAutoCommit(event.currentTarget.checked)
          }}
          disabled={isLoading || isGitSyncPaused}
        />
        <Text color={Color.BLACK}>{getString('cf.gitSync.autoCommitStatusLabel')}</Text>
      </Container>
    </Layout.Vertical>
  )
}

export default SettingsMenu
