/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import cx from 'classnames'
import { FormInput, Layout } from '@harness/uicore'
import { useStrings } from 'framework/strings'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { FormMultiTypeCheckboxField } from '@common/components'
import type { ManifestSourceRenderProps } from '@cd/factory/ManifestSourceFactory/ManifestSourceBase'
import { isFieldRuntime } from '../../../K8sServiceSpecHelper'
import { isFieldfromTriggerTabDisabled } from '../../ManifestSourceUtils'
import ManifestGitStoreRuntimeFields from '../../ManifestSourceRuntimeFields/ManifestGitStoreRuntimeFields'
import css from '../../../KubernetesManifests/KubernetesManifests.module.scss'
const HelmGitTypeStoreMapContent = (props: ManifestSourceRenderProps): React.ReactElement => {
  const { template, path, manifestPath, manifest, fromTrigger, allowableTypes, readonly, formik, stageIdentifier } =
    props
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
      <ManifestGitStoreRuntimeFields {...props} />

      {isFieldRuntime(`${manifestPath}.spec.store.spec.folderPath`, template) && (
        <div className={css.verticalSpacingInput}>
          <FormInput.MultiTextInput
            disabled={isFieldDisabled(`${manifestPath}.spec.store.spec.folderPath`)}
            name={`${path}.${manifestPath}.spec.store.spec.folderPath`}
            multiTextInputProps={{
              expressions,
              allowableTypes
            }}
            label={getString('chartPath')}
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

export default HelmGitTypeStoreMapContent
