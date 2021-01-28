import { Button, Color, Formik, FormInput, Layout, StepProps, Text } from '@wings-software/uicore'
import React from 'react'
import { Form } from 'formik'
import { startCase } from 'lodash-es'
import { useStrings } from 'framework/exports'
import type { NotificationRules, PipelineEvent } from 'services/pipeline-ng'
import css from '../useNotificationModal.module.scss'

export enum PipelineEventType {
  ALL_EVENTS = 'AllEvents',
  PipelineSuccess = 'PipelineSuccess',
  PipelineFailed = 'PipelineFailed',
  PipelinePaused = 'PipelinePaused',
  StageSuccess = 'StageSuccess',
  StageFailed = 'StageFailed',
  StageStart = 'StageStart',
  StepFailed = 'StepFailed'
}

const pipelineEventItems = [
  {
    label: startCase(PipelineEventType.ALL_EVENTS),
    value: PipelineEventType.ALL_EVENTS
  },
  {
    label: startCase(PipelineEventType.PipelineSuccess),
    value: PipelineEventType.PipelineSuccess
  },
  {
    label: startCase(PipelineEventType.PipelineFailed),
    value: PipelineEventType.PipelineFailed
  },
  {
    label: startCase(PipelineEventType.PipelinePaused),
    value: PipelineEventType.PipelinePaused
  },
  {
    label: startCase(PipelineEventType.StageFailed),
    value: PipelineEventType.StageFailed
  },
  {
    label: startCase(PipelineEventType.StageSuccess),
    value: PipelineEventType.StageSuccess
  },
  {
    label: startCase(PipelineEventType.StageStart),
    value: PipelineEventType.StageStart
  },
  {
    label: startCase(PipelineEventType.StepFailed),
    value: PipelineEventType.StepFailed
  }
]

interface PipelineEventsFormData {
  types: { [key: string]: any }
  [key: string]: { [key: string]: any }
}

const PipelineEvents: React.FC<StepProps<NotificationRules>> = ({ nextStep, prevStepData }) => {
  const { getString } = useStrings()
  const initialValues: PipelineEventsFormData = { types: {} }
  const types: Required<PipelineEventsFormData>['types'] = {}
  prevStepData?.pipelineEvents?.map(event => {
    const type = event.type
    if (type) {
      types[type] = true
      if (event.forStages?.length) initialValues[type] = event.forStages
    }
  })

  return (
    <Layout.Vertical spacing="xxlarge" padding="small">
      <Text font="medium" color={Color.BLACK}>
        {getString('pipeline-notifications.pipelineEvents')}
      </Text>
      <Formik<PipelineEventsFormData>
        initialValues={{ ...initialValues, types }}
        onSubmit={values => {
          const pipelineEvents: PipelineEvent[] = Object.keys(values.types)
            .filter(function (k) {
              return values.types[k]
            })
            .map(value => {
              return {
                type: value as PipelineEventType,
                forStages: values[value] ? Object.keys(values[value]) : undefined
              }
            })

          nextStep?.({ ...prevStepData, pipelineEvents })
        }}
      >
        {() => {
          return (
            <Form>
              <Layout.Vertical spacing="medium" height={400} width={500}>
                <Text margin={{ bottom: 'large' }}>{getString('pipeline-notifications.selectPipelineEvents')} </Text>
                {pipelineEventItems.map(event => {
                  return (
                    <Layout.Vertical key={event.label}>
                      <Layout.Horizontal spacing="small" flex>
                        <FormInput.CheckBox
                          label={event.label}
                          name={`types.${event.value}`}
                          padding={{ left: 'xxxlarge' }}
                        />
                        {(event.value === PipelineEventType.StageSuccess ||
                          event.value === PipelineEventType.StageFailed ||
                          event.value === PipelineEventType.StageStart) && (
                          <FormInput.KVTagInput
                            name={event.value}
                            className={css.forStages}
                            tagsProps={{ placeholder: getString('pipeline-notifications.placeholder') }}
                          />
                        )}
                      </Layout.Horizontal>
                    </Layout.Vertical>
                  )
                })}
              </Layout.Vertical>
              <Button type="submit" intent="primary" rightIcon="chevron-right" text={getString('saveAndContinue')} />
            </Form>
          )
        }}
      </Formik>
    </Layout.Vertical>
  )
}

export default PipelineEvents
