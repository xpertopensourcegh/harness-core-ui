import React from 'react'
import type { FormikProps } from 'formik'
import { FormInput, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import { getOptionsForMultiSelect, BUILD_TYPE } from '../../../utils/RequestUtils'

import css from './ExecutionsFilterForm.module.scss'

interface ExecutionsFilterFormProps<T> {
  formikProps?: FormikProps<T>
}

export default function ExecutionsFilterForm<T extends { buildType: BUILD_TYPE }>(
  props: ExecutionsFilterFormProps<T>
): React.ReactElement {
  const { getString } = useStrings()
  const getPipelineFormFieldsWithBuildTypeOptions = (): React.ReactElement => {
    let buildTypeField: JSX.Element = <></>
    switch (props?.formikProps?.values?.buildType) {
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
    const fixedFields = getPipelineFormFields()
    fixedFields.push(buildTypeField)
    return <>{fixedFields}</>
  }

  const getPipelineFormFields = (): JSX.Element[] => {
    return [
      <FormInput.Text
        name={'pipelineName'}
        label={getString('filters.executions.pipelineName')}
        key={'pipelineName'}
        placeholder={getString('enterNamePlaceholder')}
      />,
      <FormInput.MultiSelect
        items={getOptionsForMultiSelect()}
        name="status"
        label={getString('status')}
        key="status"
        multiSelectProps={{
          allowCreatingNewItems: false
        }}
      />,
      <span className={css.separator} key="buildsSeparator">
        <Text>{getString('buildsText').toUpperCase()}</Text>
      </span>,
      //TODO enable this later on when this field gets populated from backend
      // <FormInput.Text
      //   name={'repositoryName'}
      //   label={getString('pipelineSteps.build.create.repositoryNameLabel')}
      //   key={'repositoryName'}
      //   placeholder={getString('enterNamePlaceholder')}
      // />,
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
    ]
  }

  return getPipelineFormFieldsWithBuildTypeOptions()
}
