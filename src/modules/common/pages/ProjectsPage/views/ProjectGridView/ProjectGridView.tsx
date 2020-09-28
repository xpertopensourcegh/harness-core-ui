import React, { useState } from 'react'
import { Container, Layout, Pagination } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { Project, useGetProjectList, ResponsePageProject } from 'services/cd-ng'
import { Page } from 'modules/common/components/Page/Page'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import i18n from './ProjectGridView.i18n'
import ProjectCard from '../ProjectCard/ProjectCard'
import css from './ProjectGridView.module.scss'

interface ProjectGridViewProps {
  mockData?: UseGetMockData<ResponsePageProject>
  showEditProject?: (project: Project) => void
  collaborators?: (project: Project) => void
  searchParameter?: string
  orgFilterId?: string
  module?: Required<Project>['modules'][number]
  reloadPage?: ((value: React.SetStateAction<boolean>) => void) | undefined
  onCardClick?: ((project: Project) => void) | undefined
  openProjectModal?: (project?: Project | undefined) => void
  deselectModule?: boolean
  className?: string
  pageSize?: number
}

const ProjectGridView: React.FC<ProjectGridViewProps> = props => {
  const {
    mockData,
    showEditProject,
    collaborators,
    searchParameter,
    orgFilterId,
    module,
    reloadPage,
    onCardClick,
    openProjectModal,
    deselectModule,
    className,
    pageSize
  } = props
  const [page, setPage] = useState(0)
  const { accountId } = useParams()
  const { data, loading, refetch } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgFilterId == 'ALL' ? undefined : orgFilterId,
      moduleType: module,
      searchTerm: searchParameter,
      hasModule: deselectModule ? false : true,
      pageIndex: page,
      pageSize: pageSize || 10
    },
    mock: mockData,
    debounce: 300
  })

  if (reloadPage) {
    refetch()
    reloadPage(false)
  }

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
      className={className || cx(css.pageContainer, { [css.moduleContainer]: module ? true : false })}
    >
      <Container height="90%">
        <Layout.Masonry
          center
          gutter={25}
          width={900}
          className={css.centerContainer}
          items={data?.data?.content || []}
          renderItem={(project: Project) => (
            <ProjectCard
              data={project}
              reloadProjects={refetch}
              editProject={showEditProject}
              collaborators={collaborators}
              onClick={() => {
                onCardClick?.(project)
              }}
            />
          )}
          keyOf={(project: Project) => project.identifier}
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
