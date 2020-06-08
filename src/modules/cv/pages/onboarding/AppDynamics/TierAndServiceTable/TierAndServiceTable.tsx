import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Table, Select, Text, ModalProvider, Link, Container, SelectOption } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import css from './TierAndServiceTable.module.scss'
import { Spinner } from '@blueprintjs/core'
import { AppDynamicsService } from 'modules/cv/services'
import MetricsVerificationModal from 'modules/cv/components/MetricsVerificationModal/MetricsVerificationModal'
import type { AppdynamicsTier, AppdynamicsValidationResponse, MetricPack } from '@wings-software/swagger-ts/definitions'
import type { Row, Cell } from 'react-table'
import type { TextProps } from '@wings-software/uikit/dist/components/Text/Text'

export type TierAndServiceRow = {
  tier?: { id?: number; name?: string }
  isExisting: boolean
  selected: boolean
  serviceId?: string
  configUUID?: string
  validation?: boolean
}

interface TierAndServiceTableProps {
  data?: TierAndServiceRow[]
  metricPacks: MetricPack[]
  onChange: (fieldName: string, value: TierAndServiceRow[]) => void
  appId: string
  index: number
  dataSourceId: string
  accountId: string
  serviceOptions: SelectOption[]
}

interface RowRendererProps {
  row: Row<TierAndServiceRow>
  services: SelectOption[]
  accountId: string
  projectId: number
  appId: string
  metricPacks: MetricPack[]
  onChange: (fieldName: keyof TierAndServiceRow, value: any, index: number) => void
  connectorId: string
}

interface ValidationResultProps {
  validationResult?: AppdynamicsValidationResponse[]
  error?: string
  isLoading: boolean
  isChecked: boolean
  guid: string
}

const XHR_METRIC_VALIDATION_GROUP = 'XHR_METRIC_VALIDATION_GROUP'
const XHR_TIER_GROUP = 'XHR_TIER_GROUP'

const DEFAULT_ROW_OBJ: TierAndServiceRow = { serviceId: '', selected: false, tier: undefined, isExisting: false }
const BPTableProps = { bordered: true, condensed: true, striped: true }
const DefaultTiersAndService: TierAndServiceRow[] = [...Array(6).keys()].map(() => ({ ...DEFAULT_ROW_OBJ }))

async function fetchTiers(
  settingId: string,
  accountId: string,
  appId: string,
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
      return { ...DEFAULT_ROW_OBJ, tier: { name: tier.name, id: tier.id } }
    })
}

function ValidationResult(props: ValidationResultProps): JSX.Element {
  const { validationResult, error, isLoading, isChecked, guid } = props
  const [shouldDisplayModal, setModalDisplay] = useState(false)
  const hideModalCallback = useCallback(() => () => setModalDisplay(false), [])
  const validationStatus: { status: string; intent: TextProps['intent'] } = useMemo(() => {
    for (const result of validationResult || []) {
      if (result.overallStatus === 'FAILED') {
        return { status: 'Fail', intent: 'danger' }
      } else if (result.overallStatus === 'NO_DATA') {
        return { status: 'No Data', intent: 'none' }
      }
    }
    return { status: 'Success', intent: 'success' }
  }, [validationResult])

  const childFields = useMemo(() => {
    if (!isChecked) {
      return <span />
    } else if (isLoading) {
      return <Spinner size={Spinner.SIZE_SMALL} />
    } else if (validationResult || error || shouldDisplayModal) {
      return (
        <Container className={css.validationContainer}>
          <Text intent={validationStatus.intent} width={55} lineClamp={1}>
            {validationStatus.status}
          </Text>
          <Text inline className={css.divider}>
            |
          </Text>
          <Link withoutHref onClick={() => setModalDisplay(true)}>
            View Details
          </Link>
          {shouldDisplayModal && (
            <MetricsVerificationModal verificationData={validationResult} guid={guid} onHide={hideModalCallback()} />
          )}
        </Container>
      )
    }
    return <span />
  }, [error, guid, hideModalCallback, isChecked, isLoading, shouldDisplayModal, validationResult, validationStatus])
  return <Container className={css.validationResult}>{childFields}</Container>
}

