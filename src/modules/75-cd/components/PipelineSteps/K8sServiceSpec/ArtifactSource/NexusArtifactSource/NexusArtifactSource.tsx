/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect } from 'react'
import { defaultTo, get } from 'lodash-es'

import { FormInput, getMultiTypeFromValue, Layout, MultiTypeInputType } from '@wings-software/uicore'
import { ArtifactSourceBase, ArtifactSourceRenderProps } from '@cd/factory/ArtifactSourceFactory/ArtifactSourceBase'
import { yamlStringify } from '@common/utils/YamlHelperMethods'
import { useMutateAsGet } from '@common/hooks'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { useGetBuildDetailsForNexusArtifactWithYaml } from 'services/cd-ng'

import { ArtifactToConnectorMap, ENABLED_ARTIFACT_TYPES } from '@pipeline/components/ArtifactsSelection/ArtifactHelper'
import { repositoryFormat } from '@pipeline/components/ArtifactsSelection/ArtifactUtils'
import { TriggerDefaultFieldList } from '@pipeline/pages/triggers/utils/TriggersWizardPageUtils'
import { useStrings } from 'framework/strings'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { isFieldRuntime } from '../../K8sServiceSpecHelper'
import {
  fromPipelineInputTriggerTab,
  getYamlData,
  isFieldfromTriggerTabDisabled,
  resetTags,
  setPrimaryInitialValues
} from '../artifactSourceUtils'
import ArtifactTagRuntimeField from '../ArtifactSourceRuntimeFields/ArtifactTagRuntimeField'
import css from '../../K8sServiceSpec.module.scss'

interface NexusRenderContent extends ArtifactSourceRenderProps {
  isTagsSelectionDisabled: (data: ArtifactSourceRenderProps) => boolean
}
const Content = (props: NexusRenderContent): JSX.Element => {
  const {
    isPrimaryArtifactsRuntime,
    isSidecarRuntime,
    template,
    formik,
    path,
    initialValues,
    accountId,
    projectIdentifier,
    orgIdentifier,
    readonly,
    repoIdentifier,
    pipelineIdentifier,
    branch,
    stageIdentifier,
    isTagsSelectionDisabled,
    allowableTypes,
    fromTrigger,
    artifact,
    isSidecar,
    artifactPath
  } = props

  const { getString } = useStrings()
  const isPropagatedStage = path?.includes('serviceConfig.stageOverrides')
  const { expressions } = useVariablesExpression()

  const {
    data: nexusTagsData,
    loading: fetchingTags,
    refetch: fetchTags,
    error: fetchTagsError
  } = useMutateAsGet(useGetBuildDetailsForNexusArtifactWithYaml, {
    body: yamlStringify(getYamlData(formik?.values)),
    requestOptions: {
      headers: {
        'content-type': 'application/json'
      }
    },
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      repoIdentifier,
      branch,
      imagePath:
        getMultiTypeFromValue(artifact?.spec?.imagePath) !== MultiTypeInputType.RUNTIME
          ? artifact?.spec?.imagePath
          : get(initialValues?.artifacts, `${artifactPath}.spec.imagePath`, ''),
      connectorRef:
        getMultiTypeFromValue(artifact?.spec?.connectorRef) !== MultiTypeInputType.RUNTIME
          ? artifact?.spec?.connectorRef
          : get(initialValues?.artifacts, `${artifactPath}.spec.connectorRef`, ''),
      repository:
        getMultiTypeFromValue(artifact?.spec?.repository) !== MultiTypeInputType.RUNTIME
          ? artifact?.spec?.repository
          : get(initialValues?.artifacts, `${artifactPath}.spec.repository`, ''),
      repositoryFormat,
      pipelineIdentifier: defaultTo(pipelineIdentifier, formik?.values?.identifier),
      fqnPath: isPropagatedStage
        ? `pipeline.stages.${stageIdentifier}.spec.serviceConfig.stageOverrides.artifacts.${artifactPath}.spec.tag`
        : `pipeline.stages.${stageIdentifier}.spec.serviceConfig.serviceDefinition.spec.artifacts.${artifactPath}.spec.tag`
    },
    lazy: true
  })

  useEffect(() => {
    /* instanbul ignore else */
    if (fromPipelineInputTriggerTab(formik, fromTrigger)) {
      setPrimaryInitialValues(initialValues, formik, stageIdentifier)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik?.values?.triggerType, formik?.values?.selectedArtifact, fromTrigger, stageIdentifier])

  const isFieldDisabled = (fieldName: string, isTag = false): boolean => {
    /* instanbul ignore else */
    if (readonly) {
      return true
    }
    if (isTag) {
      return isTagsSelectionDisabled(props)
    }
    return isFieldfromTriggerTabDisabled(fieldName, formik, stageIdentifier, fromTrigger)
  }

  const isRuntime = (!isSidecar && isPrimaryArtifactsRuntime) || (isSidecar && isSidecarRuntime)

  return (
    <>
      {isRuntime && (
        <Layout.Vertical key={artifactPath} className={css.inputWidth}>
          {isFieldRuntime(`artifacts.${artifactPath}.spec.connectorRef`, template) && (
            <FormMultiTypeConnectorField
              name={`${path}.artifacts.${artifactPath}.spec.connectorRef`}
              label={getString('pipelineSteps.deploy.inputSet.artifactServer')}
              selected={get(initialValues, `artifacts.${artifactPath}.spec.connectorRef`, '')}
              placeholder={''}
              accountIdentifier={accountId}
              projectIdentifier={projectIdentifier}
              orgIdentifier={orgIdentifier}
              width={384}
              setRefValue
              disabled={isFieldDisabled(`artifacts.${artifactPath}.spec.connectorRef`)}
              multiTypeProps={{
                allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED],
                expressions
              }}
              onChange={() => resetTags(formik, `${path}.artifacts.${artifactPath}.spec.tag`)}
              className={css.connectorMargin}
              type={ArtifactToConnectorMap[defaultTo(artifact?.type, '')]}
              gitScope={{ repo: repoIdentifier || '', branch: branch || '', getDefaultFromOtherRepo: true }}
            />
          )}

          {isFieldRuntime(`artifacts.${artifactPath}.spec.imagePath`, template) && (
            <FormInput.MultiTextInput
              label={getString('pipeline.imagePathLabel')}
              disabled={isFieldDisabled(`artifacts.${artifactPath}.spec.imagePath`)}
              multiTextInputProps={{
                expressions,
                allowableTypes
              }}
              name={`${path}.artifacts.${artifactPath}.spec.imagePath`}
              onChange={() => resetTags(formik, `${path}.artifacts.${artifactPath}.spec.tag`)}
            />
          )}

          {isFieldRuntime(`artifacts.${artifactPath}.spec.repository`, template) && (
            <FormInput.MultiTextInput
              label={getString('repository')}
              disabled={isFieldDisabled(`artifacts.${artifactPath}.spec.repository`)}
              multiTextInputProps={{
                expressions,
                allowableTypes
              }}
              name={`${path}.artifacts.${artifactPath}.spec.repository`}
              onChange={() => resetTags(formik, `${path}.artifacts.${artifactPath}.spec.tag`)}
            />
          )}

          {isFieldRuntime(`artifacts.${artifactPath}.spec.repositoryPort`, template) && (
            <FormInput.MultiTextInput
              label={getString('pipeline.artifactsSelection.repositoryPort')}
              disabled={isFieldDisabled(`artifacts.${artifactPath}.spec.repositoryPort`)}
              multiTextInputProps={{
                expressions,
                allowableTypes
              }}
              name={`${path}.artifacts.${artifactPath}.spec.repositoryPort`}
            />
          )}

          {isFieldRuntime(`artifacts.${artifactPath}.spec.artifactRepositoryUrl`, template) && (
            <FormInput.MultiTextInput
              label={getString('pipeline.artifactsSelection.dockerRepositoryServer')}
              disabled={isFieldDisabled(`artifacts.${artifactPath}.spec.artifactRepositoryUrl`)}
              multiTextInputProps={{
                expressions,
                allowableTypes
              }}
              name={`${path}.artifacts.${artifactPath}.spec.artifactRepositoryUrl`}
            />
          )}

          {!!fromTrigger && isFieldRuntime(`artifacts.${artifactPath}.spec.tag`, template) && (
            <FormInput.MultiTextInput
              label={getString('tagLabel')}
              multiTextInputProps={{
                expressions,
                value: TriggerDefaultFieldList.build,
                allowableTypes
              }}
              disabled={true}
              name={`${path}.artifacts.${artifactPath}.spec.tag`}
            />
          )}

          {!fromTrigger && isFieldRuntime(`artifacts.${artifactPath}.spec.tag`, template) && (
            <ArtifactTagRuntimeField
              {...props}
              isFieldDisabled={() => isFieldDisabled(`artifacts.${artifactPath}.spec.tag`, true)}
              fetchingTags={fetchingTags}
              buildDetailsList={nexusTagsData?.data?.buildDetailsList}
              fetchTagsError={fetchTagsError}
              fetchTags={fetchTags}
              expressions={expressions}
            />
          )}
          {isFieldRuntime(`artifacts.${artifactPath}.spec.tagRegex`, template) && (
            <FormInput.MultiTextInput
              disabled={isFieldDisabled(`artifacts.${artifactPath}.spec.tagRegex`)}
              multiTextInputProps={{
                expressions,
                allowableTypes
              }}
              label={getString('tagRegex')}
              name={`${path}.artifacts.${artifactPath}.spec.tagRegex`}
            />
          )}
        </Layout.Vertical>
      )}
    </>
  )
}

