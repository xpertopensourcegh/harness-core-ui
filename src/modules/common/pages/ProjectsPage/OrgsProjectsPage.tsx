import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Layout } from '@wings-software/uikit'

import { useGetProjectList } from 'services/cd-ng'
import type { Project } from 'services/cd-ng'

import { Page } from 'modules/common/exports'
import { useProjectModal } from 'modules/common/modals/ProjectModal/useProjectModal'
import { useAppStoreReader } from 'framework/exports'
import ProjectsGridView from './views/ProjectGridView/ProjectGridView'

import i18n from './ProjectsPage.i18n'
import css from './OrgsProjectsPage.module.scss'

const OrgProjectsListPage: React.FC = () => {
  const { accountId, orgId } = useParams()
  const { organisationsMap } = useAppStoreReader()

  const { loading: loading, data: data, refetch: reloadProjects } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgId
    }
  })

  const projectCreateSuccessHandler = (): void => {
    reloadProjects()
  }

  const { openProjectModal } = useProjectModal({
    onSuccess: projectCreateSuccessHandler
  })

  const showEditProject = (project: Project): void => {
    openProjectModal(project)
  }
  return (
    <>
      <Page.Header
        title={organisationsMap.get(orgId)?.name + ' / ' + i18n.projects.toUpperCase()}
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
        <ProjectsGridView data={data?.data} reload={reloadProjects} showEditProject={showEditProject} />
      </Page.Body>
    </>
  )
}

export default OrgProjectsListPage
