import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useModalHook, StepWizard, Button } from '@wings-software/uikit'
import { Dialog, Classes } from '@blueprintjs/core'
import { pick } from 'lodash-es'
import cx from 'classnames'

import type { ProjectDTO, CreateProjectDTO } from 'services/cd-ng'
import { useCreateProject, useUpdateProject } from 'services/cd-ng'
import { Views } from './Constants'
import CreateProject from './views/CreateProject'
import StepOne from './views/StepOne'
import StepTwo from './views/StepTwo'
import StepThree from './views/StepThree'

import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import css from './useProjectModal.module.scss'

export interface UseProjectModalProps {
  onSuccess: (project: ProjectDTO | undefined) => void
}

export interface UseProjectModalReturn {
  openProjectModal: (project?: ProjectDTO) => void
  closeProjectModal: () => void
}

export const useProjectModal = ({ onSuccess }: UseProjectModalProps): UseProjectModalReturn => {
  const [view, setView] = useState(Views.NEW_PROJECT)
  const { accountId } = useParams()
  const [projectData, setProjectData] = useState<ProjectDTO>()
  const { mutate: createProject } = useCreateProject({})
  const { mutate: updateProject } = useUpdateProject({ projectId: projectData?.id || '' })

  const wizardCompleteHandler = async (wizardData: ProjectDTO | undefined): Promise<void> => {
    if (!wizardData) return
    const dataToSubmit: CreateProjectDTO = pick<CreateProjectDTO, keyof CreateProjectDTO>(wizardData, [
      'accountId',
      'color',
      'description',
      'identifier',
      'name',
      'orgId',
      'tags'
    ])
    dataToSubmit.accountId = accountId
    dataToSubmit.owners = [accountId]

    try {
      switch (view) {
        case Views.NEW_PROJECT:
          await createProject(dataToSubmit)
          break
        case Views.EDIT:
          await updateProject(dataToSubmit)
          break
      }
      onSuccess(wizardData)
      setView(Views.NEW_PROJECT)
    } catch (e) {
      // display error using ModalErrorHandler
      // console.log(e?.data?.responseMessages)
    }
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          setView(Views.CREATE)
          hideModal()
        }}
        className={cx(css.dialog, Classes.DIALOG, { [Classes.DARK]: view === Views.NEW_PROJECT })}
      >
        {view === Views.NEW_PROJECT ? <CreateProject setView={setView} /> : null}
        {view === Views.CREATE || view === Views.EDIT ? (
          <StepWizard<ProjectDTO> onCompleteWizard={wizardCompleteHandler} initialStep={view === Views.EDIT ? 2 : 1}>
            <StepOne name={i18n.newProjectWizard.stepOne.name} />
            <StepTwo name={i18n.newProjectWizard.stepTwo.name} data={projectData} />
            <StepThree name={i18n.newProjectWizard.stepThree.name} data={projectData} />
          </StepWizard>
        ) : null}
        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            setView(Views.NEW_PROJECT)
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [view]
  )

  const open = useCallback(
    (_project?: ProjectDTO) => {
      if (_project) {
        setProjectData(_project)
        setView(Views.EDIT)
      }
      showModal()
    },
    [showModal]
  )

  return {
    openProjectModal: (project?: ProjectDTO) => open(project),
    closeProjectModal: hideModal
  }
}
