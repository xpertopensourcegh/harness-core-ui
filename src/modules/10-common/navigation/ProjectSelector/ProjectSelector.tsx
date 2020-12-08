import React from 'react'
import { useParams } from 'react-router-dom'
import { Select } from '@blueprintjs/select'
import { Classes, Button, MenuItem, Alignment } from '@blueprintjs/core'
import { Text } from '@wings-software/uikit'
import type { Project } from 'services/cd-ng'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import css from './ProjectSelector.module.scss'

export interface ProjectSelectorProps {
  onSelect: (project: Project) => void
  moduleFilter?: Required<Project>['modules'][0]
}

const ProjectSelect = Select.ofType<Project>()

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ onSelect, moduleFilter }) => {
  const { projectIdentifier } = useParams()
  const { projects } = useAppStore()
  const { getString } = useStrings()

  const projectSelectOptions: Project[] = React.useMemo(
    () =>
      projects
        // filter on module
        .filter(({ modules }) => (moduleFilter ? modules && modules.indexOf(moduleFilter) > -1 : true))
        // sort on name
        .sort(({ name: name1 = '' }, { name: name2 = '' }) => {
          name1 = name1.toLocaleLowerCase()
          name2 = name2.toLocaleLowerCase()
          return name1 < name2
            ? -1
            : /* istanbul ignore next */
            name1.length < name2.length
            ? 1
            : name1 < name2
            ? -1
            : 1
        }),
    [projects]
  )

  const selectedProject = projectSelectOptions?.find(project => project.identifier === projectIdentifier)

  return (
    <ProjectSelect
      items={projectSelectOptions}
      className={css.projectSelect}
      popoverProps={{ minimal: true, className: Classes.DARK, fill: true, usePortal: false }}
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
      noResults={<Text padding="small">{getString('noSearchResultsFoundPeriod')}</Text>}
    >
      <Button
        minimal
        className={css.projectButton}
        text={/* istanbul ignore next */ selectedProject?.name || getString('selectProject')}
        rightIcon="caret-down"
        alignText={Alignment.LEFT}
      />
    </ProjectSelect>
  )
}
