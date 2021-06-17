import React from 'react'
import { useParams } from 'react-router-dom'

import { Color, FormInput, getMultiTypeFromValue, Label, List, MultiTypeInputType } from '@wings-software/uicore'

import { useStrings } from 'framework/strings'
import { FormConnectorReferenceField } from '@connectors/components/ConnectorReferenceField/FormConnectorReferenceField'
import { Connectors } from '@connectors/constants'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'

import { TerraformPlanProps, TerraformStoreTypes } from '../../Common/Terraform/TerraformInterfaces'

export default function TfVarFile(props: TerraformPlanProps): React.ReactElement {
  const { getString } = useStrings()
  const { inputSetData, readonly, path, gitScope } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
  const { expressions } = useVariablesExpression()

  return (
    <>
      <Label style={{ color: Color.GREY_900 }}>{getString('cd.terraformVarFiles')}</Label>
      {inputSetData?.template?.spec?.configuration?.varFiles?.map((varFile: any, index) => {
        if (varFile?.varFile?.type === TerraformStoreTypes.Inline) {
          return (
            <>
              {getMultiTypeFromValue(varFile?.varFile?.identifier) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.spec?.varFiles[${index}].varFile.identifier`}
                  label={getString('identifier')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}
              {getMultiTypeFromValue(varFile?.varFile?.spec?.content) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.spec?.varFiles[${index}].varFile.spec.content`}
                  label={getString('pipelineSteps.content')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}
            </>
          )
        } else if (varFile.varFile?.type === TerraformStoreTypes.Remote) {
          const remoteVarFile = varFile.varFile as any
          return (
            <>
              {getMultiTypeFromValue(varFile?.varFile?.identifier) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.spec?.varFiles[${index}].varFile.identifier`}
                  label={getString('identifier')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}

              {getMultiTypeFromValue(remoteVarFile?.spec?.store?.spec?.connectorRef) === MultiTypeInputType.RUNTIME && (
                <FormConnectorReferenceField
                  accountIdentifier={accountId}
                  projectIdentifier={projectIdentifier}
                  orgIdentifier={orgIdentifier}
                  width={400}
                  type={[Connectors.GIT, Connectors.Github, Connectors.Gitlab, Connectors.Bitbucket]}
                  name={`${path}.configuration?.spec?.varFiles[${index}].varFile.spec.store.spec.connectorRef`}
                  label={getString('connectors.title.gitConnector')}
                  placeholder={getString('select')}
                  disabled={readonly}
                  gitScope={gitScope}
                />
              )}

              {getMultiTypeFromValue(remoteVarFile?.spec?.store?.spec?.branch) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.spec?.varFiles[${index}].varFile.store.spec.branch`}
                  label={getString('pipelineSteps.deploy.inputSet.branch')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}
              {getMultiTypeFromValue(remoteVarFile?.spec?.store?.spec?.commitId) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.spec?.varFiles[${index}].varFile.store.spec.commitId`}
                  label={getString('pipeline.manifestType.commitId')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}
              {getMultiTypeFromValue(remoteVarFile?.spec?.store?.spec?.paths) === MultiTypeInputType.RUNTIME && (
                <List
                  label={getString('filePaths')}
                  name={`${path}.configuration?.spec?.varFiles[${index}].varFile.store.spec.paths`}
                  disabled={readonly}
                  style={{ marginBottom: 'var(--spacing-small)' }}
                />
              )}
            </>
          )
        }
      })}
    </>
  )
}
