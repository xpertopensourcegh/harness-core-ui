import { Color, Container } from '@wings-software/uicore'
import React, { ReactElement } from 'react'
import type { UseGitSync } from '@cf/hooks/useGitSync'
import GitSyncActions from '../GitSyncActions/GitSyncActions'

interface TargetManagementToolbarProps {
  gitSync: UseGitSync
}

const TargetManagementToolbar = ({ gitSync }: TargetManagementToolbarProps): ReactElement => {
  return (
    <Container border={{ bottom: true, style: 'solid', color: Color.GREY_200 }}>
      <Container
        flex={{ justifyContent: 'space-between', alignItems: 'center' }}
        width={230}
        margin={{ left: 'xxlarge', top: 'large', bottom: 'large' }}
      >
        <GitSyncActions
          isLoading={gitSync.gitSyncLoading}
          branch={gitSync.gitRepoDetails?.branch || ''}
          repository={gitSync.gitRepoDetails?.repoIdentifier || ''}
          isAutoCommitEnabled={gitSync.isAutoCommitEnabled}
          isGitSyncPaused={gitSync.isGitSyncPaused}
          handleToggleAutoCommit={gitSync.handleAutoCommit}
          handleGitPause={gitSync.handleGitPause}
        />
      </Container>
    </Container>
  )
}

export default TargetManagementToolbar
