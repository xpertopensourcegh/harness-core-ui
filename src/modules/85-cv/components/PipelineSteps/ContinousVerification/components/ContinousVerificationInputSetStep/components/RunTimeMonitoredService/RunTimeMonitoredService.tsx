import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { FormInput } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { HealthSource, useGetMonitoredServiceFromServiceAndEnvironment } from 'services/cv'
import { useStrings } from 'framework/strings'
import Card from '@cv/components/Card/Card'
import type { MonitoringSourceData, RunTimeMonitoredServiceProps } from './RunTimeMonitoredService.types'
import HealthSources from '../../../HealthSources/HealthSources'
import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'
import css from './RunTimeMonitoredService.module.scss'

export default function RunTimeMonitoredService({
  serviceIdentifier,
  envIdentifier,
  onUpdate,
  prefix,
  initialValues
}: RunTimeMonitoredServiceProps): JSX.Element {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps & AccountPathProps>()
  const { getString } = useStrings()
  const [monitoringSource, setMonitoringSourceData] = useState<MonitoringSourceData>({
    name: '',
    sources: { healthSources: [] }
  })

  const { data, loading, error } = useGetMonitoredServiceFromServiceAndEnvironment({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier,
      environmentIdentifier: envIdentifier,
      serviceIdentifier
    }
  })
  const monitoredServiceData = data?.data

  useEffect(() => {
    if (!loading && !error && envIdentifier && serviceIdentifier) {
      const healthSources =
        monitoredServiceData?.sources?.healthSources?.map(el => {
          return { identifier: (el as HealthSource)?.identifier }
        }) || []

      const newMonitoredServiceData = {
        serviceName: monitoredServiceData?.name,
        healthSources: healthSources as { identifier: string }[]
      }

      onUpdate?.({
        ...initialValues,
        spec: {
          ...initialValues?.spec,
          ...newMonitoredServiceData,
          spec: { ...initialValues.spec.spec }
        }
      })

      setMonitoringSourceData(monitoredServiceData as MonitoringSourceData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoredServiceData, error, loading, envIdentifier, serviceIdentifier])

  if (isEmpty(serviceIdentifier) || isEmpty(envIdentifier)) {
    return (
      <div className={css.emptyFields}>
        {isEmpty(serviceIdentifier) ? (
          <div className={css.emptyFieldItem}>
            {getString('connectors.cdng.runTimeMonitoredService.specifyService')}
          </div>
        ) : null}
        {isEmpty(envIdentifier) ? (
          <div className={css.emptyFieldItem}>{getString('connectors.cdng.runTimeMonitoredService.specifyEnv')}</div>
        ) : null}
      </div>
    )
  } else if (loading) {
    return (
      <Card>
        <>{getString('connectors.cdng.monitoredService.fetchingMonitoredService')}</>
      </Card>
    )
  } else if (error) {
    return (
      <Card>
        <>{getString('connectors.cdng.runTimeMonitoredService.fetchingMonitoredServiceError')}</>
      </Card>
    )
  } else if (!isEmpty(monitoringSource?.name) && !isEmpty(monitoringSource?.sources?.healthSources)) {
    return (
      <>
        <Card>
          <div className={cx(stepCss.formGroup)}>
            <FormInput.CustomRender
              name={`${prefix}spec.monitoredServiceRef`}
              label={getString('connectors.cdng.monitoredService.label')}
              render={() => <>{monitoringSource?.name}</>}
            />
          </div>
        </Card>
        <HealthSources healthSources={monitoredServiceData?.sources?.healthSources} isRunTimeInput={true} />
      </>
    )
  } else if (isEmpty(monitoringSource?.name)) {
    return (
      <Card>
        <div className={css.error}>
          {getString('connectors.cdng.runTimeMonitoredService.noMonitoringSercvicePresent')}
        </div>
      </Card>
    )
  } else if (isEmpty(monitoringSource?.sources?.healthSources)) {
    return (
      <Card>
        <div className={css.error}>{getString('connectors.cdng.runTimeMonitoredService.noHealthSourcePresent')}</div>
      </Card>
    )
  }
  return <></>
}
