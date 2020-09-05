import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Text, Layout, TextInput, SelectOption } from '@wings-software/uikit'

import { Select } from '@blueprintjs/select'
import { Menu } from '@blueprintjs/core'
import { useGetProjectList, ResponseDTONGPageResponseProject, useGetOrganizationList } from 'services/cd-ng'
import type { ModuleName } from 'framework/exports'

import type { Project } from 'services/cd-ng'
import { Page } from 'modules/common/exports'
import { useProjectModal } from 'modules/common/modals/ProjectModal/useProjectModal'
import { useCollaboratorModal } from 'modules/common/modals/ProjectModal/useCollaboratorModal'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import i18n from './ProjectsPage.i18n'
import { Views, Sort } from './Constants'
import ProjectsListView from './views/ProjectListView/ProjectListView'
import ProjectsGridView from './views/ProjectGridView/ProjectGridView'
import css from './ProjectsPage.module.scss'

const allOrgsSelectOption: SelectOption = {
  label: i18n.orgLabel,
  value: i18n.orgLabel.toUpperCase()
}
interface ProjectListProps {
  mockData?: UseGetMockData<ResponseDTONGPageResponseProject>
  /** when the page is being shown inside continuous verification, value will be set to CV */
  module?: ModuleName
  onNewProjectCreated?(data: Project): void
}
const CustomSelect = Select.ofType<SelectOption>()

const ProjectsListPage: React.FC<ProjectListProps> = ({ mockData, module, onNewProjectCreated }) => {
  const [orgFilter, setOrgFilter] = useState<SelectOption>(allOrgsSelectOption)
  const { accountId } = useParams()
  const [view, setView] = useState(Views.GRID)
  const [recentFilter, setRecentFilter] = useState(Sort.ALL_PROJECTS)
  const [searchParam, setSearchParam] = useState<string | undefined>()
  const [page, setPage] = useState(0)
  const { loading: loadingAllProjects, data: dataAllProjects, refetch: reloadAllProjects } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgFilter.value == 'ALL' ? undefined : orgFilter.value.toString(),
      moduleType: module ? (module as Required<Project>['modules'][number]) : undefined,
      searchTerm: searchParam,
      page: page,
      size: 10
    },
    mock: mockData,
    debounce: 300
  })

  const loading = loadingAllProjects
  const data = dataAllProjects

  const projectCreateSuccessHandler = (project: Project | undefined): void => {
    if (project && onNewProjectCreated) {
      onNewProjectCreated(project)
    }
    reloadAllProjects()
  }

  const { openProjectModal } = useProjectModal({
    onSuccess: projectCreateSuccessHandler
  })

  const showEditProject = (project: Project): void => {
    openProjectModal(project)
  }

  const { openCollaboratorModal } = useCollaboratorModal()

  const showCollaborators = (project: Project): void => {
    openCollaboratorModal(project)
  }

  const { data: orgsData } = useGetOrganizationList({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const organisations: SelectOption[] = [
    allOrgsSelectOption,
    ...(orgsData?.data?.content?.map(org => {
      return {
        label: org.name || '',
        value: org.identifier || ''
      }
    }) || [])
  ]

  return (
    <>
      <Page.Header
        title={i18n.projects.toUpperCase()}
        toolbar={
          <Layout.Horizontal inline>
            <Button
              minimal
              text={i18n.tabRecent}
              intent={recentFilter === Sort.RECENT ? 'primary' : 'none'}
              onClick={() => {
                setRecentFilter(Sort.RECENT)
              }}
            />
            <Button
              minimal
              text={i18n.tabAllProjects}
              intent={recentFilter === Sort.ALL_PROJECTS ? 'primary' : 'none'}
              onClick={() => {
                setRecentFilter(Sort.ALL_PROJECTS)
              }}
            />
          </Layout.Horizontal>
        }
      />
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal width="55%">
          <Button
            text="New Project"
            icon="plus"
            onClick={() => openProjectModal(module ? ({ modules: [module] } as Project) : undefined)}
          />
        </Layout.Horizontal>

        <Layout.Horizontal spacing="small" width="45%" className={css.headerLayout}>
          <TextInput
            leftIcon="search"
            placeholder="Search by project, tags, members"
            className={css.search}
            value={searchParam}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchParam(e.target.value.trim())
            }}
          />
          <Text>{i18n.tabOrgs}</Text>
          <CustomSelect
            items={organisations}
            filterable={false}
            itemRenderer={(item, { handleClick }) => (
              <div>
                <Menu.Item
                  text={item.label}
                  onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => handleClick(e)}
                />
              </div>
            )}
            onItemSelect={item => {
              setOrgFilter(item as SelectOption)
            }}
            popoverProps={{ minimal: true }}
          >
            <Button inline minimal rightIcon="chevron-down" text={orgFilter.label} className={css.orgSelect} />
          </CustomSelect>

          <Layout.Horizontal inline>
            <Button
              minimal
              icon="grid-view"
              intent={view === Views.GRID ? 'primary' : 'none'}
              onClick={() => {
                setView(Views.GRID)
              }}
            />
            <Button
              minimal
              icon="list"
              intent={view === Views.LIST ? 'primary' : 'none'}
              onClick={() => {
                setView(Views.LIST)
              }}
            />
          </Layout.Horizontal>
        </Layout.Horizontal>
      </Layout.Horizontal>

      <Page.Body
        loading={loading}
        retryOnError={() => reloadAllProjects()}
        noData={{
          when: () => !data?.data?.content?.length,
          icon: 'nav-project',
          message: i18n.aboutProject,
          buttonText: i18n.addProject,
          onClick: () => openProjectModal(),
          className: css.pageContainer
        }}
      >
        {view === Views.GRID ? (
          <ProjectsGridView
            data={data?.data}
            reload={reloadAllProjects}
            showEditProject={showEditProject}
            collaborators={showCollaborators}
          />
        ) : null}
        {view === Views.LIST ? (
          <ProjectsListView
            data={data?.data}
            reload={reloadAllProjects}
            editProject={showEditProject}
            collaborators={showCollaborators}
            gotoPage={pageNumber => setPage(pageNumber)}
          />
        ) : null}
      </Page.Body>
    </>
  )
}

export default ProjectsListPage
