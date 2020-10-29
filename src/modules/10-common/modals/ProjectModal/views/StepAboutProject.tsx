import React from 'react'
import type { StepProps } from '@wings-software/uikit'
import type { Project, ResponseOrganization, ResponsePageOrganization, ResponseProject } from 'services/cd-ng'
import type { UseGetMockData, UseMutateMockData } from '@common/utils/testUtils'
import CreateProject from './CreateProject'
import EditProject from './EditProject'

interface ProjectModalData {
  closeModal?: () => void
  onSuccess?: (project: Project | undefined) => void
  onProjectSubmit?: (project: Project) => Promise<void>
  modules?: Project['modules']
  orgMockData?: UseGetMockData<ResponsePageOrganization>
  editOrgMockData?: UseGetMockData<ResponseOrganization>
  projectMockData?: UseGetMockData<ResponseProject>
  createMock?: UseMutateMockData<ResponseProject>
}

const StepAboutProject: React.FC<StepProps<Project> & ProjectModalData> = props => {
  const { prevStepData, orgMockData } = props
  const isStepBack = prevStepData?.identifier ? true : false
  return (
    <>
      {isStepBack ? (
        <EditProject isStep={isStepBack} {...props} />
      ) : (
        <CreateProject orgMockData={orgMockData} {...props} />
      )}
    </>
  )
}

export default StepAboutProject
