import React, { Dispatch, SetStateAction } from 'react'
import { noop } from 'lodash-es'
import { Container, FormInput, SelectOption } from '@wings-software/uicore'
import {
  HarnessEnvironmentAsFormField,
  HarnessServiceAsFormField
} from '@cv/components/HarnessServiceAndEnvironment/HarnessServiceAndEnvironment'
import { useStrings } from 'framework/strings'
import { PrometheusGroupName } from './components/PrometheusGroupName/PrometheusGroupName'
import { MapPrometheusQueryToServiceFieldNames } from '../../constants'
import css from './MapPrometheusMetricToService.module.scss'

export interface MapMetricToServiceProps {
  onChange: (name: string, value: SelectOption) => void
  serviceValue?: SelectOption
  environmentValue?: SelectOption
  groupNameValue?: SelectOption
  serviceOptions: SelectOption[]
  groupNames?: SelectOption[]
  setPrometheusGroupNames: Dispatch<SetStateAction<SelectOption[]>>
  setServiceOptions: Dispatch<SetStateAction<SelectOption[]>>
  environmentOptions: SelectOption[]
  setEnvironmentOptions: Dispatch<SetStateAction<SelectOption[]>>
}

export function MapPrometheusMetricToService(props: MapMetricToServiceProps): JSX.Element {
  const {
    onChange,
    serviceValue,
    environmentValue,
    serviceOptions,
    environmentOptions,
    setEnvironmentOptions,
    setServiceOptions,
    groupNames,
    groupNameValue,
    setPrometheusGroupNames
  } = props
  const { getString } = useStrings()

  return (
    <Container className={css.main}>
      <FormInput.Text
        label={getString('cv.monitoringSources.metricNameLabel')}
        name={MapPrometheusQueryToServiceFieldNames.METRIC_NAME}
      />
      <PrometheusGroupName
        groupNames={groupNames}
        onChange={onChange}
        item={groupNameValue}
        setPrometheusGroupNames={setPrometheusGroupNames}
      />
      <HarnessServiceAsFormField
        customRenderProps={{
          name: MapPrometheusQueryToServiceFieldNames.SERVICE,
          label: getString('service')
        }}
        serviceProps={{
          item: serviceValue,
          options: serviceOptions,
          onSelect: noop,
          onNewCreated: newService => {
            if (newService?.name && newService.identifier) {
              const newServiceOption = { label: newService.name, value: newService.identifier }
              onChange(MapPrometheusQueryToServiceFieldNames.SERVICE, newServiceOption)
              setServiceOptions(oldServices => [newServiceOption, ...oldServices])
            }
          }
        }}
      />
      <HarnessEnvironmentAsFormField
        customRenderProps={{
          name: MapPrometheusQueryToServiceFieldNames.ENVIRONMENT,
          label: getString('environment')
        }}
        environmentProps={{
          item: environmentValue,
          options: environmentOptions,
          onSelect: noop,
          onNewCreated: newEnv => {
            if (newEnv?.name && newEnv.identifier) {
              const newEnvOption = { label: newEnv.name, value: newEnv.identifier }
              onChange(MapPrometheusQueryToServiceFieldNames.ENVIRONMENT, newEnvOption)
              setEnvironmentOptions(oldEnvs => [newEnvOption, ...oldEnvs])
            }
          }
        }}
      />
    </Container>
  )
}
