import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Layout } from '@wings-software/uikit'

import type { Project } from 'services/cd-ng'

import { Page } from '@common/exports'
import { useAppStoreReader } from 'framework/exports'
import { useProjectModal } from '@projects-orgs/modals/ProjectModal/useProjectModal'
import { useCollaboratorModal } from '@projects-orgs/modals/ProjectModal/useCollaboratorModal'
import ProjectsGridView from './views/ProjectGridView/ProjectGridView'

import i18n from './ProjectsPage.i18n'
import css from './OrgsProjectsPage.module.scss'

const OrgProjectsListPage: React.FC = () => {
  const { orgIdentifier } = useParams()
  const { organisationsMap } = useAppStoreReader()
  const [reloadOrgPage, setReloadOrgPage] = useState(false)

  const projectCreateSuccessHandler = (): void => {
    setReloadOrgPage(true)
  }

  const { openProjectModal } = useProjectModal({
    onSuccess: projectCreateSuccessHandler
  })

  const showEditProject = (project: Project): void => {
    openProjectModal(project)
  }

  const { openCollaboratorModal } = useCollaboratorModal()

  const showCollaborators = (project: Project): void => {
    openCollaboratorModal(project)
  }

  return (
    <>
      <Page.Header
        title={organisationsMap.get(orgIdentifier)?.name + ' / ' + i18n.projects.toUpperCase()}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="xlarge" padding={{ right: 'medium' }}>
              <Button text="New Project" icon="plus" onClick={() => openProjectModal()} />
            </Layout.Horizontal>
          </Container>
        }
      />

      <Page.Body className={css.pageContainer}>
        <ProjectsGridView
          showEditProject={showEditProject}
          collaborators={showCollaborators}
          orgFilterId={orgIdentifier}
          reloadPage={reloadOrgPage ? setReloadOrgPage : undefined}
        />
      </Page.Body>
    </>
  )
}

export default OrgProjectsListPage
