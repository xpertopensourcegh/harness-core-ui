import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Table, Select, Text, ModalProvider, Link, Container, SelectOption, Color } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import { Spinner, Classes } from '@blueprintjs/core'
import type { AppdynamicsTier, AppdynamicsValidationResponse, MetricPack } from '@wings-software/swagger-ts/definitions'
import type { Row } from 'react-table'
import type { TextProps } from '@wings-software/uikit/dist/components/Text/Text'
import type { IDBPDatabase } from 'idb'
import { AppDynamicsService, CVNextGenCVConfigService } from 'modules/cv/services'
import MetricsVerificationModal from 'modules/cv/components/MetricsVerificationModal/MetricsVerificationModal'
import {
  useIndexedDBHook,
  CVObjectStoreNames,
  CVIndexedDBPrimaryKeys
} from 'modules/cv/hooks/IndexedDBHook/IndexedDBHook'
import i18n from './TierAndServiceTable.i18n'
import css from './TierAndServiceTable.module.scss'

export type TierAndServiceRow = {
  tierOption?: SelectOption
  serviceName?: string
  validation?: boolean
}

interface TierAndServiceTableProps {
  metricPacks: MetricPack[]
  appId: number
  index: number
  dataSourceId: string
  accountId: string
  isLoadingServices: boolean
  setFieldTouched: (fieldName: string, touched?: boolean) => void
  setFieldValue: (fieldName: string, value: any) => void
  data?: TierAndServiceRow[]
  projectId: string
  orgId: string
}

interface RowRendererProps {
  row: Row<TierAndServiceRow>
  tierOptions: SelectOption[]
  accountId: string
  orgId: string
  projectId: string
  appId: number
  isLoadingServices: boolean
  metricPacks: MetricPack[]
  onChange: (fieldName: keyof TierAndServiceRow, value: any, index: number) => void
  connectorId: string
}

interface ValidationResultProps {
  validationResult?: AppdynamicsValidationResponse[]
  error?: string
  tierId?: number
  isLoading: boolean
  isLoadingServices: boolean
}

interface TierDropdownProps {
  tierOptions: SelectOption[]
  tierOption?: SelectOption
  onChange: RowRendererProps['onChange']
  isLoading: boolean
  serviceName?: string
  index: number
}

interface ViewDetailsProps {
  validationResult?: AppdynamicsValidationResponse[]
  error?: string
  tierId?: number
  guid: string
  isLoading: boolean
}

const XHR_METRIC_VALIDATION_GROUP = 'XHR_METRIC_VALIDATION_GROUP'
const XHR_TIER_GROUP = 'XHR_TIER_GROUP'

export const DEFAULT_ROW_OBJ: TierAndServiceRow = {
  serviceName: '',
  tierOption: undefined
}
const BPTableProps = { bordered: true, condensed: true, striped: true }
export const DefaultTiersAndService: TierAndServiceRow[] = [...Array(6).keys()].map(() => ({ ...DEFAULT_ROW_OBJ }))
const TABLE_COLUMNS = [
  {
    Header: i18n.columnHeaders.service,
    accessor: 'serviceName'
  },
  {
    Header: i18n.columnHeaders.tier,
    accessor: 'tierOption'
  },
  {
    Header: i18n.columnHeaders.validation,
    accessor: 'validation'
  },
  {
    Header: <Container width={80} />,
    accessor: 'viewDetails'
  }
]

async function fetchAppDTiers(
  settingId: string,
  accountId: string,
  appId: number,
  orgId: string,
  projectId: string,
  xhrGroup: string
): Promise<{ error?: string; tierList?: SelectOption[] } | undefined> {
  const { error, status, response } = await AppDynamicsService.getAppDynamicsTiers({
    accountId,
    datasourceId: settingId,
    orgId,
    projectId,
    appDynamicsAppId: appId,
    xhrGroup
  })
  if (status === xhr.ABORTED) {
    return
  }
  if (error) {
    return { error }
  }
  return {
    tierList: response?.resource
      ?.sort((a: AppdynamicsTier, b: AppdynamicsTier) => (a.name && b.name && a.name >= b.name ? 1 : -1))
      .map(({ name, id }) => ({ label: name || '', value: id || '' }))
  }
}

