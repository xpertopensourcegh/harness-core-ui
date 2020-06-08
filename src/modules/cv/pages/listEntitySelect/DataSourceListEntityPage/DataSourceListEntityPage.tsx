import React, { useState, useCallback, useMemo } from 'react'
import { useLocation, useHistory, useRouteMatch } from 'react-router'
import { Container, Heading, Color, Button, Text, SelectOption } from '@wings-software/uikit'
import css from './DataSourceListEntityPage.module.scss'
import { routeCVOnBoardingSetup } from '../../../routes'
import DataSourceSelectEntityTable from 'modules/cv/components/DataSourceSelectEntityTable/DataSourceSelectEntityTable'
import i18n from './SelectListEntityPage.i18n'
import {  accountId, connectorId } from 'modules/cv/constants' 

export default function DataSourceListEntitySelect(): JSX.Element {
  // navigation params to get context for the page
  const { state: locationData } = useLocation<{ products: string[] }>()
  const { params } = useRouteMatch<{ dataSourceType: 'app-dynamics' }>()
  const history = useHistory()

  const [navigateWithSelectedApps, setNavigationFunction] = useState<
    (selectedEntities: SelectOption[]) => void | undefined
  >()
  const onClickNextCallback = useCallback(
    () => (selectedEntities: SelectOption[]) => {
      history.push({
        pathname: routeCVOnBoardingSetup.url({ dataSourceType: params?.dataSourceType }),
        state: {
          ...locationData,
          selectedEntities
        }
      })
    },
    [locationData, history, params?.dataSourceType]
  )
  const verificationTypeI18N = useMemo(() => i18n[params.dataSourceType], [params.dataSourceType])
  return (
    <Container className={css.main}>
      <Heading level={2} color={Color.BLACK} className={css.heading}>
        {i18n.selectProduct}
      </Heading>
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
          datasourceId= {connectorId}
          accountId = {accountId}
          entityTableColumnName="Available Applications"
          verificationType={params.dataSourceType}
          onSubmit={navigateWithSelectedApps}
        />
      </Container>
      <Container className={css.buttonContainer}>
        <Button className={css.backButton}>{i18n.backButton}</Button>
        <Button intent="primary" onClick={() => setNavigationFunction(onClickNextCallback)}>
          {i18n.nextButton}
        </Button>
      </Container>
    </Container>
  )
}
