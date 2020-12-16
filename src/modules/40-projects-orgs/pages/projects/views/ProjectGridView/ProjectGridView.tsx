import React, { useEffect, useState } from 'react'
import { Container, Layout, Pagination } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { Project, useGetProjectAggregateDTOList, ProjectAggregateDTO } from 'services/cd-ng'
import { Page } from '@common/components/Page/Page'
import ProjectCard from '@projects-orgs/components/ProjectCard/ProjectCard'
import i18n from './ProjectGridView.i18n'
import css from './ProjectGridView.module.scss'

interface ProjectGridViewProps {
  showEditProject?: (project: Project) => void
  collaborators?: (project: Project) => void
  searchParameter?: string
  orgFilterId?: string
  module?: Required<Project>['modules'][number]
  reloadPage?: ((value: React.SetStateAction<boolean>) => void) | undefined
  openProjectModal?: (project?: Project | undefined) => void
  deselectModule?: boolean
}

const ProjectGridView: React.FC<ProjectGridViewProps> = props => {
  const {
    showEditProject,
    collaborators,
    searchParameter,
    orgFilterId,
    module,
    reloadPage,
    openProjectModal,
    deselectModule
  } = props
  const [page, setPage] = useState(0)
  const { accountId } = useParams()
  const { data, loading, refetch } = useGetProjectAggregateDTOList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgFilterId == 'ALL' ? undefined : orgFilterId,
      moduleType: module,
      searchTerm: searchParameter,
      hasModule: deselectModule ? false : true,
      pageIndex: page,
      pageSize: 10
    },
    debounce: 300
  })

  /* istanbul ignore else */ if (reloadPage) {
    refetch()
    reloadPage(false)
  }

  useEffect(() => {
    setPage(0)
  }, [searchParameter, orgFilterId])

  return (
    <Page.Body
      loading={loading}
      retryOnError={() => refetch()}
      noData={
        !searchParameter && openProjectModal
          ? {
              when: () => !data?.data?.content?.length,
              icon: 'nav-project',
              message: i18n.aboutProject,
              buttonText: i18n.addProject,
              onClick: () => openProjectModal?.()
            }
          : {
              when: () => !data?.data?.content?.length,
              icon: 'nav-project',
              message: i18n.noProject
            }
      }
      className={css.pageContainer}
    >
      <Container height="90%">
        <Layout.Masonry
          center
          gutter={25}
          className={css.centerContainer}
          items={data?.data?.content || []}
          renderItem={(projectDTO: ProjectAggregateDTO) => (
            <ProjectCard
              data={projectDTO}
              reloadProjects={refetch}
              editProject={showEditProject}
              handleInviteCollaborators={collaborators}
            />
          )}
          keyOf={(projectDTO: ProjectAggregateDTO) => projectDTO.projectResponse.project.identifier}
        />
      </Container>
      <Container height="10%" className={css.pagination}>
        <Pagination
          itemCount={data?.data?.totalItems || 0}
          pageSize={data?.data?.pageSize || 10}
          pageCount={data?.data?.totalPages || 0}
          pageIndex={data?.data?.pageIndex || 0}
          gotoPage={(pageNumber: number) => setPage(pageNumber)}
        />
      </Container>
    </Page.Body>
  )
}

export default ProjectGridView
