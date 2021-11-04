import React, { ReactElement } from 'react'
import { Text, Layout, Color, Container, Switch } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'

interface SettingsMenuProps {
  isAutoCommitEnabled: boolean
  handleToggleAutoCommit: (setAutoCommit: boolean) => void
  isLoading: boolean
}

const SettingsMenu = ({ isAutoCommitEnabled, handleToggleAutoCommit, isLoading }: SettingsMenuProps): ReactElement => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical padding="medium" spacing="small">
      <Container flex={{ alignItems: 'start' }}>
        <Switch
          data-testid="auto-commit-switch"
          alignIndicator="left"
          checked={isAutoCommitEnabled}
          onChange={async event => {
            handleToggleAutoCommit(event.currentTarget.checked)
          }}
          disabled={isLoading}
        />
        <Text color={Color.BLACK}>{getString('cf.gitSync.autoCommitStatusLabel')}</Text>
      </Container>
    </Layout.Vertical>
  )
}

export default SettingsMenu
