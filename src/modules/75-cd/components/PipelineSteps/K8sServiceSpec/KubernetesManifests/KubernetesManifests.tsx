/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect } from 'react'
import { get, isEmpty } from 'lodash-es'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { Icon, Text } from '@harness/uicore'
import { Tooltip } from '@blueprintjs/core'

import { useStrings } from 'framework/strings'
import manifestSourceBaseFactory from '@cd/factory/ManifestSourceFactory/ManifestSourceBaseFactory'
import type { GitQueryParams, InputSetPathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { useQueryParams } from '@common/hooks'
import type { ManifestConfig } from 'services/cd-ng'
import { ManifestDataType } from '@pipeline/components/ManifestSelection/Manifesthelper'
import type { KubernetesManifestsProps } from '../K8sServiceSpecInterface'
import { getNonRuntimeFields, isRuntimeMode } from '../K8sServiceSpecHelper'
import { fromPipelineInputTriggerTab, getManifestTriggerSetValues } from '../ManifestSource/ManifestSourceUtils'
import css from './KubernetesManifests.module.scss'

const ManifestInputField = (props: KubernetesManifestsProps): React.ReactElement => {
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<
    PipelineType<InputSetPathProps> & { accountId: string }
  >()
  const { repoIdentifier, branch } = useQueryParams<GitQueryParams>()
  const getManifestSourceMapType = (manifest: ManifestConfig): string => {
    return manifest.type !== ManifestDataType.HelmChart ? manifest.type : `${manifest.type}-${manifest.spec.store.type}`
  }
  const runtimeMode = isRuntimeMode(props.stepViewType)
  const isManifestsRuntime = runtimeMode && !!get(props.template, 'manifests', false)
  const manifestSource = manifestSourceBaseFactory.getManifestSource(
    getManifestSourceMapType(props.manifest as ManifestConfig)
  )
  const manifestDefaultValue = props.manifests?.find(
    manifestData => manifestData?.manifest?.identifier === props.manifest?.identifier
  )?.manifest as ManifestConfig

  useEffect(() => {
    /* instanbul ignore else */
    if (fromPipelineInputTriggerTab(props.formik, props.fromTrigger)) {
      const manifestTriggerData = getManifestTriggerSetValues(
        props.initialValues,
        props.formik,
        props.stageIdentifier,
        props.manifestPath as string
      )
      !isEmpty(manifestTriggerData) &&
        props.formik.setFieldValue(`${props.path}.${props.manifestPath}`, manifestTriggerData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div key={props.manifest?.identifier}>
      <Text className={css.inputheader} margin={{ top: 'medium', bottom: 'small' }}>
        {!props.fromTrigger && get(props.manifest, 'identifier', '')}
        {!isEmpty(
          JSON.parse(getNonRuntimeFields(manifestDefaultValue?.spec, get(props.template, `${props.manifestPath}.spec`)))
        ) && (
          <Tooltip
            position="top"
            className={css.manifestInfoTooltip}
            content={getNonRuntimeFields(manifestDefaultValue?.spec, get(props.template, `${props.manifestPath}.spec`))}
          >
            <Icon name="info" />
          </Tooltip>
        )}
      </Text>
      {manifestSource &&
        manifestSource.renderContent({
          ...props,
          isManifestsRuntime,
          projectIdentifier,
          orgIdentifier,
          accountId,
          pipelineIdentifier,
          repoIdentifier,
          branch,
          manifest: manifestDefaultValue
        })}
    </div>
  )
}
export function KubernetesManifests(props: KubernetesManifestsProps): React.ReactElement {
  const { getString } = useStrings()

  return (
    <div className={cx(css.nopadLeft, css.accordionSummary)} id={`Stage.${props.stageIdentifier}.Service.Manifests`}>
      {!props.fromTrigger && (
        <div className={css.subheading}>
          {getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.manifests')}
        </div>
      )}
      {props.template.manifests?.map((manifestObj, index) => {
        if (!manifestObj?.manifest || !props.manifests?.length) {
          return null
        }
        const manifestPath = `manifests[${index}].manifest`

        return (
          <ManifestInputField
            {...props}
            manifest={manifestObj.manifest}
            manifestPath={manifestPath}
            key={props.manifest?.identifier}
          />
        )
      })}
    </div>
  )
}
