import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { CollapseListPanel, CollapseListPanelProps, Intent } from '@wings-software/uikit'
import type { DSConfig } from '@wings-software/swagger-ts/definitions'
import type { ListPanelInterface } from '@wings-software/uikit/dist/components/Collapse/CollapseListPanel'
import { connect, FormikContext } from 'formik'
import { CVNextGenCVConfigService } from 'modules/cv/services'
import DataSourcePanelStatusHeader from 'modules/cv/components/DataSourcePanelStatusHeader/DataSourcePanelStatusHeader'
import i18n from './DataSourceConfigPanel.i18n'

import css from './DataSourceConfigPanel.module.scss'

async function removeDataSourceConfig(
  accountId: string,
  dataSourceConnectorId: string,
  identifier: string,
  orgId: string,
  projectId: string,
  productName?: string
): Promise<string | undefined> {
  const { error } = await CVNextGenCVConfigService.deleteConfigs({
    accountId,
    dataSourceConnectorId,
    identifier,
    orgId,
    projectId,
    productName,
    group: 'XHR_DELETE_CONFIG_GROUP'
  })
  return error ? error : undefined
}

async function saveDSConfig(
  dsConfig: DSConfig,
  accountId: string,
  orgId: string,
  projectId: string
): Promise<string | undefined> {
  if (!dsConfig) {
    return
  }

  const { error } = await CVNextGenCVConfigService.upsertDSConfig({
    accountId,
    group: 'XHR_SAVE_CONFIG_GROUP',
    projectId,
    orgId,
    config: dsConfig
  })

  return error?.message
}

type FormValues = {
  dsConfigs: DSConfig[]
}

type FormikProperties = 'values' | 'setFieldTouched' | 'setFieldError' | 'touched'

interface DataSourceConfigPanelProps extends ListPanelInterface, Pick<FormikContext<FormValues>, FormikProperties> {
  entityName: string | JSX.Element
  onRemove: (index: number) => void
  transformToSavePayload?: (dsConfig: DSConfig) => DSConfig
  index: number
  orgId: string
  validateConfig?: (config: DSConfig) => { [fieldName: string]: string }
}

const DataSourceConfigPanel: React.FC<DataSourceConfigPanelProps> = (props): JSX.Element => {
  const {
    entityName,
    onRemove,
    children,
    transformToSavePayload,
    index,
    isOpen,
    onToggleOpen,
    validateConfig,
    openNext,
    values,
    setFieldTouched,
    setFieldError,
    touched,
    orgId
  } = props
  const [panelHeaderMsg, setPanelHeaderMsg] = useState<{ intent: Intent; msg: string } | undefined>()
  const configData = values?.dsConfigs?.[index] || {}
  const accountId = configData.accountId
  const touchedFields = touched?.dsConfigs?.[index] || {}
  const headingComp = useMemo(
    () => (
      <DataSourcePanelStatusHeader
        panelName={entityName}
        intent={panelHeaderMsg ? panelHeaderMsg.intent : undefined}
        message={panelHeaderMsg ? panelHeaderMsg.msg : undefined}
      />
    ),
    [entityName, panelHeaderMsg]
  )

  const validateCallback = useCallback(() => {
    if (!validateConfig) {
      return true
    }

    const panelErrors = validateConfig(configData) || {}
    Object.keys(panelErrors).forEach(field => {
      setFieldTouched(`dsConfigs[${index}].${field}`, true)
      setFieldError(`dsConfigs[${index}].${field}`, panelErrors[field])
    })
    if (Object.keys(panelErrors).length) {
      setPanelHeaderMsg({ intent: 'danger', msg: i18n.invalidMessage })
      return false
    }
    return true
  }, [configData, setFieldError, setFieldTouched, index, validateConfig])

  const onRemoveCallback = useCallback(() => {
    if (!configData.identifier && !panelHeaderMsg) {
      onRemove(index)
      return
    }

    if (!window.confirm(i18n.deleteConfimation)) {
      return
    }
    if (configData.identifier) {
      removeDataSourceConfig(
        accountId || '',
        configData.connectorId || '',
        configData.identifier || '',
        orgId,
        configData.projectIdentifier || '',
        configData.productName
      ).then(error => {
        if (!error) {
          setPanelHeaderMsg(undefined)
          onRemove(index)
        } else {
          setPanelHeaderMsg({ intent: 'danger', msg: error })
        }
      })
    } else {
      onRemove(index)
    }
  }, [onRemove, accountId, index, configData, panelHeaderMsg, orgId])

  const collapseHeaderProps: CollapseListPanelProps['collapseHeaderProps'] = useMemo(
    () => ({
      heading: headingComp,
      isRemovable: true,
      className: css.header,
      onRemove: onRemoveCallback
    }),
    [headingComp, onRemoveCallback]
  )

  const onNextCallback = useCallback(async () => {
    if (!validateCallback()) {
      return
    }
    const config: DSConfig = transformToSavePayload?.(configData) || configData
    const error = await saveDSConfig(config, config.accountId || '', orgId, config.projectIdentifier || '')
    if (error) {
      setPanelHeaderMsg({ msg: error, intent: 'danger' })
      return
    } else {
      setPanelHeaderMsg({ msg: i18n.successMessage, intent: 'success' })
    }
    openNext?.()
  }, [configData, transformToSavePayload, validateCallback, openNext, orgId])

  useEffect(() => {
    if (isOpen || panelHeaderMsg?.intent !== 'primary' || !touchedFields || !Object.keys(touchedFields).length) {
      return
    }

    if (validateCallback()) {
      setPanelHeaderMsg({ intent: 'none', msg: i18n.usavedChangesMessage })
    } else {
      setPanelHeaderMsg({ intent: 'danger', msg: i18n.invalidMessage })
    }
  }, [isOpen, touchedFields, validateCallback, panelHeaderMsg?.intent])

  useEffect(() => {
    if (!isOpen || !touchedFields || !Object.keys(touchedFields).length) {
      return
    }
    setPanelHeaderMsg({ intent: 'primary', msg: i18n.editingMessage })
  }, [configData, touchedFields])

  return (
    <CollapseListPanel
      collapseHeaderProps={collapseHeaderProps}
      onToggleOpen={onToggleOpen}
      isOpen={isOpen || false}
      className={css.main}
      nextButtonText={i18n.saveButtonText}
      openNext={onNextCallback}
    >
      {children}
    </CollapseListPanel>
  )
}

export default connect(DataSourceConfigPanel)
