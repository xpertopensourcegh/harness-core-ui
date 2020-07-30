import React, { useCallback, useState } from 'react'
import { useModalHook, StepWizard, Button, Container } from '@wings-software/uikit'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'

import type { ProjectDTO } from 'services/cd-ng'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import { Views } from './Constants'
import Collaborators from './views/Collaborators'
import PurposeList from './views/PurposeList'
import AboutProject from './views/AboutProject'

import css from './useProjectModal.module.scss'

export interface UseProjectModalProps {
  onSuccess: (project: ProjectDTO | undefined) => void
}

export interface UseProjectModalReturn {
  openProjectModal: (project?: ProjectDTO) => void
  closeProjectModal: () => void
}

export const useProjectModal = ({ onSuccess }: UseProjectModalProps): UseProjectModalReturn => {
  const [view, setView] = useState(Views.CREATE)
  const [projectData, setProjectData] = useState<ProjectDTO>()

  const wizardCompleteHandler = async (wizardData: ProjectDTO | undefined): Promise<void> => {
    setView(Views.PURPOSE)
    setProjectData(wizardData)
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
          <StepWizard<ProjectDTO> onCompleteWizard={wizardCompleteHandler}>
            <AboutProject name={i18n.newProjectWizard.stepTwo.name} data={projectData} onSuccess={onSuccess} />
            <Collaborators name={i18n.newProjectWizard.Collaborators.name} data={projectData} />
          </StepWizard>
        ) : null}

        {view === Views.PURPOSE ? <PurposeList data={projectData} /> : null}

        {view === Views.EDIT ? (
          <Container padding="large">
            <AboutProject
              name={i18n.newProjectWizard.stepTwo.name}
              data={projectData}
              closeModal={hideModal}
              onSuccess={onSuccess}
            />
          </Container>
        ) : null}

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
    (_project?: ProjectDTO) => {
      setProjectData(_project)
      if (_project) {
        setView(Views.EDIT)
      } else setView(Views.CREATE)
      showModal()
    },
    [showModal]
  )

  return {
    openProjectModal: (project?: ProjectDTO) => open(project),
    closeProjectModal: hideModal
  }
}
