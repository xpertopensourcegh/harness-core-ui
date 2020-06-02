import React, { useState, useEffect } from 'react'
import { useModalHook, Button, StepWizard, Icon, Text, Card, Layout } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import cx from 'classnames'

import { getProjects, createProject } from 'modules/common/services/ProjectsService'
import ProjectCard from './views/ProjectCard/ProjectCard'
import StepOne from './views/StepOne'
import StepTwo, { StepTwoData } from './views/StepTwo'
import StepThree, { StepThreeData } from './views/StepThree'
import i18n from './ProjectsPage.i18n'

import css from './ProjectsPage.module.scss'
// import type { ProjectDTO } from '@wings-software/swagger-ts/definitions'
// TODO replace with actual swagger type
import type { ProjectDTO } from './views/ProjectCard/ProjectCard'

export type SharedData = StepTwoData & StepThreeData

const ProjectsListPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<ProjectDTO[]>([])

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
      hideLightModal()
      fetchProjects()
    }
  }

  const [openLightModal, hideLightModal] = useModalHook(() => (
    <Dialog isOpen={true} style={{ borderLeft: 'none', paddingBottom: 0, width: 1000, position: 'relative' }}>
      <StepWizard<SharedData> onCompleteWizard={wizardCompleteHandler}>
        <StepOne name={i18n.newProjectWizard.stepOne.name} />
        <StepTwo name={i18n.newProjectWizard.stepTwo.name} />
        <StepThree name={i18n.newProjectWizard.stepThree.name} />
      </StepWizard>
      <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideLightModal} className={css.crossIcon} />
    </Dialog>
  ))

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <Layout.Vertical spacing="large" style={{ padding: 'var(--spacing-large)' }}>
      <Text font="medium">PROJECTS</Text>
      {loading ? (
        <Text>{i18n.loading}</Text>
      ) : projects.length > 0 ? (
        <div>
          <Card className={cx(css.addProjectCard, css.projectCard)} interactive={true} onClick={openLightModal}>
            <Layout.Vertical spacing="large" style={{ alignItems: 'center' }}>
              <Icon name="document" size={32} />
              <Text>{i18n.addProject}</Text>
            </Layout.Vertical>
          </Card>
          {projects.map(project => {
            return <ProjectCard key={project.uuid} data={project} className={css.projectCard} />
          })}
        </div>
      ) : (
        <Layout.Vertical spacing="large" style={{ alignItems: 'center', padding: '150px 0' }}>
          <Icon name="layers" size={50} />
          <Text font="medium">{i18n.aboutProject}</Text>
          <Button intent="primary" text={i18n.newProject} onClick={openLightModal} />
        </Layout.Vertical>
      )}
    </Layout.Vertical>
  )
}

export default ProjectsListPage
