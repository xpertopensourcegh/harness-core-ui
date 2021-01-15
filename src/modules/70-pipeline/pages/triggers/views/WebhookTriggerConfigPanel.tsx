import React, { useState, useEffect } from 'react'
import { Layout, FormInput, SelectOption, Text, Heading } from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'
import { useGetActionsList, useGetSourceRepoToEvent } from 'services/pipeline-ng'
import { AddDescriptionAndKVTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { useStrings } from 'framework/exports'
import { GitSourceProviders } from '../utils/TriggersListUtils'
import css from './WebhookTriggerConfigPanel.module.scss'

export interface WebhookTriggerConfigPanelPropsInterface {
  formikProps?: any
  isEdit?: boolean
}

const sourceRepoOptions = [
  { label: 'GitHub', value: GitSourceProviders.GITHUB.value },
  { label: 'GitLab', value: GitSourceProviders.GITLAB.value },
  { label: 'BitBucket', value: GitSourceProviders.BITBUCKET.value }
]

const WebhookTriggerConfigPanel: React.FC<WebhookTriggerConfigPanelPropsInterface> = ({
  formikProps,
  isEdit = false
}) => {
  const { sourceRepo, actions, event } = formikProps.values
  const { data: ResponseSourceRepoToEvent, loading: loadingGetSourceRepoToEvent } = useGetSourceRepoToEvent({})
  const { data: actionsListResponse, refetch: refetchActions } = useGetActionsList({
    queryParams: { sourceRepo, event },
    lazy: true,
    debounce: 300
  })
  const [eventOptions, setEventOptions] = useState<SelectOption[]>([])
  const [actionsOptions, setActionsOptions] = useState<SelectOption[]>([]) // will need to get actions from api
  const [actionsDisabled, setActionsDisabled] = useState<boolean>(false) // no action options to choose from
  const { getString } = useStrings()
  const loading = loadingGetSourceRepoToEvent

  useEffect(() => {
    if (sourceRepo && ResponseSourceRepoToEvent?.data?.[sourceRepo]) {
      const eventsList = ResponseSourceRepoToEvent.data[sourceRepo]
      if (eventsList.length) {
        setEventOptions(eventsList.map(e => ({ label: e, value: e })))
        if (event && !eventsList.includes(event)) {
          formikProps.setFieldValue('event', '')
        }
      }
    }
  }, [ResponseSourceRepoToEvent?.data, sourceRepo])

  useEffect(() => {
    if (actionsListResponse?.data) {
      const actionsOptionsKV = actionsListResponse.data.map(item => ({ label: item, value: item }))
      setActionsOptions(actionsOptionsKV)
      if (actionsOptionsKV.length === 0) {
        formikProps.setValues({ ...formikProps.values, actions: [], anyAction: true })
        setActionsDisabled(true)
      }
    }
  }, [actionsListResponse?.data])

  useEffect(() => {
    if (event && sourceRepo) {
      refetchActions()
    }
  }, [event, sourceRepo])

  return (
    <Layout.Vertical className={css.webhookConfigurationContainer} padding="xxlarge">
      {loading && (
        <div style={{ position: 'relative', height: 'calc(100vh - 128px)' }}>
          <PageSpinner />
        </div>
      )}
      <h2 className={css.heading}>{`${getString('pipeline-triggers.triggerConfigurationLabel')}${
        !isEdit ? `: ${getString('pipeline-triggers.onNewWebhookTitle')}` : ''
      }`}</h2>
      <div style={{ backgroundColor: 'var(--white)' }}>
        <AddDescriptionAndKVTagsWithIdentifier
          className={css.triggerName}
          formikProps={formikProps}
          identifierProps={{
            inputLabel: getString('pipeline-triggers.triggerConfigurationPanel.triggerName'),
            isIdentifierEditable: !isEdit
          }}
        />
        <Heading className={css.listenOnNewWebhook} style={{ marginTop: '0!important' }} level={2}>
          {getString('pipeline-triggers.triggerConfigurationPanel.listenOnNewWebhook')}
        </Heading>
        <section style={{ width: '650px', marginTop: 'var(--spacing-small)' }}>
          <FormInput.Select
            label={getString('pipeline-triggers.triggerConfigurationPanel.payloadType')}
            name="sourceRepo"
            items={sourceRepoOptions}
            onChange={e => {
              setActionsDisabled(false)
              formikProps.setValues({
                ...formikProps.values,
                sourceRepo: e.value,
                actions: undefined,
                anyAction: false
              })
            }}
          />
          <FormInput.Text name="repoUrl" label={getString('repositoryUrlLabel')} />
          <FormInput.Select
            key={event}
            label={getString('pipeline-triggers.triggerConfigurationPanel.event')}
            name="event"
            items={eventOptions}
            onChange={e => {
              setActionsDisabled(false)
              formikProps.setValues({ ...formikProps.values, event: e.value, actions: undefined, anyAction: false })
            }}
          />
          <div className={css.actionsContainer}>
            <div>
              <Text style={{ fontSize: 13, marginBottom: 'var(--spacing-xsmall)' }}>
                {getString('pipeline-triggers.triggerConfigurationPanel.actions')}
              </Text>
              <FormInput.MultiSelect
                name="actions"
                items={actionsOptions}
                // yaml design: empty array means selecting all
                disabled={Array.isArray(actions) && isEmpty(actions)}
                onChange={e => {
                  if (!e || (Array.isArray(e) && isEmpty(e))) {
                    formikProps.setFieldValue('actions', undefined)
                  } else {
                    formikProps.setFieldValue('actions', e)
                  }
                }}
              />
            </div>
            <FormInput.CheckBox
              name="anyAction"
              key={Date.now()}
              label={getString('pipeline-triggers.triggerConfigurationPanel.anyActions')}
              disabled={actionsDisabled}
              defaultChecked={Array.isArray(actions) && actions.length === 0}
              className={css.anyAction}
              onClick={(e: React.FormEvent<HTMLInputElement>) => {
                if (e.currentTarget?.checked) {
                  formikProps.setFieldValue('actions', [])
                } else {
                  formikProps.setFieldValue('actions', undefined)
                }
              }}
            />
          </div>
        </section>
      </div>
    </Layout.Vertical>
  )
}
export default WebhookTriggerConfigPanel
