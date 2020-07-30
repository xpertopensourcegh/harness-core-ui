import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Table, Select, Text, ModalProvider, Link, Container, SelectOption, Color } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import { Spinner, Classes } from '@blueprintjs/core'
import type { AppdynamicsTier, AppdynamicsValidationResponse, MetricPack } from '@wings-software/swagger-ts/definitions'
import type { Row } from 'react-table'
import type { TextProps } from '@wings-software/uikit/dist/components/Text/Text'
import { AppDynamicsService, CVNextGenCVConfigService } from 'modules/cv/services'
import MetricsVerificationModal from 'modules/cv/components/MetricsVerificationModal/MetricsVerificationModal'
import i18n from './TierAndServiceTable.i18n'
import css from './TierAndServiceTable.module.scss'

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
  isLoadingTiers: boolean
  metricPacks: MetricPack[]
  onChange: (fieldName: keyof TierAndServiceRow, value: any, index: number) => void
  connectorId: string
}

interface ValidationResultProps {
  validationResult?: AppdynamicsValidationResponse[]
  error?: any
  isLoading: boolean
  isChecked: boolean
  isLoadingTiers: boolean
}

interface TierMappingCheckBoxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  isLoading: boolean
  isLoadingTiers: boolean
}

interface ServiceDropdownProps {
  serviceOptions: SelectOption[]
  value?: SelectOption
  onChange: RowRendererProps['onChange']
  isLoading: boolean
  index: number
  isLoadingTiers: boolean
}

interface ViewDetailsProps {
  validationResult?: AppdynamicsValidationResponse[]
  error?: any
  guid: string
  selected: boolean
  isLoadingTiers: boolean
}

const XHR_METRIC_VALIDATION_GROUP = 'XHR_METRIC_VALIDATION_GROUP'
const XHR_TIER_GROUP = 'XHR_TIER_GROUP'

const DEFAULT_ROW_OBJ: TierAndServiceRow = { service: '', selected: false, tierName: undefined, tierId: undefined }
const BPTableProps = { bordered: true, condensed: true, striped: true }
export const DefaultTiersAndService: TierAndServiceRow[] = [...Array(6).keys()].map(() => ({ ...DEFAULT_ROW_OBJ }))

