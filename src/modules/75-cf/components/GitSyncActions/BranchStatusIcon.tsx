import React, { ReactElement } from 'react'
import { Text, Color, Container, Icon, Utils } from '@wings-software/uicore'

import { useStrings } from 'framework/strings'
import css from './GitSyncActions.module.scss'

interface BranchStatusIconProps {
  isSettingsOpen: boolean
  branch: string
  isLoading: boolean
  isAutoCommitEnabled: boolean
  isGitSyncPaused: boolean
}

const BranchStatusIcon = ({
  isSettingsOpen,
  branch,
  isAutoCommitEnabled,
  isGitSyncPaused,
  isLoading
}: BranchStatusIconProps): ReactElement => {
  const { getString } = useStrings()

  const getIcon = (): JSX.Element => {
    if (isGitSyncPaused) {
      return <Icon name="disable" size={15} data-testid="git-paused-icon" className={css.pausedIcon} />
    } else if (isLoading) {
      return <Icon name="steps-spinner" size={15} className={css.loadingSpinner} data-testid="git-sync-spinner" />
    }
    return (
      <Icon
        data-testid="auto-commit-status-icon"
        name="full-circle"
        size={10}
        className={isAutoCommitEnabled ? css.autoCommitEnabled : css.autoCommitDisabled}
      />
    )
  }

  const getToolTipText = (): string => {
    return isGitSyncPaused
      ? getString('cf.gitSync.syncingPaused')
      : getString('cf.gitSync.branchStatus', {
          branch,
          status: isAutoCommitEnabled ? 'ON' : 'OFF'
        })
  }

  return (
    <Container className={css.gitStatusIcon}>
      <Utils.WrapOptionalTooltip
        tooltipProps={{
          isDark: true,
          disabled: isSettingsOpen
        }}
        tooltip={
          <Container padding="medium" data-testid="git-sync-status-tooltip">
            <Text color={Color.WHITE}>{getToolTipText()}</Text>
          </Container>
        }
      >
        {getIcon()}
      </Utils.WrapOptionalTooltip>
    </Container>
  )
}

export default BranchStatusIcon
