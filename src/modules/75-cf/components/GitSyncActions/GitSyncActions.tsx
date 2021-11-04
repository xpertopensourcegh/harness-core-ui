import React, { ReactElement, useState } from 'react'
import { Text, Color, Container, Icon } from '@wings-software/uicore'

import BranchSettingsButton from './BranchSettingsButton'
import css from './GitSyncActions.module.scss'

export interface GitSyncActionsProps {
  isLoading: boolean
  branch: string
  repository: string
  isAutoCommitEnabled: boolean
  handleToggleAutoCommit: (newAutoCommitValue: boolean) => Promise<void>
}

const GitSyncActions = ({
  isLoading,
  branch,
  repository,
  isAutoCommitEnabled,
  handleToggleAutoCommit
}: GitSyncActionsProps): ReactElement => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <Container className={css.gitRepoText}>
        <Icon name="repository" />
        <Text color={Color.BLACK}>{repository}</Text>
      </Container>

      <Container className={css.verticalDivider} />

      <Container>
        <BranchSettingsButton
          isSettingsOpen={isSettingsOpen}
          handleToggleAutoCommit={handleToggleAutoCommit}
          setIsSettingsOpen={setIsSettingsOpen}
          branch={branch}
          isLoading={isLoading}
          isAutoCommitEnabled={isAutoCommitEnabled}
        />
      </Container>
    </>
  )
}

export default GitSyncActions
