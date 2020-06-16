import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Table, Select, Text, ModalProvider, Link, Container, SelectOption, Color } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import css from './TierAndServiceTable.module.scss'
import { Spinner } from '@blueprintjs/core'
import { AppDynamicsService } from 'modules/cv/services'
import MetricsVerificationModal from 'modules/cv/components/MetricsVerificationModal/MetricsVerificationModal'
import type { AppdynamicsTier, AppdynamicsValidationResponse, MetricPack } from '@wings-software/swagger-ts/definitions'
import type { Row, Cell } from 'react-table'
import type { TextProps } from '@wings-software/uikit/dist/components/Text/Text'

export type TierAndServiceRow = {
  tierName?: string
  tierId?: number
  selected: boolean
  service?: string
  validation?: boolean
}

interface TierAndServiceTableProps {
  metricPacks: MetricPack[]
  appId: number
  index: number
  dataSourceId: string
  accountId: string
  serviceOptions: SelectOption[]
  setFieldTouched: (fieldName: string, touched?: boolean) => void
  setFieldValue: (fieldName: string, value: any) => void
  data?: TierAndServiceRow[]
}

interface RowRendererProps {
  row: Row<TierAndServiceRow>
  services: SelectOption[]
  accountId: string
  projectId: number
  appId: number
  metricPacks: MetricPack[]
  onChange: (fieldName: keyof TierAndServiceRow, value: any, index: number) => void
  connectorId: string
}

interface ValidationResultProps {
  validationResult?: AppdynamicsValidationResponse[]
  error?: any
  isLoading: boolean
  isChecked: boolean
  guid: string
}

const XHR_METRIC_VALIDATION_GROUP = 'XHR_METRIC_VALIDATION_GROUP'
const XHR_TIER_GROUP = 'XHR_TIER_GROUP'

const DEFAULT_ROW_OBJ: TierAndServiceRow = { service: '', selected: false, tierName: undefined, tierId: undefined }
const BPTableProps = { bordered: true, condensed: true, striped: true }
export const DefaultTiersAndService: TierAndServiceRow[] = [...Array(6).keys()].map(() => ({ ...DEFAULT_ROW_OBJ }))

async function fetchTiers(
  settingId: string,
  accountId: string,
  appId: number,
  xhrGroup: string
): Promise<TierAndServiceRow[] | undefined> {
  const { error, status, response } = await AppDynamicsService.getAppDynamicsTiers({
    accountId,
    datasourceId: settingId,
    appDynamicsAppId: appId,
    xhrGroup
  })
  if (status === xhr.ABORTED || error || !response?.resource?.length) {
    return
  }
  return response?.resource
    ?.sort((a: AppdynamicsTier, b: AppdynamicsTier) => (a.name && b.name && a.name >= b.name ? 1 : -1))
    .map((tier: AppdynamicsTier) => {
      return { ...DEFAULT_ROW_OBJ, tierName: tier.name, tierId: tier.id }
    })
}

function ValidationResult(props: ValidationResultProps): JSX.Element {
  const { validationResult, error, isLoading, isChecked, guid } = props
  const [shouldDisplayModal, setModalDisplay] = useState(false)
  const hideModalCallback = useCallback(() => () => setModalDisplay(false), [])
  const validationStatus: { status: string; intent: TextProps['intent'] } | undefined = useMemo(() => {
    if (error && error.message) {
      return { intent: 'danger', status: error.message }
    }

    if (!validationResult) {
      return
    }

    for (const result of validationResult) {
      if (result.overallStatus === 'FAILED') {
        return { status: 'Fail', intent: 'danger' }
      } else if (result.overallStatus === 'NO_DATA') {
        return { status: 'No Data', intent: 'none' }
      }
    }

    if (validationResult.every(result => result?.overallStatus === 'SUCCESS')) {
      return { intent: 'success', status: 'Success' }
    }
  }, [validationResult, error])

  const childFields = useMemo(() => {
    if (!isChecked) {
      return <span />
    } else if (isLoading) {
      return <Spinner size={Spinner.SIZE_SMALL} />
    } else if (validationStatus || shouldDisplayModal) {
      return (
        <Container className={css.validationContainer}>
          <Text intent={validationStatus?.intent} width={error && error.message ? 100 : 55} lineClamp={1}>
            {validationStatus?.status}
          </Text>
          {!error && !error?.message && (
            <Text inline className={css.divider}>
              |
            </Text>
          )}
          {!error && !error?.message && (
            <Link withoutHref onClick={() => setModalDisplay(true)}>
              View Details
            </Link>
          )}
          {shouldDisplayModal && (
            <MetricsVerificationModal verificationData={validationResult} guid={guid} onHide={hideModalCallback()} />
          )}
        </Container>
      )
    }
    return <span />
  }, [guid, hideModalCallback, error, isChecked, isLoading, shouldDisplayModal, validationResult, validationStatus])
  return <Container className={css.validationResult}>{childFields}</Container>
}

