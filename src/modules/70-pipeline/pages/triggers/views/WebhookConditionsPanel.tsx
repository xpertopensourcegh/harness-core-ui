import React from 'react'
import { Layout, FormInput, Heading, Text } from '@wings-software/uicore'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import { eventTypes } from '../utils/TriggersWizardPageUtils'
import PayloadConditionsSection from './PayloadConditionsSection'
import css from './WebhookConditionsPanel.module.scss'

export const mockOperators = [
  { label: '', value: '' },
  { label: 'equals', value: 'equals' },
  { label: 'not equals', value: 'not equals' },
  { label: 'in', value: 'in' },
  { label: 'not in', value: 'not in' },
  { label: 'starts with', value: 'starts with' },
  { label: 'ends with', value: 'ends with' },
  { label: 'regex', value: 'regex' }
]

interface WebhookConditionsPanelPropsInterface {
  formikProps?: any
}

const WebhookConditionsPanel: React.FC<WebhookConditionsPanelPropsInterface> = ({ formikProps }): JSX.Element => {
  const {
    values: { payloadConditions, event },
    setFieldValue,
    errors
  } = formikProps
  const { getString } = useStrings()
  const eventIsPush = event === eventTypes.PUSH
  return (
    <Layout.Vertical
      key={payloadConditions?.length || 0}
      className={cx(css.webhookConditionsContainer)}
      spacing="large"
      padding="xxlarge"
    >
      <h2 className={css.heading}>
        {getString('conditions')}{' '}
        <Text style={{ display: 'inline-block' }} color="grey400">
          {getString('pipeline-triggers.conditionsPanel.titleOptional')}
        </Text>
      </h2>
      <Text>{getString('pipeline-triggers.conditionsPanel.subtitle')}</Text>
      <section>
        <Heading level={2} font={{ weight: 'bold' }}>
          {getString('pipeline-triggers.conditionsPanel.branchConditions')}
        </Heading>
        {!eventIsPush && (
          <div className={css.conditionsRow}>
            <div>
              <Text style={{ fontSize: 16 }}>{getString('pipeline-triggers.conditionsPanel.sourceBranch')}</Text>
            </div>
            <FormInput.Select
              items={mockOperators}
              name="sourceBranchOperator"
              label={getString('pipeline-triggers.conditionsPanel.operator')}
            />
            <FormInput.Text
              name="sourceBranchValue"
              label={getString('pipeline-triggers.conditionsPanel.matchesValue')}
            />
          </div>
        )}
        <div className={css.conditionsRow}>
          <div>
            <Text style={{ fontSize: 16 }}>
              {eventIsPush
                ? getString('pipeline-triggers.conditionsPanel.branchName')
                : getString('pipeline-triggers.conditionsPanel.targetBranch')}
            </Text>
          </div>
          <FormInput.Select
            items={mockOperators}
            name="targetBranchOperator"
            label={getString('pipeline-triggers.conditionsPanel.operator')}
          />
          <FormInput.Text
            name="targetBranchValue"
            label={getString('pipeline-triggers.conditionsPanel.matchesValue')}
          />
        </div>
      </section>
      <PayloadConditionsSection
        key={payloadConditions?.length || 0}
        payloadConditions={payloadConditions}
        setFieldValue={setFieldValue}
        errors={errors}
      />
      {/* <FormInput.TextArea style={{ width: '100%' }} disabled={true} name="jexlConditions" label="JEXL Conditions" /> */}
    </Layout.Vertical>
  )
}
export default WebhookConditionsPanel
