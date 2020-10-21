import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { StepProps, SelectOption, ModalErrorHandlerBinding } from '@wings-software/uikit'
import { pick } from 'lodash-es'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import { useGetOrganizationList, ResponsePageOrganization, ResponseProject } from 'services/cd-ng'
import type { Project } from 'services/cd-ng'
import { usePostProject } from 'services/cd-ng'
import type { UseGetMockData, UseMutateMockData } from 'modules/common/utils/testUtils'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import ProjectForm from './ProjectFrom'

interface CreateModalData {
  orgMockData?: UseGetMockData<ResponsePageOrganization>
  modules?: Project['modules']
  onSuccess?: (project: Project | undefined) => void
  createMock?: UseMutateMockData<ResponseProject>
}

const CreateProject: React.FC<StepProps<Project> & CreateModalData> = props => {
  const { nextStep, onSuccess, orgMockData, modules, createMock } = props
  const { accountId, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const { mutate: createProject } = usePostProject({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    },
    mock: createMock
  })
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()
  const { data: orgData } = useGetOrganizationList({
    queryParams: {
      accountIdentifier: accountId
    },
    mock: orgMockData
  })
  const { projects } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()

  const organisations: SelectOption[] =
    orgData?.data?.content?.map(org => {
      return {
        label: org.name || /* istanbul ignore next */ '',
        value: org.identifier || /* istanbul ignore next */ ''
      }
    }) || []

  const onComplete = async (values: Project): Promise<void> => {
    const dataToSubmit: Project = pick<Project, keyof Project>(values, [
      'name',
      'orgIdentifier',
      'color',
      'description',
      'identifier',
      'tags'
    ])
    ;(dataToSubmit as Project)['accountIdentifier'] = accountId
    ;(dataToSubmit as Project)['owners'] = [accountId]
    ;(dataToSubmit as Project)['modules'] = values.modules || []
    try {
      const { data: project } = await createProject(dataToSubmit as Project, {
        queryParams: {
          accountIdentifier: accountId,
          orgIdentifier: values?.orgIdentifier || /* istanbul ignore next */ ''
        }
      })
      nextStep?.(project)
      showSuccess(i18n.newProjectWizard.aboutProject.createSuccess)
      onSuccess?.(project)
      updateAppStore({ projects: projects.concat(project!) })
    } catch (e) {
      /* istanbul ignore next */
      modalErrorHandler?.showDanger(e.data.message)
    }
  }
  return (
    <ProjectForm
      disableSelect={orgIdentifier ? true : false}
      enableEdit={true}
      disableSubmit={false}
      initialOrgIdentifier={orgIdentifier || i18n.newProjectWizard.aboutProject.default}
      initialModules={modules}
      organisationItems={organisations}
      title={i18n.newProjectWizard.aboutProject.name.toUpperCase()}
      setModalErrorHandler={setModalErrorHandler}
      onComplete={onComplete}
    />
  )
}

export default CreateProject
