import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Table, Select, Text, ModalProvider, Link, Container, SelectOption } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import css from './TierAndServiceTable.css'
import { Spinner } from '@blueprintjs/core'
import { AppDynamicsService } from '../../../../services'
import MetricsVerificationModal from '../../../../components/MetricsVerificationModal/MetricsVerificationModal'
import type { AppdynamicsTier } from '@wings-software/swagger-ts/definitions'

export type TierAndServiceRow = {
  tier: { id?: number; name?: string }
  isExisting: boolean
  selected: boolean
  serviceId?: string
  configUUID?: string
}

interface TierAndServiceTableProps {
  data: TierAndServiceRow[]
  metricPacks: string[]
  onChange: (fieldName: string, value: TierAndServiceRow[]) => void
  appId: string
  index: number
  dataSourceId: string
  accountId: string
  serviceOptions: SelectOption[]
}

const XHR_METRIC_VALIDATION_GROUP = 'XHR_METRIC_VALIDATION_GROUP'

const DEFAULT_ROW_OBJ: TierAndServiceRow = { serviceId: '', selected: false, tier: {}, isExisting: false }
const BPTableProps = { bordered: true, condensed: true, striped: true }
const DefaultTiersAndService = [{ ...DEFAULT_ROW_OBJ }]

async function fetchTiers(
  settingId: string,
  accountId: string,
  appId: string
): Promise<TierAndServiceRow[] | undefined> {
  const { error, status, tiers } = await AppDynamicsService.getAppDynamicsTiers({
    accountId,
    datasourceId: settingId,
    appdynamicsAppId: appId
  })
  if (status === xhr.ABORTED || error || !tiers?.length) {
    return
  }
  return tiers
    .sort((a: AppdynamicsTier, b: AppdynamicsTier) => (a.name && b.name && a.name >= b.name ? 1 : -1))
    .map((tier: AppdynamicsTier) => {
      return { ...DEFAULT_ROW_OBJ, tier: { name: tier.name, id: tier.id } }
    })
}

function ValidationResult(props): JSX.Element {
  const { validationResult, error, isLoading, isChecked, guid } = props
  const [shouldDisplayModal, setModalDisplay] = useState(false)
  const hideModalCallback = useCallback(() => () => setModalDisplay(false), [])
  const validationSuccess = validationResult ? 'Success' : error
  const childFields = useMemo(() => {
    if (!isChecked) {
      return <span />
    } else if (isLoading) {
      return <Spinner size={Spinner.SIZE_SMALL} />
    } else if (validationResult || error || shouldDisplayModal) {
      return (
        <Container className={css.validationContainer}>
          <Text className={validationResult ? css.success : css.error} width={55} lineClamp={1}>
            {validationSuccess}
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
  }, [error, guid, hideModalCallback, isChecked, isLoading, shouldDisplayModal, validationResult, validationSuccess])
  return <Container className={css.validationResult}>{childFields}</Container>
}

function RowRenderer(props): JSX.Element {
  const { row, services, accountId, projectId, appId, metricPacks, onChange, connectorId } = props
  const { cells, values, index: rowIndex, ...otherProps } = row
  const [{ error, validationResult, isLoading, guid }, setValidationResult] = useState({
    error: '',
    validationResult: '',
    isLoading: false,
    guid: new Date().getTime()
  })
  const { serviceId, tier, selected } = values

  useEffect(() => {
    if (!metricPacks?.length || !tier?.id || !selected) {
      return
    }
    const newGUID = new Date().getTime()
    setValidationResult({ isLoading: true, validationResult: '', error: '', guid: newGUID })
    VerificationService.validateMetricsApi({
      accountId,
      connectorId,
      projectId,
      tierId: tier?.id,
      appId,
      metricPacks,
      xhrGroup: `${XHR_METRIC_VALIDATION_GROUP}-${newGUID}`,
      guid: newGUID
    }).then(({ status, error, validationResult }) => {
      if (status === xhr.ABORTED) {
        return
      }
      setValidationResult({ error, validationResult, isLoading: false, guid: newGUID })
    })
  }, [accountId, appId, metricPacks, projectId, tier, selected, connectorId])
  const serviceSelectObj = useMemo(
    () => services?.find(({ value }) => value === serviceId) || [{ label: '', value: '' }],
    [serviceId, services]
  )

  const rowCellCallback = useCallback(
    () => (index, cell) => {
      switch (index) {
        case 0:
          return (
            <input
              type="checkbox"
              className={css.tierSelectChecBox}
              checked={cell.value}
              onClick={() => onChange('selected', Boolean(!selected), rowIndex)}
            />
          )
        case 1:
          return <Text className={css.tierName}>{tier?.name}</Text>
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
            {rowCellCallback()(index, cell)}
          </td>
        )
      })}
    </tr>
  )
}

export default function TierAndServiceTable(props: TierAndServiceTableProps): JSX.Element {
  const { appId, metricPacks, data, onChange, dataSourceId, serviceOptions, index: appIndex, accountId } = props
  const [tierList, setTierList] = useState<TierAndServiceRow[]>(DefaultTiersAndService)

  // fetch tier and service list
  useEffect(() => {
    fetchTiers(dataSourceId, accountId, appId).then(tiers => {
      setTierList(tiers?.length ? tiers : [])
    })
  }, [appId, dataSourceId, accountId])

  // merge api call list with data list user has saved
  const mergedData: TierAndServiceRow[] = useMemo(() => {
    const existingTiers = new Map(data?.length ? data.map(tierMapping => [tierMapping.tier?.id, tierMapping]) : [])
    return tierList?.map(tierRow =>
      existingTiers.has(tierRow?.tier?.id) ? { ...existingTiers.get(tierRow?.tier.id), tier: tierRow?.tier } : tierRow
    )
  }, [data, tierList])

  // when clicking on column header checkbox toggle checked value of all checkboxes
  const onColumnCheckboxCallback = useCallback(
    () => e => {
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
        Header: <input type="checkbox" className={css.tierSelectChecBox} onClick={onColumnCheckboxCallback()} />,
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
    () => (fieldName: string, value, index: number) => {
      const newData = [...mergedData]
      newData[index][fieldName] = value
      onChange(`appDConfigs[${appIndex}].tableData`, newData)
    },
    [appIndex, mergedData, onChange]
  )

  return (
    <ModalProvider>
      <Table
        columns={tableColumns}
        bpTableProps={BPTableProps}
        data={mergedData}
        className={css.main}
        renderCustomRow={row => (
          <RowRenderer
            row={row}
            appId={appId}
            accountId={accountId}
            onChange={onRowChangeCallback()}
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
