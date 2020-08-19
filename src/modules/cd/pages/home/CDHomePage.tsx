import React from 'react'
import { Container, Layout, Text, Heading, Icon, Button, Color } from '@wings-software/uikit'
import { useAppStoreReader, useAppStoreWriter, ModuleName } from 'framework/exports'
import type { ProjectDTO, NGPageResponseProjectDTO } from 'services/cd-ng'
import { useProjectModal } from 'modules/common/modals/ProjectModal/useProjectModal'
import { Page } from 'modules/common/exports'
import ProjectGridView from '../../../common/pages/ProjectsPage/views/ProjectGridView/ProjectGridView'
import i18n from './CDHomePage.i18n'

const CDHomePage: React.FC = () => {
  const { projects } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()
  const { openProjectModal } = useProjectModal({
    onSuccess: (project?: ProjectDTO): void => {
      if (project) {
        const index = projects.findIndex(p => p.identifier === project.identifier)
        projects.splice(index, 1, project)
        updateAppStore({ projects: ([] as ProjectDTO[]).concat(projects) })
      }
    }
  })
  const showEditProject = (project: ProjectDTO): void => {
    openProjectModal(project)
  }
  const onDeleted = (project: ProjectDTO): void => {
    const index = projects.findIndex(p => p.identifier === project.identifier)
    projects.splice(index, 1)
    updateAppStore({ projects: ([] as ProjectDTO[]).concat(projects) })
  }

  return (
    <Page.Body filled>
      <Container style={{ marginBottom: 10 }}>
        <Layout.Vertical flex style={{ alignItems: 'center', marginTop: 60 }}>
          <Heading font={{ weight: 'bold', size: 'large' }} color="black">
            {i18n.welcomeToCD}
          </Heading>
          <Text color={Color.GREY_400} padding="small" style={{ paddingTop: 20 }}>
            {i18n.deployYourService}
          </Text>
          <Icon name="nav-cd" size={200} />
          <Button
            intent="primary"
            text={i18n.newProject}
            onClick={() => openProjectModal(({ modules: [ModuleName.CD] } as unknown) as ProjectDTO)}
          />
          <Text color={Color.GREY_400} padding="large">
            {i18n.startYourTrial}
          </Text>
        </Layout.Vertical>
      </Container>
      <Container style={{ borderTop: '1px solid var(--grey-300)', maxWidth: 900, margin: '0 auto' }}>
        <Text padding="xlarge" font={{ align: 'center' }} color={Color.BLACK} style={{ paddingBottom: 0 }}>
          {i18n.addCdToExistingProject}
        </Text>
        <ProjectGridView
          data={{ content: projects } as NGPageResponseProjectDTO}
          showEditProject={showEditProject}
          onDeleted={onDeleted}
        />
      </Container>
    </Page.Body>
  )
}

export default CDHomePage
