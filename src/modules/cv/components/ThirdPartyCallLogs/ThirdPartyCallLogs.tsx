import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Layout, Heading, Container, Icon, Text, Color, CodeBlock, GraphError, Button } from '@wings-software/uikit'
import { Dialog, IDialogProps, Classes, Spinner } from '@blueprintjs/core'
import xhr from '@wings-software/xhr-async'
import moment from 'moment'
import css from './ThirdPartyCallLog.module.scss'
import i18n from './ThirdPartyCallLogs.i18n'
import type { ThirdPartyApiCallLog } from '@wings-software/swagger-ts/definitions'
import { ActivitiesService } from '../../services'

interface ThirdPartyCallLogsProps {
  guid: string
  onBackButtonClick?: () => void
  onHide: () => void
}

interface RequestMadeProps {
  status: ThirdPartyApiCallLog['status']
  requestURL: string
  requestTimestamp: number
  isSelected: boolean
  onClick: () => void
}

interface SelectedLogProps {
  callLog: ThirdPartyApiCallLog
}

type RequestAndResponse = {
  requestURL?: string
  requestMethod?: string
  statusCode?: string
  responseBody?: string
  responseIsJSON?: boolean
}

const bpDialogProps: IDialogProps = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  title: 'Third Party Call Logs',
  className: Classes.DIALOG,
  style: { width: 900, height: 570 }
}

const XHR_3RD_PARTY_CALL_LOG_GROUP = 'XHR_3RD_PARTY_CALL_LOG_GROUP'

async function fetchCallLogs(guid: string): Promise<{ callLogs?: ThirdPartyApiCallLog[]; error?: string } | undefined> {
  const { error, status, response } = await ActivitiesService.fetchApiCallLogs({
    entityIdentifier: guid,
    appId: 'ogVkjRvETFOG4-2e_kYPQA',
    xhrGroup: XHR_3RD_PARTY_CALL_LOG_GROUP
  })

  if (status === xhr.ABORTED) {
    return
  }
  if (error) {
    return { error: error.message }
  }

  return { callLogs: response?.resource }
}

function SelectedLog(props: SelectedLogProps): JSX.Element {
  const { title, request, response, requestTimeStamp, responseTimeStamp } = props.callLog || {}
  const requiredKeys = useMemo(() => {
    const obj: RequestAndResponse = {}
    request?.forEach(reqObj => {
      if (reqObj.type === 'URL') {
        obj.requestURL = reqObj.value
      } else if (reqObj.name === 'METHOD') {
        obj.requestMethod = reqObj.value
      }

      response?.forEach(respObj => {
        if (respObj.name === 'Status Code') {
          obj.statusCode = respObj.value
        } else if (respObj.name === 'Response Body') {
          obj.responseBody = respObj.value
          obj.responseIsJSON = respObj.type === 'JSON'
        }
      })
    })
    return obj
  }, [request?.forEach, response?.forEach])

  return (
    <Container className={css.selectedCallLog}>
      <Heading level={2} className={css.callLogHeader}>
        {title}
      </Heading>
      <Container className={css.requestContainer}>
        <Text color={Color.BLACK}>{i18n.requestMade}</Text>
        <Text className={css.urlLabel}>URL:</Text>
        <Container className={css.requestUrl}>
          <CodeBlock allowCopy format="pre" snippet={requiredKeys.requestURL} />
        </Container>
        <Text>
          {i18n.method}: <Text inline>{requiredKeys.requestMethod}</Text>
        </Text>
      </Container>
      <Container className={css.responseContainer}>
        <Text color={Color.BLACK}>{i18n.requestMade}</Text>
        <Text>
          {i18n.statusCode}: <Text inline>{requiredKeys.statusCode}</Text>
        </Text>
        <Text>
          {i18n.timeTaken}: <Text inline>{(responseTimeStamp || 0) - (requestTimeStamp || 0)}ms</Text>
        </Text>
        <Text>{i18n.responseBody}:</Text>
        <Container className={css.responseBody}>
          <CodeBlock allowCopy format="pre" snippet={requiredKeys.responseBody} />
        </Container>
      </Container>
    </Container>
  )
}

