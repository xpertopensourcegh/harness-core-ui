import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Container, Layout, Tabs, Tab, Text, Card, Icon, Link, Color, useModalHook } from '@wings-software/uikit'
import { Dialog, IDialogProps, Classes } from '@blueprintjs/core'
import css from './MetricsVerificationModal.module.scss'
import cx from 'classnames'
import { ThirdPartyCallLogModal } from '../ThirdPartyCallLogs/ThirdPartyCallLogs'

interface MetricsVerificationModalProps {
  onHide: () => void
  verificationData: any
  guid: string
}

interface StatusCard {
  metricName: string
}

interface SuccessMetricCardProps extends StatusCard {
  count: number
}

interface NoDataErrorCardProps extends StatusCard {
  viewCallLogs: (metricPackName: string, metricName: string) => void
  metricPackName: string
}

interface ErrorMetricCardProps extends NoDataErrorCardProps {
  errorMsg: string
}

interface MetricPackValidationResultProps {
  data: any
  viewCallLogs: (metricPackName: string, metricName: string) => void
}

const modalPropsLight: IDialogProps = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  title: 'Metric Pack Verification',
  className: Classes.DIALOG,
  style: { width: 900, height: 570 }
}

function filterForMetricPacksByMetricStatus(data: any, status: string): Array<{ metricPackName: string; values: [] }> {
  if (!data?.length) {
    return []
  }
  const filteredMetrics: Array<{ metricPackName: string; values: [] }> = []
  data.forEach((metricPack: any) => {
    const metrics = metricPack?.values?.filter((metric: any) => {
      return metric.apiResponseStatus === status
    })
    filteredMetrics.push({ metricPackName: metricPack.metricPackName, values: metrics })
  })

  return filteredMetrics
}

function SuccessMetricCard(props: SuccessMetricCardProps): JSX.Element {
  const { metricName, count } = props
  return (
    <Card className={cx(css.successCard, css.statusCard)}>
      <Icon name="deployment-success-legacy" className={css.statusIcon} />
      <Layout.Vertical className={css.dataContainer}>
        <Text lineClamp={1} className={css.smallFont} color={Color.GREEN_600}>
          {metricName}
        </Text>
        <Text className={css.count} lineClamp={1} color={Color.GREEN_600}>
          {count}
        </Text>
      </Layout.Vertical>
    </Card>
  )
}

function ErrorMetricCard(props: ErrorMetricCardProps): JSX.Element {
  const { metricName, errorMsg, viewCallLogs, metricPackName } = props
  return (
    <Card className={cx(css.errorCard, css.statusCard)}>
      <Icon name="deployment-failed-legacy" className={css.statusIcon} />
      <Layout.Vertical className={css.dataContainer}>
        <Text intent="danger" lineClamp={1} className={css.smallFont}>
          {metricName}
        </Text>
        <Text intent="danger" lineClamp={1} className={css.smallFont}>
          {errorMsg}
        </Text>
        <Link withoutHref className={css.smallFont} onClick={() => viewCallLogs(metricPackName, metricName)}>
          View call logs
        </Link>
      </Layout.Vertical>
    </Card>
  )
}

function NoDataErrorCard(props: NoDataErrorCardProps): JSX.Element {
  const { metricName, viewCallLogs, metricPackName } = props
  return (
    <Card className={cx(css.noDataCard, css.statusCard)}>
      <Icon name="remove" className={css.statusIcon} />
      <Layout.Vertical className={css.dataContainer}>
        <Text intent="none" lineClamp={1} className={css.smallFont}>
          {metricName}
        </Text>
        <Text intent="none" className={css.smallFont}>
          No data found
        </Text>
        <Link withoutHref className={css.smallFont} onClick={() => viewCallLogs(metricPackName, metricName)}>
          View call logs
        </Link>
      </Layout.Vertical>
    </Card>
  )
}

