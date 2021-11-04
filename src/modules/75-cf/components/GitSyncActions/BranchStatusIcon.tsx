import React, { ReactElement } from 'react'
import { Text, Color, Container, Icon, Utils } from '@wings-software/uicore'

import { useStrings } from 'framework/strings'
import css from './GitSyncActions.module.scss'

interface BranchStatusIconProps {
  isSettingsOpen: boolean
  branch: string
  isLoading: boolean
  isAutoCommitEnabled: boolean
}

const BranchStatusIcon = ({
  isSettingsOpen,
  branch,
  isAutoCommitEnabled,
  isLoading
}: BranchStatusIconProps): ReactElement => {
  const { getString } = useStrings()

  return (
    <Container className={css.gitStatusIcon}>
      <Utils.WrapOptionalTooltip
        tooltipProps={{
          isDark: true,
          disabled: isSettingsOpen
        }}
        tooltip={
          <Container padding="medium" data-testid="git-sync-status-tooltip">
            <Text color={Color.WHITE}>
              {getString('cf.gitSync.branchStatus', {
                branch,
                status: isAutoCommitEnabled ? 'ON' : 'OFF'
              })}
            </Text>
          </Container>
        }
      >
        {isLoading ? (
          <Icon name="steps-spinner" size={15} className={css.loadingSpinner} data-testid="git-sync-spinner" />
        ) : (
          <Icon
            data-testid="auto-commit-status-icon"
            name="full-circle"
            size={10}
            className={isAutoCommitEnabled ? css.autoCommitEnabled : css.autoCommitDisabled}
          />
        )}
      </Utils.WrapOptionalTooltip>
    </Container>
  )
}

export default BranchStatusIcon
