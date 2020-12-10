import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Text, Layout, SelectOption, Link, ExpandingSearchInput } from '@wings-software/uikit'

import { Select } from '@blueprintjs/select'
import { Menu } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'

import { useGetOrganizationList } from 'services/cd-ng'
import type { Project } from 'services/cd-ng'
import { Page } from '@common/components/Page/Page'
import { useQueryParams } from '@common/hooks'
import { useProjectModal } from '@projects-orgs/modals/ProjectModal/useProjectModal'
import { useCollaboratorModal } from '@projects-orgs/modals/ProjectModal/useCollaboratorModal'
import routes from '@common/RouteDefinitions'
import i18n from './ProjectsPage.i18n'
import { Views } from './Constants'
import ProjectsListView from './views/ProjectListView/ProjectListView'
import ProjectsGridView from './views/ProjectGridView/ProjectGridView'
import css from './ProjectsPage.module.scss'

const allOrgsSelectOption: SelectOption = {
  label: i18n.orgLabel,
  value: i18n.orgLabel.toUpperCase()
}

const CustomSelect = Select.ofType<SelectOption>()

const ProjectsListPage: React.FC = () => {
  const { accountId } = useParams()
  const { orgId } = useQueryParams()
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
    openCollaboratorModal({ projectIdentifier: project.identifier, orgIdentifier: project.orgIdentifier || 'default' })
  }

  const { data: orgsData } = useGetOrganizationList({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const organizations: SelectOption[] = [
    allOrgsSelectOption,
    ...(orgsData?.data?.content?.map(org => {
      org.organization.identifier === orgId
        ? (orgFilter = {
            label: org.organization.name,
            value: org.organization.identifier
          })
        : null
      return {
        label: org.organization.name,
        value: org.organization.identifier
      }
    }) || [])
  ]

  return (
    <>
      <Page.Header
        title={i18n.projects}
        content={
          <Link
            withoutHref
            onClick={() => {
              history.push(routes.toProjectsGetStarted({ accountId }))
            }}
          >
            {i18n.getNewProjectStarted}
          </Link>
        }
      />

      <>
        <Layout.Horizontal className={css.header}>
          <Layout.Horizontal width="55%">
            <Button intent="primary" text={i18n.newProject} icon="plus" onClick={() => openProjectModal()} />
          </Layout.Horizontal>

          <Layout.Horizontal spacing="small" width="45%" className={css.headerLayout}>
            <Layout.Horizontal flex>
              <ExpandingSearchInput
                placeholder={i18n.search}
                onChange={text => {
                  setSearchParam(text.trim())
                }}
                className={css.search}
              />
            </Layout.Horizontal>

            <Text>{i18n.tabOrgs}</Text>
            <CustomSelect
              items={organizations}
              filterable={false}
              itemRenderer={(item, { handleClick }) => (
                <div key={item.value.toString()}>
                  <Menu.Item text={item.label} onClick={handleClick} />
                </div>
              )}
              onItemSelect={item => {
                orgFilter = item
                history.push({
                  pathname: routes.toProjects({ accountId }),
                  search: `?orgId=${orgFilter.value.toString()}`
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
    </>
  )
}

export default ProjectsListPage