function MetricPackValidationResult(props: MetricPackValidationResultProps): JSX.Element {
  const { data, viewCallLogs } = props
  return (
    <Container>
      {data?.map((metricPack: any) => {
        return (
          <Container key={metricPack?.metricPackName} className={css.metricPackContainer}>
            <Text className={css.metricPackName}>{metricPack?.metricPackName}</Text>
            <Container className={css.cardContainer}>
              {metricPack?.values?.map((metric: any) => {
                switch (metric?.apiResponseStatus) {
                  case 'SUCCESS':
                    return <SuccessMetricCard metricName={metric?.metricName} count={metric?.value} />
                  case 'ERROR':
                    return (
                      <ErrorMetricCard
                        metricName={metric?.metricName}
                        metricPackName={metricPack?.metricPackName}
                        errorMsg={metric.error}
                        viewCallLogs={viewCallLogs}
                      />
                    )
                  default:
                    return (
                      <NoDataErrorCard
                        metricName={metric?.metricName}
                        metricPackName={metricPack?.metricPackName}
                        viewCallLogs={viewCallLogs}
                      />
                    )
                }
              })}
            </Container>
          </Container>
        )
      })}
    </Container>
  )
}

function MetricsModal(props: MetricsVerificationModalProps): JSX.Element {
  const { onHide, verificationData, guid } = props
  const errorMetrics = useMemo(() => filterForMetricPacksByMetricStatus(verificationData, 'ERROR'), [verificationData])
  const noDataMetrics = useMemo(() => filterForMetricPacksByMetricStatus(verificationData, 'NO_DATA'), [
    verificationData
  ])
  const successMetrics = useMemo(() => filterForMetricPacksByMetricStatus(verificationData, 'SUCCESS'), [
    verificationData
  ])
  const [{ displayCallLog, guidWithMetricFilter }, setCallLogDisplay] = useState({
    displayCallLog: false,
    guidWithMetricFilter: guid
  })
  const displayCallLogCallback = useCallback(
    (metricPackName, metricName) =>
      setCallLogDisplay({ displayCallLog: true, guidWithMetricFilter: `${metricPackName}:${metricName}:${guid}` }),
    [guid]
  )
  const hideCallLogCallback = useCallback(
    () => () => setCallLogDisplay({ displayCallLog: false, guidWithMetricFilter: guid }),
    [guid]
  )
  const onHideCallback = useCallback(() => onHide(), [onHide])
  return (
    <Dialog {...modalPropsLight} onClose={onHideCallback} className={css.main}>
      {!displayCallLog ? (
        <Tabs id="tabsId1">
          <Tab
            id="All"
            title="All"
            panel={<MetricPackValidationResult data={verificationData} viewCallLogs={displayCallLogCallback} />}
          />
          {errorMetrics?.length && (
            <Tab
              id="Error"
              title="Error"
              panel={<MetricPackValidationResult data={errorMetrics} viewCallLogs={displayCallLogCallback} />}
            />
          )}
          {noDataMetrics?.length && (
            <Tab
              id="NoData"
              title="No Data"
              panel={<MetricPackValidationResult data={noDataMetrics} viewCallLogs={displayCallLogCallback} />}
            />
          )}
          {successMetrics?.length && (
            <Tab
              id="Success"
              title="Success"
              panel={<MetricPackValidationResult data={successMetrics} viewCallLogs={displayCallLogCallback} />}
            />
          )}
        </Tabs>
      ) : (
        <ThirdPartyCallLogModal guid={guidWithMetricFilter} onHide={onHide} onBackButtonClick={hideCallLogCallback()} />
      )}
    </Dialog>
  )
}

export default function MetricsVerificationModal(props: MetricsVerificationModalProps): JSX.Element {
  const { onHide, verificationData, guid } = props
  const [openModal, hideModal] = useModalHook(() => {
    const hidemodalCallback = (): void => {
      hideModal()
      onHide()
    }
    return <MetricsModal onHide={hidemodalCallback} verificationData={verificationData} guid={guid} />
  })
  useEffect(() => openModal(), [openModal])
  return <span />
}
