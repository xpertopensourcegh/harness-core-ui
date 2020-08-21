import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Container, Button, Text } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import xhr from '@wings-software/xhr-async'
import CVProductCard, { TypeCard } from 'modules/cv/components/CVProductCard/CVProductCard'
import {
  routeCVDataSourcesEntityPage,
  routeCVOnBoardingSetup,
  routeCVDataSources,
  routeCVSplunkInputTypePage
} from 'modules/cv/routes'
import { Page } from 'modules/common/exports'
import { CVNextGenCVConfigService } from 'modules/cv/services'
import { routeParams } from 'framework/exports'
import { DataSourceRoutePaths } from 'modules/cv/routePaths'
import { CVObjectStoreNames } from 'modules/cv/hooks/IndexedDBHook/IndexedDBHook'
import useOnBoardingPageDataHook from 'modules/cv/hooks/OnBoardingPageDataHook/OnBoardingPageDataHook'
import i18n from './DataSourceProductPage.i18n'
import css from './DataSourceProductPage.module.scss'

type PageContextData = { isEdit?: boolean; dataSourceId?: string }

const XHR_DATA_SOURCE_PRODUCTS_GROUP = 'XHR_DATA_SOURCE_PRODUCTS_GROUP'
const ProductOptions: { [datasourceType: string]: Array<{ item: TypeCard }> } = {
  [DataSourceRoutePaths.APP_DYNAMICS]: [
    {
      item: {
        title: 'Application Monitoring',
        icon: 'service-appdynamics'
      }
    }
  ],
  [DataSourceRoutePaths.SPLUNK]: [
    {
      item: {
        title: 'Splunk Enterprise',
        icon: 'service-splunk-with-name',
        iconSize: 40
      }
    }
  ]
}

function getLinkForCreationFlow(dataSource: string, projectIdentifier: string, orgId: string): string {
  switch (dataSource) {
    case DataSourceRoutePaths.SPLUNK:
      return routeCVSplunkInputTypePage.url({ dataSourceType: dataSource, orgId, projectIdentifier })
    default:
      return routeCVDataSourcesEntityPage.url({ dataSourceType: dataSource, orgId, projectIdentifier })
  }
}

function getProductDetails(
  dataSourceType?: string
): {
  productOptions: Array<{ item: TypeCard }>
  productDescription: string
} {
  switch (dataSourceType) {
    case DataSourceRoutePaths.APP_DYNAMICS:
      return {
        productOptions: ProductOptions[DataSourceRoutePaths.APP_DYNAMICS],
        productDescription: i18n['app-dynamics'].productDescription
      }
    case DataSourceRoutePaths.SPLUNK:
      return {
        productOptions: ProductOptions[DataSourceRoutePaths.SPLUNK],
        productDescription: i18n['splunk'].productDescription
      }
    default:
      return {
        productOptions: [],
        productDescription: ''
      }
  }
}

export default function AppDynamicsProductPage(): JSX.Element {
  const {
    params: {
      accountId,
      dataSourceType: routeDataSourceType = '',
      projectIdentifier: routeProjectId,
      orgId: routeOrgId
    },
    query: { dataSourceId: routeDataSourceId = '' }
  } = routeParams()
  const { pageData = {}, isInitializingDB, dbInstance } = useOnBoardingPageDataHook<PageContextData>(
    (routeDataSourceId as string) || ''
  )
  const dataSourceId: string = (routeDataSourceId as string) || pageData.dataSourceId || ''
  const projectId = routeProjectId as string
  const orgId = routeOrgId as string
  const dataSourceType = routeDataSourceType as string
  const [isLoading, setLoading] = useState(isInitializingDB || pageData.isEdit)
  const [{ displayError, noData }, setDisplayError] = useState<{ displayError?: string; noData?: string }>({})
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const history = useHistory()
  const { productOptions, productDescription } = useMemo(() => getProductDetails(dataSourceType), [dataSourceType])
  useEffect(() => {
    if (isInitializingDB) {
      return
    }
    if (!pageData.isEdit) {
      setLoading(false)
      return
    }
    CVNextGenCVConfigService.fetchProducts({
      group: XHR_DATA_SOURCE_PRODUCTS_GROUP,
      accountId,
      projectId,
      orgId,
      dataSourceConnectorId: dataSourceId
    }).then(({ error, response, status }) => {
      if (status === xhr.ABORTED) {
        return
      } else if (error) {
        setDisplayError({ displayError: error })
      } else if (response?.resource?.length) {
        setSelectedProducts(response.resource)
      } else {
        setDisplayError({ noData: 'No data was found.' })
      }
      setLoading(false)
    })
    return () => xhr.abort(XHR_DATA_SOURCE_PRODUCTS_GROUP)
  }, [dataSourceId, pageData.isEdit, accountId, isInitializingDB, projectId, orgId])

  const urlParams = useMemo(
    () => ({
      pathname: pageData.isEdit
        ? routeCVOnBoardingSetup.url({ dataSourceType, projectIdentifier: projectId, orgId })
        : getLinkForCreationFlow(dataSourceType, projectId, orgId),
      search: `?dataSourceId=${dataSourceId}`,
      state: { products: selectedProducts, isEdit: pageData.isEdit, dataSourceId }
    }),
    [selectedProducts, dataSourceType, dataSourceId, pageData.isEdit, orgId, projectId]
  )
  const onProductCardClickHandler = useCallback(
    (item?: TypeCard) => {
      if (!item?.title) {
        return
      }
      if (!selectedProducts.includes(item.title)) {
        setSelectedProducts([...selectedProducts, item.title])
      } else {
        setSelectedProducts(selectedProducts.filter(product => product !== item.title))
      }
    },
    [selectedProducts]
  )
  const routeToDataSourcePage = () => history.replace(routeCVDataSources.url({ projectIdentifier: projectId, orgId }))
  return (
    <>
      <Page.Header title={i18n.pageTitle} />
      <Page.Body
        loading={isLoading}
        error={displayError}
        noData={{
          when: () => Boolean(noData?.length),
          icon: 'warning-sign',
          ...i18n.noDataContent,
          onClick: routeToDataSourcePage
        }}
      >
        <Container className={css.main}>
          <Container className={css.contentContainer}>
            <Container className={css.sourcesGrid}>
              {productOptions.map(option => (
                <CVProductCard
                  item={option.item}
                  key={option.item.title}
                  onClick={onProductCardClickHandler}
                  selected={selectedProducts.includes(option.item.title)}
                />
              ))}
            </Container>
            <Text className={css.productDescriptions}>{productDescription}</Text>
            <Container className={css.buttonContainer}>
              <Button className={css.backButton} onClick={routeToDataSourcePage}>
                {i18n.backButton}
              </Button>
              <Button
                disabled={!selectedProducts?.length}
                intent="primary"
                onClick={() => {
                  history.push(urlParams)
                  dbInstance?.put(CVObjectStoreNames.ONBOARDING_JOURNEY, {
                    products: selectedProducts,
                    isEdit: pageData.isEdit,
                    dataSourceId
                  })
                }}
              >
                {i18n.nextButton}
              </Button>
            </Container>
          </Container>
        </Container>
      </Page.Body>
    </>
  )
}
