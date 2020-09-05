import React from 'react'
import { Select, SelectOption } from '@wings-software/uikit'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import cx from 'classnames'
import { routeParams, useAppStoreReader, ModuleName } from 'framework/exports'
import type { Project } from 'services/cd-ng'
import i18n from './ProjectSelector.i18n'
import css from './ProjectSelector.module.scss'

type ProjectListOptions = SelectOption & Project

export interface ProjectSelectorProps {
  module: ModuleName.CD | ModuleName.CV | ModuleName.CE | ModuleName.CI | ModuleName.CF
  onSelect: (project: Project) => void
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ module, onSelect }) => {
  const {
    params: { projectIdentifier }
  } = routeParams()
  const [selectedProject, setSelectedProject] = React.useState<ProjectListOptions | undefined>()
  const { projects } = useAppStoreReader()
  const projectSelectOptions: ProjectListOptions[] = React.useMemo(
    () =>
      projects
        .filter(project => project.modules?.includes?.(module))
        .sort(({ name: name1 = '' }, { name: name2 = '' }) => {
          // sort projects by name
          name1 = name1.toLocaleLowerCase()
          name2 = name2.toLocaleLowerCase()
          return name1 < name2 ? -1 : name1.length < name2.length ? 1 : name1 < name2 ? -1 : 1
        })
        .reduce((values, project) => {
          values.push({
            ...project,
            label: project.name || '',
            value: project.identifier || '',
            icon: { name: 'nav-project-hover' } as IconProps
          })
          return values
        }, [] as ProjectListOptions[]),
    [projects, module]
  )

  React.useEffect(() => {
    if (projectIdentifier) {
      setSelectedProject(projectSelectOptions.find(project => project.identifier === projectIdentifier))
    } else {
      setSelectedProject(undefined)
    }
  }, [projectSelectOptions, projectIdentifier])

  return (
    <Select
      className={cx(css.projectSelector, !selectedProject && css.noSelected)}
      items={projectSelectOptions}
      value={selectedProject}
      inputProps={{
        placeholder: i18n.selectProject
      }}
      onChange={item => {
        setSelectedProject(item)
        onSelect(item as Project)
      }}
    />
  )
}
