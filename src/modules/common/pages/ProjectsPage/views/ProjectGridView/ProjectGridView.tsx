import React from 'react'
import { Layout } from '@wings-software/uikit'
import type { ProjectDTO } from 'services/cd-ng'
import ProjectCard from '../ProjectCard/ProjectCard'
import css from './ProjectGridView.module.scss'

interface ProjectGridViewProps {
  data: ProjectDTO[] | undefined
  reload?: () => Promise<void>
  showEditProject?: (project: ProjectDTO) => void
}

const ProjectGridView: React.FC<ProjectGridViewProps> = props => {
  const { data, reload, showEditProject } = props

  return (
    <>
      <Layout.Masonry
        gutter={25}
        width={900}
        className={css.centerContainer}
        items={data || []}
        renderItem={(project: ProjectDTO) => (
          <ProjectCard data={project} reloadProjects={reload} editProject={showEditProject} />
        )}
        keyOf={(project: ProjectDTO) => project.id}
      />
    </>
  )
}

export default ProjectGridView
