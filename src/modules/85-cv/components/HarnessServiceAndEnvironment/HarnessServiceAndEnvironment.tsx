import React, { useState, useEffect } from 'react'
import type { SelectOption } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import {
  useGetServiceListForProject,
  GetServiceListForProjectQueryParams,
  useGetEnvironmentListForProject,
  GetEnvironmentListForProjectQueryParams
} from 'services/cd-ng'
import { useToaster } from '@common/exports'
import {
  EnvironmentSelect,
  EnvironmentSelectProps
} from '@cv/pages/monitoring-source/app-dynamics/SelectApplications/EnvironmentSelect'
import { ServiceSelectOrCreate, ServiceSelectOrCreateProps } from '../ServiceSelectOrCreate/ServiceSelectOrCreate'
import css from './HarnessServiceAndEnvironment.module.scss'

export function useGetHarnessServices() {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { getString } = useStrings()
  const { showError, clear } = useToaster()
  const [serviceOptions, setServiceOptions] = useState<SelectOption[]>([])
  const { error, loading, data } = useGetServiceListForProject({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    } as GetServiceListForProjectQueryParams
  })

  useEffect(() => {
    if (loading) {
      setServiceOptions([{ label: getString('loading'), value: '' }])
    } else if (error) {
      clear()
      showError(error?.message, 7000)
      setServiceOptions([])
    } else if (data?.data?.content) {
      const options = []
      for (const service of data.data.content) {
        if (service?.identifier && service.name) {
          options.push({
            label: service.name,
            value: service.identifier
          })
        }
      }
      setServiceOptions(options)
    }
  }, [loading, error, data])

  return { serviceOptions, setServiceOptions }
}

export function useGetHarnessEnvironments() {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { getString } = useStrings()
  const { showError, clear } = useToaster()
  const [environmentOptions, setEnvironmentOptions] = useState<SelectOption[]>([])
  const { error, loading, data } = useGetEnvironmentListForProject({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    } as GetEnvironmentListForProjectQueryParams
  })

  useEffect(() => {
    if (loading) {
      setEnvironmentOptions([{ label: getString('loading'), value: '' }])
    } else if (error) {
      clear()
      showError(error?.message, 7000)
      setEnvironmentOptions([])
    } else if (data?.data?.content) {
      const options = []
      for (const service of data.data.content) {
        if (service?.identifier && service.name) {
          options.push({
            label: service.name,
            value: service.identifier
          })
        }
      }
      setEnvironmentOptions(options)
    }
  }, [loading, error, data])

  return { environmentOptions, setEnvironmentOptions }
}

export function HarnessService(props: ServiceSelectOrCreateProps): JSX.Element {
  return <ServiceSelectOrCreate {...props} className={cx(css.serviceEnvDropdown, props.className)} />
}

export function HarnessEnvironment(props: EnvironmentSelectProps): JSX.Element {
  return <EnvironmentSelect {...props} className={cx(css.serviceEnvDropdown, props.className)} />
}
