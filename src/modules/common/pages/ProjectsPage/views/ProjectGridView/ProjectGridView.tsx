import React from 'react'
import { Layout } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { Project, useGetProjectList } from 'services/cd-ng'
import { Page } from 'modules/common/components/Page/Page'
import i18n from './ProjectGridView.i18n'
import ProjectCard from '../ProjectCard/ProjectCard'
import css from './ProjectGridView.module.scss'

interface ProjectGridViewProps {
  showEditProject?: (project: Project) => void
  collaborators?: (project: Project) => void
  searchParameter?: string
  orgFilterId?: string
  module?: Required<Project>['modules'][number]
  reloadPage?: ((value: React.SetStateAction<boolean>) => void) | undefined
  onCardClick?: ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
  openProjectModal?: (project?: Project | undefined) => void
  deSelectModule?: boolean
}

const ProjectGridView: React.FC<ProjectGridViewProps> = props => {
  const {
    showEditProject,
    collaborators,
    searchParameter,
    orgFilterId,
    module,
    reloadPage,
    onCardClick,
    openProjectModal,
    deSelectModule
  } = props
  const { accountId } = useParams()
  const { data, loading, refetch } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgFilterId == 'ALL' ? undefined : orgFilterId,
      moduleType: module,
      searchTerm: searchParameter,
      hasModule: deSelectModule ? false : true
    },
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
              onClick: () => openProjectModal?.(),
              className: css.pageContainer
            }
          : {
              when: () => !data?.data?.content?.length,
              icon: 'nav-project',
              message: i18n.noProject
            }
      }
    >
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
            onClick={onCardClick}
          />
        )}
        keyOf={(project: Project) => project.identifier}
      />
    </Page.Body>
  )
}

export default ProjectGridView
