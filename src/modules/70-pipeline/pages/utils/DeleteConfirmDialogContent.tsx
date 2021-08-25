import React from 'react'
import { TextArea } from '@blueprintjs/core'
import { Text } from '@wings-software/uicore'
import type { EntityGitDetails } from 'services/pipeline-ng'
import { useStrings } from 'framework/strings'

interface DeleteConfirmDialogContentProps {
  gitDetails?: EntityGitDetails
  entityName: string
  commitMsg: string
  onCommitMsgChange: (commitMsg: string) => void
  entityType: string
}

export const DeleteConfirmDialogContent: React.FC<DeleteConfirmDialogContentProps> = ({
  gitDetails = {},
  entityName = '',
  commitMsg,
  onCommitMsgChange,
  entityType = ''
}): JSX.Element => {
  const { getString } = useStrings()

  return (
    <div className={'pipelineDeleteDialog'}>
      <Text margin={{ bottom: 'medium' }} title={entityName}>{`${getString(
        'pipeline-list.confirmDelete'
      )} ${entityType} ${entityName}?`}</Text>
      {gitDetails?.objectId && (
        <>
          <Text>{getString('common.git.commitMessage')}</Text>
          <TextArea
            value={commitMsg}
            onInput={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              onCommitMsgChange(event.target.value)
            }}
          />
        </>
      )}
    </div>
  )
}
