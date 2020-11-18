import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Text, Layout, TextInput, SelectOption } from '@wings-software/uikit'

import { Select } from '@blueprintjs/select'
import { Menu } from '@blueprintjs/core'
import { ResponsePageOrganization, useGetOrganizationList } from 'services/cd-ng'

import type { Project } from 'services/cd-ng'
import { Page } from '@common/components/Page/Page'
import type { UseGetMockData } from '@common/utils/testUtils'
import { useProjectModal } from '@projects-orgs/modals/ProjectModal/useProjectModal'
import { useCollaboratorModal } from '@projects-orgs/modals/ProjectModal/useCollaboratorModal'
import { routeProjects } from 'navigation/projects/routes'
import { useRouteParams } from 'framework/exports'
import i18n from './ProjectsPage.i18n'
import { Views } from './Constants'
import ProjectsListView from './views/ProjectListView/ProjectListView'
import ProjectsGridView from './views/ProjectGridView/ProjectGridView'
import css from './ProjectsPage.module.scss'

const allOrgsSelectOption: SelectOption = {
  label: i18n.orgLabel,
  value: i18n.orgLabel.toUpperCase()
}
interface ProjectListProps {
  orgMockData?: UseGetMockData<ResponsePageOrganization>
}
const CustomSelect = Select.ofType<SelectOption>()

const ProjectsListPage: React.FC<ProjectListProps> = ({ orgMockData }) => {
  const {
    params: { accountId },
    query: { orgId }
  } = useRouteParams()
  const [view, setView] = useState(Views.GRID)
  const [searchParam, setSearchParam] = useState<string>()
  const [reloadProjectPage, setReloadProjectPage] = useState(false)
  const projectCreateSuccessHandler = (): void => {
    setReloadProjectPage(true)
  }
  const history = useHistory()
  let orgFilter = allOrgsSelectOption
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
    },
    mock: orgMockData
  })

  const organisations: SelectOption[] = [
    allOrgsSelectOption,
    ...(orgsData?.data?.content?.map(org => {
      org.identifier === orgId
        ? (orgFilter = {
            label: org.name,
            value: org.identifier
          })
        : null
      return {
        label: org.name,
        value: org.identifier
      }
    }) || [])
  ]

  return (
    <>
      <Page.Header title={i18n.projects.toUpperCase()} />
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal width="55%">
          <Button text="New Project" icon="plus" onClick={() => openProjectModal()} />
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
                <Menu.Item text={item.label} onClick={handleClick} />
              </div>
            )}
            onItemSelect={item => {
              orgFilter = item
              history.push({
                pathname: routeProjects.url(),
                search: `?orgId=${orgId}`
              })
            }}
            popoverProps={{ minimal: true, popoverClassName: css.customselect }}
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

      {view === Views.GRID ? (
        <ProjectsGridView
          showEditProject={showEditProject}
          collaborators={showCollaborators}
          orgFilterId={orgFilter.value.toString()}
          searchParameter={searchParam}
          reloadPage={reloadProjectPage ? setReloadProjectPage : undefined}
          openProjectModal={openProjectModal}
        />
      ) : null}
      {view === Views.LIST ? (
        <ProjectsListView
          showEditProject={showEditProject}
          collaborators={showCollaborators}
          orgFilterId={orgFilter.value.toString()}
          searchParameter={searchParam}
          reloadPage={reloadProjectPage ? setReloadProjectPage : undefined}
          openProjectModal={openProjectModal}
        />
      ) : null}
    </>
  )
}

export default ProjectsListPage
