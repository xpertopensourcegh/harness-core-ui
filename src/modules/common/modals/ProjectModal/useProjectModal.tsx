import React, { useCallback, useState } from 'react'
import { useModalHook, StepWizard, Button } from '@wings-software/uikit'
import { Dialog, Classes } from '@blueprintjs/core'
import isEmpty from 'lodash/isEmpty'
import cx from 'classnames'
import type { Project } from 'services/cd-ng'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import { Views } from './Constants'
import Collaborators from './views/Collaborators'
import PurposeList from './views/PurposeList'
import AboutProject from './views/AboutProject'

import css from './useProjectModal.module.scss'

export interface UseProjectModalProps {
  onSuccess: (project: Project | undefined) => void
}

export interface UseProjectModalReturn {
  openProjectModal: (project?: Project) => void
  closeProjectModal: () => void
}

export const useProjectModal = ({ onSuccess }: UseProjectModalProps): UseProjectModalReturn => {
  const [view, setView] = useState(Views.CREATE)
  const [projectData, setProjectData] = useState<Project>()

  const wizardCompleteHandler = async (wizardData: Project | undefined): Promise<void> => {
    if (!wizardData || isEmpty(wizardData.modules)) {
      setView(Views.PURPOSE)
      setProjectData(wizardData)
    } else {
      hideModal()
    }
    onSuccess(wizardData)
  }
  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          setView(Views.CREATE)
          hideModal()
        }}
        className={cx(css.dialog, Classes.DIALOG, {
          [css.create]: view === Views.CREATE,
          [css.edit]: view === Views.EDIT,
          [css.purposeList]: view === Views.PURPOSE
        })}
      >
        {view === Views.CREATE ? (
          <StepWizard<Project> onCompleteWizard={wizardCompleteHandler} stepClassName={css.stepClass}>
            <AboutProject name={i18n.newProjectWizard.aboutProject.name} data={projectData} onSuccess={onSuccess} />
            <Collaborators name={i18n.newProjectWizard.Collaborators.name} data={projectData} />
          </StepWizard>
        ) : null}

        {view === Views.PURPOSE ? <PurposeList data={projectData} /> : null}

        {view === Views.EDIT ? <AboutProject data={projectData} closeModal={hideModal} onSuccess={onSuccess} /> : null}

        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            setView(Views.CREATE)
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [view, projectData]
  )

  const open = useCallback(
    (_project?: Project) => {
      setProjectData(_project)
      const isNew = !_project || !_project.identifier
      if (!isNew) {
        setView(Views.EDIT)
      } else setView(Views.CREATE)
      showModal()
    },
    [showModal]
  )

  return {
    openProjectModal: (project?: Project) => open(project),
    closeProjectModal: hideModal
  }
}
