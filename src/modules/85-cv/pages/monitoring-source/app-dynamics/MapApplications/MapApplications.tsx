import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Container, Text, Checkbox, Color, SelectOption } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import qs from 'qs'
import { useParams } from 'react-router-dom'
import cloneDeep from 'lodash-es/cloneDeep'
import type { CellProps } from 'react-table'
import Table from '@common/components/Table/Table'
import { useGetServiceListForProject } from 'services/cd-ng'
import {
  MetricPackArrayRequestBody,
  MetricPackDTO,
  useGetAppDynamicsTiers,
  useGetMetricPacks,
  AppDynamicsTier
} from 'services/cv'
import { useStrings } from 'framework/exports'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import MetricsVerificationModal from '@cv/components/MetricsVerificationModal/MetricsVerificationModal'
import { TableColumnWithFilter } from '@cv/components/TableColumnWithFilter/TableColumnWithFilter'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { ValidationCell, ServiceCell } from './MapApplicationsTableCells'
import AppDApplicationSelector from './AppDApplicationSelector'
import { TierRecord, InternalState, ValidationStatus, useValidationErrors } from '../AppDOnboardingUtils'
import { InfoPanel, InfoPanelItem } from '../InfoPanel/InfoPanel'
import styles from './MapApplications.module.scss'

