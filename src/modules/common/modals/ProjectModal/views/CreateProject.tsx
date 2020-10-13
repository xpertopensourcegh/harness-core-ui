import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { StepProps, SelectOption, ModalErrorHandlerBinding } from '@wings-software/uikit'
import { pick } from 'lodash-es'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import { useGetOrganizationList, ResponsePageOrganization } from 'services/cd-ng'
import type { Project } from 'services/cd-ng'
import { usePostProject } from 'services/cd-ng'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import ProjectForm from './ProjectFrom'

interface CreateModalData {
  orgMockData?: UseGetMockData<ResponsePageOrganization>
  onSuccess?: (project: Project | undefined) => void
}

const CreateProject: React.FC<StepProps<Project> & CreateModalData> = props => {
  const { nextStep, onSuccess, orgMockData } = props
  const { accountId, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const { mutate: createProject } = usePostProject({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    }
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
        label: org.name || '',
        value: org.identifier || ''
      }
    }) || []

  const getErrorMessage = (errors: any): string => {
    const message: string[] = errors.map((error: any) => {
      return error.error
    })
    return message.toString()
  }

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
      await createProject(dataToSubmit as Project, {
        queryParams: { accountIdentifier: accountId, orgIdentifier: values?.orgIdentifier || '' }
      })
      nextStep?.({ ...values })
      showSuccess(i18n.newProjectWizard.aboutProject.createSuccess)
      onSuccess?.(values)
      updateAppStore({ projects: projects.concat(values) })
    } catch (e) {
      modalErrorHandler?.showDanger(e.data.message || getErrorMessage(e.data.errors))
    }
  }
  return (
    <ProjectForm
      disableSelect={orgIdentifier ? true : false}
      enableEdit={true}
      disableSubmit={false}
      initialOrgIdentifier={orgIdentifier || i18n.newProjectWizard.aboutProject.default}
      organisationItems={organisations}
      title={i18n.newProjectWizard.aboutProject.name.toUpperCase()}
      setModalErrorHandler={setModalErrorHandler}
      onComplete={onComplete}
    />
  )
}

export default CreateProject
