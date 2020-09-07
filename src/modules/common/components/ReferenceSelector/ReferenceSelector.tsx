import React, { useState, useEffect, useCallback, useRef } from 'react'
import cx from 'classnames'
import { Container, TextInput, Button, Layout, Text } from '@wings-software/uikit'
import { Classes } from '@blueprintjs/core'
import { debounce } from 'lodash'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { PageError } from 'modules/common/components/Page/PageError'
import i18n from './ReferenceSelector.i18n'
import css from './ReferenceSelector.module.scss'

export enum Scope {
  PROJECT = 'project',
  ORG = 'org',
  ACCOUNT = 'acc'
}

export type ReferenceResponse<T> = { label: string; identifier: string; record: T }

export interface ReferenceProps<T> {
  onSelect: (reference: T, scope: Scope) => void
  fetchRecords: (scope: Scope, searchTerm: string | undefined, done: (records: ReferenceResponse<T>[]) => void) => void
  recordRender?: (item: ReferenceResponse<T>) => JSX.Element
  recordClassName?: string
  className?: string
  projectIdentifier?: string
  noRecordsText?: string
  orgIdentifier?: string
  defaultScope?: Scope
}

function itemRender<T>(item: ReferenceResponse<T>): JSX.Element {
  return <div>{item.label}</div>
}

export function ReferenceSelector<T>(props: ReferenceProps<T>): JSX.Element {
  const {
    defaultScope,
    projectIdentifier,
    orgIdentifier,
    fetchRecords,
    className = '',
    recordRender = itemRender,
    recordClassName = '',
    noRecordsText = i18n.noRecordFound
  } = props
  const [searchTerm, setSearchTerm] = useState<string | undefined>()
  const [selectedScope, setSelectedScope] = useState<Scope>(defaultScope || Scope.ACCOUNT)
  const [data, setData] = useState<ReferenceResponse<T>[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  const delayedFetchRecords = useRef(debounce(fetchRecords, 300)).current
  const fetchData = useCallback(() => {
    try {
      setError(null)
      setLoading(true)
      delayedFetchRecords(selectedScope, searchTerm, records => {
        setData(records)
        setLoading(false)
      })
    } catch (msg) {
      setError(msg)
    }
  }, [selectedScope, delayedFetchRecords, searchTerm])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Container padding="large" className={cx(css.container, className)}>
      <Layout.Vertical spacing="medium">
        <Layout.Horizontal spacing="small">
          <Button
            className={css.scopeButton}
            intent={selectedScope == Scope.PROJECT ? 'primary' : 'none'}
            text={i18n.project}
            icon="cube"
            onClick={() => setSelectedScope(Scope.PROJECT)}
            disabled={!projectIdentifier}
          />
          <Button
            className={css.scopeButton}
            intent={selectedScope == Scope.ORG ? 'primary' : 'none'}
            text={i18n.organization}
            icon="diagram-tree"
            onClick={() => setSelectedScope(Scope.ORG)}
            disabled={!orgIdentifier}
          />
          <Button
            className={css.scopeButton}
            intent={selectedScope == Scope.ACCOUNT ? 'primary' : 'none'}
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
          {data.map((item: ReferenceResponse<T>) => (
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

export default ReferenceSelector
