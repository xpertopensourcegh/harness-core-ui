import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
  Button,
  Container,
  Text,
  useToaster,
  ButtonVariation,
  FontVariation,
  CardSelect,
  CardSelectType,
  Card,
  NoDataCard
} from '@wings-software/uicore'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { NGBreadcrumbs } from '@common/components/NGBreadcrumbs/NGBreadcrumbs'
import { useDeleteSLOData, useGetAllJourneys, useGetServiceLevelObjectives, UserJourneyDTO } from 'services/cv'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import {
  LIST_SLOs_OFFSET,
  LIST_SLOs_PAGESIZE,
  LIST_USER_JOURNEYS_OFFSET,
  LIST_USER_JOURNEYS_PAGESIZE
} from './CVSLOsListingPage.constants'
import type { CVSLOsListingPageProps } from './CVSLOsListingPage.types'
import { getUserJourneys } from './components/CVCreateSLO/CVSLOsListingPage.utils'
import SLOCardHeader from './SLOCard/SLOCardHeader'
import css from './CVSLOsListingPage.module.scss'

const CVSLOsListingPage: React.FC<CVSLOsListingPageProps> = ({ monitoredServiceIdentifier }) => {
  const history = useHistory()
  const { getString } = useStrings()
  const { showError, showSuccess } = useToaster()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const [selectedUserJourney, setSelectedUserJourney] = useState<UserJourneyDTO>()

  const {
    data: SLOsData,
    loading: SLOsLoading,
    refetch: refetchSLOs,
    error: SLOsError
  } = useGetServiceLevelObjectives({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier,
      offset: LIST_SLOs_OFFSET,
      pageSize: LIST_SLOs_PAGESIZE,
      // monitoredServiceIdentifier, // Uncomment after BE supports this
      userJourneys: selectedUserJourney?.identifier ? [selectedUserJourney.identifier] : undefined
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    }
  })

  const {
    data: userJourneysData,
    loading: userJourneysLoading,
    error: userJourneysError,
    refetch: refetchUserJourneys
  } = useGetAllJourneys({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier,
      offset: LIST_USER_JOURNEYS_OFFSET,
      pageSize: LIST_USER_JOURNEYS_PAGESIZE
    }
  })

  const { mutate: deleteSLO, loading: deleteSLOLoading } = useDeleteSLOData({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    }
  })

  const onDelete = async (identifier: string, name: string): Promise<void> => {
    try {
      await deleteSLO(identifier)

      await refetchSLOs()

      showSuccess(getString('cv.slos.sloDeleted', { name }))
    } catch (e) {
      showError(getErrorMessage(e))
    }
  }

  const onAddNewSLO = (): void => {
    history.push(
      routes.toCVCreateSLOs({
        accountId,
        orgIdentifier,
        projectIdentifier
      })
    )
  }

  const onFilter = (userJourney: UserJourneyDTO): void => {
    if (selectedUserJourney?.identifier === userJourney.identifier) {
      setSelectedUserJourney(undefined)
    } else {
      setSelectedUserJourney(userJourney)
    }
  }

  return (
    <>
      {!monitoredServiceIdentifier && (
        <>
          <Page.Header breadcrumbs={<NGBreadcrumbs />} title={getString('cv.slos.title')} />
          <Page.Header
            title={
              <Button
                icon="plus"
                text={getString('cv.slos.newSLO')}
                variation={ButtonVariation.PRIMARY}
                onClick={onAddNewSLO}
              />
            }
          />
        </>
      )}

      <Page.Body
        loading={userJourneysLoading || SLOsLoading || deleteSLOLoading}
        error={getErrorMessage(SLOsError || userJourneysError)}
        retryOnError={() => {
          if (SLOsError) {
            refetchSLOs()
          }
          if (userJourneysError) {
            refetchUserJourneys()
          }
        }}
        noData={{
          when: () => !SLOsData?.data?.content?.length && !selectedUserJourney,
          message: getString('cv.slos.noData'),
          icon: 'join-table'
        }}
        className={css.pageBody}
      >
        <Container padding={{ top: 'medium', left: 'xlarge', right: 'xlarge' }}>
          <CardSelect
            type={CardSelectType.CardView}
            data={getUserJourneys(userJourneysData?.data?.content)}
            cardClassName={css.userJourney}
            renderItem={({ name }) => <Text font={{ variation: FontVariation.FORM_HELP }}>{name}</Text>}
            selected={selectedUserJourney}
            onChange={onFilter}
          />

          <div className={css.sloCardContainer}>
            {SLOsData?.data?.content?.map(({ serviceLevelObjective }) => (
              <Card key={serviceLevelObjective.identifier} className={css.sloCard} data-testid="sloCard">
                <SLOCardHeader
                  {...serviceLevelObjective}
                  monitoredServiceIdentifier={monitoredServiceIdentifier}
                  onDelete={onDelete}
                />
              </Card>
            ))}
          </div>

          {!SLOsData?.data?.content?.length && !SLOsLoading && (
            <NoDataCard icon="join-table" message={getString('cv.slos.noData')} />
          )}
        </Container>
      </Page.Body>
    </>
  )
}

export default CVSLOsListingPage