export class NexusArtifactSource extends ArtifactSourceBase<ArtifactSourceRenderProps> {
  protected artifactType = ENABLED_ARTIFACT_TYPES.NexusRegistry
  protected isSidecar = false

  isTagsSelectionDisabled(props: ArtifactSourceRenderProps): boolean {
    const { initialValues, artifactPath, artifact } = props
    const isImagePathPresent =
      getMultiTypeFromValue(artifact?.spec?.imagePath) !== MultiTypeInputType.RUNTIME
        ? artifact?.spec?.imagePath
        : get(initialValues?.artifacts, `${artifactPath}.spec.imagePath`, '')
    const isConnectorPresent =
      getMultiTypeFromValue(artifact?.spec?.connectorRef) !== MultiTypeInputType.RUNTIME
        ? artifact?.spec?.connectorRef
        : get(initialValues?.artifacts, `${artifactPath}.spec.connectorRef`, '')
    const isRepositoryPresent =
      getMultiTypeFromValue(artifact?.spec?.repository) !== MultiTypeInputType.RUNTIME
        ? artifact?.spec?.repository
        : get(initialValues?.artifacts, `${artifactPath}.spec.repository`, '')
    return !(isImagePathPresent && isConnectorPresent && isRepositoryPresent)
  }

  renderContent(props: ArtifactSourceRenderProps): JSX.Element | null {
    if (!props.isArtifactsRuntime) {
      return null
    }

    this.isSidecar = defaultTo(props.isSidecar, false)

    return <Content {...props} isTagsSelectionDisabled={this.isTagsSelectionDisabled.bind(this)} />
  }
}