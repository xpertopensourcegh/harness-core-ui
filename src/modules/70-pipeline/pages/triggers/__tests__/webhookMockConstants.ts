import { RUNTIME_INPUT_VALUE } from '@wings-software/uikit'
import type { WebhookTriggerConfigPanelPropsInterface } from '../views/WebhookTriggerConfigPanel'
export const triggerConfigInitialValues = { identifier: '', sourceRepo: 'GITHUB', triggerType: 'Webhook' }
// export const triggerConfigInitialValues = { identifier: '', sourceRepo: 'GITHUB', triggerType: 'Webhook' }
export const pipelineInputInitialValues = {
  identifier: '',
  originalPipeline: {
    identifier: 'p1',
    stages: [
      {
        stage: {
          identifier: 'stage1',
          type: 'Deployment',
          spec: {
            infrastructure: {
              infrastructureDefinition: {
                type: 'KubernetesDirect',
                spec: {
                  namespace: RUNTIME_INPUT_VALUE,
                  releaseName: RUNTIME_INPUT_VALUE
                }
              }
            }
          }
        }
      }
    ]
  },
  pipeline: {
    identifier: 'p1',
    stages: [
      {
        stage: {
          identifier: 'stage1',
          type: 'Deployment',
          spec: {
            infrastructure: {
              infrastructureDefinition: {
                type: 'KubernetesDirect',
                spec: {
                  namespace: RUNTIME_INPUT_VALUE,
                  releaseName: RUNTIME_INPUT_VALUE
                }
              }
            }
          }
        }
      }
    ]
  },
  sourceRepo: 'GITHUB',
  triggerType: 'Webhook'
}
export const getTriggerConfigDefaultProps = ({
  isEdit = false
}: {
  isEdit?: boolean
}): WebhookTriggerConfigPanelPropsInterface => ({
  isEdit
})
