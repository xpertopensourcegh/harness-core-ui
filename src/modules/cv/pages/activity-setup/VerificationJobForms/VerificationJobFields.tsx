import React, { useMemo, useCallback, CSSProperties } from 'react'
import { FormInput, SelectOption, MultiTypeInput } from '@wings-software/uikit'
import { useFormikContext } from 'formik'
import i18n from './VerificationJobForms.i18n'

interface BaseFieldProps {
  zIndex?: Pick<CSSProperties, 'zIndex'>
}

export const VerificationJobNameFieldNames = {}

export function JobName(): JSX.Element {
  return <FormInput.Text name="jobName" label={i18n.fieldLabels.jobName} placeholder={i18n.placeholders.jobName} />
}

const VerificationSensitivityOptions: SelectOption[] = [
  { label: i18n.verificationSensitivityLabel.high, value: 'HIGH' },
  { label: i18n.verificationSensitivityLabel.medium, value: 'MEDIUM' },
  { label: i18n.verificationSensitivityLabel.low, value: 'LOW' }
]

export function VerificationSensitivity(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: VerificationSensitivityOptions
    }),
    []
  )
  const { setFieldValue } = useFormikContext()
  const onChangeCallback = useCallback(
    (value?: string) => {
      setFieldValue('sensitivity', value)
    },
    [setFieldValue]
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 10 }), [zIndex]) as CSSProperties
  return (
    <FormInput.CustomRender
      name="sensitivity"
      style={style}
      label={i18n.fieldLabels.sensitivity}
      render={() => <MultiTypeInput selectProps={selectProps} onChange={onChangeCallback} />}
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
  const { setFieldValue } = useFormikContext()
  const onChangeCallback = useCallback(
    (value?: string) => {
      setFieldValue('service', value)
    },
    [setFieldValue]
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 9 }), [zIndex]) as CSSProperties
  return (
    <FormInput.CustomRender
      name="service"
      label={i18n.fieldLabels.service}
      style={style}
      render={() => <MultiTypeInput selectProps={selectProps} onChange={onChangeCallback} />}
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
  const { setFieldValue } = useFormikContext()
  const onChangeCallback = useCallback(
    (value?: string) => {
      setFieldValue('service', value)
    },
    [setFieldValue]
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 8 }), [zIndex]) as CSSProperties
  return (
    <FormInput.CustomRender
      name="duration"
      label={i18n.fieldLabels.duration}
      style={style}
      render={() => <MultiTypeInput selectProps={selectProps} onChange={onChangeCallback} />}
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
  const { setFieldValue } = useFormikContext()
  const onChangeCallback = useCallback(
    (value?: string) => {
      setFieldValue('environment', value)
    },
    [setFieldValue]
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 7 }), [zIndex]) as CSSProperties
  return (
    <FormInput.CustomRender
      name="environment"
      label={i18n.fieldLabels.environment}
      style={style}
      render={() => <MultiTypeInput selectProps={selectProps} onChange={onChangeCallback} />}
    />
  )
}

export function TrafficSplit(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: [
        { label: '5%', value: '5' },
        { label: '10%', value: '10' },
        { label: '15', value: '15%' }
      ]
    }),
    []
  )
  const { setFieldValue } = useFormikContext()
  const onChangeCallback = useCallback(
    (value?: string) => {
      setFieldValue('dataSource', value)
    },
    [setFieldValue]
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 6 }), [zIndex]) as CSSProperties
  return (
    <FormInput.CustomRender
      name="trafficSplit"
      label={i18n.fieldLabels.trafficSplit}
      style={style}
      render={() => <MultiTypeInput selectProps={selectProps} onChange={onChangeCallback} />}
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
  const { setFieldValue } = useFormikContext()
  const onChangeCallback = useCallback(
    (value?: string) => {
      setFieldValue('baseline', value)
    },
    [setFieldValue]
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 5 }), [zIndex]) as CSSProperties
  return (
    <FormInput.CustomRender
      name="baseline"
      label={i18n.fieldLabels.baseline}
      style={style}
      render={() => <MultiTypeInput selectProps={selectProps} onChange={onChangeCallback} />}
    />
  )
}

export function DataSource(props: BaseFieldProps): JSX.Element {
  const selectProps = useMemo(
    () => ({
      items: [
        { label: 'App Dynamics', value: '12314234' },
        { label: 'Splunk', value: '456546546' }
      ]
    }),
    []
  )
  const { setFieldValue } = useFormikContext()
  const onChangeCallback = useCallback(
    (value?: string) => {
      setFieldValue('dataSource', value)
    },
    [setFieldValue]
  )
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 4 }), [zIndex]) as CSSProperties
  return (
    <FormInput.CustomRender
      name="dataSource"
      label={i18n.fieldLabels.dataSource}
      style={style}
      render={() => <MultiTypeInput selectProps={selectProps} onChange={onChangeCallback} />}
    />
  )
}
