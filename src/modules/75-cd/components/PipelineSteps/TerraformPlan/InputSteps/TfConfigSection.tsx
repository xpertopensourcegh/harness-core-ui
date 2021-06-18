import React from 'react'
import cx from 'classnames'

import { useParams } from 'react-router-dom'
import { get } from 'lodash-es'
import { getMultiTypeFromValue, MultiTypeInputType, FormInput } from '@wings-software/uicore'
import { useQueryParams } from '@common/hooks'
import type { GitQueryParams } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import { FormConnectorReferenceField } from '@connectors/components/ConnectorReferenceField/FormConnectorReferenceField'
import { Connectors } from '@connectors/constants'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'

import type { TerraformPlanProps } from '../../Common/Terraform/TerraformInterfaces'
import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

export default function ConfigSection(props: TerraformPlanProps): React.ReactElement {
  const { getString } = useStrings()
  const { inputSetData, readonly, initialValues, path } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
  const { repoIdentifier, branch } = useQueryParams<GitQueryParams>()
  const { expressions } = useVariablesExpression()

  return (
    <>
      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.workspace) === MultiTypeInputType.RUNTIME && (
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormInput.MultiTextInput
            name={`${path}.configuration.spec.workspace`}
            label={getString('pipelineSteps.workspace')}
            disabled={readonly}
            multiTextInputProps={{
              expressions,
              allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
            }}
          />
        </div>
      )}
      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.configFiles?.store?.spec?.connectorRef) ===
        MultiTypeInputType.RUNTIME && (
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormConnectorReferenceField
            accountIdentifier={accountId}
            selected={get(initialValues, 'spec.configuration.configFiles.store.spec.connectorRef', '')}
            projectIdentifier={projectIdentifier}
            orgIdentifier={orgIdentifier}
            width={400}
            type={[Connectors.GIT, Connectors.Github, Connectors.Gitlab, Connectors.Bitbucket]}
            name={`${path}.spec.configuration.configFiles.store.spec.connectorRef`}
            label={getString('connector')}
            placeholder={getString('select')}
            disabled={readonly}
            gitScope={{ repo: repoIdentifier || '', branch, getDefaultFromOtherRepo: true }}
          />
        </div>
      )}

      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.configFiles?.store?.spec?.branch) ===
        MultiTypeInputType.RUNTIME && (
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormInput.MultiTextInput
            label=""
            name={`${path}.spec.configuration.configFiles.store.spec.branch`}
            placeholder={getString('pipeline.manifestType.branchPlaceholder')}
            disabled={readonly}
            multiTextInputProps={{
              expressions,
              allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
            }}
          />
        </div>
      )}

      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.configFiles?.store?.spec?.commitId) ===
        MultiTypeInputType.RUNTIME && (
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormInput.MultiTextInput
            label=""
            name={`${path}.spec.configuration.spec.configFiles.store.spec.commitId`}
            placeholder={getString('pipeline.manifestType.commitPlaceholder')}
            disabled={readonly}
            multiTextInputProps={{
              expressions,
              allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
            }}
          />
        </div>
      )}

      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.configFiles?.store?.spec?.commitId) ===
        MultiTypeInputType.RUNTIME && (
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormInput.MultiTextInput
            label=""
            name={`${path}.spec.configuration.spec.configFiles.store.spec.commitId`}
            placeholder={getString('pipeline.manifestType.commitPlaceholder')}
            disabled={readonly}
            multiTextInputProps={{
              expressions,
              allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
            }}
          />
        </div>
      )}

      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.configFiles?.store?.spec?.folderPath) ===
        MultiTypeInputType.RUNTIME && (
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormInput.MultiTextInput
            label=""
            name={`${path}.spec.configuration.spec.configFiles.store.spec.folderPath`}
            placeholder={getString('pipeline.manifestType.pathPlaceholder')}
            disabled={readonly}
            multiTextInputProps={{
              expressions,
              allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
            }}
          />
        </div>
      )}
    </>
  )
}
