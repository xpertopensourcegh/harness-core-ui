import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Container, Text, Checkbox, Color } from '@wings-software/uikit'
import groupBy from 'lodash-es/groupBy'
import xhr from '@wings-software/xhr-async'
import qs from 'qs'
import { useParams } from 'react-router-dom'
import Table from '@common/components/Table/Table'
import { useGetServiceListForProject } from 'services/cd-ng'
import { MetricPackArrayRequestBody, MetricPackDTO, useGetAppDynamicsTiers, useGetMetricPacks } from 'services/cv'
import { useStrings } from 'framework/exports'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import MetricsVerificationModal from '@cv/components/MetricsVerificationModal/MetricsVerificationModal'
import { TableColumnWithFilter } from '@cv/components/TableColumnWithFilter/TableColumnWithFilter'
import { SelectedCell, ValidationCell, ServiceCell } from './MapApplicationsTableCells'
import AppDApplicationSelector from './AppDApplicationSelector'
import { TierRecord, ValidationStatus, useValidationErrors } from '../AppDOnboardingUtils'
import { InfoPanel, InfoPanelItem } from '../InfoPanel/InfoPanel'
import styles from './MapApplications.module.scss'

export interface MapApplicationsProps {
  stepData?: { [key: string]: any }
  onCompleteStep: (data: object) => void
  onPrevious?: () => void
}

export interface InternalState {
  [id: string]: TierRecord
}

export async function validateTier(metricPacks: MetricPackArrayRequestBody, queryParams: object) {
  const url = `/cv/api/appdynamics/metric-data?${qs.stringify(queryParams)}`
  const { response }: any = await xhr.post(url, { data: metricPacks })
  if (response?.resource?.length) {
    let status
    if (response?.resource?.some((val: any) => val.overallStatus === 'FAILED')) {
      status = ValidationStatus.ERROR
    } else if (response?.resource?.some((val: any) => val.overallStatus === 'NO_DATA')) {
      status = ValidationStatus.NO_DATA
    } else if (response?.resource?.every((val: any) => val.overallStatus === 'SUCCESS')) {
      status = ValidationStatus.SUCCESS
    }
    return { validationStatus: status, metricData: response?.resource }
  }
  return {}
}

export function updateTier(
  updater: (params: (val: InternalState) => InternalState) => void,
  tierId: number,
  update: object | null
) {
  updater?.(old => {
    const newState = { ...old }
    if (update === null) {
      delete newState[tierId]
    } else {
      newState[tierId] = {
        ...old[tierId],
        ...update
      }
    }
    return newState
  })
}

const PAGE_SIZE = 10

