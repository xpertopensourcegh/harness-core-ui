import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useModalHook, Button, StepWizard, Text, Container, Layout } from '@wings-software/uikit'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'
import { pick } from 'lodash-es'
import { useGetProjects, useCreateProject } from 'services/cd-ng'
import type { ProjectDTO, CreateProjectDTO } from 'services/cd-ng'

import { Page } from 'modules/common/exports'
import ProjectCard from './views/ProjectCard/ProjectCard'
import CreateProject from './views/CreateProject'
import StepOne, { StepOneData } from './views/StepOne'
import StepTwo, { StepTwoData } from './views/StepTwo'
import StepThree, { StepThreeData } from './views/StepThree'
import i18n from './ProjectsPage.i18n'
import { Views } from './Constants'

import css from './ProjectsPage.module.scss'

export type SharedData = StepOneData & StepTwoData & StepThreeData

const ProjectsListPage: React.FC = () => {
  const [view, setView] = useState(Views.NEW_PROJECT)
  const { accountId } = useParams()
  const { loading, data, refetch: reloadProjects } = useGetProjects({})
  const { mutate: createProject } = useCreateProject({})

  const wizardCompleteHandler = async (wizardData: SharedData | undefined): Promise<void> => {
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
      await createProject(dataToSubmit)
      hideModal()
      reloadProjects()
    } catch (e) {
      // display error using ModalErrorHandler
      // console.log(e?.data?.responseMessages)
    }
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen={true} className={cx(css.dialog, Classes.DIALOG, { [Classes.DARK]: view === Views.NEW_PROJECT })}>
        {view === Views.NEW_PROJECT ? <CreateProject setView={setView} /> : null}
        {view === Views.CREATE ? (
          <StepWizard<SharedData> onCompleteWizard={wizardCompleteHandler}>
            <StepOne name={i18n.newProjectWizard.stepOne.name} />
            <StepTwo name={i18n.newProjectWizard.stepTwo.name} />
            <StepThree name={i18n.newProjectWizard.stepThree.name} />
          </StepWizard>
        ) : null}
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    [view]
  )

  return (
    <>
      <Page.Header
        title={i18n.projects.toUpperCase()}
        toolbar={
          <Container>
            <Button text={i18n.addProject} onClick={showModal} />
          </Container>
        }
      />

      {loading ? (
        <Page.Body>
          <Text>{i18n.loading}</Text>
        </Page.Body>
      ) : data && data.content && data.content.length > 0 ? (
        <Page.Body>
          <Layout.Masonry
            items={data.content}
            renderItem={(project: ProjectDTO) => <ProjectCard data={project} className={css.projectCard} />}
            keyOf={(project: ProjectDTO) => project.id}
          />
        </Page.Body>
      ) : (
        <Page.Body>
          <Page.NoDataCard
            icon="nav-project"
            message={i18n.aboutProject}
            buttonText={i18n.addProject}
            onClick={showModal}
          />
        </Page.Body>
      )}
    </>
  )
}

export default ProjectsListPage
