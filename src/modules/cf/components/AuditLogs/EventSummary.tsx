import React from 'react'
import { Drawer, IDrawerProps, Classes } from '@blueprintjs/core'
import { get } from 'lodash-es'
import cx from 'classnames'
import { MonacoDiffEditor } from 'react-monaco-editor'
import { Layout, Container, Text, Color, Button, useToggle } from '@wings-software/uicore'
import { CF_LOCAL_STORAGE_ENV_KEY, DEFAULT_ENV, AuditLogAction, formatDate, formatTime } from '@cf/utils/CFUtils'
import { useLocalStorage } from '@common/hooks'
import { PageError } from '@common/components/Page/PageError'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { useAppStore, useStrings } from 'framework/exports'
import { AuditTrail, Feature, useGetOSById } from 'services/cf'
import css from './EventSummary.module.scss'

const drawerStates: IDrawerProps = {
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  hasBackdrop: true,
  usePortal: true,
  isOpen: true,
  size: 790,
  backdropClassName: css.backdrop,
  className: css.container
}

export interface EventSummaryProps {
  flagData: Feature
  data: AuditTrail
  onClose: () => void
}

export const EventSummary: React.FC<EventSummaryProps> = ({ data, flagData, onClose }) => {
  const { getString } = useStrings()
  const [environment] = useLocalStorage(CF_LOCAL_STORAGE_ENV_KEY, DEFAULT_ENV)
  const { selectedProject } = useAppStore()
  let text = getString('cf.auditLogs.createdMessageFF')
  const [showDiff, toggleShowDiff] = useToggle(true)
  const { data: diffData, loading, error, refetch } = useGetOSById({
    // identifiers: ['0989203a-61e5-448d-9111-c935ac72f0a2', '8168a910-ba29-489f-9a14-1b46d4aaaf98']
    identifiers: [data.objectIdentifier, data.objectAfter],
    lazy: !showDiff
  })

  switch (data.action) {
    case AuditLogAction.SegmentCreated:
      text = getString('cf.auditLogs.createdMessageSegment')
      break
    case AuditLogAction.FeatureActivationPatched:
      text = getString('cf.auditLogs.createdMessageFFUpdate')
      break
  }
  const date = `${formatDate(data.executedOn)}, ${formatTime(data.executedOn)} PST`

  return (
    <Drawer
      className={css.container}
      {...drawerStates}
      onClose={onClose}
      title={
        <header>
          {getString('cf.auditLogs.eventSummary')} <span className={css.subHeader}>({data.objectIdentifier})</span>
        </header>
      }
    >
      <Container className={cx(Classes.DRAWER_BODY, css.body)} padding="xlarge">
        <Container className={css.eventSection} padding="large">
          <Layout.Vertical spacing="medium">
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#9293AB' }}>{date}</Text>
            <Text color={Color.GREY_400}>
              {getString('cf.auditLogs.moduleFF')} | Project: {selectedProject?.name} | Environment:{' '}
              {environment?.label}
            </Text>
          </Layout.Vertical>
          <Container style={{ marginTop: 'var(--spacing-xxlarge)' }}>
            <Text icon="person" iconProps={{ size: 16 }}>
              <strong>{data.actor}</strong>
              <span style={{ padding: '0 var(--spacing-xsmall)' }}>{text}</span>
              <strong>{flagData.name}</strong>
            </Text>
          </Container>
          <Container margin={{ top: 'large', left: 'small' }}>
            <Button
              minimal
              rightIcon={showDiff ? 'chevron-up' : 'chevron-down'}
              text={getString('cf.auditLogs.jsonDifference')}
              onClick={() => {
                toggleShowDiff()
                refetch()
              }}
            />
            {showDiff && (
              <Container margin={{ top: 'xsmall', left: 'small', right: 'small' }} height={480}>
                {!!diffData && (
                  <MonacoDiffEditor
                    width="670"
                    height="480"
                    language="javascript"
                    original={JSON.stringify(diffData?.data?.objectsnapshots?.[0]?.value || '', null, 2)}
                    value={JSON.stringify(diffData?.data?.objectsnapshots?.[1]?.value || '', null, 2)}
                    options={{ minimap: { enabled: false }, codeLens: false, readOnly: true, renderSideBySide: true }}
                  />
                )}

                {error && (
                  <PageError
                    message={get(error, 'data.message', error?.message)}
                    onClick={() => {
                      refetch()
                    }}
                  />
                )}

                {loading && (
                  <Container
                    style={{
                      position: 'fixed',
                      top: '240px',
                      right: '29px',
                      width: '733px',
                      height: '507px'
                    }}
                  >
                    <ContainerSpinner />
                  </Container>
                )}
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Drawer>
  )
}
