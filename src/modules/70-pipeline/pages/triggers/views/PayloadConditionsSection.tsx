import React from 'react'
import { FormInput, Text, Icon, Heading, Color } from '@wings-software/uikit'
import cx from 'classnames'
import { FieldArray } from 'formik'
import { useStrings } from 'framework/exports'
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
export interface PayloadConditionInterface {
  key: string
  operator: string
  value: string
}

interface PayloadConditionsSectionInterface {
  payloadConditions: PayloadConditionInterface[]
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  errors: { [key: string]: string }
}
interface PayloadConditionRowInterface {
  index: number
  getString: (key: string) => string
}

const PayloadConditionRow: React.FC<PayloadConditionRowInterface> = ({ index, getString }) => (
  <div className={cx(css.conditionsRow, css.payloadConditions)}>
    <FormInput.Text name={`payloadConditions.${[index]}.key`} label="Attribute" />
    <FormInput.Select items={mockOperators} name={`payloadConditions.${[index]}.operator`} label="Operator" />
    <FormInput.Text
      name={`payloadConditions.${[index]}.value`}
      label={getString('pipeline-triggers.conditionsPanel.matchesValue')}
    />
  </div>
)

export const PayloadConditionsSection: React.FC<PayloadConditionsSectionInterface> = ({
  payloadConditions,
  setFieldValue,
  errors
}) => {
  const { getString } = useStrings()
  return (
    <section>
      <Heading level={2} font={{ weight: 'bold' }}>
        {getString('pipeline-triggers.conditionsPanel.payloadConditions')}
      </Heading>
      <FieldArray
        name="payloadConditions"
        render={() => (
          <div style={{ marginTop: '20px' }}>
            {payloadConditions?.map((_payloadCondition: PayloadConditionInterface, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <PayloadConditionRow index={index} getString={getString} />
                <Icon
                  style={{
                    position: 'absolute',
                    left: '775px',
                    cursor: 'pointer'
                  }}
                  data-name="main-delete"
                  size={14}
                  color={Color.GREY_500}
                  name="main-delete"
                  onClick={() => {
                    const newPayloadConditions = [...payloadConditions]
                    newPayloadConditions.splice(index, 1)
                    setFieldValue('payloadConditions', newPayloadConditions)
                  }}
                />
              </div>
            ))}
            {errors['payloadConditions'] && (
              <Text color={Color.RED_500} style={{ marginBottom: 'var(--spacing-medium)' }}>
                {errors['payloadConditions']}
              </Text>
            )}
          </div>
        )}
      />
      <Text
        intent="primary"
        style={{ cursor: 'pointer', width: '70px' }}
        onClick={() => {
          const emptyRow = { key: '', operator: '', value: '' }
          if (!payloadConditions) setFieldValue('payloadConditions', [emptyRow])
          else setFieldValue('payloadConditions', [...payloadConditions, emptyRow])
        }}
      >
        {getString('plusAdd')}
      </Text>
    </section>
  )
}

export default PayloadConditionsSection
