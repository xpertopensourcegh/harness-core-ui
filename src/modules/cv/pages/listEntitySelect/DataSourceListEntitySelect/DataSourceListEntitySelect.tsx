import React, { useState, useCallback } from 'react'
import { useLocation, useHistory, useRouteMatch } from 'react-router'
import { Container, Heading, Color, Button, Text, SelectOption } from '@wings-software/uikit'
import css from './DataSourceListEntitySelect.module.scss'
import { routeCVOnBoardingSetup } from '../../../routes'
import DataSourceSelectEntityTable from 'modules/cv/components/DataSourceSelectEntityTable/DataSourceSelectEntityTable'

export default function DataSourceListEntitySelect(): JSX.Element {
  // navigation params to get context for the page
  const { state: locationData } = useLocation<{ products: string[] }>()
  const { params } = useRouteMatch<{ dataSourceType: string }>()
  const history = useHistory()

  const [navigateWithSelectedApps, setNavigationFunction] = useState<
    (selectedEntities: SelectOption[]) => void | undefined
  >()
  const onClickNextCallback = useCallback(
    () => (selectedEntities: SelectOption[]) => {
      history.push(routeCVOnBoardingSetup.url({ dataSourceType: params?.dataSourceType }), {
        ...locationData,
        selectedEntities
      })
    },
    [locationData, history, params?.dataSourceType]
  )
  return (
    <Container className={css.main}>
      <Heading level={2} color={Color.BLACK} className={css.heading}>
        Select a Product
      </Heading>
      <Container className={css.contentContainer}>
        <Container className={css.infographic}>
          <Text>infographic</Text>
        </Container>
        <Container className={css.entityDescription}>
          <Heading level={2} color={Color.BLACK} className={css.entityTitle}>
            Select your AppDynamics Applications
          </Heading>
          <Heading level={3}>Saved queries from your AppDynamics product</Heading>
        </Container>
        <DataSourceSelectEntityTable
          datasourceId="kP-xxUWrRhuhuFlKYNyMrQ"
          accountId="kmpySmUISimoRrJL6NL73w"
          entityTableColumnName="Available Applications"
          verificationType={params.dataSourceType}
          onSubmit={navigateWithSelectedApps}
        />
        <Container className={css.buttonContainer}>
          <Button className={css.backButton}>Back</Button>
          <Button intent="primary" onClick={() => setNavigationFunction(onClickNextCallback)}>
            Next
          </Button>
        </Container>
      </Container>
    </Container>
  )
}
