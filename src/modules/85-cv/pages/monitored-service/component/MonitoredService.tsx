import React, { useEffect, useMemo, useCallback } from 'react'
import { Formik, FormikContext } from 'formik'
import { useHistory, useParams } from 'react-router-dom'
import { PageSpinner } from '@common/components'
import { useStrings } from 'framework/strings'
import routes from '@common/RouteDefinitions'
import { MonitoredServiceResponse, useGetMonitoredService } from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import ServiceEnvironment from './serviceEnvironment/MonitoredServiceEnvironment'
import MonitoredServiceDetails from './monitoredServiceDetails/MonitoredServiceDetails'
import CardWithOuterTitle from '../../health-source/common/CardWithOuterTitle/CardWithOuterTitle'
import HealthSourceTable from '../../health-source/HealthSourceTable'
import type { MonitoredServiceForm } from './MonitoredService.types'
import { getInitFormData } from './MonitoredService.utils'

function MonitoredService(): JSX.Element {
  const { getString } = useStrings()
  const history = useHistory()
  const params = useParams<ProjectPathProps & { identifier: string }>()
  const isEdit = !!params?.identifier
  const {
    data: dataMonitoredServiceById,
    refetch,
    loading: loadingMonitoredServiceById
  } = useGetMonitoredService({
    lazy: true,
    identifier: params?.identifier,
    pathParams: {
      identifier: params?.identifier
    },
    queryParams: {
      orgIdentifier: params.orgIdentifier,
      projectIdentifier: params.projectIdentifier,
      accountId: params.accountId
    }
  })

  useEffect(() => {
    if (isEdit) {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])

  const onDelete = useCallback((data: MonitoredServiceResponse, formik: FormikContext<MonitoredServiceForm>): void => {
    formik.setFieldValue('sources', data?.monitoredService?.sources)
  }, [])

  const onSuccess = useCallback(
    (data: MonitoredServiceResponse, formik: FormikContext<MonitoredServiceForm>): void => {
      isEdit
        ? formik.setFieldValue('sources', data?.monitoredService?.sources)
        : history.push(
            routes.toCVMonitoringServices({
              orgIdentifier: params.orgIdentifier,
              projectIdentifier: params.projectIdentifier,
              accountId: params.accountId
            })
          )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEdit]
  )

  const initValue: MonitoredServiceForm = useMemo(
    () => getInitFormData(dataMonitoredServiceById?.data?.monitoredService, isEdit),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataMonitoredServiceById?.data?.monitoredService.name, isEdit]
  )

  return (
    <Formik<MonitoredServiceForm> initialValues={initValue} onSubmit={() => undefined} enableReinitialize>
      {formik => {
        const { name, identifier, description, tags, serviceRef, environmentRef } = formik?.values
        return (
          <div>
            {loadingMonitoredServiceById && <PageSpinner />}
            <MonitoredServiceDetails formik={formik} />
            <ServiceEnvironment formik={formik} />
            <CardWithOuterTitle title={getString('cv.healthSource.defineYourSource')}>
              <HealthSourceTable
                isEdit={isEdit}
                value={formik.values.sources?.healthSources || []}
                onSuccess={data => onSuccess(data, formik)}
                onDelete={data => onDelete(data, formik)}
                serviceRef={serviceRef}
                environmentRef={environmentRef}
                monitoredServiceRef={{
                  name,
                  identifier,
                  description,
                  tags
                }}
              />
            </CardWithOuterTitle>
          </div>
        )
      }}
    </Formik>
  )
}

export default MonitoredService