function RowRenderer(props: RowRendererProps): JSX.Element {
  const { row, services, accountId, projectId, appId, metricPacks, onChange, connectorId } = props
  const { cells, values, index: rowIndex, ...otherProps } = row
  const [[mp, s, t], setDep] = useState([metricPacks, values.selected, values.tier?.id])
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
  const { serviceId, tier, selected } = values

  useEffect(() => {
    if (!metricPacks?.length || !tier?.id || !selected) {
      return
    }
    if (mp === metricPacks && s === selected && t === tier?.id) {
      return
    }
    const newGUID = new Date().getTime().toString()
    setValidationResult({ isLoading: true, validationResult: undefined, error: '', guid: newGUID })
    xhr.abort(`${XHR_METRIC_VALIDATION_GROUP}-${guid}`)
    AppDynamicsService.validateMetricsApi({
      accountId,
      connectorId,
      projectId: projectId.toString(),
      tierId: tier.id,
      appId,
      metricPacks,
      xhrGroup: `${XHR_METRIC_VALIDATION_GROUP}-${newGUID}`,
      guid: newGUID
    }).then(({ status, error: apiError, response }) => {
      if (status === xhr.ABORTED) {
        return
      }
      setValidationResult({ error: apiError, validationResult: response?.resource, isLoading: false, guid: newGUID })
      setDep([metricPacks, selected, tier.id])
      onChange('validation', response?.resource ? true : false, rowIndex)
    })
  }, [accountId, appId, metricPacks, projectId, tier, selected, onChange, connectorId, rowIndex])

  const serviceSelectObj: SelectOption | undefined = useMemo(() => {
    if (!services.length) {
      return { value: '', label: '' }
    }
    return !serviceId ? services[0] : services.find(({ value }) => value === serviceId)
  }, [serviceId, services])

  const rowCellCallback = useCallback(
    (index: number, cell: Cell<TierAndServiceRow, any>) => {
      if (!tier || !tier.id || !tier.name) {
        return <Container height={25} width={index === 0 ? 30 : 100} />
      }
      switch (index) {
        case 0:
          return (
            <input
              type="checkbox"
              className={css.tierSelectChecBox}
              checked={cell.value}
              onClick={() =>
                onChange('selected', { serviceId: serviceSelectObj?.value, selected: Boolean(!selected) }, rowIndex)
              }
            />
          )
        case 1:
          return (
            <Text lineClamp={1} width={100}>
              {tier && tier.name}
            </Text>
          )
        case 2:
          return (
            <Select
              items={services}
              className={css.serviceSelect}
              value={serviceSelectObj}
              onChange={value => {
                onChange('serviceId', value?.value, rowIndex)
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
    [error, guid, isLoading, onChange, rowIndex, serviceSelectObj, services, tier, selected, validationResult]
  )
  return (
    <tr {...otherProps}>
      {cells.map((cell, index) => {
        const { key: cellKey, ...otherCellProps } = cell.getCellProps()
        return (
          <td key={cellKey} {...otherCellProps}>
            {rowCellCallback(index, cell)}
          </td>
        )
      })}
    </tr>
  )
}

export default function TierAndServiceTable(props: TierAndServiceTableProps): JSX.Element {
  const { appId, metricPacks, data = [], onChange, dataSourceId, serviceOptions, index: appIndex, accountId } = props
  const [tierList, setTierList] = useState<TierAndServiceRow[]>(DefaultTiersAndService)

  // fetch tier and service list
  useEffect(() => {
    const xhrGroup = `${XHR_TIER_GROUP}_${appId}`
    fetchTiers(dataSourceId, accountId, appId, xhrGroup).then(tiers => {
      if (!tiers?.length) {
        return
      }
      if (tiers.length < DefaultTiersAndService.length) {
        const newTiers = [...DefaultTiersAndService]
        tiers.forEach((tier, index) => (newTiers[index] = tier))
        setTierList(newTiers)
      } else {
        setTierList(tiers)
      }
    })
    return () => xhr.abort(xhrGroup)
  }, [appId, dataSourceId, accountId])

  // merge api call list with data list user has saved
  const mergedData = useMemo(() => {
    const existingTiers = new Map<number, TierAndServiceRow>()
    for (const row of data) {
      if (row?.tier?.id) {
        existingTiers.set(row.tier.id, row)
      }
    }

    return tierList.map(tierRow =>
      tierRow?.tier?.id && existingTiers.has(tierRow.tier.id)
        ? { ...(existingTiers.get(tierRow.tier.id) as TierAndServiceRow), tier: tierRow.tier }
        : tierRow
    )
  }, [tierList, data])

  // when clicking on column header checkbox toggle checked value of all checkboxes
  const onColumnCheckboxCallback = useCallback(
    e => {
      const checkedTiersRows = [...mergedData]
      checkedTiersRows?.forEach(tierRow => {
        tierRow.selected = e.target.checked
      })
      onChange(`appDConfigs[${appIndex}].tableData`, checkedTiersRows)
    },
    [appIndex, mergedData, onChange]
  )

  const tableColumns = useMemo(
    () => [
      {
        Header: <input type="checkbox" className={css.tierSelectChecBox} onClick={onColumnCheckboxCallback} />,
        accessor: 'selected'
      },
      {
        Header: 'Tier',
        accessor: 'tier'
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
      const newData = [...mergedData]
      if (fieldName === 'selected') {
        newData[index]['serviceId'] = value.serviceId
        newData[index]['selected'] = value.selected
      } else {
        newData[index][fieldName] = value as never
      }
      onChange(`appDConfigs[${appIndex}].tableData`, newData)
    },
    [appIndex, mergedData, onChange]
  )

  return (
    <ModalProvider>
      <Table
        columns={tableColumns as any}
        bpTableProps={BPTableProps}
        data={mergedData}
        className={css.main}
        renderCustomRow={row => (
          <RowRenderer
            row={row}
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
