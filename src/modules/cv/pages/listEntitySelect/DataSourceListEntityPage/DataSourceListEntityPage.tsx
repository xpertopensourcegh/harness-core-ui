import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router'
import { Container, Heading, Color, Button, Text, SelectOption } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import { routeCVOnBoardingSetup, routeCVDataSourcesProductPage } from 'modules/cv/routes'
import { AppDynamicsService, CVNextGenCVConfigService } from 'modules/cv/services'
import { transformQueriesFromSplunk } from 'modules/cv/pages/onboarding/Splunk/SplunkOnboardingUtils'
import { transformAppDynamicsApplications } from 'modules/cv/pages/onboarding/AppDynamics/AppDynamicsOnboardingUtils'
import DataSourceSelectEntityTable from 'modules/cv/components/DataSourceSelectEntityTable/DataSourceSelectEntityTable'
import { connectorId } from 'modules/cv/constants'
import { routeParams, linkTo } from 'framework/exports'
import { Page } from 'modules/common/exports'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import i18n from './SelectListEntityPage.i18n'
import css from './DataSourceListEntityPage.module.scss'

const XHR_FETCH_ENTITIES_GROUP = 'XHR_FETCH_ENTITIES_GROUP'

// map to call the appropriate service depending on data source
const VerificationTypeEntityCall: {
  [verificationType: string]: {
    entityFetchFunc: (
      ...params: Parameters<typeof AppDynamicsService.fetchAppDynamicsApplications>
    ) => ServiceResponse<any, 'response'>
    entityTransformFunc: (response: any) => SelectOption[]
  }
} = {
  'app-dynamics': {
    entityFetchFunc: AppDynamicsService.fetchAppDynamicsApplications,
    entityTransformFunc: transformAppDynamicsApplications
  },
  splunk: {
    entityFetchFunc: CVNextGenCVConfigService.fetchQueriesFromSplunk,
    entityTransformFunc: transformQueriesFromSplunk
  }
}

export default function DataSourceListEntitySelect(): JSX.Element {
  const [pageError, setError] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [entityOptions, setEntityOptions] = useState<SelectOption[]>([])
  const [enableNext, setEnableNext] = useState<boolean>(false)
  // navigation params to get context for the page
  const { state: locationData } = useLocation<{ products: string[]; dataSourceId?: string }>()
  const {
    params: { accountId, dataSourceType = '' }
  } = routeParams()
  const history = useHistory()

  const [navigateWithSelectedApps, setNavigationFunction] = useState<
    (selectedEntities: SelectOption[]) => void | undefined
  >()
  const onClickNextCallback = useCallback(
    () => (selectedEntities: SelectOption[]) => {
      history.push({
        pathname: linkTo(routeCVOnBoardingSetup, { dataSourceType }, true),
        state: {
          ...locationData,
          selectedEntities,
          dataSourceId: locationData?.dataSourceId || connectorId
        }
      })
    },
    [locationData, history, dataSourceType]
  )
  const verificationTypeI18N = useMemo(() => {
    if (dataSourceType === 'app-dynamics' || dataSourceType === 'splunk') {
      return i18n[dataSourceType]
    }
  }, [dataSourceType])

  const onSelectEntityCallback = useCallback(
    (_, ttlChecked: number) => {
      if (ttlChecked && !enableNext) {
        setEnableNext(true)
      } else if (!ttlChecked && enableNext) {
        setEnableNext(false)
      }
    },
    [enableNext]
  )

  useEffect(() => {
    const { entityFetchFunc, entityTransformFunc } = VerificationTypeEntityCall[dataSourceType || ''] || {}
    if (!entityFetchFunc || !entityTransformFunc) {
      return
    }
    entityFetchFunc({
      accountId,
      dataSourceId: locationData && locationData.dataSourceId ? locationData.dataSourceId : connectorId,
      xhrGroup: XHR_FETCH_ENTITIES_GROUP
    }).then(({ status, error, response }) => {
      if (status === xhr.ABORTED) {
        return
      } else if (error?.message) {
        setError(error.message)
      } else if (response?.resource?.length) {
        setEntityOptions(entityTransformFunc(response.resource))
      }
      setLoading(false)
    })
  }, [accountId, dataSourceType, locationData])
  return (
    <>
      <Page.Header title={verificationTypeI18N?.pageTitle} />
      <Page.Body error={pageError} loading={loading}>
        <Container className={css.main}>
          <Container className={css.contentContainer}>
            <Container className={css.infographic}>
              <Text>infographic</Text>
            </Container>
            <Container>
              <Container className={css.entityDescription}>
                <Heading level={2} color={Color.BLACK} className={css.entityTitle}>
                  {verificationTypeI18N?.entityTitle}
                </Heading>
                <Heading level={3}>{verificationTypeI18N?.entitySubTitle}</Heading>
              </Container>
              <DataSourceSelectEntityTable
                entityOptions={entityOptions}
                entityTableColumnName={verificationTypeI18N?.columnHeaderTitle || ''}
                onSubmit={navigateWithSelectedApps}
                onSelectEntity={onSelectEntityCallback}
              />
            </Container>
          </Container>
          <Container className={css.buttonContainer}>
            <Button
              className={css.backButton}
              onClick={() =>
                history.replace({
                  pathname: linkTo(routeCVDataSourcesProductPage, { dataSourceType }, true),
                  state: { ...locationData }
                })
              }
            >
              {i18n.backButton}
            </Button>
            <Button disabled={!enableNext} intent="primary" onClick={() => setNavigationFunction(onClickNextCallback)}>
              {i18n.nextButton}
            </Button>
          </Container>
        </Container>
      </Page.Body>
    </>
  )
}
