import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { StepProps, SelectOption, ModalErrorHandlerBinding } from '@wings-software/uikit'
import { pick } from 'lodash-es'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import i18n from '@projects-orgs/pages/projects/ProjectsPage.i18n'
import {
  ResponseOrganization,
  ResponsePageOrganization,
  ResponseProject,
  useGetOrganization,
  useGetProject
} from 'services/cd-ng'
import type { Project } from 'services/cd-ng'
import { usePutProject } from 'services/cd-ng'
import type { UseGetMockData, UseMutateMockData } from '@common/utils/testUtils'
import { useToaster } from '@common/components/Toaster/useToaster'
import ProjectForm from './ProjectForm'

interface EditModalData {
  orgmockData?: UseGetMockData<ResponsePageOrganization>
  identifier?: string
  orgIdentifier?: string
  closeModal?: () => void
  onSuccess?: (project: Project | undefined) => void
  isStep?: boolean
  editOrgMockData?: UseGetMockData<ResponseOrganization>
  projectMockData?: UseGetMockData<ResponseProject>
  editMockData?: UseMutateMockData<ResponseProject>
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
    projectMockData,
    editMockData
  } = props
  const [version, setVersion] = useState<string>()
  const { accountId } = useParams()
  const { showSuccess } = useToaster()
  const projectIdentifier = isStep ? prevStepData?.identifier : identifier
  const organisationIdentifier = isStep ? prevStepData?.orgIdentifier : orgIdentifier

  const { data: projectData, loading, response, error } = useGetProject({
    identifier: projectIdentifier || /* istanbul ignore next */ '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: organisationIdentifier || /* istanbul ignore next */ ''
    },
    mock: projectMockData
  })

  const { data: orgData } = useGetOrganization({
    identifier: organisationIdentifier || /* istanbul ignore next */ '',
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
    },
    mock: editMockData
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
      label: orgData?.data?.name || /* istanbul ignore next */ '',
      value: orgData?.data?.identifier || /* istanbul ignore next */ ''
    }
  ]

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
    try {
      await updateProject(dataToSubmit as Project, {
        pathParams: { identifier: values.identifier },
        queryParams: {
          accountIdentifier: accountId,
          orgIdentifier: values.orgIdentifier
        }
      })
      showSuccess(i18n.newProjectWizard.aboutProject.editSuccess)
      onSuccess?.(values)
      updateAppStore({
        projects: projects.filter(/* istanbul ignore next */ p => p.identifier !== values.identifier).concat(values)
      })
      isStep ? nextStep?.({ ...values }) : closeModal?.()
    } catch (e) {
      /* istanbul ignore next */
      modalErrorHandler?.showDanger(e.data.message)
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
          initialOrgIdentifier={projectData.data?.orgIdentifier || orgIdentifier || /* istanbul ignore next */ ''}
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