export interface MapApplicationsProps {
  stepData?: { [key: string]: any }
  onCompleteStep: (data: object) => void
  onPrevious?: () => void
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

const PAGE_SIZE = 10

export default function MapApplications({ stepData, onCompleteStep, onPrevious }: MapApplicationsProps) {
  const { getString } = useStrings()
  const [selectedAppName, setSelectedAppName] = useState<string>('')
  const [pageIndex, setPageIndex] = useState(0)
  const [textFilter, setTextFilter] = useState('')
  const [state, setState] = useState<InternalState>(cloneDeep(stepData?.applications || {}))
  const [serviceOptions, setServiceOptions] = useState<Array<SelectOption>>([])
  const [metricPacks, setMetricPacks] = useState<Array<{ selected: boolean; data: MetricPackDTO }>>([])
  const [validationResult, setValidationResult] = useState<TierRecord['validationResult']>()
  const { setError, renderError } = useValidationErrors()
  const haveMPacksChanged = useRef((val: any) => val === metricPacks)

  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps & AccountPathProps>()

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
      for (const app of Object.values(state)) {
        const appTiers = Object.values(app?.tiers ?? {})
        if (!appTiers.length) continue
        if (
          appTiers
            .map(t => t.service)
            .filter(s => !!s)
            .some((s, i, a) => a.indexOf(s) >= 0 && a.indexOf(s) !== i)
        ) {
          appErrors[app!.name] = getString('cv.monitoringSources.appD.validationMsg')
          statuses[app!.name] = 'ERROR'
        } else if (appTiers.some(val => val.validationStatus === ValidationStatus.ERROR)) {
          statuses[app!.name] = 'ERROR'
        } else if (
          appTiers.every(
            val =>
              val.validationStatus === ValidationStatus.SUCCESS || val.validationStatus === ValidationStatus.NO_DATA
          )
        ) {
          statuses[app!.name] = 'SUCCESS'
        }
      }
    }
    return [statuses, appErrors]
  }, [state])

  const { data: tiers, loading: loadingTiers } = useGetAppDynamicsTiers({
    queryParams: {
      accountId,
      appName: selectedAppName,
      connectorIdentifier: stepData?.connectorIdentifier,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string,
      offset: pageIndex,
      pageSize: PAGE_SIZE,
      filter: textFilter
    },
    resolve: response => {
      if (Number.isInteger(response?.resource?.totalItems)) {
        setState(old => ({
          ...old,
          [selectedAppName]: {
            ...old[selectedAppName]!,
            totalTiers: response?.resource?.totalItems
          }
        }))
      }
      return response
    }
  })

  const onValidateTier = async (appName: string, tierName: string) => {
    if (metricPacks.some(mp => mp.selected)) {
      onSetTierData(appName, tierName, { validationStatus: ValidationStatus.IN_PROGRESS })
      const payload = metricPacks.filter(mp => mp.selected).map(mp => mp.data)
      const update = await validateTier(payload as MetricPackArrayRequestBody, {
        accountId,
        appName,
        tierName,
        connectorIdentifier: stepData?.connectorIdentifier,
        orgIdentifier: orgIdentifier as string,
        projectIdentifier: projectIdentifier as string,
        requestGuid: String(Date.now())
      })
      if (haveMPacksChanged.current(metricPacks)) {
        onSetTierData(appName, tierName, update)
      }
    } else {
      onSetTierData(appName, tierName, { validationStatus: undefined })
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

  const onSetTierData = (appName: string, tierName: string, value?: Partial<TierRecord>) => {
    setState(old => {
      const appTiers = { ...(old[appName]?.tiers || {}) }
      const tier = appTiers[tierName] || {}
      if (value) {
        appTiers[tierName] = { ...tier, ...value }
      } else {
        delete appTiers[tierName]
      }
      return {
        ...old,
        [appName]: {
          ...old[appName]!,
          tiers: {
            ...appTiers
          }
        }
      }
    })
  }

  useEffect(() => {
    haveMPacksChanged.current = (val: any) => val === metricPacks
    if (Object.keys(state).length) {
      Object.values(state).forEach(app => {
        Object.values(app?.tiers ?? {}).forEach(tier => {
          if (tier.service) {
            onValidateTier(app!.name, tier.name)
          }
        })
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
      const applications = cloneDeep(state)
      let foundSomeTiers = false
      for (const app of Object.values(applications)) {
        for (const tier of Object.values(app?.tiers ?? {})) {
          if (!tier.service) {
            setError('selectTier', getString('cv.monitoringSources.appD.validations.selectTier'))
            return
          } else if (tier.validationStatus === ValidationStatus.IN_PROGRESS) {
            delete tier.validationStatus
          }
          foundSomeTiers = true
        }
      }
      if (foundSomeTiers) {
        onCompleteStep({ applications, metricPacks: mPacks })
      } else {
        setError('selectTier', getString('cv.monitoringSources.appD.validations.selectTier'))
      }
    }
  }

  return (
    <Container className={styles.tabWrapper}>
      <Container className={styles.main}>
        <AppDApplicationSelector
          applications={stepData?.applications}
          statuses={applicationStatuses}
          selectedAppName={selectedAppName}
          onSelect={appName => {
            setPageIndex(0)
            setSelectedAppName(appName)
          }}
        />
        <Container className={styles.content}>
          <Text color={Color.GREY_350} font={{ size: 'medium' }} margin={{ bottom: 'large' }}>
            {getString('cv.monitoringSources.appD.mapApplicationsToEnv')}
          </Text>
          <Container className={styles.mappingDetails}>
            <Text icon="service-appdynamics">{selectedAppName}</Text>
            <Text>{getString('cv.admin.mapsTo')}</Text>
            <Text icon="harness">{stepData?.applications[selectedAppName!]?.environment}</Text>
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
          <Table<AppDynamicsTier>
            columns={[
              {
                id: '1',
                Header: '',
                width: '5%',
                disableSortBy: true,
                accessor: 'name',
                Cell: function SelectTierCell({ value: tierName }: CellProps<AppDynamicsTier>) {
                  return (
                    <input
                      type="checkbox"
                      className="select-tier"
                      checked={!!state[selectedAppName]?.tiers?.[tierName]}
                      onChange={e => {
                        onSetTierData(selectedAppName, tierName, e.target.checked ? { name: tierName } : undefined)
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
                width: '25%',
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
                accessor: 'name',
                Cell: function ValidationCellWrapper({ value: tierName }: CellProps<AppDynamicsTier>) {
                  return (
                    <ValidationCell
                      tier={state[selectedAppName]?.tiers?.[tierName]}
                      onValidateTier={() => onValidateTier(selectedAppName, tierName)}
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
                width: '40%',
                disableSortBy: true,
                accessor: 'name',
                Cell: function ServiceCellWrapper({ value: tierName }: any) {
                  return (
                    <ServiceCell
                      value={state[selectedAppName]?.tiers?.[tierName]?.service}
                      disabled={!state[selectedAppName]?.tiers?.[tierName]}
                      onSelect={service => {
                        onValidateTier(selectedAppName, tierName)
                        onSetTierData(selectedAppName, tierName, { name: tierName, service })
                        setError('selectTier', undefined)
                      }}
                      options={serviceOptions}
                      onUpdateOptions={setServiceOptions}
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
          {!!selectedAppName && errors[selectedAppName!] && (
            <Text color={Color.RED_500}>{errors[selectedAppName]}</Text>
          )}
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
