import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { StepProps, SelectOption, ModalErrorHandlerBinding } from '@wings-software/uikit'
import { pick } from 'lodash-es'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import {
  ResponseOrganization,
  ResponsePageOrganization,
  ResponseProject,
  useGetOrganization,
  useGetProject
} from 'services/cd-ng'
import type { Project } from 'services/cd-ng'
import { usePutProject } from 'services/cd-ng'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import ProjectForm from './ProjectFrom'

interface EditModalData {
  orgmockData?: UseGetMockData<ResponsePageOrganization>
  identifier?: string
  orgIdentifier?: string
  closeModal?: () => void
  onSuccess?: (project: Project | undefined) => void
  isStep?: boolean
  editOrgMockData?: UseGetMockData<ResponseOrganization>
  projectMockData?: UseGetMockData<ResponseProject>
}

const EditProject: React.FC<StepProps<Project> & EditModalData> = props => {
  const {
    prevStepData,
    nextStep,
    identifier,
    orgIdentifier,
    closeModal,
    onSuccess,
    isStep,
    editOrgMockData,
    projectMockData
  } = props
  const [version, setVersion] = useState<string>()
  const { accountId } = useParams()
  const { showSuccess } = useToaster()
  const projectIdentifier = isStep ? prevStepData?.identifier : identifier
  const organisationIdentifier = isStep ? prevStepData?.orgIdentifier : orgIdentifier

  const { data: projectData, loading, response, error } = useGetProject({
    identifier: projectIdentifier || '',
    queryParams: { accountIdentifier: accountId, orgIdentifier: organisationIdentifier || '' },
    mock: projectMockData
  })

  const { data: orgData } = useGetOrganization({
    identifier: organisationIdentifier || '',
    queryParams: { accountIdentifier: accountId },
    mock: editOrgMockData
  })

  const { mutate: updateProject } = usePutProject({
    identifier: '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    },
    requestOptions: {
      headers: { 'If-Match': version as string }
    }
  })

  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()

  useEffect(() => {
    if (!loading && !error) {
      setVersion(response?.headers.get('etag') as string)
    }
  }, [error, loading])

  const { projects } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()

  const organisations: SelectOption[] = [
    {
      label: orgData?.data?.name || '',
      value: orgData?.data?.identifier || ''
    }
  ]

  const getErrorMessage = (errors: any): string => {
    const message: string[] = errors.map((errorMessage: any) => {
      return errorMessage.error
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
    try {
      await updateProject(dataToSubmit as Project, {
        pathParams: { identifier: values?.identifier || '' },
        queryParams: { accountIdentifier: accountId, orgIdentifier: values?.orgIdentifier || '' }
      })
      showSuccess(i18n.newProjectWizard.aboutProject.editSuccess)
      onSuccess?.(values)
      updateAppStore({ projects: projects.filter(p => p.identifier !== values.identifier).concat(values) })
      isStep ? nextStep?.({ ...values }) : closeModal?.()
    } catch (e) {
      modalErrorHandler?.showDanger(e.data.message || getErrorMessage(e.data.errors))
    }
  }
  return (
    <>
      {projectData ? (
        <ProjectForm
          data={projectData.data}
          disableSelect={true}
          enableEdit={false}
          disableSubmit={false}
          initialOrgIdentifier={projectData.data?.orgIdentifier || orgIdentifier || ''}
          organisationItems={organisations}
          title={i18n.newProjectWizard.aboutProject.edit.toUpperCase()}
          setModalErrorHandler={setModalErrorHandler}
          onComplete={onComplete}
        />
      ) : null}
    </>
  )
}

export default EditProject
