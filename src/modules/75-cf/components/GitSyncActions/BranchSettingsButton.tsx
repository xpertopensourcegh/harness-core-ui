import React, { ReactElement } from 'react'
import cx from 'classnames'

import { PopoverPosition } from '@blueprintjs/core'
import { Text, Color, Container, Button, Icon } from '@wings-software/uicore'
import SettingsMenu from './SettingsMenu'
import BranchStatusIcon from './BranchStatusIcon'
import css from './GitSyncActions.module.scss'

interface BranchSettingsProps {
  isSettingsOpen: boolean
  handleToggleAutoCommit: (newAutoCommitValue: boolean) => void
  handleGitPause: (newGitPauseValue: boolean) => void
  setIsSettingsOpen: (isOpen: boolean) => void
  branch: string
  isLoading: boolean
  isAutoCommitEnabled: boolean
  isGitSyncPaused: boolean
}

const BranchSettingsButton = (props: BranchSettingsProps): ReactElement => {
  const { isSettingsOpen, setIsSettingsOpen, branch } = props

  return (
    <Button
      noStyling
      className={cx(css.branchActionButton, isSettingsOpen && css.branchActionButtonActive)}
      tooltipProps={{
        fill: true,
        interactionKind: 'click',
        minimal: true,
        position: PopoverPosition.BOTTOM_LEFT,
        isOpen: isSettingsOpen,
        onInteraction: nextOpenState => setIsSettingsOpen(nextOpenState)
      }}
      tooltip={<SettingsMenu {...props} />}
    >
      <Container className={css.branchActionButtonWrapper}>
        <Icon name="git-new-branch" size={15} />
        <Text color={Color.GREY_900}>{branch}</Text>
        <BranchStatusIcon {...props} />
      </Container>
    </Button>
  )
}

export default BranchSettingsButton