function RequestMade(props: RequestMadeProps): JSX.Element {
  const { requestTimestamp, requestURL, status, isSelected, onClick } = props
  const requestDate = useMemo(() => (requestTimestamp === -1 ? undefined : moment(requestTimestamp)), [
    requestTimestamp
  ])
  const statusIcon = useMemo(() => {
    switch (status) {
      case 'SUCCESS':
        return <Icon name="deployment-success-legacy" className={css.statusIcon} />
      case 'ERROR':
        return <Icon name="main-issue" intent="danger" className={css.statusIcon} />
      default:
        return <Icon name="remove" className={css.statusIcon} />
    }
  }, [status])
  return (
    <Container className={css.requestCard} data-selected={isSelected} onClick={onClick}>
      <Container flex className={css.dateContainer}>
        <Container>
          {statusIcon}
          {requestDate && <Text className={css.day}>{requestDate.format('MMM D YYYY')}</Text>}
        </Container>
        {requestDate && <Text className={css.timestamp}>{requestDate.format('hh:mm')}</Text>}
      </Container>
      <Container className={css.requestContainer}>
        <Text inline className={css.requestLabel}>
          {i18n.requestMade}:
        </Text>
        <Text intent="primary" lineClamp={1} width={200}>
          {requestURL}
        </Text>
      </Container>
    </Container>
  )
}

export function ThirdPartyCallLogModal(props: ThirdPartyCallLogsProps): JSX.Element {
  const { guid, onHide, onBackButtonClick } = props
  const [callLogs, setCallLogs] = useState<ThirdPartyApiCallLog[]>([])
  const [{ error, isLoading }, setLoadingError] = useState({ isLoading: true, error: '' })
  const [selectedIndex, setSelected] = useState(0)
  const onLogCallCallback = useCallback(() => (index: number) => () => setSelected(index), [])
  useEffect(() => {
    fetchCallLogs(guid).then(callLogsResponse => {
      if (callLogsResponse?.error) {
        setLoadingError({ error: callLogsResponse.error, isLoading: false })
      } else {
        setCallLogs(callLogsResponse?.callLogs?.response || [])
        setLoadingError({ error: '', isLoading: false })
      }
    })
  }, [guid])
  const dialogProps = useMemo(() => {
    if (onBackButtonClick) {
      return {
        ...bpDialogProps,
        title: (
          <Container className={css.headingContainer}>
            <Button minimal intent="primary" icon="chevron-left" onClick={onBackButtonClick}>
              {i18n.backButtonTitle}
            </Button>
            <Heading level={2} className={css.backButtonHeading}>
              {i18n.modalTitle}
            </Heading>
          </Container>
        ),
        onClose: onHide
      }
    }
    return { ...bpDialogProps, onClose: onHide }
  }, [onBackButtonClick, onHide])

  return (
    <Dialog {...dialogProps}>
      <Layout.Horizontal className={css.main}>
        <Container className={css.sideContainer}>
          <Container>
            {callLogs?.map((callLog, index) => {
              return (
                <RequestMade
                  key={callLog?.uuid}
                  requestTimestamp={callLog?.requestTimeStamp || -1}
                  requestURL={callLog?.request?.[0].value || ''}
                  status={callLog.status}
                  isSelected={selectedIndex === index}
                  onClick={onLogCallCallback()(index)}
                />
              )
            })}
          </Container>
        </Container>
        {isLoading && (
          <Container className={css.spinner}>
            <Spinner />
          </Container>
        )}
        {!isLoading && !error && callLogs?.length === 0 && <Text className={css.noCalls}>No calls were made.</Text>}
        {error && (
          <Container className={css.error}>
            <GraphError title={error} />
          </Container>
        )}
        {!isLoading && !error && callLogs?.length > 0 && <SelectedLog callLog={callLogs[selectedIndex]} />}
      </Layout.Horizontal>
    </Dialog>
  )
}
