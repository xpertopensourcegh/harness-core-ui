import React, { useCallback } from 'react'
import type { HealthSource, MonitoredServiceResponse } from 'services/cv'
import { useStrings } from 'framework/strings'
import { useDrawer } from '@cv/hooks/useDrawerHook/useDrawerHook'
import HealthSourceTable from './HealthSourceTable'
import HealthSourceDrawerHeader from '../HealthSourceDrawer/component/HealthSourceDrawerHeader/HealthSourceDrawerHeader'
import HealthSourceDrawerContent from '../HealthSourceDrawer/HealthSourceDrawerContent'
import type { RowData } from '../HealthSourceDrawer/HealthSourceDrawerContent.types'
import { createHealthsourceList } from './HealthSourceTable.utils'

interface VerifyStepHealthSourceTableInterface {
  serviceIdentifier: string
  envIdentifier: string
  healthSourcesList: RowData[]
  monitoredServiceRef: { identifier: string; name: string }
  onSuccess: (data: any) => void
  isRunTimeInput: boolean
}

export default function VerifyStepHealthSourceTable(tableProps: VerifyStepHealthSourceTableInterface) {
  const { getString } = useStrings()

  const { serviceIdentifier, envIdentifier, healthSourcesList, monitoredServiceRef, isRunTimeInput, onSuccess } =
    tableProps
  const {
    showDrawer: showHealthSourceDrawer,
    hideDrawer: hideHealthSourceDrawer,
    setDrawerHeaderProps
  } = useDrawer({
    createHeader: props => <HealthSourceDrawerHeader {...props} />,
    createDrawerContent: props => <HealthSourceDrawerContent {...props} />
  })

  const healthSourceDrawerHeaderProps = useCallback(
    (isEdit = false) => {
      return {
        isEdit,
        shouldRenderAtVerifyStep: true,
        onClick: () => hideHealthSourceDrawer(),
        breadCrumbRoute: { routeTitle: getString('connectors.cdng.runTimeMonitoredService.backToRunPipeline') }
      }
    },
    [serviceIdentifier, envIdentifier, healthSourcesList, monitoredServiceRef, isRunTimeInput]
  )

  const getHealthSourceDrawerProps = useCallback(
    (values?: any) => {
      return {
        isRunTimeInput,
        shouldRenderAtVerifyStep: true,
        serviceRef: serviceIdentifier,
        environmentRef: envIdentifier,
        monitoredServiceRef: monitoredServiceRef,
        rowData: values,
        tableData: createHealthsourceList(healthSourcesList, values),
        onSuccess: (data: MonitoredServiceResponse) => {
          onSuccess(data)
          hideHealthSourceDrawer()
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceIdentifier, envIdentifier, healthSourcesList, monitoredServiceRef, isRunTimeInput]
  )

  const onEdit = useCallback(values => {
    const drawerProps = getHealthSourceDrawerProps(values)
    showHealthSourceDrawer(drawerProps)
    setDrawerHeaderProps?.(healthSourceDrawerHeaderProps(true))
  }, [])

  const onAddNewHealthSource = useCallback(() => {
    const drawerProps = getHealthSourceDrawerProps()
    setDrawerHeaderProps?.(healthSourceDrawerHeaderProps())
    return showHealthSourceDrawer(drawerProps)
  }, [])
  return (
    <>
      <HealthSourceTable
        onEdit={onEdit}
        isRunTimeInput={isRunTimeInput}
        onAddNewHealthSource={onAddNewHealthSource}
        value={healthSourcesList as HealthSource[]}
        shouldRenderAtVerifyStep
        onSuccess={data => {
          onSuccess(data)
          hideHealthSourceDrawer()
        }}
      />
    </>
  )
}
