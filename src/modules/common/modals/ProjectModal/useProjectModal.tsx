import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useModalHook, StepWizard, Button } from '@wings-software/uikit'
import { Dialog, Classes } from '@blueprintjs/core'
import { pick } from 'lodash-es'
import cx from 'classnames'

import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from 'services/cd-ng'
import { usePostProject, usePutProject } from 'services/cd-ng'
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
  const { accountId, orgId } = useParams()
  const [projectData, setProjectData] = useState<ProjectDTO>()
  const { mutate: createProject } = usePostProject({ orgIdentifier: orgId })
  const { mutate: updateProject } = usePutProject({
    orgIdentifier: orgId,
    projectIdentifier: projectData?.identifier || ''
  })

  const wizardCompleteHandler = async (wizardData: ProjectDTO | undefined): Promise<void> => {
    if (!wizardData) return
    const dataToSubmit: unknown = pick<ProjectDTO, keyof CreateProjectDTO>(wizardData, [
      'name',
      'color',
      'purposeList',
      'description',
      'tags'
    ])
    ;(dataToSubmit as CreateProjectDTO)['accountIdentifier'] = accountId
    ;(dataToSubmit as CreateProjectDTO)['owners'] = [accountId]

    try {
      switch (view) {
        case Views.CREATE:
          ;(dataToSubmit as CreateProjectDTO)['identifier'] = wizardData.identifier || ''
          await createProject(dataToSubmit as CreateProjectDTO)
          break
        case Views.EDIT:
          await updateProject(dataToSubmit as UpdateProjectDTO)
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
