import React, { FunctionComponent, useState, useEffect } from 'react'
import { Button, Color, Container, Heading, OverlaySpinner, Text } from '@wings-software/uikit'
import { accountId, RouteVerificationTypeToVerificationType } from 'modules/cv/constants'
import { useRouteParams } from 'framework/exports'
import { Page } from '@common/exports'
import { fetchMetricPacks, saveGlobalMetricPacks } from '../../services/CVNextGenCVConfigService'
import ConfigureThreshold from './ConfigureThreshold'
import { MetricPackTable } from '../../components/MetricPackTable/MetricPackTable'
import i18n from './MetricPackConfigure.i18n'
import css from './MetricPackConfigure.module.scss'

const MetricPackConfigure: FunctionComponent<any> = () => {
  const [isEditingThreshold, setIsEditingThreshold] = useState(false)
  const [metricPacks, setMetricPacks] = useState([])
  const [metricPacksThresholdData, setMetricPacksThresholdData] = useState([])
  const [inProgress, setInProgress] = useState(false)
  const {
    params: { orgId: routeOrgId, projectId: routeProjectId }
  } = useRouteParams()
  const orgId = routeOrgId as string
  const projectId = routeProjectId as string

  useEffect(() => {
    fetchExistingMetricPacks()
  }, [])

  async function fetchExistingMetricPacks() {
    setInProgress(true)
    const { response }: any = await fetchMetricPacks({
      accountId,
      projectId,
      orgId,
      dataSourceType: RouteVerificationTypeToVerificationType['app-dynamics'],
      group: 'metric-packs'
    })
    setMetricPacks(response.resource!)
    setInProgress(false)
  }

  function renderMetricTables(metrics: any) {
    return metrics.map((metric: any, index: number) => {
      return (
        <div key={index}>
          <MetricPackTable
            metrics={metric}
            metricPackName={metric.identifier}
            onConfigureThresholdClick={(data: any) => {
              setMetricPacksThresholdData(data)
              setIsEditingThreshold(true)
            }}
          />
        </div>
      )
    })
  }

  async function onSave(payload: any) {
    setInProgress(true)
    await saveGlobalMetricPacks({
      payload,
      accountId,
      projectId,
      orgId,
      dataSourceType: RouteVerificationTypeToVerificationType['app-dynamics'],
      group: 'metric-packs'
    })
    setInProgress(false)
  }

  function renderBody() {
    return (
      <OverlaySpinner show={inProgress}>
        <Container>
          <Container className={css.header}>
            <Heading level={3} color={Color.BLACK} font={{ weight: 'bold', size: 'medium' }}>
              {i18n.configureMetricPackText}
            </Heading>
            <Text>{i18n.configurePackSubtitle}</Text>
          </Container>
          <Container className={css.packsContainer}>{renderMetricTables(metricPacks)}</Container>
          <Button
            large
            intent="primary"
            text="Save"
            className={css.actionButton}
            width={120}
            onClick={() => {
              onSave(metricPacks)
            }}
            type="submit"
          />
        </Container>
      </OverlaySpinner>
    )
  }

  return (
    <>
      <Page.Header title={i18n.titleText} />
      <Page.Body>
        <Container className={css.main}>
          {!isEditingThreshold ? (
            renderBody()
          ) : (
            <Container className={css.thresholdSection}>
              <ConfigureThreshold
                metricPack={metricPacksThresholdData}
                dataSourceType={RouteVerificationTypeToVerificationType['app-dynamics']}
                onCancel={() => {
                  setIsEditingThreshold(false)
                }}
              />
            </Container>
          )}
        </Container>
      </Page.Body>
    </>
  )
}

export default MetricPackConfigure
