import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'
import { Container, Heading, Color, Button, Text, SelectOption } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import { routeCVOnBoardingSetup, routeCVDataSourcesProductPage, routeCVDataSources } from 'modules/cv/routes'
import { AppDynamicsService, CVNextGenCVConfigService } from 'modules/cv/services'
import { transformQueriesFromSplunk } from 'modules/cv/pages/onboarding/Splunk/SplunkOnboardingUtils'
import { transformAppDynamicsApplications } from 'modules/cv/pages/onboarding/AppDynamics/AppDynamicsOnboardingUtils'
import DataSourceSelectEntityTable from 'modules/cv/components/DataSourceSelectEntityTable/DataSourceSelectEntityTable'
import { routeParams, linkTo } from 'framework/exports'
import { Page } from 'modules/common/exports'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import { CVObjectStoreNames, CVIndexedDBPrimaryKeys } from 'modules/cv/hooks/IndexedDBHook/IndexedDBHook'
import useOnBoardingPageDataHook from 'modules/cv/hooks/OnBoardingPageDataHook/OnBoardingPageDataHook'
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

type PageContextData = { isEdit?: boolean; dataSourceId?: string; products: string[] }

function createNextPageData(pageData: any): PageContextData {
  const pageContextData: { [key: string]: any } = {}
  for (const key of ['isEdit', 'dataSourceId', 'products']) {
    pageContextData[key] = pageData[key]
  }
  return pageContextData as PageContextData
}

export default function DataSourceListEntitySelect(): JSX.Element {
  const {
    params: { accountId, dataSourceType = '' },
    query: { dataSourceId: routeDataSourceId }
  } = routeParams()
  const { pageData, dbInstance } = useOnBoardingPageDataHook<PageContextData>(routeDataSourceId as string)
  const [{ pageError, noEntities }, setErrorOrNoData] = useState<{ pageError?: string; noEntities?: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [entityOptions, setEntityOptions] = useState<SelectOption[]>([])
  const [enableNext, setEnableNext] = useState<boolean>(false)
  const history = useHistory()
  const dataSourceId: string = (routeDataSourceId as string) || pageData?.dataSourceId || ''

  const [navigateWithSelectedApps, setNavigationFunction] = useState<
    (selectedEntities: SelectOption[]) => void | undefined
  >()
  const onClickNextCallback = useCallback(
    () => (selectedEntities: SelectOption[]) => {
      const newPageData = { ...createNextPageData(pageData), selectedEntities }
      history.push({
        pathname: linkTo(routeCVOnBoardingSetup, { dataSourceType }, true),
        search: `?dataSourceId=${dataSourceId}`,
        state: newPageData
      })
      dbInstance?.put(CVObjectStoreNames.ONBOARDING_JOURNEY, newPageData)
      dbInstance?.put(CVObjectStoreNames.LIST_ENTITIES, {
        [CVIndexedDBPrimaryKeys.DATASOURCE_ID]: dataSourceId,
        entityOptions
      })
    },
    [pageData, dataSourceId, history, dataSourceType, entityOptions, dbInstance?.put]
  )
  const verificationTypeI18N = useMemo(
    () => (dataSourceType === 'app-dynamics' || dataSourceType === 'splunk' ? i18n[dataSourceType] : undefined),
    [dataSourceType]
  )

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
      dataSourceId,
      xhrGroup: XHR_FETCH_ENTITIES_GROUP
    }).then(({ status, error, response }) => {
      if (status === xhr.ABORTED) {
        return
      } else if (error?.message) {
        setErrorOrNoData({ pageError: error.message })
      } else if (response?.resource?.length) {
        setEntityOptions(entityTransformFunc(response.resource))
      } else {
        setErrorOrNoData({ noEntities: true })
      }
      setLoading(false)
    })
  }, [accountId, dataSourceType, dataSourceId])
  return (
    <>
      <Page.Header title={verificationTypeI18N?.pageTitle} />
      <Page.Body
        error={pageError}
        loading={loading}
        noData={{
          when: () => Boolean(noEntities),
          icon: 'warning-sign',
          ...i18n.noDataContent,
          onClick: () => history.replace(linkTo(routeCVDataSources))
        }}
      >
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
                  state: { ...pageData }
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
