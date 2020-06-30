import React, { useState, useCallback, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router'
import { Container, Heading, Color, Button, Text, SelectOption } from '@wings-software/uikit'
import css from './DataSourceListEntityPage.module.scss'
import { routeCVOnBoardingSetup, routeCVDataSourcesProductPage } from 'modules/cv/routes'
import DataSourceSelectEntityTable from 'modules/cv/components/DataSourceSelectEntityTable/DataSourceSelectEntityTable'
import i18n from './SelectListEntityPage.i18n'
import { connectorId } from 'modules/cv/constants'
import { routeParams } from 'framework/exports'
import { Page } from 'modules/common/exports'

export default function DataSourceListEntitySelect(): JSX.Element {
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
        pathname: routeCVOnBoardingSetup.url({ accountId, dataSourceType }),
        state: {
          ...locationData,
          selectedEntities,
          dataSourceId: locationData?.dataSourceId || connectorId
        }
      })
    },
    [locationData, history, dataSourceType, accountId]
  )
  const verificationTypeI18N = useMemo(() => {
    if (dataSourceType === 'app-dynamics' || dataSourceType === 'splunk') {
      return i18n[dataSourceType]
    }
  }, [dataSourceType])
  return (
    <Container className={css.main}>
      <Page.Header title={verificationTypeI18N?.pageTitle} />
      <Container className={css.contentContainer}>
        <Container className={css.infographic}>
          <Text>infographic</Text>
        </Container>
        <Container className={css.entityDescription}>
          <Heading level={2} color={Color.BLACK} className={css.entityTitle}>
            {verificationTypeI18N?.entityTitle}
          </Heading>
          <Heading level={3}>{verificationTypeI18N?.entitySubTitle}</Heading>
        </Container>
        <DataSourceSelectEntityTable
          datasourceId={connectorId}
          accountId={accountId}
          entityTableColumnName={verificationTypeI18N?.columnHeaderTitle || ''}
          verificationType={dataSourceType as string}
          onSubmit={navigateWithSelectedApps}
        />
      </Container>
      <Container className={css.buttonContainer}>
        <Button
          className={css.backButton}
          onClick={() =>
            history.replace({
              pathname: routeCVDataSourcesProductPage.url({ accountId, dataSourceType }),
              state: { ...locationData }
            })
          }
        >
          {i18n.backButton}
        </Button>
        <Button intent="primary" onClick={() => setNavigationFunction(onClickNextCallback)}>
          {i18n.nextButton}
        </Button>
      </Container>
    </Container>
  )
}
