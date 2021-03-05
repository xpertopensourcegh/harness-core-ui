import React from 'react'
import { Layout, Card, Icon, Text, Accordion } from '@wings-software/uicore'
import type { IconName } from '@wings-software/uicore'
import { debounce, get, isNil } from 'lodash-es'
import cx from 'classnames'
import { StepWidget, StepViewType, PipelineContext } from '@pipeline/exports'
import type { K8SDirectInfrastructure, NgPipeline, PipelineInfrastructure } from 'services/cd-ng'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import Timeline from '@common/components/Timeline/Timeline'
import { String } from 'framework/exports'
import i18n from './DeployInfraSpecifications.i18n'
import css from './DeployInfraSpecifications.module.scss'

const supportedDeploymentTypes: { name: string; icon: IconName; enabled: boolean }[] = [
  {
    name: i18n.deploymentTypes.kubernetes,
    icon: 'service-kubernetes',
    enabled: true
  },
  {
    name: i18n.deploymentTypes.gk8engine,
    icon: 'google-kubernetes-engine',
    enabled: false
  }
]

const TimelineNodes = [
  {
    label: 'Environment',
    id: 'environment'
  },
  {
    label: 'Infrastructure definition',
    id: 'infrastructureDefinition',
    childItems: [
      {
        label: 'Cluster details',
        id: 'clusterDetails-panel'
      }
    ]
  }
]

export default function DeployInfraSpecifications(props: React.PropsWithChildren<unknown>): JSX.Element {
  const [initialValues, setInitialValues] = React.useState<{}>()
  const [updateKey, setUpdateKey] = React.useState(0)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
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
  const onTimelineItemClick = (id: string) => {
    const element = document.querySelector(`#${id}`)
    if (scrollRef.current && element) {
      const elementTop = element.getBoundingClientRect().top
      const parentTop = scrollRef.current.getBoundingClientRect().top
      scrollRef.current.scrollTo({ top: elementTop - parentTop, behavior: 'smooth' })
    }
  }
  const renderInfraSelection = (): JSX.Element => {
    const k8sInfra = supportedDeploymentTypes[0]
    return (
      <div className={css.infraSelection}>
        <div>
          <div className={css.connectionType}>
            <String stringID="pipelineSteps.deploy.infrastructure.directConnection" />
          </div>
          <div key={k8sInfra.name} className={css.squareCardContainer}>
            <Card
              disabled={!k8sInfra.enabled}
              interactive={true}
              selected={k8sInfra.name === i18n.deploymentTypes.kubernetes}
              cornerSelected={k8sInfra.name === i18n.deploymentTypes.kubernetes}
              className={cx({ [css.disabled]: !k8sInfra.enabled }, css.squareCard)}
            >
              <Icon name={k8sInfra.icon as IconName} size={26} height={26} />
            </Card>
            <Text
              style={{
                fontSize: '12px',
                color: k8sInfra.enabled ? 'var(--grey-900)' : 'var(--grey-350)',
                textAlign: 'center'
              }}
            >
              {k8sInfra.name}
            </Text>
          </div>
        </div>
        <div>
          <div className={css.connectionType}>
            <String stringID="pipelineSteps.deploy.infrastructure.viaCloudProvider" />
          </div>
          <Layout.Horizontal>
            {supportedDeploymentTypes.map(
              (type: { name: string; icon: IconName; enabled: boolean }) =>
                type.name !== i18n.deploymentTypes.kubernetes && (
                  <div key={type.name} className={css.squareCardContainer}>
                    <Card
                      disabled={!type.enabled}
                      interactive={true}
                      selected={type.name === i18n.deploymentTypes.kubernetes}
                      cornerSelected={type.name === i18n.deploymentTypes.kubernetes}
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
                )
            )}
          </Layout.Horizontal>
        </div>
      </div>
    )
  }
  return (
    <div className={css.serviceOverrides}>
      <Timeline onNodeClick={onTimelineItemClick} nodes={TimelineNodes} />

      <div className={css.contentSection} ref={scrollRef}>
        <Layout.Vertical>
          <div className={css.tabHeading} id="environment">
            {<String stringID="environment" />}
          </div>
          <Card className={cx(css.sectionCard, css.shadow)}>
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
          </Card>
        </Layout.Vertical>
        <div className={css.tabHeading} id="infrastructureDefinition">
          <String stringID="pipelineSteps.deploy.infrastructure.infraDefinition" />
        </div>
        <Card className={cx(css.sectionCard, css.shadow)}>
          <div className={css.stepContainer}>
            <div className={css.subheading}>
              <String stringID="pipelineSteps.deploy.infrastructure.selectMethod" />
            </div>
            {renderInfraSelection()}
          </div>
        </Card>
        <Accordion className={css.sectionCard} activeId="clusterDetails">
          <Accordion.Panel
            id="clusterDetails"
            addDomId={true}
            summary={'Cluster details'}
            details={
              <StepWidget<K8SDirectInfrastructure>
                factory={factory}
                key={updateKey}
                initialValues={initialValues || {}}
                type={StepType.KubernetesDirect}
                stepViewType={StepViewType.Edit}
                onUpdate={value => onUpdateDefinition(value)}
              />
            }
          />
        </Accordion>
        {props.children}
      </div>
    </div>
  )
}
