/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import cx from 'classnames'
import { FormInput, Layout } from '@harness/uicore'
import { defaultTo, get } from 'lodash-es'
import { useStrings } from 'framework/strings'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { FormMultiTypeCheckboxField } from '@common/components'
import { ManifestSourceBase, ManifestSourceRenderProps } from '@cd/factory/ManifestSourceFactory/ManifestSourceBase'
import {
  ManifestDataType,
  ManifestStoreMap,
  ManifestToConnectorMap
} from '@pipeline/components/ManifestSelection/Manifesthelper'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { TriggerDefaultFieldList } from '@triggers/pages/triggers/utils/TriggersWizardPageUtils'
import { isFieldRuntime } from '../../../K8sServiceSpecHelper'
import { isFieldfromTriggerTabDisabled } from '../../ManifestSourceUtils'
import css from '../../../KubernetesManifests/KubernetesManifests.module.scss'
const Content = ({
  initialValues,
  template,
  path,
  manifestPath,
  manifest,
  fromTrigger,
  allowableTypes,
  readonly,
  formik,
  accountId,
  projectIdentifier,
  orgIdentifier,
  repoIdentifier,
  branch,
  stageIdentifier
}: ManifestSourceRenderProps): React.ReactElement => {
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()

  const isFieldDisabled = (fieldName: string): boolean => {
    // /* instanbul ignore else */
    if (readonly) {
      return true
    }

    return isFieldfromTriggerTabDisabled(
      fieldName,
      formik,
      stageIdentifier,
      manifest?.identifier as string,
      fromTrigger
    )
  }

  return (
    <Layout.Vertical
      data-name="manifest"
      key={manifest?.identifier}
      className={cx(css.inputWidth, css.layoutVerticalSpacing)}
    >
      {isFieldRuntime(`${manifestPath}.spec.store.spec.connectorRef`, template) && (
        <div data-name="connectorRefContainer" className={css.verticalSpacingInput}>
          <FormMultiTypeConnectorField
            disabled={isFieldDisabled(`${manifestPath}.spec.store.spec.connectorRef`)}
            name={`${path}.${manifestPath}.spec.store.spec.connectorRef`}
            selected={get(initialValues, `${manifestPath}.spec.store.spec.connectorRef`, '')}
            label={getString('connector')}
            placeholder={''}
            setRefValue
            multiTypeProps={{
              allowableTypes,
              expressions
            }}
            width={370}
            accountIdentifier={accountId}
            projectIdentifier={projectIdentifier}
            orgIdentifier={orgIdentifier}
            type={ManifestToConnectorMap[defaultTo(manifest?.spec.store.type, '')]}
            gitScope={{
              repo: defaultTo(repoIdentifier, ''),
              branch: defaultTo(branch, ''),
              getDefaultFromOtherRepo: true
            }}
          />
        </div>
      )}
      {isFieldRuntime(`${manifestPath}.spec.chartName`, template) && (
        <div className={css.verticalSpacingInput}>
          <FormInput.MultiTextInput
            disabled={isFieldDisabled(`${manifestPath}.spec.chartName`)}
            name={`${path}.${manifestPath}.spec.chartName`}
            multiTextInputProps={{
              expressions,
              allowableTypes
            }}
            label={getString('pipeline.manifestType.http.chartName')}
          />
        </div>
      )}

      {isFieldRuntime(`${manifestPath}.spec.chartVersion`, template) && (
        <div className={css.verticalSpacingInput}>
          <FormInput.MultiTextInput
            disabled={isFieldDisabled(fromTrigger ? 'chartVersion' : `${manifestPath}.spec.chartVersion`)}
            name={`${path}.${manifestPath}.spec.chartVersion`}
            multiTextInputProps={{
              ...(fromTrigger && { value: TriggerDefaultFieldList.chartVersion }),
              expressions,
              allowableTypes
            }}
            label={getString('pipeline.manifestType.http.chartVersion')}
          />
        </div>
      )}

      {isFieldRuntime(`${manifestPath}.spec.skipResourceVersioning`, template) && (
        <div className={css.verticalSpacingInput}>
          <FormMultiTypeCheckboxField
            disabled={isFieldDisabled(`${manifestPath}.spec.skipResourceVersioning`)}
            name={`${path}.${manifestPath}.spec.skipResourceVersioning`}
            label={getString('skipResourceVersion')}
            setToFalseWhenEmpty={true}
            multiTypeTextbox={{
              expressions,
              allowableTypes
            }}
          />
        </div>
      )}
    </Layout.Vertical>
  )
}

export class HelmHttpManifestSource extends ManifestSourceBase<ManifestSourceRenderProps> {
  protected manifestType = `${ManifestDataType.HelmChart}-${ManifestStoreMap.Http}`

  renderContent(props: ManifestSourceRenderProps): JSX.Element | null {
    if (!props.isManifestsRuntime) {
      return null
    }

    return <Content {...props} />
  }
}
