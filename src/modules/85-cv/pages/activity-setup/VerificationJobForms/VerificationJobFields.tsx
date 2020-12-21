import React, { useMemo, CSSProperties, useEffect, useState } from 'react'
import { FormInput, SelectOption, MultiTypeInputType, MultiSelectOption } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import {
  useGetServiceListForProject,
  useGetEnvironmentListForProject,
  EnvironmentResponseDTO,
  ServiceResponseDTO
} from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { useListAllActivitySources, useListAllSupportedDataSource, useListBaselineExecutions } from 'services/cv'
import { getMonitoringSourceLabel } from '@cv/pages/admin/setup/SetupUtils'
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
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { data: serviceOptions } = useGetServiceListForProject({
    queryParams: { accountId, projectIdentifier: projectIdentifier as string, orgIdentifier: orgIdentifier as string },
    resolve: serviceList =>
      serviceList?.data?.content?.map(({ identifier }: ServiceResponseDTO) => ({
        label: identifier,
        value: identifier
      }))
  })
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 9 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="service"
      style={style}
      label={i18n.fieldLabels.service}
      selectItems={serviceOptions as SelectOption[]}
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
        { label: '5 min', value: '5m' },
        { label: '10 min', value: '10m' },
        { label: '30 min', value: '30m' }
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
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { data: environmentOptions } = useGetEnvironmentListForProject({
    queryParams: { accountId, projectIdentifier: projectIdentifier as string, orgIdentifier: orgIdentifier as string },
    resolve: envList =>
      envList?.data.content?.map(({ identifier }: EnvironmentResponseDTO) => ({
        label: identifier,
        value: identifier
      })) || []
  })
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 7 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="environment"
      style={style}
      label={i18n.fieldLabels.environment}
      selectItems={environmentOptions as SelectOption[]}
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

export function BaselineSelect(props: BaseFieldProps): JSX.Element {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [baselineOption, setBaselineOption] = useState([
    { label: i18n.baselineDefaultLabel.lastSuccess, value: 'LAST' },
    { label: i18n.baselineDefaultLabel.pinBaseline, value: 'PIN' }
  ])
  const { data } = useListBaselineExecutions({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  useEffect(() => {
    if (data?.resource?.length) {
      const options = data.resource.map(item => {
        return {
          label: new Date(item?.createdAt || 0),
          value: item.verificationJobInstanceId
        }
      })
      setBaselineOption(baselineOption.concat(options as any))
    }
  }, [data])

  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 5 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiTypeInput
      name="baseline"
      style={style}
      label={i18n.fieldLabels.baseline}
      selectItems={baselineOption}
      multiTypeInputProps={{
        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
      }}
    />
  )
}

// Remove this after old onboarding is removed
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

export function DataSources(props: BaseFieldProps & { formik: FormikProps<any> }): JSX.Element {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [monitoringOptions, setMonitoringOptions] = useState([{ label: 'All', value: 'All' }])
  const { data } = useListAllSupportedDataSource({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })
  let options: MultiSelectOption[]
  useEffect(() => {
    if (data?.resource?.length) {
      options = data.resource.map(item => {
        return {
          label: getMonitoringSourceLabel(item),
          value: item
        }
      })
      setMonitoringOptions(monitoringOptions.concat(options as any))
      props.formik.setFieldValue('dataSourceOptions', options)
    }
  }, [data])
  const { zIndex } = props
  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 4 }), [zIndex]) as CSSProperties
  return (
    <FormInput.MultiSelect
      name="dataSource"
      style={style}
      label={i18n.fieldLabels.dataSource}
      items={monitoringOptions}
    />
  )
}

export const ActivitySource: React.FC<BaseFieldProps> = props => {
  const { getString } = useStrings()
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [activityOptions, setActivityOptions] = useState([])
  const { zIndex } = props
  const { data } = useListAllActivitySources({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier,
      offset: 0,
      pageSize: 100
    }
  })

  useEffect(() => {
    if (data?.resource?.content?.length) {
      const options = data.resource.content.map(item => {
        return {
          label: item.name,
          value: { identifier: item.identifier, type: item.type }
        }
      })
      setActivityOptions(options as any)
    }
  }, [data])

  const style: CSSProperties = useMemo(() => ({ zIndex: zIndex ?? 4 }), [zIndex]) as CSSProperties
  return (
    <FormInput.Select
      name="activitySource"
      style={style}
      label={getString('activitySource')}
      items={activityOptions as SelectOption[]}
    />
  )
}