export default function MapApplications({ stepData, onCompleteStep, onPrevious }: MapApplicationsProps) {
  const { getString } = useStrings()
  const [selectedAppId, setSelectedAppId] = useState<number>()
  const [pageIndex, setPageIndex] = useState(0)
  const [textFilter, setTextFilter] = useState('')
  const [state, setState] = useState<InternalState>(stepData?.tiers || {})
  const [serviceOptions, setServiceOptions] = useState([])
  const [metricPacks, setMetricPacks] = useState<Array<{ selected: boolean; data: MetricPackDTO }>>([])
  const [validationResult, setValidationResult] = useState()
  const { setError, renderError } = useValidationErrors()
  const haveMPacksChanged = useRef((val: any) => val === metricPacks)

  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  useGetServiceListForProject({
    queryParams: {
      accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    },
    resolve: res => {
      if (res?.data?.content?.length) {
        setServiceOptions(
          res.data.content.map((option: any) => ({
            label: option.name,
            value: option.identifier
          }))
        )
      }
      return res
    }
  })

  useGetMetricPacks({
    queryParams: {
      accountId: accountId,
      projectIdentifier: projectIdentifier as string,
      dataSourceType: 'APP_DYNAMICS'
    },
    resolve: res => {
      if (res.resource?.length) {
        setMetricPacks(
          res.resource.map((resource: MetricPackDTO) => ({
            data: resource,
            selected: stepData?.metricPacks?.some((mp: MetricPackDTO) => mp.identifier === resource.identifier) ?? false
          }))
        )
      }
      return res
    }
  })

  const [applicationStatuses, errors] = useMemo(() => {
    const statuses: any = {}
    const appErrors: any = {}
    if (state) {
      const tiersByAppId = groupBy(Object.values(state), 'appId')
      for (const appId of Object.keys(tiersByAppId)) {
        if (
          tiersByAppId[appId]
            .map(t => t.service)
            .filter(s => !!s)
            .some((s, i, a) => a.indexOf(s) >= 0 && a.indexOf(s) !== i)
        ) {
          appErrors[appId] = getString('cv.monitoringSources.appD.validationMsg')
          statuses[appId] = 'ERROR'
        } else if (tiersByAppId[appId].some(val => val.validationStatus === ValidationStatus.ERROR)) {
          statuses[appId] = 'ERROR'
        } else if (
          tiersByAppId[appId].every(
            val =>
              val.validationStatus === ValidationStatus.SUCCESS || val.validationStatus === ValidationStatus.NO_DATA
          )
        ) {
          statuses[appId] = 'SUCCESS'
        }
      }
    }
    return [statuses, appErrors]
  }, [state])

  const { data: tiers, loading: loadingTiers } = useGetAppDynamicsTiers({
    queryParams: {
      accountId,
      appDynamicsAppId: selectedAppId as number,
      connectorIdentifier: stepData?.connectorIdentifier,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string,
      offset: pageIndex,
      pageSize: PAGE_SIZE,
      filter: textFilter
    }
  })

  const onValidateTier = async (tierId: number) => {
    if (metricPacks.some(mp => mp.selected)) {
      updateTier(setState, tierId, { validationStatus: ValidationStatus.IN_PROGRESS })
      const payload = metricPacks.filter(mp => mp.selected).map(mp => mp.data)
      const update = await validateTier(payload as MetricPackArrayRequestBody, {
        accountId,
        appdAppId: selectedAppId as number,
        appdTierId: tierId,
        connectorIdentifier: stepData?.connectorIdentifier,
        orgIdentifier: orgIdentifier as string,
        projectIdentifier: projectIdentifier as string,
        requestGuid: String(Date.now())
      })
      if (haveMPacksChanged.current(metricPacks)) {
        updateTier(setState, tierId, update)
      }
    } else {
      updateTier(setState, tierId, { validationStatus: undefined })
    }
  }

  const onSelectMetricPack = (identifier: string, selected: boolean) => {
    setMetricPacks(old =>
      old.map(val => {
        if (val.data.identifier === identifier) {
          return {
            data: val.data,
            selected
          }
        } else {
          return val
        }
      })
    )
    setError('metricPacks', undefined)
  }

  useEffect(() => {
    haveMPacksChanged.current = (val: any) => val === metricPacks
    if (Object.keys(state).length) {
      Object.values(state).forEach(tier => {
        if (tier.service) {
          onValidateTier(tier.id)
        }
      })
    }
  }, [metricPacks])

  const onNext = async () => {
    const mPacks = metricPacks.filter(mp => mp.selected).map(mp => mp.data)
    if (!mPacks.length) {
      setError('metricPacks', getString('cv.monitoringSources.appD.validations.selectMetricPack'))
      return
    }
    if (!Object.keys(errors).length) {
      const tiersData = { ...state }
      for (const tierId of Object.keys(tiersData)) {
        if (!tiersData[tierId].service) {
          delete tiersData[tierId]
        } else if (tiersData[tierId].validationStatus === ValidationStatus.IN_PROGRESS) {
          tiersData[tierId].validationStatus = undefined
        }
      }
      if (Object.keys(tiersData).length) {
        onCompleteStep({ tiers: tiersData, metricPacks: mPacks })
      } else {
        setError('selectTier', getString('cv.monitoringSources.appD.validations.selectTier'))
      }
    }
  }

  const onTierUpdate = (tierId: number, update: Partial<TierRecord>) => updateTier(setState, tierId, update)

  return (
    <Container className={styles.tabWrapper}>
      <Container className={styles.main}>
        <AppDApplicationSelector
          applications={stepData?.applications}
          statuses={applicationStatuses}
          selectedAppId={selectedAppId}
          onSelect={appId => {
            setPageIndex(0)
            setSelectedAppId(appId)
          }}
        />
        <Container className={styles.content}>
          <Text color={Color.GREY_350} font={{ size: 'medium' }} margin={{ bottom: 'large' }}>
            {getString('cv.monitoringSources.appD.mapApplicationsToEnv')}
          </Text>
          <Container className={styles.mappingDetails}>
            <Text icon="service-appdynamics">{stepData?.applications[selectedAppId!]?.name}</Text>
            <Text>{getString('cv.monitoringSources.appD.mapsTo')}</Text>
            <Text icon="harness">{stepData?.applications[selectedAppId!]?.environment}</Text>
          </Container>
          <Container className={styles.metricPacks}>
            <Text color={Color.GREY_350} font={{ size: 'medium' }} margin={{ bottom: 'large' }}>
              {getString('metricPacks')}
            </Text>
            <Container margin={{ bottom: 'small' }}>
              {metricPacks.map(mp => (
                <Checkbox
                  key={mp.data.identifier}
                  checked={mp.selected}
                  label={mp.data.identifier}
                  onChange={e => onSelectMetricPack(mp.data.identifier!, e.currentTarget.checked)}
                />
              ))}
            </Container>
            {renderError('metricPacks')}
          </Container>
          <Text color={Color.GREY_350} font={{ size: 'medium' }} margin={{ bottom: 'large' }}>
            {getString('cv.monitoringSources.appD.mapTiersToServices')}
          </Text>
          {loadingTiers && <PageSpinner />}
          <Table
            columns={[
              {
                id: '1',
                Header: '',
                width: '10%',
                Cell: function SelectedCellWrapper({ row }: any) {
                  return (
                    <SelectedCell
                      tierId={row.original.id}
                      tierData={state[row.original.id]}
                      onUpdate={(tierId: number, update: TierRecord) => {
                        onTierUpdate(
                          tierId,
                          update
                            ? {
                                ...update,
                                name: row.original.name,
                                appId: selectedAppId,
                                totalTiers: tiers?.resource?.totalItems
                              }
                            : update
                        )
                        if (update) {
                          setError('selectTier', undefined)
                        }
                      }}
                    />
                  )
                }
              },
              {
                id: '2',
                Header: (
                  <Text font={{ size: 'small', weight: 'bold' }} color={Color.BLACK}>
                    {getString('cv.monitoringSources.appD.appDTier')}
                  </Text>
                ),
                width: '30%',
                disableSortBy: true,
                accessor: 'name'
              },
              {
                id: '3',
                Header: (
                  <Text font={{ size: 'small', weight: 'bold' }} color={Color.BLACK}>
                    {getString('cv.monitoringSources.appD.metricPackValidation')}
                  </Text>
                ),
                width: '30%',
                disableSortBy: true,
                Cell: function ValidationCellWrapper({ row }: any) {
                  return (
                    <ValidationCell
                      tierId={row.original.id}
                      tierData={state[row.original.id]}
                      onValidateTier={onValidateTier}
                      onShowValidationResult={val => setValidationResult(val)}
                    />
                  )
                }
              },
              {
                id: '4',
                Header: (
                  <TableColumnWithFilter
                    className={styles.columnHeaderWithFilter}
                    appliedFilter={textFilter}
                    onFilter={val => {
                      setPageIndex(0)
                      setTextFilter(val)
                    }}
                    columnName={getString('cv.monitoringSources.appD.mappingToHarnessService')}
                  />
                ),
                width: '30%',
                disableSortBy: true,
                Cell: function ServiceCellWrapper({ row }: any) {
                  return (
                    <ServiceCell
                      tierId={row.original.id}
                      tierData={state[row.original.id]}
                      onUpdate={onTierUpdate}
                      options={serviceOptions}
                      onValidateTier={onValidateTier}
                    />
                  )
                }
              }
            ]}
            data={tiers?.resource?.content ?? []}
            pagination={{
              itemCount: tiers?.resource?.totalItems || 0,
              pageSize: tiers?.resource?.pageSize || PAGE_SIZE,
              pageCount: tiers?.resource?.totalPages || 0,
              pageIndex: tiers?.resource?.pageIndex || 0,
              gotoPage: (page: number) => setPageIndex(page)
            }}
          />
          {!!selectedAppId && errors[selectedAppId] && <Text color={Color.RED_500}>{errors[selectedAppId]}</Text>}
          {renderError('selectTier')}
          {!loadingTiers && !tiers?.resource?.content?.length && (
            <Container height={250}>
              <NoDataCard message={getString('cv.monitoringSources.appD.noTiersMsg')} icon="warning-sign" />
            </Container>
          )}
        </Container>
        <InfoPanel>
          <InfoPanelItem
            label={getString('cv.monitoringSources.appD.infoPanel.applications')}
            text={getString('cv.monitoringSources.appD.infoPanel.applicationsDesc')}
          />
          <InfoPanelItem
            label={getString('metricPacks')}
            text={getString('cv.monitoringSources.appD.infoPanel.applicationsDesc')}
          />
          <InfoPanelItem
            label={getString('cv.monitoringSources.appD.infoPanel.tiers')}
            text={getString('cv.monitoringSources.appD.infoPanel.applicationsDesc')}
          />
        </InfoPanel>
      </Container>
      {validationResult && (
        <MetricsVerificationModal
          verificationData={validationResult}
          guid="guid"
          onHide={() => setValidationResult(undefined)}
          verificationType="AppDynamics"
        />
      )}
      <SubmitAndPreviousButtons onPreviousClick={onPrevious} onNextClick={onNext} />
    </Container>
  )
}
