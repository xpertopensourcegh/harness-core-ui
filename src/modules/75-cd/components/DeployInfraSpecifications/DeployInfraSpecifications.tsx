import React from 'react'
import { Layout, Card, Icon, Text } from '@wings-software/uicore'
import type { IconName } from '@wings-software/uicore'
import { debounce, get, isNil } from 'lodash-es'
import cx from 'classnames'
import { StepWidget, StepViewType, PipelineContext } from '@pipeline/exports'
import type { K8SDirectInfrastructure, NgPipeline, PipelineInfrastructure } from 'services/cd-ng'
import i18n from './DeployInfraSpecifications.i18n'
import factory from '../../../70-pipeline/components/PipelineSteps/PipelineStepFactory'
import { StepType } from '../../../70-pipeline/components/PipelineSteps/PipelineStepInterface'
import css from './DeployInfraSpecifications.module.scss'

const supportedDeploymentTypes: { name: string; icon: IconName; enabled: boolean }[] = [
  {
    name: i18n.deploymentTypes.kubernetes,
    icon: 'service-kubernetes',
    enabled: true
  },
  {
    name: i18n.deploymentTypes.azurek8s,
    icon: 'azure-kubernetes-service',
    enabled: false
  },
  {
    name: i18n.deploymentTypes.ek8s,
    icon: 'elastic-kubernetes-service',
    enabled: false
  },
  {
    name: i18n.deploymentTypes.gk8engine,
    icon: 'google-kubernetes-engine',
    enabled: false
  }
]

export default function DeployInfraSpecifications(props: React.PropsWithChildren<unknown>): JSX.Element {
  const [initialValues, setInitialValues] = React.useState<{}>()
  const [updateKey, setUpdateKey] = React.useState(0)
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },
    updatePipeline,
    getStageFromPipeline
  } = React.useContext(PipelineContext)

  const debounceUpdatePipeline = React.useRef(
    debounce((pipelineData: NgPipeline) => {
      return updatePipeline(pipelineData)
    }, 500)
  ).current

  const { stage } = getStageFromPipeline(selectedStageId || '')
  const infraSpec = get(stage, 'stage.spec.infrastructure', null)
  if (isNil(infraSpec)) {
    const pipelineData = get(stage, 'stage.spec', {})
    pipelineData['infrastructure'] = {
      environmentRef: '',
      infrastructureDefinition: {}
    }
  }

  React.useEffect(() => {
    setInitialValues(getInitialInfraConnectorValues())
    setUpdateKey(Math.random())
  }, [stage])

  const getInitialInfraConnectorValues = (): K8SDirectInfrastructure => {
    const infrastructure = get(stage, 'stage.spec.infrastructure.infrastructureDefinition', null)
    const connectorRef = infrastructure?.spec?.connectorRef
    const namespace = infrastructure?.spec?.namespace
    const releaseName = infrastructure?.spec?.releaseName
    return {
      connectorRef,
      namespace,
      releaseName
    }
  }

  const onUpdateDefinition = (value: K8SDirectInfrastructure): void => {
    const infrastructure = get(stage, 'stage.spec.infrastructure', null)
    if (infrastructure) {
      const infraStruct = {
        type: 'KubernetesDirect',
        spec: {
          connectorRef: value.connectorRef,
          namespace: value.namespace,
          releaseName: value.releaseName
        }
      }
      infrastructure['infrastructureDefinition'] = infraStruct
      debounceUpdatePipeline(pipeline)
    }
  }

  return (
    <Layout.Vertical className={css.serviceOverrides}>
      <Layout.Vertical spacing="large">
        <div className={cx(css.serviceSection, css.noPadTop)}>
          <Layout.Vertical className={cx(css.specTabs, css.tabHeading)}>{i18n.infraDetailsLabel}</Layout.Vertical>
          <Layout.Horizontal spacing="medium">
            <StepWidget
              type={StepType.DeployEnvironment}
              initialValues={get(stage, 'stage.spec.infrastructure', {})}
              onUpdate={(value: PipelineInfrastructure) => {
                const infraObj: PipelineInfrastructure = get(stage, 'stage.spec.infrastructure', {})
                if (value.environment) {
                  infraObj.environment = value.environment
                  delete infraObj.environmentRef
                } else if (value.environmentRef) {
                  infraObj.environmentRef = value.environmentRef
                  delete infraObj.environment
                }
                debounceUpdatePipeline(pipeline)
              }}
              factory={factory}
              stepViewType={StepViewType.Edit}
            />
          </Layout.Horizontal>
        </div>
      </Layout.Vertical>
      <div className={css.serviceSection}>
        <Layout.Vertical className={cx(css.specTabs, css.tabHeading)}>{i18n.infraSpecificationLabel}</Layout.Vertical>
        <div>
          <div className={css.stepContainer}>
            <div className={css.serviceCards}>
              <Layout.Horizontal>
                {supportedDeploymentTypes.map((type: { name: string; icon: IconName; enabled: boolean }) => (
                  <div key={type.name} className={css.squareCardContainer}>
                    <Card
                      disabled={!type.enabled}
                      interactive={true}
                      selected={type.name === i18n.deploymentTypes.kubernetes ? true : false}
                      cornerSelected={type.name === i18n.deploymentTypes.kubernetes ? true : false}
                      className={cx({ [css.disabled]: !type.enabled }, css.squareCard)}
                    >
                      <Icon name={type.icon as IconName} size={26} height={26} />
                    </Card>
                    <Text
                      style={{
                        fontSize: '12px',
                        color: type.enabled ? 'var(--grey-900)' : 'var(--grey-350)',
                        textAlign: 'center'
                      }}
                    >
                      {type.name}
                    </Text>
                  </div>
                ))}
              </Layout.Horizontal>
            </div>
            <StepWidget<K8SDirectInfrastructure>
              factory={factory}
              key={updateKey}
              initialValues={initialValues || {}}
              type={StepType.KubernetesDirect}
              stepViewType={StepViewType.Edit}
              onUpdate={value => onUpdateDefinition(value)}
            />
          </div>
        </div>
      </div>
      {props.children}
    </Layout.Vertical>
  )
}
