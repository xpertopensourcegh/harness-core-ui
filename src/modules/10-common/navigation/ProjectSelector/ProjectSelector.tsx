import React from 'react'
import { useParams } from 'react-router-dom'
import { Select } from '@blueprintjs/select'
import { Classes, Button, MenuItem, Alignment } from '@blueprintjs/core'
import type { Project } from 'services/cd-ng'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import i18n from './ProjectSelector.i18n'
import css from './ProjectSelector.module.scss'

export interface ProjectSelectorProps {
  onSelect: (project: Project) => void
}

const ProjectSelect = Select.ofType<Project>()

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ onSelect }) => {
  const { projectIdentifier } = useParams()
  const { projects } = useAppStore()

  const projectSelectOptions: Project[] = React.useMemo(
    () =>
      (projects || []).sort(({ name: name1 = '' }, { name: name2 = '' }) => {
        // sort projects by name
        name1 = name1.toLocaleLowerCase()
        name2 = name2.toLocaleLowerCase()
        return name1 < name2 ? -1 : name1.length < name2.length ? 1 : name1 < name2 ? -1 : 1
      }),
    [projects]
  )

  const selectedProject = projectSelectOptions?.find(project => project.identifier === projectIdentifier)

  return (
    <ProjectSelect
      items={projectSelectOptions}
      popoverProps={{ minimal: true, className: Classes.DARK, fill: true }}
      onItemSelect={onSelect}
      itemPredicate={(query, item) => item.name.includes(query)}
      itemRenderer={(item, { handleClick, modifiers }) => (
        <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          text={item.name}
          key={item.name}
          onClick={handleClick}
        />
      )}
    >
      <Button
        minimal
        className={css.projectButton}
        text={selectedProject?.name || i18n.selectProject}
        rightIcon="caret-down"
        alignText={Alignment.LEFT}
      />
    </ProjectSelect>
  )
}
