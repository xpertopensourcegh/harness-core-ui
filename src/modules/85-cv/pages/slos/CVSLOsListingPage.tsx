import React, { useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Container, Text, Select, SelectOption } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { BGColorWrapper, HorizontalLayout } from '@cv/pages/health-source/common/StyledComponents'
import { NGBreadcrumbs } from '@common/components/NGBreadcrumbs/NGBreadcrumbs'
import { useGetMonitoredServiceListEnvironments } from 'services/cv'
import { getEnvironmentOptions } from '@cv/utils/CommonUtils'
import css from './CVSLOsListingPage.module.scss'

function CVSLOsListingPage(): JSX.Element {
  const { getString } = useStrings()
  const history = useHistory()
  const { orgIdentifier, projectIdentifier, accountId } = useParams<ProjectPathProps & { identifier: string }>()
  const [environment, setEnvironment] = useState<SelectOption>()
  const { data: environmentDataList, loading: loadingServices } = useGetMonitoredServiceListEnvironments({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  const environmentOptions = useMemo(
    () => getEnvironmentOptions(environmentDataList, loadingServices, getString),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [environmentDataList, loadingServices]
  )

  return (
    <BGColorWrapper>
      <Container className={css.header}>
        <Container className={css.title}>
          <NGBreadcrumbs />
          <p>{getString('cv.slos.title')}</p>
        </Container>
      </Container>

      <Container className={css.header}>
        <Button
          intent="primary"
          icon="plus"
          text={getString('cv.slos.newSLO')}
          margin={{ bottom: 'small' }}
          onClick={() => {
            history.push(
              routes.toCVCreateSLOs({
                orgIdentifier,
                projectIdentifier,
                accountId
              })
            )
          }}
        />
        <HorizontalLayout alignItem={'baseline'}>
          <Text margin={{ right: 'large' }} font={{ size: 'small', weight: 'bold' }}>
            {getString('cv.monitoredServices.filterlabel')}
          </Text>
          <Select
            value={environment}
            inputProps={{
              leftIcon: 'search'
            }}
            defaultSelectedItem={{ label: getString('all'), value: getString('all') }}
            items={environmentOptions}
            onChange={item => setEnvironment(item)}
          />
        </HorizontalLayout>
      </Container>
    </BGColorWrapper>
  )
}

export default CVSLOsListingPage
