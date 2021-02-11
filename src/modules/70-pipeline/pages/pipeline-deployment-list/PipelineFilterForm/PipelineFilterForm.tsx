import React from 'react'
import type { FormikProps } from 'formik'
import { FormInput, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import type { FilterProperties } from 'services/pipeline-ng'
import {
  getOptionsForMultiSelect,
  BUILD_TYPE,
  DeploymentTypeContext,
  BuildTypeContext
} from '../../../utils/PipelineExecutionFilterRequestUtils'

import css from './PipelineFilterForm.module.scss'

export type FormView = 'PIPELINE-META'
interface PipelineFilterFormProps<T> {
  formikProps?: FormikProps<T>
  type: FilterProperties['filterType']
  isCDEnabled: boolean
  isCIEnabled: boolean
  initialValues: FormikProps<T>['initialValues']
}

export default function PipelineFilterForm<T extends { buildType?: BuildTypeContext['buildType'] }>(
  props: PipelineFilterFormProps<T>
): React.ReactElement {
  const { getString } = useStrings()
  const { type, formikProps, isCDEnabled, isCIEnabled, initialValues } = props

  const getBuildTypeOptions = (): React.ReactElement => {
    let buildTypeField: JSX.Element = <></>
    const buildType = formikProps?.values?.buildType as BuildTypeContext['buildType']
    switch (buildType) {
      case BUILD_TYPE.PULL_OR_MERGE_REQUEST:
        buildTypeField = (
          <div className={css.subfilter} key="buildSubType">
            <FormInput.Text
              name={'sourceBranch'}
              label={getString('pipeline-triggers.conditionsPanel.sourceBranch')}
              key={'sourceBranch'}
              placeholder={getString('enterNamePlaceholder')}
            />
            <FormInput.Text
              name={'targetBranch'}
              label={getString('pipeline-triggers.conditionsPanel.targetBranch')}
              key={'targetBranch'}
              placeholder={getString('enterNamePlaceholder')}
            />
          </div>
        )
        break
      case BUILD_TYPE.BRANCH:
        buildTypeField = (
          <div className={css.subfilter} key="buildSubType">
            <FormInput.Text
              name={'branch'}
              label={getString('pipelineSteps.deploy.inputSet.branch')}
              key={'branch'}
              placeholder={getString('enterNamePlaceholder')}
            />
          </div>
        )
        break
      case BUILD_TYPE.TAG:
        buildTypeField = (
          <div className={css.subfilter} key="buildSubType">
            <FormInput.Text
              name={'tag'}
              label={getString('tagLabel')}
              key={'tag'}
              placeholder={getString('filters.executions.tagPlaceholder')}
            />
          </div>
        )
        break
      default:
        break
    }
    return (
      <>
        <>
          <span className={css.separator} key="buildsSeparator">
            <Text>{getString('buildsText').toUpperCase()}</Text>
          </span>
          {type === 'PipelineSetup' ? (
            <FormInput.Text
              name={'repositoryName'}
              label={getString('pipelineSteps.build.create.repositoryNameLabel')}
              key={'repositoryName'}
              placeholder={getString('enterNamePlaceholder')}
            />
          ) : null}
          <FormInput.Select
            items={[
              { label: getString('filters.executions.pullOrMergeRequest'), value: BUILD_TYPE.PULL_OR_MERGE_REQUEST },
              { label: getString('pipelineSteps.deploy.inputSet.branch'), value: BUILD_TYPE.BRANCH },
              { label: getString('tagLabel'), value: BUILD_TYPE.TAG }
            ]}
            name="buildType"
            label={getString('filters.executions.buildType')}
            key="buildType"
          />
        </>
        {buildTypeField}
      </>
    )
  }

  const getDeploymentTypeOptions = (): React.ReactElement => {
    const { environments, services } = initialValues as DeploymentTypeContext
    return (
      <>
        <span className={css.separator} key="deploymentSeparator">
          <Text>{getString('deploymentsText').toUpperCase()}</Text>
        </span>
        <FormInput.Select
          items={[{ label: getString('kubernetesText'), value: 'Kubernetes' }]}
          name="deploymentType"
          label={getString('deploymentTypeText')}
          key="deploymentType"
        />
        <FormInput.Select
          items={[{ label: getString('kubernetesDirectText'), value: 'Kubernetes Direct' }]}
          name="infrastructureType"
          label={getString('infrastructureTypeText')}
          key="infrastructureType"
        />
        <FormInput.MultiSelect
          items={services || []}
          name="services"
          label={getString('services')}
          key="services"
          multiSelectProps={{
            allowCreatingNewItems: false
          }}
        />
        <FormInput.MultiSelect
          items={environments || []}
          name="environments"
          label={getString('environments')}
          key="environments"
          multiSelectProps={{
            allowCreatingNewItems: false
          }}
        />
      </>
    )
  }

  const getPipelineFormCommonFields = (): React.ReactElement => {
    const isPipeSetupType = type === 'PipelineSetup'
    return (
      <>
        <FormInput.Text
          name={isPipeSetupType ? 'name' : 'pipelineName'}
          label={isPipeSetupType ? getString('name') : getString('filters.executions.pipelineName')}
          key={isPipeSetupType ? 'name' : 'pipelineName'}
          placeholder={getString('enterNamePlaceholder')}
        />
        {isPipeSetupType ? (
          <>
            <FormInput.Text name={'description'} label={getString('description')} key={'description'} />
            <FormInput.KVTagInput name="pipelineTags" label={getString('tagsLabel')} key="pipelineTags" />
          </>
        ) : null}
        {type === 'PipelineExecution' ? (
          <FormInput.MultiSelect
            items={getOptionsForMultiSelect()}
            name="status"
            label={getString('status')}
            key="status"
            multiSelectProps={{
              allowCreatingNewItems: false
            }}
          />
        ) : null}
      </>
    )
  }

  if (isCDEnabled && isCIEnabled) {
    return (
      <>
        <>{getPipelineFormCommonFields()}</>
        <>{getDeploymentTypeOptions()}</>
        <>{getBuildTypeOptions()}</>
      </>
    )
  } else if (isCDEnabled) {
    return (
      <>
        <>{getPipelineFormCommonFields()}</>
        <>{getDeploymentTypeOptions()}</>
      </>
    )
  } else if (isCIEnabled) {
    return (
      <>
        <>{getPipelineFormCommonFields()}</>
        <>{getBuildTypeOptions()}</>
      </>
    )
  }
  return <></>
}