async function loadAppDTiers(
  accountId: string,
  appId: number,
  dataSourceId: string,
  orgId: string,
  projectId: string,
  dbInstance?: IDBPDatabase
): Promise<{ error?: string; tierList?: SelectOption[] } | undefined> {
  if (!appId || appId === -1 || !dataSourceId) {
    return { tierList: [] }
  }
  const cachedTierOptions = await dbInstance?.get(CVObjectStoreNames.APPD_TIERS, [appId, dataSourceId])
  if (cachedTierOptions) {
    return { tierList: cachedTierOptions.tiers }
  }

  const xhrGroup = `${XHR_TIER_GROUP}_${appId}`
  xhr.abort(xhrGroup)
  const tiers = await fetchAppDTiers(dataSourceId, accountId, appId, orgId, projectId, xhrGroup)
  if (tiers?.tierList?.length) {
    dbInstance?.put(CVObjectStoreNames.APPD_TIERS, {
      [CVIndexedDBPrimaryKeys.APPD_APP_ID]: appId,
      [CVIndexedDBPrimaryKeys.DATASOURCE_ID]: dataSourceId,
      tiers: tiers.tierList
    })
  }
  return tiers
}

function mergeTierListWithExistingData(tableData: TierAndServiceRow[], tierList: SelectOption[]): void {
  const existingTiers = new Map<string, TierAndServiceRow>()
  for (const row of tableData || []) {
    if (row?.tierOption?.label) {
      existingTiers.set(row.tierOption.label, row)
    }
  }

  if (!tierList?.length) {
    return
  }

  tierList.forEach(tier => {
    if (!tier?.label || !tier?.value) {
      return
    }

    const tableRow = existingTiers.get(tier.label)
    if (tableRow?.tierOption) {
      tableRow.tierOption.value = tier.value as number
      tableRow.tierOption.label = tier.label
    }
  })

  for (let paddingIndex = 6 - tableData.length; paddingIndex > 0; paddingIndex--) {
    tableData.push({ ...DEFAULT_ROW_OBJ })
  }
}

function LoadingCell(props: { width: number }): JSX.Element {
  const { width } = props
  return (
    <Container
      height={12}
      width={width}
      className={Classes.SKELETON}
      style={{ marginTop: '4px', marginBottom: '4px' }}
    />
  )
}

function ValidationResult(props: ValidationResultProps): JSX.Element {
  const { validationResult, error, isLoading, isLoadingServices, tierId } = props
  const validationStatus: { status: string; intent: TextProps['intent'] } | undefined = useMemo(() => {
    if (error) {
      return { intent: 'danger', status: error }
    }

    if (!validationResult) {
      return
    }

    for (const result of validationResult) {
      if (result.overallStatus === 'FAILED') {
        return { status: i18n.validationStatus.error, intent: 'danger' }
      } else if (result.overallStatus === 'NO_DATA') {
        return { status: i18n.validationStatus.noData, intent: 'none' }
      }
    }

    if (validationResult.every(result => result?.overallStatus === 'SUCCESS')) {
      return { intent: 'success', status: i18n.validationStatus.success }
    }
  }, [validationResult, error])

  const childFields = useMemo(() => {
    if (!tierId) {
      return <Container width={100} />
    } else if (isLoading) {
      return <Spinner size={Spinner.SIZE_SMALL} />
    } else if (validationStatus) {
      return (
        <Container className={css.validationContainer} width={100}>
          <Text intent={validationStatus.intent} width={100} lineClamp={1}>
            {validationStatus.status}
          </Text>
        </Container>
      )
    }
    return <Container width={100} />
  }, [isLoading, validationStatus, tierId])
  return isLoadingServices ? (
    <LoadingCell width={100} />
  ) : (
    <Container className={css.validationResult}>{childFields}</Container>
  )
}