function RowRenderer(props: RowRendererProps): JSX.Element {
  const { row, services, accountId, projectId, appId, metricPacks, onChange, connectorId } = props
  const { cells, original, index: rowIndex } = row
  const { service, tierName, selected, tierId } = original || {}
  const [[mp, s, t], setDep] = useState<[MetricPack[] | undefined, boolean | undefined, number | undefined]>([
    undefined,
    undefined,
    undefined
  ])
  const [{ error, validationResult, isLoading, guid }, setValidationResult] = useState<{
    error: string
    validationResult: AppdynamicsValidationResponse[] | undefined
    isLoading: boolean
    guid: string
  }>({
    error: '',
    validationResult: undefined,
    isLoading: false,
    guid: new Date().getTime().toString()
  })

  useEffect(() => {
    if (!metricPacks?.length || !tierId || !selected) {
      return
    }
    if (mp === metricPacks && s === selected && t === tierId) {
      return
    }
    const newGUID = new Date().getTime().toString()
    setValidationResult({ isLoading: true, validationResult: undefined, error: '', guid: newGUID })
    setDep([metricPacks, selected, tierId])
    xhr.abort(`${XHR_METRIC_VALIDATION_GROUP}-${guid}`)
    AppDynamicsService.validateMetricsApi({
      accountId,
      connectorId,
      projectId: projectId.toString(),
      tierId,
      appId,
      metricPacks,
      xhrGroup: `${XHR_METRIC_VALIDATION_GROUP}-${newGUID}`,
      guid: newGUID
    }).then(({ status, error: apiError, response }) => {
      if (status === xhr.ABORTED) {
        return
      }
      setValidationResult({ error: apiError, validationResult: response?.resource, isLoading: false, guid: newGUID })
      onChange('validation', response?.resource ? true : false, rowIndex)
    })
  }, [accountId, appId, metricPacks, projectId, tierId, selected, onChange, connectorId, rowIndex])
  const serviceSelectObj: SelectOption | undefined = useMemo(() => {
    if (!services.length) {
      return { value: '', label: '' }
    }
    return !service ? services[0] : services.find(({ value }) => value === service)
  }, [service, services])

  const rowCellCallback = useCallback(
    (index: number, cell: Cell<TierAndServiceRow, any>) => {
      if (!tierName) {
        return <Container height={20} width={index === 0 ? 30 : 100} />
      }
      switch (index) {
        case 0:
          return (
            <Container className={css.tierSelectChecBox}>
              <input
                type="checkbox"
                checked={cell.value}
                onChange={() => {
                  const serviceName = serviceSelectObj && serviceSelectObj.label ? serviceSelectObj.label : ''
                  onChange('selected', { service: serviceName, selected: Boolean(!selected) }, rowIndex)
                }}
              />
            </Container>
          )
        case 1:
          return (
            <Text lineClamp={1} className={css.tier} width={100} color={Color.BLACK}>
              {tierName}
            </Text>
          )
        case 2:
          return (
            <Select
              items={services}
              className={css.serviceSelect}
              value={serviceSelectObj}
              onChange={value => {
                onChange('service', value?.label, rowIndex)
              }}
            />
          )
        case 3:
          return (
            <ValidationResult
              validationResult={validationResult}
              error={error}
              isLoading={isLoading}
              guid={guid}
              isChecked={selected}
            />
          )
        default:
          return <span />
      }
    },
    [error, guid, isLoading, onChange, rowIndex, serviceSelectObj, services, tierName, selected, validationResult]
  )
  return (
    <tr key={row.id}>
      {cells.map((cell, index) => {
        const { key: cellKey } = cell.getCellProps()
        return <td key={cellKey}>{rowCellCallback(index, cell)}</td>
      })}
    </tr>
  )
}

