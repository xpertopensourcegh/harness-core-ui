import React, { ReactElement, useState } from 'react'
import { Text, Color, Container, Icon } from '@wings-software/uicore'

import BranchSettingsButton from './BranchSettingsButton'
import css from './GitSyncActions.module.scss'

export interface GitSyncActionsProps {
  isLoading: boolean
  branch: string
  repository: string
  isAutoCommitEnabled: boolean
  isGitSyncPaused: boolean
  handleToggleAutoCommit: (newAutoCommitValue: boolean) => Promise<void>
  handleGitPause: (newGitPauseValue: boolean) => Promise<void>
}

const GitSyncActions = (props: GitSyncActionsProps): ReactElement => {
  const { repository } = props

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <Container className={css.gitRepoText}>
        <Icon name="repository" />
        <Text color={Color.BLACK}>{repository}</Text>
      </Container>

      <Container className={css.verticalDivider} />

      <Container>
        <BranchSettingsButton isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} {...props} />
      </Container>
    </>
  )
}

export default GitSyncActions
