import React, { useState } from 'react'
import { IDrawerProps, Position, Drawer } from '@blueprintjs/core'
import cx from 'classnames'
import { Container, Heading, Text, Color, Link, Icon } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'
import { PageError } from '@common/components/Page/PageError'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetActivityDetails } from 'services/cv'
import { useStrings } from 'framework/exports'
import { VerificationActivityRiskCardWithApi } from '../VerificationActivityRiskCard/VerificationActivityRiskCard'
import type { EventData } from '../ActivitiesTimelineView/ActivitiesTimelineView'
import css from './EventDetailsForChange.module.scss'

interface EventDetailsForChangeProps {
  onCloseCallback: () => void
  selectedActivityId?: string
  selectedActivities?: EventData[]
}

interface KeyValuePairProps {
  name: string
  value?: string
}

interface EventsListProps {
  events: Array<{ createdAt?: number; type?: string; reason?: string; message?: string }>
}

interface ChangeSourceSummaryCardProps {
  onViewJSONClick: () => void
  displayViewJSONOption: boolean
}

interface ActivitiesListProps {
  activities: EventData[]
  onSelectActivity: (updatedActivityId: string) => void
  selectedActivityId?: string
}

const DrawerProps: IDrawerProps = {
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  isOpen: false,
  hasBackdrop: true,
  position: Position.RIGHT,
  usePortal: true,
  size: '70%'
}

// function generateEventTypeTotals(events: EventData[]): Array<{ eventType: string; total: number }> {
//   const eventTotals = [
//     { eventType: 'Normal(s)', total: 0 },
//     { eventType: 'Warning(s)', total: 0 },
//     { eventType: 'Error(s)', total: 0 }
//   ]
//   events?.forEach(event => {
//     switch (event.verificationResult) {
//       case 'IN_PROGRESS':
//         eventTotals[0].total++
//         break
//       case 'ERROR':
//       case 'VERIFICATION_FAILED':
//         eventTotals[1].total++
//         break
//       case 'VERIFICATION_FAILED':
//         eventTotals[2].total++
//         break
//       default:
//     }
//   })

//   return eventTotals.filter(breakDown => breakDown.total > 0)
// }

function KeyValuePair(props: KeyValuePairProps): JSX.Element {
  const { name, value } = props
  return (
    <Container width="100%" className={css.keyValPair}>
      <Text font={{ size: 'small' }} lineClamp={1} className={css.key}>
        {name}
      </Text>
      <Text color={Color.BLACK} lineClamp={1}>
        {value}
      </Text>
    </Container>
  )
}

function ChangeSourceSummaryCard(props: ChangeSourceSummaryCardProps): JSX.Element {
  const { onViewJSONClick, displayViewJSONOption } = props
  const { getString } = useStrings()
  return (
    <Container className={css.summaryCard}>
      <Container className={css.changeSourceDetails}>
        <Heading level={2} className={css.heading} color={Color.BLACK}>
          {getString('cv.changesPage.changeSourceDetails')}
        </Heading>
        <KeyValuePair name={getString('source')} value="SEMI-ADAS" />
        <KeyValuePair name={getString('connector')} value="sdfsfd" />
      </Container>
      <Container className={css.changeSummary}>
        <Container flex>
          <Heading level={2} className={css.heading} color={Color.BLACK}>
            {getString('cv.changesPage.changeSummary')}
          </Heading>
          {displayViewJSONOption && (
            <Link minimal withoutHref text={getString('viewJSON')} onClick={() => onViewJSONClick()} />
          )}
        </Container>
        <Container className={css.summaryRow}>
          <KeyValuePair name={getString('pipelineSteps.workload')} value="sdfasdfsdf" />
          <KeyValuePair name={getString('kind')} value="sdfasdfsdf" />
        </Container>
        <Container className={css.summaryRow}>
          <KeyValuePair name={getString('pipelineSteps.workload')} value="sdfasdfsdf" />
          <KeyValuePair name={getString('cv.changesPage.eventCount')} value="DFLSDF" />
        </Container>
      </Container>
    </Container>
  )
}

function EventsList(props: EventsListProps): JSX.Element {
  const { events } = props
  const { getString } = useStrings()
  return (
    <ul className={css.eventsList}>
      <li className={cx(css.listHeader, css.listItem)}>
        <Text className={css.creationDate}>{getString('creationTimestamp').toLocaleUpperCase()}</Text>
        <Text className={css.type}>{getString('typeLabel').toLocaleUpperCase()}</Text>
        <Text className={css.reason}>{getString('reason').toLocaleUpperCase()}</Text>
        <Text className={css.message}>{getString('message').toLocaleUpperCase()}</Text>
      </li>
      {events?.map((event, index) => (
        <li className={css.listItem} key={index}>
          <Text className={css.creationDate} lineClamp={1}>
            {event?.createdAt ? new Date(event.createdAt).toLocaleString() : ''}
          </Text>
          <Text className={css.type} lineClamp={1}>
            {event?.type}
          </Text>
          <Text className={css.reason} lineClamp={1}>
            {event?.reason}
          </Text>
          <Text className={css.message} lineClamp={3}>
            {event?.message}
          </Text>
        </li>
      ))}
    </ul>
  )
}

