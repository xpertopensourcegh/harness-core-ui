import React from 'react'
import cx from 'classnames'
import { Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { FormMultiTypeCheckboxField } from '@common/components/MultiTypeCheckbox/MultiTypeCheckbox'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import MultiTypeMap from '@common/components/MultiTypeMap/MultiTypeMap'
import MultiTypeList from '@common/components/MultiTypeList/MultiTypeList'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { MultiTypeSelectField } from '@common/components/MultiTypeSelect/MultiTypeSelect'
import { ArchiveFormatOptions } from '../../../constants/Constants'
import css from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

interface CIStepOptionalConfigProps {
  readonly?: boolean
  enableFields: {
    [key: string]: { [key: string]: any }
  }
}

export const CIStepOptionalConfig: React.FC<CIStepOptionalConfigProps> = props => {
  const { readonly, enableFields } = props
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()
  return (
    <>
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.privileged') ? (
        <div className={cx(css.formGroup, css.sm)}>
          <FormMultiTypeCheckboxField
            name="spec.privileged"
            label={getString('ci.privileged')}
            multiTypeTextbox={{
              expressions
            }}
            tooltipProps={{ dataTooltipId: 'privileged' }}
            disabled={readonly}
          />
        </div>
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.settings') ? (
        <MultiTypeMap
          name="spec.settings"
          valueMultiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text
                style={{ display: 'flex', alignItems: 'center' }}
                tooltipProps={{ dataTooltipId: 'pluginSettings' }}
              >
                {getString('settingsLabel')}
              </Text>
            )
          }}
          style={{ marginBottom: 'var(--spacing-small)' }}
          disabled={readonly}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.reportPaths') ? (
        <MultiTypeList
          name="spec.reportPaths"
          placeholder={getString('pipelineSteps.reportPathsPlaceholder')}
          multiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text style={{ display: 'flex', alignItems: 'center' }} tooltipProps={{ dataTooltipId: 'reportPaths' }}>
                {getString('pipelineSteps.reportPathsLabel')}
              </Text>
            )
          }}
          style={{ marginBottom: 'var(--spacing-small)' }}
          disabled={readonly}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.envVariables') ? (
        <MultiTypeMap
          name="spec.envVariables"
          valueMultiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text
                style={{ display: 'flex', alignItems: 'center' }}
                tooltipProps={{ dataTooltipId: enableFields['spec.envVariables'].tooltipId }}
              >
                {getString('environmentVariables')}
              </Text>
            )
          }}
          style={{ marginBottom: 'var(--spacing-small)' }}
          disabled={readonly}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.outputVariables') ? (
        <MultiTypeList
          name="spec.outputVariables"
          multiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text
                style={{ display: 'flex', alignItems: 'center' }}
                tooltipProps={{ dataTooltipId: 'outputVariables' }}
              >
                {getString('pipelineSteps.outputVariablesLabel')}
              </Text>
            )
          }}
          disabled={readonly}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.entrypoint') ? (
        <MultiTypeList
          name="spec.entrypoint"
          multiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text
                style={{ display: 'flex', alignItems: 'center' }}
                tooltipProps={{ dataTooltipId: 'dependencyEntryPoint' }}
              >
                {getString('entryPointLabel')}
              </Text>
            )
          }}
          disabled={readonly}
          style={{ marginTop: 'var(--spacing-small)', marginBottom: 'var(--spacing-small)' }}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.args') ? (
        <MultiTypeList
          name="spec.args"
          multiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text
                style={{ display: 'flex', alignItems: 'center' }}
                tooltipProps={{ dataTooltipId: 'dependencyArgs' }}
              >
                {getString('argsLabel')}
              </Text>
            )
          }}
          disabled={readonly}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.optimize') ? (
        <div className={cx(css.formGroup, css.sm)}>
          <FormMultiTypeCheckboxField
            name="spec.optimize"
            label={getString('ci.optimize')}
            multiTypeTextbox={{
              expressions
            }}
            tooltipProps={{ dataTooltipId: 'optimize' }}
            disabled={readonly}
          />
        </div>
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.dockerfile') ? (
        <MultiTypeTextField
          name="spec.dockerfile"
          label={
            <Text margin={{ top: 'small' }} tooltipProps={{ dataTooltipId: 'dockerfile' }}>
              {getString('pipelineSteps.dockerfileLabel')}
            </Text>
          }
          multiTextInputProps={{
            multiTextInputProps: { expressions },
            disabled: readonly
          }}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.context') ? (
        <MultiTypeTextField
          name="spec.context"
          label={
            <Text margin={{ top: 'small' }} tooltipProps={{ dataTooltipId: 'context' }}>
              {getString('pipelineSteps.contextLabel')}
            </Text>
          }
          multiTextInputProps={{
            multiTextInputProps: { expressions },
            disabled: readonly
          }}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.labels') ? (
        <MultiTypeMap
          name="spec.labels"
          valueMultiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text style={{ display: 'flex', alignItems: 'center' }} tooltipProps={{ dataTooltipId: 'labels' }}>
                {getString('pipelineSteps.labelsLabel')}
              </Text>
            )
          }}
          style={{ marginTop: 'var(--spacing-xsmall)', marginBottom: 'var(--spacing-small)' }}
          disabled={readonly}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.buildArgs') ? (
        <MultiTypeMap
          name="spec.buildArgs"
          valueMultiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text style={{ display: 'flex', alignItems: 'center' }} tooltipProps={{ dataTooltipId: 'buildArgs' }}>
                {getString('pipelineSteps.buildArgsLabel')}
              </Text>
            )
          }}
          disabled={readonly}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.endpoint') ? (
        <MultiTypeTextField
          name="spec.endpoint"
          label={<Text tooltipProps={{ dataTooltipId: 'endpoint' }}>{getString('pipelineSteps.endpointLabel')}</Text>}
          multiTextInputProps={{
            placeholder: getString('pipelineSteps.endpointPlaceholder'),
            multiTextInputProps: { expressions },
            disabled: readonly
          }}
          style={{ marginBottom: 'var(--spacing-small)' }}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.target') ? (
        <MultiTypeTextField
          name="spec.target"
          label={
            <Text margin={{ top: 'small' }} tooltipProps={{ dataTooltipId: enableFields['spec.target'].tooltipId }}>
              {getString('pipelineSteps.targetLabel')}
            </Text>
          }
          multiTextInputProps={{
            placeholder: getString('pipelineSteps.artifactsTargetPlaceholder'),
            multiTextInputProps: { expressions },
            disabled: readonly
          }}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.remoteCacheImage') ? (
        <MultiTypeTextField
          name="spec.remoteCacheImage"
          label={
            <Text margin={{ top: 'small' }} tooltipProps={{ dataTooltipId: 'gcrRemoteCache' }}>
              {getString('ci.remoteCacheImage.label')}
            </Text>
          }
          multiTextInputProps={{
            multiTextInputProps: { expressions },
            disabled: readonly,
            placeholder: getString('ci.remoteCacheImage.placeholder')
          }}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.archiveFormat') ? (
        <MultiTypeSelectField
          name="spec.archiveFormat"
          label={
            <Text margin={{ top: 'small' }} tooltipProps={{ dataTooltipId: 'archiveFormat' }}>
              {getString('archiveFormat')}
            </Text>
          }
          multiTypeInputProps={{
            selectItems: ArchiveFormatOptions,
            multiTypeInputProps: { expressions },
            disabled: readonly
          }}
          style={{ marginBottom: 'var(--spacing-medium)' }}
          disabled={readonly}
        />
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.override') ? (
        <div className={cx(css.formGroup, css.sm)}>
          <FormMultiTypeCheckboxField
            name="spec.override"
            label={getString('override')}
            multiTypeTextbox={{
              expressions,
              disabled: readonly
            }}
            style={{ marginBottom: 'var(--spacing-medium)' }}
            disabled={readonly}
            tooltipProps={{ dataTooltipId: 'saveCacheOverride' }}
          />
        </div>
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.pathStyle') ? (
        <div className={cx(css.formGroup, css.sm)}>
          <FormMultiTypeCheckboxField
            name="spec.pathStyle"
            label={getString('pathStyle')}
            multiTypeTextbox={{
              expressions,
              disabled: readonly
            }}
            style={{ marginBottom: 'var(--spacing-small)' }}
            disabled={readonly}
            tooltipProps={{ dataTooltipId: 'pathStyle' }}
          />
        </div>
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.failIfKeyNotFound') ? (
        <div className={cx(css.formGroup, css.sm)}>
          <FormMultiTypeCheckboxField
            name="spec.failIfKeyNotFound"
            label={getString('failIfKeyNotFound')}
            multiTypeTextbox={{
              expressions,
              disabled: readonly
            }}
            style={{ marginBottom: 'var(--spacing-small)' }}
            disabled={readonly}
            tooltipProps={{ dataTooltipId: 'failIfKeyNotFound' }}
          />
        </div>
      ) : null}
      {Object.prototype.hasOwnProperty.call(enableFields, 'spec.remoteCacheRepo') ? (
        <MultiTypeTextField
          name="spec.remoteCacheRepo"
          label={
            <Text margin={{ top: 'small' }} tooltipProps={{ dataTooltipId: 'dockerHubRemoteCache' }}>
              {getString('ci.remoteCacheRepository.label')}
            </Text>
          }
          multiTextInputProps={{
            multiTextInputProps: { expressions },
            disabled: readonly,
            placeholder: getString('ci.remoteCacheImage.placeholder')
          }}
        />
      ) : null}
    </>
  )
}