async function fetchAppDTiers(
  settingId: string,
  accountId: string,
  appId: number,
  xhrGroup: string
): Promise<{ error?: string; tierList?: SelectOption[] } | undefined> {
  const { error, status, response } = await AppDynamicsService.getAppDynamicsTiers({
    accountId,
    datasourceId: settingId,
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

function mergeTierListWithExistingData(tableData: TierAndServiceRow[], tierList: SelectOption[]): void {
  const existingTiers = new Map<string, TierAndServiceRow>()
  for (const row of tableData || []) {
    if (row?.tierName) {
      existingTiers.set(row.tierName, row)
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
    if (tableRow) {
      tableRow.tierId = tier.value as number
      tableRow.tierName = tier.label
    } else {
      tableData.push({ ...DEFAULT_ROW_OBJ, tierId: tier.value as number, tierName: tier.label })
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
  const { validationResult, error, isLoading, isChecked, isLoadingTiers } = props
  const validationStatus: { status: string; intent: TextProps['intent'] } | undefined = useMemo(() => {
    if (error && error.message) {
      return { intent: 'danger', status: error.message }
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
    if (!isChecked) {
      return <Container width={90} />
    } else if (isLoading) {
      return <Spinner size={Spinner.SIZE_SMALL} />
    } else if (validationStatus) {
      return (
        <Container className={css.validationContainer} width={90}>
          <Text intent={validationStatus.intent} width={error && error.message ? 90 : 85} lineClamp={1}>
            {validationStatus.status}
          </Text>
        </Container>
      )
    }
    return <span />
  }, [error, isChecked, isLoading, validationStatus])
  return isLoadingTiers ? (
    <LoadingCell width={90} />
  ) : (
    <Container className={css.validationResult}>{childFields}</Container>
  )
}

function TierMappingCheckBox(props: TierMappingCheckBoxProps): JSX.Element {
  const { checked, onChange, isLoading, isLoadingTiers } = props

  if (isLoadingTiers) {
    return <LoadingCell width={15} />
  }
  if (isLoading) {
    return <Container height={20} width={15} />
  }

  return (
    <Container className={css.tierSelectChecBox}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.currentTarget?.checked)} />
    </Container>
  )
}

function TierName(props: { tierName?: string; isLoadingTiers: boolean }): JSX.Element {
  if (props.isLoadingTiers) {
    return <LoadingCell width={85} />
  }
  return (
    <Text lineClamp={1} className={css.tier} width={85} color={Color.BLACK}>
      {props.tierName}
    </Text>
  )
}

function ServiceDropdown(props: ServiceDropdownProps): JSX.Element {
  const { serviceOptions, value, onChange, isLoading, index, isLoadingTiers } = props
  const onChangeCallback = useCallback((val: SelectOption) => onChange('service', val?.label, index), [onChange, index])
  if (isLoadingTiers) {
    return <LoadingCell width={100} />
  }
  if (isLoading) {
    return <Container height={20} width={100} className={isLoadingTiers ? Classes.SKELETON : undefined} />
  }

  return <Select items={serviceOptions} className={css.serviceSelect} value={value} onChange={onChangeCallback} />
}

function ViewDetails(props: ViewDetailsProps): JSX.Element {
  const { error, validationResult, guid, selected, isLoadingTiers } = props
  const [displayMetricsModal, setMetricsModalDisplay] = useState(false)
  const hideModalCallback = useCallback(() => () => setMetricsModalDisplay(false), [])
  if (displayMetricsModal) {
    return <MetricsVerificationModal verificationData={validationResult} guid={guid} onHide={hideModalCallback()} />
  }
  if (isLoadingTiers) {
    return <LoadingCell width={83} />
  }
  return !error && validationResult && selected ? (
    <Link withoutHref onClick={() => setMetricsModalDisplay(true)} className={css.viewDetails}>
      View Details
    </Link>
  ) : (
    <Container />
  )
}

function RowRenderer(props: RowRendererProps): JSX.Element {
  const { row, services, accountId, projectId, appId, metricPacks, onChange, connectorId, isLoadingTiers } = props
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
    CVNextGenCVConfigService.validateMetricsApi({
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

  const onTierMappingSelection = useCallback(
    (checked: boolean) => {
      const serviceName = serviceSelectObj && serviceSelectObj.label ? serviceSelectObj.label : ''
      xhr.abort(`${XHR_METRIC_VALIDATION_GROUP}-${guid}`)
      if (!checked) {
        setValidationResult({ validationResult, guid, error, isLoading: false })
      }
      onChange('selected', { service: serviceName, selected: checked }, rowIndex)
    },
    [guid, error, validationResult, onChange, rowIndex, serviceSelectObj]
  )

  const rowCellCallback = useCallback(
    (index: number) => {
      switch (index) {
        case 0:
          return (
            <TierMappingCheckBox
              onChange={onTierMappingSelection}
              isLoading={!tierName}
              checked={selected}
              isLoadingTiers={isLoadingTiers}
            />
          )
        case 1:
          return <TierName tierName={tierName} isLoadingTiers={isLoadingTiers} />
        case 2:
          return (
            <ServiceDropdown
              serviceOptions={services}
              value={serviceSelectObj}
              onChange={onChange}
              isLoading={!tierName}
              index={rowIndex}
              isLoadingTiers={isLoadingTiers}
            />
          )
        case 3:
          return (
            <ValidationResult
              validationResult={validationResult}
              error={error}
              isLoading={isLoading}
              isChecked={selected}
              isLoadingTiers={isLoadingTiers}
            />
          )
        case 4:
          return (
            <ViewDetails
              error={error}
              validationResult={validationResult}
              guid={guid}
              selected={selected}
              isLoadingTiers={isLoadingTiers}
            />
          )
        default:
          return <Container />
      }
    },
    [
      error,
      guid,
      isLoading,
      onChange,
      rowIndex,
      serviceSelectObj,
      services,
      isLoadingTiers,
      tierName,
      selected,
      validationResult,
      onTierMappingSelection
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
    serviceOptions,
    data = [],
    index: appIndex,
    accountId
  } = props
  const [isLoadingTiers, setIsLoadingTiers] = useState(true)

  // fetch tier and service list
  useEffect(() => {
    const xhrGroup = `${XHR_TIER_GROUP}_${appId}`
    fetchAppDTiers(dataSourceId, accountId, appId, xhrGroup).then(tiers => {
      if (!tiers) {
        return
      }

      if (tiers.error) {
        return // todo
      }

      if (!tiers.tierList?.length) {
        setIsLoadingTiers(false)
        return
      }

      mergeTierListWithExistingData(data, tiers.tierList)
      setFieldValue(`dsConfigs[${appIndex}].tableData`, data)
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
    },
    [appIndex, setFieldValue, data, setFieldTouched]
  )

  const tableColumns = useMemo(
    () => [
      {
        Header: <input type="checkbox" className={css.tierSelectChecBox} onClick={onColumnCheckboxCallback} />,
        accessor: 'selected'
      },
      {
        Header: i18n.columnHeaders.tier,
        accessor: 'tierName'
      },
      {
        Header: i18n.columnHeaders.service,
        accessor: 'serviceId'
      },
      {
        Header: i18n.columnHeaders.validation,
        accessor: 'validation'
      },
      {
        Header: <Container width={80} />,
        accessor: 'viewDetails'
      }
    ],
    [onColumnCheckboxCallback]
  )

  const onRowChangeCallback = useCallback(
    (fieldName: keyof TierAndServiceRow, value: any, index: number) => {
      if (fieldName === 'selected') {
        const validation = value.selected ? data[index]['validation'] : undefined
        data[index] = { ...data[index], ...value, validation }
      } else {
        data[index][fieldName] = value as never
      }

      setFieldValue(`dsConfigs[${appIndex}].tableData`, fieldName === 'validation' ? data : [...data])
      setFieldTouched(`dsConfigs[${appIndex}].tableData`, true)
    },
    [appIndex, setFieldValue, data, setFieldTouched]
  )

  return (
    <ModalProvider>
      <Table
        columns={tableColumns as any}
        bpTableProps={BPTableProps}
        data={isLoadingTiers || !data?.length ? DefaultTiersAndService : data}
        className={css.main}
        renderCustomRow={row => (
          <RowRenderer
            key={row.values?.tierName || row.index}
            row={row as any}
            isLoadingTiers={isLoadingTiers}
            appId={appId}
            accountId={accountId}
            onChange={onRowChangeCallback}
            projectId={12345}
            connectorId={dataSourceId}
            metricPacks={metricPacks}
            services={serviceOptions}
          />
        )}
      />
    </ModalProvider>
  )
}
