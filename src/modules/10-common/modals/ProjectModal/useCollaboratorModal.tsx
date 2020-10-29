import React, { useCallback, useState } from 'react'
import { useModalHook, Button } from '@wings-software/uikit'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'
import type { Project } from 'services/cd-ng'
import Collaborators from './views/Collaborators'

import css from './useProjectModal.module.scss'

export interface UseCollaboratorModalReturn {
  openCollaboratorModal: (project?: Project) => void
  closeCollaboratorModal: () => void
}

export const useCollaboratorModal = (): UseCollaboratorModalReturn => {
  const [projectData, setProjectData] = useState<Project>()

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen={true} onClose={hideModal} className={cx(css.dialog, Classes.DIALOG, css.collaborators)}>
        <Collaborators identifier={projectData?.identifier} orgIdentifier={projectData?.orgIdentifier} />
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    [projectData]
  )

  const open = useCallback(
    (_project?: Project) => {
      setProjectData(_project)
      showModal()
    },
    [showModal]
  )

  return {
    openCollaboratorModal: (project?: Project) => open(project),
    closeCollaboratorModal: hideModal
  }
}