function EventsJson({ selectedActivityId }: { selectedActivityId: string }): JSX.Element {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { error: eventsError, loading: eventsLoading, data: eventsData, refetch } = useGetActivityDetails({
    activityId: selectedActivityId,
    queryParams: { projectIdentifier, orgIdentifier, accountId }
  })
  if (eventsError?.message) {
    return <PageError message={eventsError.message} onClick={() => refetch()} />
  }

  if (eventsLoading) {
    return (
      <Container className={css.eventsLoading}>
        <Icon name="steps-spinner" size={25} color={Color.GREY_600} />
      </Container>
    )
  }

  return (
    <Container className={css.eventsEditor}>
      <MonacoEditor
        language="json"
        height={570}
        value={JSON.stringify(eventsData?.data, null, 4)?.replace(/\\n/g, '\r\n')}
        options={
          {
            readOnly: true,
            wordBasedSuggestions: false,
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 13
          } as any
        }
      />
    </Container>
  )
}

function ActivitiesList(props: ActivitiesListProps): JSX.Element {
  const { activities, onSelectActivity, selectedActivityId } = props
  return (
    <Container width={300} height="100%" className={css.eventVerifications}>
      {activities?.map(activity => {
        const { name, activityId, verificationResult } = activity || {}
        if (!name || !activityId || !verificationResult) return null
        return (
          <Container
            key={`${name}-${activityId}`}
            className={cx(css.activityItem, activityId === selectedActivityId ? css.selectedActivity : undefined)}
            onClick={() => onSelectActivity?.(activityId)}
          >
            <Container>
              <Text color={Color.BLACK} lineClamp={1}>
                {name}
              </Text>
              <Container>
                {/* {bucketedEvents?.map((event, index) => {
                  const { eventType, total } = event
                  return (
                    <>
                      <Text
                        key={eventType}
                        font={{ size: 'small' }}
                        className={css.activityTotal}
                      >{`${total} ${eventType}`}</Text>
                      {index < bucketedEvents?.length - 1 && (
                        <Container
                          width={1}
                          height={14}
                          background={Color.GREY_350}
                          style={{ display: 'inline-block', margin: '0 5px' }}
                        />
                      )}
                    </>
                  )
                })} */}
              </Container>
            </Container>
            <Icon
              name="cv-main"
              data-verification-result={verificationResult}
              className={css.verificationResult}
              size={22}
            />
          </Container>
        )
      })}
    </Container>
  )
}

export function EventDetailsForChange(props: EventDetailsForChangeProps): JSX.Element {
  const { onCloseCallback, selectedActivityId: propsSelectedActivityId, selectedActivities } = props
  const [displayJSON, setDisplayJSON] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState(
    propsSelectedActivityId || selectedActivities?.[0]?.activityId
  )

  return (
    <Drawer {...DrawerProps} isOpen={true} onClose={onCloseCallback} className={css.main}>
      {selectedActivities?.length && (
        <ActivitiesList
          activities={selectedActivities}
          onSelectActivity={updatedActivityId => setSelectedActivityId(updatedActivityId)}
          selectedActivityId={selectedActivityId}
        />
      )}
      {displayJSON && selectedActivityId ? (
        <EventsJson selectedActivityId={selectedActivityId} />
      ) : (
        <Container width="100%" padding="medium">
          <VerificationActivityRiskCardWithApi selectedActivityId={selectedActivityId} />
          <ChangeSourceSummaryCard
            onViewJSONClick={() => setDisplayJSON(true)}
            displayViewJSONOption={Boolean(selectedActivityId)}
          />
          <EventsList
            events={[
              { createdAt: Date.now(), reason: 'Pod restart', message: 'something bad happened', type: 'Kubernetes' },
              {
                createdAt: Date.now(),
                reason: 'Pod restart',
                message: 'something bad happened i think that something bad happened what happened',
                type: 'Kubernetes'
              },
              { createdAt: Date.now(), reason: 'Pod restart', message: 'something bad happened', type: 'Kubernetes' },
              { createdAt: Date.now(), reason: 'Pod restart', message: 'something bad happened', type: 'Kubernetes' },
              { createdAt: Date.now(), reason: 'Pod restart', message: 'something bad happened', type: 'Kubernetes' },
              { createdAt: Date.now(), reason: 'Pod restart', message: 'something bad happened', type: 'Kubernetes' },
              { createdAt: Date.now(), reason: 'Pod restart', message: 'something bad happened', type: 'Kubernetes' }
            ]}
          />
        </Container>
      )}
    </Drawer>
  )
}
