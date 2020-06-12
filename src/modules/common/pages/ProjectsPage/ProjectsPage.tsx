import React, { useState, useEffect } from 'react'
import { useModalHook, Button, StepWizard, Text, Container, Layout } from '@wings-software/uikit'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'

import { Page } from 'modules/common/exports'
import { getProjects, createProject } from 'modules/common/services/ProjectsService'
import ProjectCard from './views/ProjectCard/ProjectCard'
import CreateProject from './views/CreateProject'
import StepOne, { StepOneData } from './views/StepOne'
import StepTwo, { StepTwoData } from './views/StepTwo'
import StepThree, { StepThreeData } from './views/StepThree'
import i18n from './ProjectsPage.i18n'
import { Views } from './Constants'

import css from './ProjectsPage.module.scss'
// import type { ProjectDTO } from '@wings-software/swagger-ts/definitions'
// TODO replace with actual swagger type
import type { ProjectDTO } from './views/ProjectCard/ProjectCard'

export type SharedData = StepOneData & StepTwoData & StepThreeData

interface ProjectCardsProps {
  projects: ProjectDTO[]
}

const ProjectCards: React.FC<ProjectCardsProps> = ({ projects }) => {
  return (
    <Layout.Masonry
      items={projects}
      renderItem={(project: ProjectDTO) => {
        return <ProjectCard data={project} className={css.projectCard} />
      }}
      keyOf={(project: ProjectDTO) => project.uuid}
    />
  )
}

const ProjectsListPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<ProjectDTO[]>([])
  const [view, setView] = useState(Views.NEW_PROJECT)

  const fetchProjects = async () => {
    setLoading(true)
    const { response } = await getProjects()
    setLoading(false)
    if (response && response instanceof Array) {
      setProjects(response)
    }
  }

  const wizardCompleteHandler = async (data: SharedData | undefined) => {
    const { errors } = await createProject(data as ProjectDTO)
    if (!errors) {
      hideModal()
      fetchProjects()
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

  useEffect(() => {
    fetchProjects()
  }, [])

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
        <Page.Body center>
          <Text>{i18n.loading}</Text>
        </Page.Body>
      ) : projects.length > 0 ? (
        <Page.Body>
          <ProjectCards projects={projects} />
        </Page.Body>
      ) : (
        <Page.Body center>
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
