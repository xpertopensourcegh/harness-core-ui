import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Layout } from '@wings-software/uikit'

import cx from 'classnames'
import {
  useGetProjectListForOrganization,
  useGetProjectListBasedOnFilter
  // useGetOrganizations
} from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'

import { Page } from 'modules/common/exports'
import ProjectCard from './views/ProjectCard/ProjectCard'
import { useProjectModal } from 'modules/common/modals/ProjectModal/useProjectModal'

import i18n from './ProjectsPage.i18n'

import css from './ProjectsPage.module.scss'

// interface SelectOption {
//   label: string
//   value: string
// }

// const allOrgsSelectOption: SelectOption = {
//   label: 'All',
//   value: 'ALL'
// }

const ProjectsListPage: React.FC = () => {
  // const [orgFilter, setOrgFilter] = useState<SelectOption>(allOrgsSelectOption)
  const [ownerFilter, setOwnerFilter] = useState('ALL')
  const { accountId, orgId } = useParams()

  const {
    loading: loadingOrgProjects,
    data: dataOrgProjects,
    refetch: reloadOrgProjects
  } = useGetProjectListForOrganization({ orgIdentifier: orgId, lazy: true })
  const {
    loading: loadingAllProjects,
    data: dataAllProjects,
    refetch: reloadAllProjects
  } = useGetProjectListBasedOnFilter({ queryParams: { accountIdentifier: accountId }, lazy: true })

  const loading = orgId ? loadingOrgProjects : loadingAllProjects
  const data = orgId ? dataOrgProjects : dataAllProjects
  const reloadProjects = orgId ? reloadOrgProjects : reloadAllProjects

  useEffect(() => {
    reloadProjects()
  }, [accountId, orgId])

  const projectCreateSuccessHandler = (): void => {
    closeProjectModal()
    reloadProjects()
  }

  const { openProjectModal, closeProjectModal } = useProjectModal({ onSuccess: projectCreateSuccessHandler })

  const showEditProject = (project: ProjectDTO): void => {
    openProjectModal(project)
  }

  // const organisations = [
  //   allOrgsSelectOption,
  //   ...(orgs?.content?.map(org => {
  //     return {
  //       label: org.name || '',
  //       value: org.id || ''
  //     }
  //   }) || [])
  // ]

  return (
    <>
      <Page.Header
        title={i18n.projects.toUpperCase()}
        content={
          <Layout.Horizontal style={{ alignItems: 'center' }}>
            <a
              className={cx(css.filterTab, { [css.selected]: ownerFilter === 'MY' })}
              onClick={e => {
                e.preventDefault()
                setOwnerFilter('MY')
              }}
            >
              {i18n.tabMyProjects}
            </a>
            <a
              className={cx(css.filterTab, { [css.selected]: ownerFilter === 'ALL' })}
              onClick={e => {
                e.preventDefault()
                setOwnerFilter('ALL')
              }}
            >
              {i18n.tabAllProjects}
            </a>
            {/* <Text style={{ paddingLeft: '20px' }}>{i18n.tabOrgs}:</Text>
            <Select
              items={organisations}
              value={orgFilter}
              onChange={item => setOrgFilter(item as SelectOption)}
              className={css.orgSelect}
            /> */}
          </Layout.Horizontal>
        }
        toolbar={
          <Container>
            <Button text={i18n.addProject} onClick={() => openProjectModal()} />
          </Container>
        }
      />
      <Page.Body
        loading={loading}
        retryOnError={() => reloadProjects()}
        noData={{
          when: () => !data?.data?.content?.length,
          icon: 'nav-project',
          message: i18n.aboutProject,
          buttonText: i18n.addProject,
          onClick: () => openProjectModal()
        }}
      >
        <Layout.Masonry
          gutter={25}
          width={900}
          className={css.centerContainer}
          items={data?.data?.content || []}
          renderItem={(project: ProjectDTO) => (
            <ProjectCard data={project} reloadProjects={reloadProjects} editProject={showEditProject} />
          )}
          keyOf={(project: ProjectDTO) => project.id}
        />
      </Page.Body>
    </>
  )
}

export default ProjectsListPage
