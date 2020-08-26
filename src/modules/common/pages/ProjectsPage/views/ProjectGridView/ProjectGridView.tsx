import React from 'react'
import { Layout } from '@wings-software/uikit'
import type { ProjectDTO, NGPageResponseProjectDTO } from 'services/cd-ng'
import ProjectCard from '../ProjectCard/ProjectCard'
import css from './ProjectGridView.module.scss'

interface ProjectGridViewProps {
  data?: NGPageResponseProjectDTO
  reload?: () => Promise<void>
  showEditProject?: (project: ProjectDTO) => void
  collaborators?: (project: ProjectDTO) => void
}

const ProjectGridView: React.FC<ProjectGridViewProps> = props => {
  const { data, reload, showEditProject, collaborators } = props

  return (
    <>
      <Layout.Masonry
        center
        gutter={25}
        width={900}
        className={css.centerContainer}
        items={data?.content || []}
        renderItem={(project: ProjectDTO) => (
          <ProjectCard
            data={project}
            reloadProjects={reload}
            editProject={showEditProject}
            collaborators={collaborators}
          />
        )}
        keyOf={(project: ProjectDTO) => project.id}
      />
    </>
  )
}

export default ProjectGridView
