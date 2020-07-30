import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Layout } from '@wings-software/uikit'

import cx from 'classnames'
import { useGetProjectListBasedOnFilter, ResponseDTONGPageResponseProjectDTO } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'

import { Page } from 'modules/common/exports'
import { useProjectModal } from 'modules/common/modals/ProjectModal/useProjectModal'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import ProjectCard from './views/ProjectCard/ProjectCard'

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
interface ProjectListProps {
  mockData?: UseGetMockData<ResponseDTONGPageResponseProjectDTO>
}
const ProjectsListPage: React.FC<ProjectListProps> = ({ mockData }) => {
  // const [orgFilter, setOrgFilter] = useState<SelectOption>(allOrgsSelectOption)
  const [ownerFilter, setOwnerFilter] = useState('ALL')
  const { accountId } = useParams()
  // const {
  //   loading: loadingOrgProjects,
  //   data: dataOrgProjects,
  //   refetch: reloadOrgProjects
  // } = useGetProjectListForOrganization({ orgIdentifier: orgId, lazy: true })
  const {
    loading: loadingAllProjects,
    data: dataAllProjects,
    refetch: reloadAllProjects
  } = useGetProjectListBasedOnFilter({ queryParams: { accountIdentifier: accountId }, mock: mockData })

  const loading = loadingAllProjects
  const data = dataAllProjects

  const projectCreateSuccessHandler = (): void => {
    reloadAllProjects()
  }

  const { openProjectModal } = useProjectModal({ onSuccess: projectCreateSuccessHandler })

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
      <div className={css.pageContainer}>
        <Page.Body
          loading={loading}
          retryOnError={() => reloadAllProjects()}
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
              <ProjectCard data={project} reloadProjects={reloadAllProjects} editProject={showEditProject} />
            )}
            keyOf={(project: ProjectDTO) => project.id}
          />
        </Page.Body>
      </div>
    </>
  )
}

export default ProjectsListPage
