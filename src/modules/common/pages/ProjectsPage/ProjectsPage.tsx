import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Layout, Text, Select } from '@wings-software/uikit'
import { includes } from 'framework/utils/rsql'

import cx from 'classnames'
import { useGetProjects, useGetOrganizations } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'

import { Page } from 'modules/common/exports'
import ProjectCard from './views/ProjectCard/ProjectCard'
import { useProjectModal } from 'modules/common/modals/ProjectModal/useProjectModal'

import i18n from './ProjectsPage.i18n'

import css from './ProjectsPage.module.scss'

interface SelectOption {
  label: string
  value: string
}

const allOrgsSelectOption: SelectOption = {
  label: 'All',
  value: 'ALL'
}

const ProjectsListPage: React.FC = () => {
  const [orgFilter, setOrgFilter] = useState<SelectOption>(allOrgsSelectOption)
  const [ownerFilter, setOwnerFilter] = useState('ALL')
  const { accountId } = useParams()

  const { loading, data, refetch: reloadProjects, error } = useGetProjects({
    queryParams: {
      orgId: orgFilter.value === 'ALL' ? '' : orgFilter.value,
      filter: ownerFilter === 'ALL' ? '' : includes('owners', [accountId])
    }
  })
  const { data: orgs } = useGetOrganizations({})

  const projectCreateSuccessHandler = (): void => {
    closeProjectModal()
    reloadProjects()
  }

  const { openProjectModal, closeProjectModal } = useProjectModal({ onSuccess: projectCreateSuccessHandler })

  const showEditProject = (project: ProjectDTO): void => {
    openProjectModal(project)
  }

  const organisations = [
    allOrgsSelectOption,
    ...(orgs?.content?.map(org => {
      return {
        label: org.name || '',
        value: org.id || ''
      }
    }) || [])
  ]

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
            <Text style={{ paddingLeft: '20px' }}>{i18n.tabOrgs}:</Text>
            <Select
              items={organisations}
              value={orgFilter}
              onChange={item => setOrgFilter(item as SelectOption)}
              className={css.orgSelect}
            />
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
        error={error?.message}
        retryOnError={() => reloadProjects()}
        noData={{
          when: () => !data?.content?.length,
          icon: 'nav-project',
          message: i18n.aboutProject,
          buttonText: i18n.addProject,
          onClick: () => openProjectModal()
        }}
      >
        <Layout.Masonry
          gutter={30}
          width={900}
          className={css.centerContainer}
          items={data?.content || []}
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
