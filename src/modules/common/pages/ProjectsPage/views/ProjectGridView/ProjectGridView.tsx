import React from 'react'
import { Layout } from '@wings-software/uikit'
import type { Project, NGPageResponseProject } from 'services/cd-ng'
import ProjectCard from '../ProjectCard/ProjectCard'
import css from './ProjectGridView.module.scss'

interface ProjectGridViewProps {
  data?: NGPageResponseProject
  reload?: () => Promise<void>
  showEditProject?: (project: Project) => void
  collaborators?: (project: Project) => void
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
        renderItem={(project: Project) => (
          <ProjectCard
            data={project}
            reloadProjects={reload}
            editProject={showEditProject}
            collaborators={collaborators}
          />
        )}
        keyOf={(project: Project) => project.identifier}
      />
    </>
  )
}

export default ProjectGridView
