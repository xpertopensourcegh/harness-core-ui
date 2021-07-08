import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { Container, Formik, FormInput, Layout } from '@wings-software/uicore'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetAppDynamicsApplications, useGetMetricPacks, useGetAppDynamicsTiers } from 'services/cv'
import { PageError } from '@common/components/Page/PageError'
import { useToaster } from '@common/components/Toaster/useToaster'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import { useStrings } from 'framework/strings'
import CardWithOuterTitle from '@cv/pages/health-source/common/CardWithOuterTitle'
import DrawerFooter from '@cv/pages/health-source/common/DrawerFooter'
import { SetupSourceTabsContext } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import { createAppDPayload } from './AppDMonitringSource.utils'

export default function AppDMonitringSource({
  data,
  onSubmit
}: {
  data: any
  onSubmit: (formdata: any, healthSourcePayload: any) => void
}): JSX.Element {
  const { getString } = useStrings()
  const { showError } = useToaster()
  const { onPrevious } = useContext(SetupSourceTabsContext)
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const connectorIdentifier = data?.connectorRef?.connector?.identifier || data?.connectorRef
  const {
    data: metricPacks,
    refetch: refetchMetricPacks,
    error: metricPackError
  } = useGetMetricPacks({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier,
      dataSourceType: 'APP_DYNAMICS'
    }
  })
  const {
    data: applicationsData,
    loading: applicationLoading,
    error: applicationError
  } = useGetAppDynamicsApplications({
    queryParams: {
      accountId,
      connectorIdentifier,
      orgIdentifier,
      projectIdentifier,
      offset: 0,
      pageSize: 10000,
      filter: ''
    }
  })

  const {
    data: tierData,
    loading: tierLoading,
    refetch: refetchTier,
    error: tierError
  } = useGetAppDynamicsTiers({
    lazy: true
  })

  useEffect(() => {
    if (data?.appdApplicationName) {
      refetchTier({
        queryParams: {
          appName: data?.appdApplicationName,
          accountId,
          connectorIdentifier,
          orgIdentifier,
          projectIdentifier,
          offset: 0,
          pageSize: 10000,
          filter: ''
        }
      })
    }
  }, [applicationsData])

  const applicationContent = applicationsData?.data?.content || []
  const tierContent = tierData?.data?.content || []

  if (applicationError || tierError) {
    tierError && showError(tierError?.message)
    applicationError && showError(applicationError?.message)
  }

  const applicationOptions = applicationLoading
    ? [{ label: 'Loading', value: 'loading' }]
    : applicationContent.map(item => {
        return { value: item.id as unknown as string, label: item.name as string }
      }) || []

  const tierOptions = tierLoading
    ? [{ label: 'Loading', value: 'loading' }]
    : tierContent.map(item => {
        return { value: item.id as unknown as string, label: item.name as string }
      }) || []

  const metricAppD: { [key: string]: any } = {}
  data?.metricPacks?.forEach((i: { identifier: number }) => (metricAppD[i.identifier] = true))
  const initPayload = {
    ...data,
    appdApplication: isNaN(data?.appdApplicationName) ? '' : Number(data?.appdApplicationName),
    appDTier: isNaN(data?.appdTierName) ? '' : Number(data?.appdTierName),
    metricAppD
  }

  const validate = () => {
    return Yup.object().shape({
      appDTier: Yup.number().required(getString('cv.healthSource.connectors.AppDynamics.validation.tier')),
      appdApplication: Yup.number().required(getString('cv.healthSource.connectors.AppDynamics.validation.application'))
    })
  }

  return (
    <Formik
      formName={'appDHealthSourceform'}
      validationSchema={validate()}
      initialValues={initPayload}
      onSubmit={async values => {
        const appDPayload = createAppDPayload(values)
        await onSubmit(values, appDPayload)
      }}
    >
      {formik => {
        return (
          <>
            <CardWithOuterTitle title={getString('cv.healthSource.connectors.AppDynamics.applicationsAndTiers')}>
              <Layout.Horizontal spacing={'large'}>
                <Container margin={{ bottom: 'large' }} width={'400px'}>
                  <FormInput.Select
                    onChange={item => {
                      refetchTier({
                        queryParams: {
                          appName: item.value.toString(),
                          accountId,
                          connectorIdentifier,
                          orgIdentifier,
                          projectIdentifier,
                          offset: 0,
                          pageSize: 10000
                        }
                      })
                    }}
                    name={'appdApplication'}
                    placeholder={
                      applicationLoading
                        ? getString('loading')
                        : getString('cv.healthSource.connectors.AppDynamics.applicationPlaceholder')
                    }
                    items={applicationOptions}
                    label={getString('cv.healthSource.connectors.AppDynamics.applicationLabel')}
                  />
                </Container>
                {formik.values.appdApplication && (
                  <Container margin={{ bottom: 'large' }} width={'400px'}>
                    <FormInput.Select
                      name={'appDTier'}
                      placeholder={
                        tierLoading
                          ? getString('loading')
                          : getString('cv.healthSource.connectors.AppDynamics.tierPlaceholder')
                      }
                      items={tierOptions}
                      label={getString('cv.healthSource.connectors.AppDynamics.trierLabel')}
                    />
                  </Container>
                )}
              </Layout.Horizontal>
            </CardWithOuterTitle>
            <CardWithOuterTitle title={getString('metricPacks')}>
              <Layout.Horizontal spacing={'large'}>
                {metricPacks?.resource?.map(mp => (
                  <FormInput.CheckBox
                    margin={'large'}
                    name={`metricAppD.${mp.identifier}`}
                    key={mp.identifier}
                    label={mp.identifier || ''}
                  />
                ))}
                {metricPackError?.data && (
                  <PageError message={getErrorMessage(metricPackError)} onClick={() => refetchMetricPacks()} />
                )}
              </Layout.Horizontal>
            </CardWithOuterTitle>
            <DrawerFooter isSubmit onPrevious={() => onPrevious(formik.values)} onNext={() => formik.submitForm()} />
          </>
        )
      }}
    </Formik>
  )
}
