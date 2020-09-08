import React, { useMemo, CSSProperties } from 'react'
import { FormInput, SelectOption, MultiTypeInputType } from '@wings-software/uikit'
import i18n from './VerificationJobForms.i18n'

interface BaseFieldProps {
  zIndex?: Pick<CSSProperties, 'zIndex'>
}

export const VerificationJobNameFieldNames = {}

export function JobName(): JSX.Element {
  return (
    <FormInput.InputWithIdentifier
      inputName="jobName"
      idLabel="Identifier"
      inputGroupProps={{ placeholder: i18n.placeholders.jobName }}
      inputLabel={i18n.fieldLabels.jobName}
    />
  )
}

const VerificationSensitivityOptions: SelectOption[] = [
  { label: i18n.verificationSensitivityLabel.high, value: 'HIGH' },
  { label: i18n.verificationSensitivityLabel.medium, value: 'MEDIUM' },
  { label: i18n.verificationSensitivityLabel.low, value: 'LOW' }
]

export function VerificationSensitivity(props: BaseFieldProps): JSX.Element {
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 10 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="sensitivity"
      style={style}
      label={i18n.fieldLabels.sensitivity}
      selectItems={VerificationSensitivityOptions}
      multiTypeInputProps={{
        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
      }}
    />
  )
}

export function ServiceName(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: [
        { label: 'Service1', value: 'service1' },
        { label: 'Service2', value: 'service2' }
      ]
    }),
    []
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 9 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="service"
      style={style}
      label={i18n.fieldLabels.service}
      selectItems={selectProps.items}
      multiTypeInputProps={{
        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
      }}
    />
  )
}

export function Duration(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: [
        { label: '5 min', value: 60000 * 5 },
        { label: '10 min', value: 60000 * 10 },
        { label: '30 min', value: 60000 * 30 }
      ]
    }),
    []
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 8 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="duration"
      style={style}
      label={i18n.fieldLabels.duration}
      selectItems={selectProps.items}
      multiTypeInputProps={{
        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
      }}
    />
  )
}

export function EnvironmentName(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: [
        { label: 'Env1', value: 'envionment1' },
        { label: 'Env2', value: 'environment2' }
      ]
    }),
    []
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 7 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="environment"
      style={style}
      label={i18n.fieldLabels.environment}
      selectItems={selectProps.items}
      multiTypeInputProps={{
        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
      }}
    />
  )
}

export function TrafficSplit(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: [
        { label: '5%', value: '5' },
        { label: '10%', value: '10' },
        { label: '15%', value: '15%' }
      ]
    }),
    []
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 6 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="trafficSplit"
      style={style}
      label={i18n.fieldLabels.trafficSplit}
      selectItems={selectProps.items}
      multiTypeInputProps={{
        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
      }}
    />
  )
}

export function Baseline(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: [
        { label: i18n.baselineDefaultLabel.lastSuccess, value: 'LAST' },
        { label: i18n.baselineDefaultLabel.pinBaseline, value: 'PIN' }
      ]
    }),
    []
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 5 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="baseline"
      style={style}
      label={i18n.fieldLabels.baseline}
      selectItems={selectProps.items}
      multiTypeInputProps={{
        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
      }}
    />
  )
}

export function DataSource(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: [
        { label: 'App Dynamics', value: 'APP_DYNAMICS' },
        { label: 'Splunk', value: 'SPLUNK' }
      ]
    }),
    []
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 4 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiSelectTypeInput
      name="dataSource"
      style={style}
      label={i18n.fieldLabels.dataSource}
      selectItems={selectProps.items}
      multiSelectTypeInputProps={{
        multiSelectProps: {
          items: selectProps.items
        },
        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
      }}
    />
  )
}