export default function TierAndServiceTable(props: TierAndServiceTableProps): JSX.Element {
  const {
    appId,
    metricPacks,
    dataSourceId,
    setFieldTouched,
    setFieldValue,
    serviceOptions,
    data = [],
    index: appIndex,
    accountId
  } = props
  const [tableData, setTableData] = useState([...DefaultTiersAndService])
  const [isLoadingTiers, setIsLoadingTiers] = useState(true)

  // fetch tier and service list
  useEffect(() => {
    const xhrGroup = `${XHR_TIER_GROUP}_${appId}`
    fetchTiers(dataSourceId, accountId, appId, xhrGroup).then(tiers => {
      if (!tiers?.length) {
        setIsLoadingTiers(false)
        return
      }

      const existingTiers = new Map<string, TierAndServiceRow>()
      for (const row of data) {
        if (row?.tierName) {
          existingTiers.set(row.tierName, row)
        }
      }

      let tiersToSet = tiers
      if (tiers.length < DefaultTiersAndService.length) {
        const newTiers = [...DefaultTiersAndService]
        tiersToSet.forEach((tierName, index) => (newTiers[index] = tierName))
        tiersToSet = newTiers
      }

      const blah = tiersToSet.map(tierRow =>
        tierRow?.tierName && existingTiers.has(tierRow.tierName)
          ? {
              ...(existingTiers.get(tierRow.tierName) as TierAndServiceRow),
              tierName: tierRow.tierName,
              tierId: tierRow.tierId
            }
          : tierRow
      )
      blah.forEach((b, index: number) => {
        if (index < data.length) {
          data[index] = b
        } else {
          data.push(b)
        }
      })
      setFieldValue(`dsConfigs[${appIndex}].tableData`, data)
      setTableData(blah)
      setIsLoadingTiers(false)
    })
    return () => xhr.abort(xhrGroup)
  }, [appId, dataSourceId, accountId, appIndex])

  // when clicking on column header checkbox toggle checked value of all checkboxes
  const onColumnCheckboxCallback = useCallback(
    e => {
      if (data) {
        data.forEach(tierRow => (tierRow.selected = e.target.checked))
        setFieldValue(`dsConfigs[${appIndex}].tableData`, [...data])
        setFieldTouched(`dsConfigs[${appIndex}].tableData`, true)
      }
      setTableData(tableData.map(row => ({ ...row, selected: e.target.checked })))
    },
    [appIndex, setFieldValue, tableData, data, setFieldTouched]
  )

  const tableColumns = useMemo(
    () => [
      {
        Header: <input type="checkbox" className={css.tierSelectChecBox} onClick={onColumnCheckboxCallback} />,
        accessor: 'selected'
      },
      {
        Header: 'Tier',
        accessor: 'tierName'
      },
      {
        Header: 'Service',
        accessor: 'serviceId'
      },
      {
        Header: 'Validation',
        accessor: 'validation'
      }
    ],
    [onColumnCheckboxCallback]
  )

  const onRowChangeCallback = useCallback(
    (fieldName: keyof TierAndServiceRow, value: any, index: number) => {
      const newData = [...tableData]
      if (fieldName === 'selected') {
        const validation = value.selected ? data[index]['validation'] : undefined
        data[index] = { ...data[index], ...value, validation }
        newData[index] = { ...newData[index], ...value, validation }
      } else {
        newData[index][fieldName] = value as never
        data[index][fieldName] = value as never
      }

      setFieldValue(`dsConfigs[${appIndex}].tableData`, fieldName === 'validation' ? data : [...data])
      setFieldTouched(`dsConfigs[${appIndex}].tableData`, true)
      setTableData(newData)
    },
    [appIndex, setFieldValue, tableData, data, setFieldTouched]
  )

  return (
    <ModalProvider>
      <Table
        columns={tableColumns as any}
        bpTableProps={BPTableProps}
        data={!isLoadingTiers ? tableData : DefaultTiersAndService}
        className={css.main}
        renderCustomRow={row => (
          <RowRenderer
            key={row.values?.tierName || row.index}
            row={row as any}
            appId={appId}
            accountId={accountId}
            onChange={onRowChangeCallback}
            projectId={1234}
            connectorId={dataSourceId}
            metricPacks={metricPacks}
            services={serviceOptions}
          />
        )}
      />
    </ModalProvider>
  )
}