function TierName(props: TierDropdownProps): JSX.Element {
  const { isLoading, tierOption, tierOptions, serviceName, onChange, index } = props
  if (isLoading) {
    return <LoadingCell width={100} />
  } else if (!serviceName) {
    return <Container width={100} height={19} />
  }
  return (
    <Select
      items={tierOptions || []}
      className={css.tierSelect}
      value={tierOption}
      onChange={(item: SelectOption) => {
        onChange('tierOption', item, index)
      }}
    />
  )
}

function ServiceName(props: { serviceName?: string; isLoading: boolean }): JSX.Element {
  const { serviceName, isLoading } = props
  if (isLoading) {
    return <LoadingCell width={100} />
  }

  return (
    <Text lineClamp={1} className={css.serviceName} width={100} color={Color.BLACK}>
      {serviceName}
    </Text>
  )
}

function ViewDetails(props: ViewDetailsProps): JSX.Element {
  const { error, validationResult, guid, isLoading, tierId } = props
  const [displayMetricsModal, setMetricsModalDisplay] = useState(false)
  const hideModalCallback = useCallback(() => () => setMetricsModalDisplay(false), [])
  if (isLoading) {
    return <LoadingCell width={83} />
  }
  if (!tierId) {
    return <Container width={85} />
  }
  if (displayMetricsModal) {
    return (
      <MetricsVerificationModal
        verificationData={validationResult}
        guid={guid}
        onHide={hideModalCallback()}
        verificationType="AppDynamics"
      />
    )
  }
  return !error && validationResult ? (
    <Link withoutHref onClick={() => setMetricsModalDisplay(true)} className={css.viewDetails}>
      {i18n.viewDetails}
    </Link>
  ) : (
    <Container />
  )
}

