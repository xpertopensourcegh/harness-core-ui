import React, { useState, useEffect, useCallback, useRef } from 'react'
import cx from 'classnames'
import { Container, TextInput, Button, Layout, Text } from '@wings-software/uicore'
import { Classes } from '@blueprintjs/core'
import { debounce } from 'lodash-es'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { PageError } from '@common/components/Page/PageError'
import { Scope } from '@common/interfaces/SecretsInterface'
import i18n from './EntityReference.i18n'
import css from './EntityReference.module.scss'

export interface ScopedObjectDTO {
  accountIdentifier?: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export function getScopeFromDTO<T extends ScopedObjectDTO>(obj: T): Scope {
  if (obj.projectIdentifier) {
    return Scope.PROJECT
  } else if (obj.orgIdentifier) {
    return Scope.ORG
  }
  return Scope.ACCOUNT
}

export function getScopeFromValue(value: string): Scope {
  if (value.startsWith(`${Scope.ACCOUNT}.`)) {
    return Scope.ACCOUNT
  } else if (value.startsWith(`${Scope.ORG}.`)) {
    return Scope.ORG
  }
  return Scope.PROJECT
}

export function getIdentifierFromValue(value: string): string {
  const scope = getScopeFromValue(value)
  if (scope === Scope.ACCOUNT || scope === Scope.ORG) {
    return value.replace(`${scope}.`, '')
  }
  return value
}

export type EntityReferenceResponse<T> = {
  name: string
  identifier: string
  record: T
}

export interface EntityReferenceProps<T> {
  onSelect: (reference: T, scope: Scope) => void
  fetchRecords: (
    scope: Scope,
    searchTerm: string | undefined,
    done: (records: EntityReferenceResponse<T>[]) => void
  ) => void
  recordRender: (item: EntityReferenceResponse<T>) => JSX.Element
  recordClassName?: string
  className?: string
  projectIdentifier?: string
  noRecordsText?: string
  orgIdentifier?: string
  defaultScope?: Scope
}

export function EntityReference<T>(props: EntityReferenceProps<T>): JSX.Element {
  const {
    defaultScope,
    projectIdentifier,
    orgIdentifier,
    fetchRecords,
    className = '',
    recordRender,
    recordClassName = '',
    noRecordsText = i18n.noRecordFound
  } = props
  const [searchTerm, setSearchTerm] = useState<string | undefined>()
  const [selectedScope, setSelectedScope] = useState<Scope>(defaultScope || Scope.ACCOUNT)
  const [data, setData] = useState<EntityReferenceResponse<T>[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  const delayedFetchRecords = useRef(
    debounce((scope: Scope, search: string | undefined, done: (records: EntityReferenceResponse<T>[]) => void) => {
      setLoading(true)
      fetchRecords(scope, search, done)
    }, 300)
  ).current

  const fetchData = useCallback(() => {
    try {
      setError(null)
      if (!searchTerm) {
        setLoading(true)
        fetchRecords(selectedScope, searchTerm, records => {
          setData(records)
          setLoading(false)
        })
      } else {
        delayedFetchRecords(selectedScope, searchTerm, records => {
          setData(records)
          setLoading(false)
        })
      }
    } catch (msg) {
      setError(msg)
    }
  }, [selectedScope, delayedFetchRecords, searchTerm])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Container className={cx(css.container, className)}>
      <Layout.Vertical spacing="medium">
        <Layout.Horizontal spacing="small">
          <Button
            className={cx(css.scopeButton, { [css.selected]: selectedScope == Scope.PROJECT })}
            text={i18n.project}
            icon="cube"
            onClick={() => setSelectedScope(Scope.PROJECT)}
            disabled={!projectIdentifier}
          />
          <Button
            className={cx(css.scopeButton, { [css.selected]: selectedScope == Scope.ORG })}
            text={i18n.organization}
            icon="diagram-tree"
            onClick={() => setSelectedScope(Scope.ORG)}
            disabled={!orgIdentifier}
          />
          <Button
            className={cx(css.scopeButton, { [css.selected]: selectedScope == Scope.ACCOUNT })}
            text={i18n.account}
            icon="layers"
            onClick={() => setSelectedScope(Scope.ACCOUNT)}
          />
        </Layout.Horizontal>
        <TextInput
          placeholder={i18n.search}
          leftIcon="search"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value)
          }}
        />
      </Layout.Vertical>
      {loading ? (
        <PageSpinner />
      ) : error ? (
        <Container padding={{ top: 'large' }}>
          <PageError
            message={error}
            onClick={() => {
              fetchData()
            }}
          />
        </Container>
      ) : data.length ? (
        <div className={css.referenceList}>
          {data.map((item: EntityReferenceResponse<T>) => (
            <div
              key={item.identifier}
              className={cx(css.listItem, Classes.POPOVER_DISMISS, recordClassName)}
              onClick={() => props.onSelect(item.record, selectedScope)}
            >
              {recordRender(item)}
            </div>
          ))}
        </div>
      ) : (
        <Container padding={{ top: 'xlarge' }} flex={{ align: 'center-center' }}>
          <Text>{noRecordsText}</Text>
        </Container>
      )}
    </Container>
  )
}

export default EntityReference
