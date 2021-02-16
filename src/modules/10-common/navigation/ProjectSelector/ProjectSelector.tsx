import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Select } from '@blueprintjs/select'
import { Classes, Button, MenuItem, Alignment } from '@blueprintjs/core'
import { Text, Layout, Color } from '@wings-software/uicore'
import { Project, useGetProjectList } from 'services/cd-ng'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import css from './ProjectSelector.module.scss'

export interface ProjectSelectorProps {
  onSelect: (project: Project) => void
  moduleFilter: Required<Project>['modules'][0]
}

const ProjectSelect = Select.ofType<Project>()

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ onSelect, moduleFilter }) => {
  const { accountId } = useParams()
  const { selectedProject, updateAppStore } = useAppStore()
  const { getString } = useStrings()
  const [searchTerm, setSearchTerm] = useState<string>()
  const { data } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId,
      moduleType: moduleFilter,
      searchTerm: searchTerm,
      pageSize: 10
    },
    debounce: 300
  })

  let projects = data?.data?.content?.map(response => response.project)

  if (data?.data?.totalItems && data.data.totalItems > 10) {
    projects = projects?.concat({
      name: getString('more', { number: data.data.totalItems - 10 }),
      identifier: '$disabled$'
    })
  }

  useEffect(() => {
    if (!selectedProject?.modules?.includes(moduleFilter)) {
      updateAppStore({ selectedProject: undefined })
    }
  }, [moduleFilter])

  return (
    <ProjectSelect
      items={projects || []}
      className={css.projectSelect}
      popoverProps={{ minimal: true, className: Classes.DARK, fill: true, usePortal: false }}
      onItemSelect={onSelect}
      onQueryChange={query => {
        setSearchTerm(query)
      }}
      itemRenderer={(item, { handleClick }) => (
        <MenuItem
          disabled={item.identifier === '$disabled$'}
          text={
            <Layout.Vertical>
              <Text color={Color.WHITE}>{item.name}</Text>
              <Text font={{ size: 'small' }}>{item.orgIdentifier}</Text>
            </Layout.Vertical>
          }
          key={item.name}
          onClick={handleClick}
        />
      )}
      noResults={<Text padding="small">{getString('noSearchResultsFoundPeriod')}</Text>}
      inputProps={{
        placeholder: getString('projectSelector.placeholder', { number: data?.data?.totalItems })
      }}
    >
      <Button
        minimal
        className={css.projectButton}
        text={
          selectedProject ? (
            <Text lineClamp={1} color={Color.WHITE}>
              {selectedProject?.name}
            </Text>
          ) : (
            getString('selectProject')
          )
        }
        rightIcon="caret-down"
        alignText={Alignment.LEFT}
      />
    </ProjectSelect>
  )
}