function RowRenderer(props: RowRendererProps): JSX.Element {
  const {
    row,
    tierOptions,
    accountId,
    projectId,
    appId,
    metricPacks,
    orgId,
    onChange,
    connectorId,
    isLoadingServices
  } = props
  const { cells, original, index: rowIndex } = row
  const { serviceName, tierOption } = original || {}
  const [[mp, t], setDep] = useState<[MetricPack[] | undefined, number | undefined]>([undefined, undefined])
  const [{ error, validationResult, isValidating, guid }, setValidationResult] = useState<{
    error: string
    validationResult: AppdynamicsValidationResponse[] | undefined
    isValidating: boolean
    guid: string
  }>({
    error: '',
    validationResult: undefined,
    isValidating: false,
    guid: new Date().getTime().toString()
  })

  const tierId = tierOption?.value as number
  useEffect(() => {
    if (!metricPacks?.length || !tierId || tierId === -1 || appId === -1 || isLoadingServices) {
      return
    }
    if (mp === metricPacks && t === tierId) {
      return
    }
    const newGUID = new Date().getTime().toString()
    setValidationResult({ isValidating: true, validationResult: undefined, error: '', guid: newGUID })
    setDep([metricPacks, tierId])
    xhr.abort(`${XHR_METRIC_VALIDATION_GROUP}-${guid}`)
    CVNextGenCVConfigService.validateMetricsApi({
      accountId,
      connectorId,
      projectId: projectId.toString(),
      tierId,
      orgId,
      appId,
      metricPacks,
      xhrGroup: `${XHR_METRIC_VALIDATION_GROUP}-${newGUID}`,
      guid: newGUID
    }).then(({ status, error: apiError, response }) => {
      if (status === xhr.ABORTED) {
        return
      }
      setValidationResult({
        error: apiError?.message,
        validationResult: response?.resource,
        isValidating: false,
        guid: newGUID
      })
      onChange('validation', response?.resource ? true : false, rowIndex)
    })
  }, [accountId, appId, metricPacks, projectId, orgId, tierOption, onChange, connectorId, rowIndex, isLoadingServices])

  const rowCellCallback = useCallback(
    (index: number) => {
      switch (index) {
        case 0:
          return <ServiceName serviceName={serviceName} isLoading={isLoadingServices} />
        case 1:
          return (
            <TierName
              tierOption={tierOption}
              onChange={onChange}
              index={rowIndex}
              serviceName={serviceName}
              isLoading={isLoadingServices}
              tierOptions={tierOptions}
            />
          )
        case 2:
          return (
            <ValidationResult
              validationResult={validationResult}
              error={error}
              tierId={tierId}
              isLoading={isValidating}
              isLoadingServices={isLoadingServices}
            />
          )
        case 3:
          return (
            <ViewDetails
              error={error}
              tierId={tierId}
              validationResult={validationResult}
              guid={guid}
              isLoading={isLoadingServices}
            />
          )
        default:
          return <Container />
      }
    },
    [
      error,
      guid,
      tierId,
      isValidating,
      onChange,
      tierOption,
      rowIndex,
      serviceName,
      tierOptions,
      isLoadingServices,
      validationResult
    ]
  )
  return (
    <tr key={row.id}>
      {cells.map((cell, index) => {
        const { key: cellKey } = cell.getCellProps()
        return <td key={cellKey}>{rowCellCallback(index)}</td>
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
    isLoadingServices,
    data = [],
    index: appIndex,
    accountId,
    projectId,
    orgId
  } = props
  const { dbInstance, isInitializingDB } = useIndexedDBHook()
  const [tierOptions, setTierOptions] = useState<SelectOption[]>([{ label: 'Loading...', value: '' }])

  // fetch tier and service list
  useEffect(() => {
    if (isInitializingDB || appId === -1) {
      return
    }

    loadAppDTiers(accountId, appId, dataSourceId, orgId, projectId, dbInstance).then(tiers => {
      if (!tiers) {
        return
      } else if (tiers.error) {
        setTierOptions([])
      } else if (!tiers.tierList?.length) {
        setTierOptions([])
      } else {
        mergeTierListWithExistingData(data, tiers.tierList)
        setFieldValue(`dsConfigs[${appIndex}].tableData`, data)
        setTierOptions(tiers.tierList)
      }
    })
    return () => xhr.abort(`${XHR_TIER_GROUP}_${appId}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, dataSourceId, accountId, appIndex, dbInstance, isInitializingDB])

  const onRowChangeCallback = useCallback(
    (fieldName: keyof TierAndServiceRow, value: any, index: number) => {
      data[index][fieldName] = value as never
      setFieldValue(`dsConfigs[${appIndex}].tableData`, fieldName === 'validation' ? data : [...data])
      setFieldTouched(`dsConfigs[${appIndex}].tableData`, true)
    },
    [appIndex, setFieldValue, data, setFieldTouched]
  )

  const paddedTableData = useMemo(() => {
    if (isLoadingServices || !data?.length) {
      return DefaultTiersAndService
    }

    const paddedData = [...data]
    for (let i = 6 - data.length; i > 0; i--) {
      paddedData.push({ ...DEFAULT_ROW_OBJ })
    }
    return paddedData
  }, [data, isLoadingServices])

  return (
    <ModalProvider>
      <Table
        columns={TABLE_COLUMNS as any}
        bpTableProps={BPTableProps}
        data={paddedTableData}
        className={css.main}
        renderCustomRow={row => (
          <RowRenderer
            key={row.values?.tierName || row.index}
            row={row as any}
            isLoadingServices={isLoadingServices || tierOptions?.[0]?.label === 'Loading...'}
            appId={appId}
            accountId={accountId}
            onChange={onRowChangeCallback}
            projectId={projectId}
            orgId={orgId}
            connectorId={dataSourceId}
            metricPacks={metricPacks}
            tierOptions={tierOptions}
          />
        )}
      />
    </ModalProvider>
  )
}
