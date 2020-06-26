import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useModalHook, Button, StepWizard, Container, Layout, Text, Select } from '@wings-software/uikit'
import { includes } from 'framework/utils/rsql'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'
import { pick } from 'lodash-es'
import { useGetProjects, useCreateProject, useGetOrganizations } from 'services/cd-ng'
import type { ProjectDTO, CreateProjectDTO } from 'services/cd-ng'

import { Page } from 'modules/common/exports'
import ProjectCard from './views/ProjectCard/ProjectCard'
import CreateProject from './views/CreateProject'
import StepOne, { StepOneData } from './views/StepOne'
import StepTwo, { StepTwoData, SelectOption } from './views/StepTwo'
import StepThree, { StepThreeData } from './views/StepThree'
import i18n from './ProjectsPage.i18n'
import { Views } from './Constants'

import css from './ProjectsPage.module.scss'

export type SharedData = StepOneData & StepTwoData & StepThreeData

const allOrgsSelectOption: SelectOption = {
  label: 'All',
  value: 'ALL'
}

const ProjectsListPage: React.FC = () => {
  const [view, setView] = useState(Views.NEW_PROJECT)
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
  const { mutate: createProject } = useCreateProject({})

  const wizardCompleteHandler = async (wizardData: SharedData | undefined): Promise<void> => {
    if (!wizardData) return
    const dataToSubmit: CreateProjectDTO = pick<CreateProjectDTO, keyof CreateProjectDTO>(wizardData, [
      'accountId',
      'color',
      'description',
      'identifier',
      'name',
      'orgId',
      'tags'
    ])
    dataToSubmit.accountId = accountId
    dataToSubmit.owners = [accountId]

    try {
      await createProject(dataToSubmit)
      hideModal()
      reloadProjects()
      setView(Views.NEW_PROJECT)
    } catch (e) {
      // display error using ModalErrorHandler
      // console.log(e?.data?.responseMessages)
    }
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen={true} className={cx(css.dialog, Classes.DIALOG, { [Classes.DARK]: view === Views.NEW_PROJECT })}>
        {view === Views.NEW_PROJECT ? <CreateProject setView={setView} /> : null}
        {view === Views.CREATE ? (
          <StepWizard<SharedData> onCompleteWizard={wizardCompleteHandler}>
            <StepOne name={i18n.newProjectWizard.stepOne.name} />
            <StepTwo name={i18n.newProjectWizard.stepTwo.name} />
            <StepThree name={i18n.newProjectWizard.stepThree.name} />
          </StepWizard>
        ) : null}
        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            setView(Views.NEW_PROJECT)
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [view]
  )

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
              href="javascript:;"
              className={cx(css.filterTab, { [css.selected]: ownerFilter === 'MY' })}
              onClick={() => setOwnerFilter('MY')}
            >
              {i18n.tabMyProjects}
            </a>
            <a
              href="javascript:;"
              className={cx(css.filterTab, { [css.selected]: ownerFilter === 'ALL' })}
              onClick={() => setOwnerFilter('ALL')}
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
            <Button text={i18n.addProject} onClick={showModal} />
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
          onClick: showModal
        }}
      >
        <Layout.Masonry
          gutter={30}
          width={900}
          className={css.centerContainer}
          items={data?.content || []}
          renderItem={(project: ProjectDTO) => <ProjectCard data={project} reloadProjects={reloadProjects} />}
          keyOf={(project: ProjectDTO) => project.id}
        />
      </Page.Body>
    </>
  )
}

export default ProjectsListPage
