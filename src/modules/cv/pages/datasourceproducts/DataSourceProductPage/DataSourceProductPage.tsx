import React, { useState, useCallback, useMemo } from 'react'
import { Container, Button, Heading, Color, Layout, Text } from '@wings-software/uikit'
import CVProductCard, { TypeCard } from 'modules/cv/components/CVProductCard/CVProductCard'
import { Link, useRouteMatch } from 'react-router-dom'
import css from './DataSourceProductPage.module.scss'
import i18n from './DataSourceProductPage.i18n'
import { routeCVDataSourcesAppDynamicsProductPage, routeCVOnBoardingSplunk } from 'modules/cv/routes'

const ProductOptions: { [datasourceType: string]: Array<{ item: TypeCard }> } = {
  'app-dynamics': [
    {
      item: {
        title: 'Application Monitoring',
        icon: 'service-appdynamics'
      }
    }
  ],
  splunk: [
    {
      item: {
        title: 'Splunk Enterprise',
        icon: 'service-splunk',
        iconSize: 25
      }
    }
  ]
}

const RouteForNextPage: { [datasourceType: string]: string } = {
  'app-dynamics': routeCVDataSourcesAppDynamicsProductPage.path,
  splunk: routeCVOnBoardingSplunk.path
}

export default function AppDynamicsProductPage(): JSX.Element {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const { params } = useRouteMatch<{ dataSourceType: string }>()
  const { productOptions, productDescription } = useMemo<{
    productOptions: Array<{ item: TypeCard }>
    productDescription: string
  }>(() => {
    switch (params?.dataSourceType) {
      case 'app-dynamics':
        return {
          productOptions: ProductOptions['app-dynamics'],
          productDescription: i18n['app-dynamics'].productDescription
        }
      case 'splunk':
        return {
          productOptions: ProductOptions['splunk'],
          productDescription: i18n['splunk'].productDescription
        }
      default:
        return {
          productOptions: [],
          productDescription: ''
        }
    }
  }, [params?.dataSourceType])

  const linkToParams = useMemo(
    () => ({
      pathname: RouteForNextPage[params?.dataSourceType],
      state: { products: selectedProducts }
    }),
    [selectedProducts, params?.dataSourceType]
  )

  const onProductCardClickHandler = useCallback(
    (item?: TypeCard) => {
      if (!item?.title) {
        return
      }
      if (!selectedProducts.includes(item.title)) {
        setSelectedProducts([...selectedProducts, item.title])
      } else {
        setSelectedProducts(selectedProducts.filter(product => product === item.title))
      }
    },
    [selectedProducts]
  )
  return (
    <Container className={css.main}>
      <Heading level={2} color={Color.BLACK} className={css.heading}>
        Select a Product
      </Heading>
      <Layout.Horizontal className={css.contentContainer}>
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
        <Container className={css.rightContainer}>
          <Text className={css.productDescriptions}>{productDescription}</Text>
          <Container className={css.buttonContainer}>
            <Button className={css.backButton}>Back</Button>
            <Link to={linkToParams}>
              <Button disabled={!selectedProducts?.length} intent="primary">
                Next
              </Button>
            </Link>
          </Container>
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}
