import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Layout } from '@wings-software/uikit'

import { useGetProjectListForOrganization, useGetOrganization } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'

import { Page } from 'modules/common/exports'
import { useProjectModal } from 'modules/common/modals/ProjectModal/useProjectModal'
import ProjectsGridView from './views/ProjectGridView/ProjectGridView'

import i18n from './ProjectsPage.i18n'
import css from './OrgsProjectsPage.module.scss'

const OrgProjectsListPage: React.FC = () => {
  const { accountId, orgId } = useParams()

  const { loading: loading, data: data, refetch: reloadProjects } = useGetProjectListForOrganization({
    orgIdentifier: orgId
  })

  const { data: orgData } = useGetOrganization({ accountIdentifier: accountId, orgIdentifier: orgId })
  const projectCreateSuccessHandler = (): void => {
    reloadProjects()
  }

  const { openProjectModal } = useProjectModal({
    onSuccess: projectCreateSuccessHandler
  })

  const showEditProject = (project: ProjectDTO): void => {
    openProjectModal(project)
  }
  return (
    <>
      <Page.Header
        title={orgData?.data?.name?.toUpperCase() + ' / ' + i18n.projects.toUpperCase()}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="xlarge" padding={{ right: 'medium' }}>
              <Button text="New Project" icon="plus" onClick={() => openProjectModal()} />
            </Layout.Horizontal>
          </Container>
        }
      />

      <Page.Body
        loading={loading}
        retryOnError={() => reloadProjects()}
        noData={{
          when: () => !data?.data?.content?.length,
          icon: 'nav-project',
          message: i18n.aboutProject,
          buttonText: i18n.addProject,
          onClick: () => openProjectModal(),
          className: css.pageContainer
        }}
      >
        <ProjectsGridView data={data?.data?.content} reload={reloadProjects} showEditProject={showEditProject} />
      </Page.Body>
    </>
  )
}

export default OrgProjectsListPage
