import React, { useEffect, useState } from 'react'
import YAML from 'yaml'
import { Layout, Card, Text, Accordion, Color } from '@wings-software/uicore'
import { clone, get, isEmpty, isNil, omit } from 'lodash-es'
import debounce from 'p-debounce'
import cx from 'classnames'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import {
  ExecutionWrapper,
  getProvisionerExecutionStrategyYamlPromise,
  Infrastructure,
  K8SDirectInfrastructure,
  K8sGcpInfrastructure,
  NgPipeline,
  PipelineInfrastructure,
  StageElementWrapper
} from 'services/cd-ng'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { InfraProvisioningData } from '@cd/components/PipelineSteps/InfraProvisioning/InfraProvisioning'
import type { GcpInfrastructureSpec } from '@cd/components/PipelineSteps/GcpInfrastructureSpec/GcpInfrastructureSpec'
import { useFeatureFlag } from '@common/hooks/useFeatureFlag'
import { String, useStrings } from 'framework/strings'
import { PipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import DeployServiceErrors from '@cd/components/PipelineStudio/DeployServiceSpecifications/DeployServiceErrors'
import SelectDeploymentType from '@cd/components/PipelineStudio/DeployInfraSpecifications/SelectDeployementType'
import css from './DeployInfraSpecifications.module.scss'

// TODO: Add key once we have default value
const DEFAULT_INFRA_KEY = ''

export default function DeployInfraSpecifications(props: React.PropsWithChildren<unknown>): JSX.Element {
  const isProvisionerEnabled = useFeatureFlag('NG_PROVISIONERS')
  const [initialInfrastructureDefinitionValues, setInitialInfrastructureDefinitionValues] = React.useState<
    Infrastructure
  >({})
  const [selectedDeploymentType, setSelectedDeploymentType] = React.useState<string | undefined>()
  const [updateKey, setUpdateKey] = React.useState(0)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const { getString } = useStrings()

  const {
    state: {
      pipeline,
      originalPipeline,
      selectionState: { selectedStageId }
    },
    isReadonly,
    updatePipeline,
    getStageFromPipeline
  } = React.useContext(PipelineContext)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceUpdatePipeline = React.useCallback(
    debounce((pipelineData: NgPipeline) => updatePipeline(clone(pipelineData)), 300),
    [updatePipeline]
  )

  const { stage } = getStageFromPipeline(selectedStageId || '')

  const resetInfrastructureDefinition = (type?: string, shouldUpdate = false): void => {
    const spec = get(stage, 'stage.spec', {})
    spec.infrastructure = {
      ...spec.infrastructure,
      infrastructureDefinition: {}
    }

    if (type) {
      spec.infrastructure.infrastructureDefinition.type = type
    }

    if (shouldUpdate) {
      const initialInfraDefValues = getInfrastructureDefaultValue(stage, type)
      setInitialInfrastructureDefinitionValues(initialInfraDefValues)

      debounceUpdatePipeline(pipeline)
    }

    setProvisionerEnabled(false)
  }

  const infraSpec = get(stage, 'stage.spec.infrastructure', null)
  if (isNil(infraSpec)) {
    const spec = get(stage, 'stage.spec', {})
    spec['infrastructure'] = {
      environmentRef: '',
      infrastructureDefinition: {},
      allowSimultaneousDeployments: false,
      infrastructureKey: DEFAULT_INFRA_KEY
    }
  }

  React.useEffect(() => {
    const type = stage?.stage?.spec?.infrastructure?.infrastructureDefinition?.type
    setSelectedDeploymentType(type)
    const initialInfraDefValues = getInfrastructureDefaultValue(stage, type)
    setInitialInfrastructureDefinitionValues(initialInfraDefValues)
    setUpdateKey(Math.random())
  }, [stage])

  const onUpdateInfrastructureDefinition = (
    extendedSpec: K8SDirectInfrastructure | K8sGcpInfrastructure,
    type: string
  ): void => {
    const infrastructure = get(stage, 'stage.spec.infrastructure', null)
    if (infrastructure) {
      infrastructure.infrastructureDefinition = {
        ...infrastructure.infrastructureDefinition,
        type,
        spec: omit(extendedSpec, 'allowSimultaneousDeployments', 'infrastructureKey')
      }
      infrastructure.allowSimultaneousDeployments = extendedSpec.allowSimultaneousDeployments ?? false
      infrastructure.infrastructureKey = extendedSpec.infrastructureKey ?? DEFAULT_INFRA_KEY
      debounceUpdatePipeline(pipeline)
    }
  }

  const [provisionerEnabled, setProvisionerEnabled] = useState<boolean>(false)
  const [provisionerSnippetLoading, setProvisionerSnippetLoading] = useState<boolean>(false)

  const isProvisionerEmpty = (stageData: StageElementWrapper): boolean => {
    const provisionerData = get(stageData, 'stage.spec.infrastructure.infrastructureDefinition.provisioner')
    return isEmpty(provisionerData?.steps) && isEmpty(provisionerData?.rollbackSteps)
  }

  // load and apply provisioner snippet to the stage
  useEffect(() => {
    if (stage && isProvisionerEmpty(stage) && provisionerEnabled) {
      setProvisionerSnippetLoading(true)
      getProvisionerExecutionStrategyYamlPromise({ queryParams: { provisionerType: 'TERRAFORM' } }).then(res => {
        const provisionerSnippet = YAML.parse(res?.data || '')
        if (stage && isProvisionerEmpty(stage) && provisionerSnippet) {
          stage.stage.spec.infrastructure.infrastructureDefinition.provisioner = provisionerSnippet.provisioner
          debounceUpdatePipeline(pipeline).then(() => {
            setProvisionerSnippetLoading(false)
          })
        }
      })
    }
  }, [provisionerEnabled])

  const cleanUpEmptyProvisioner = (): boolean => {
    const provisioner = stage?.stage?.spec?.infrastructure?.infrastructureDefinition?.provisioner
    let isChanged = false

    if (!isNil(provisioner?.steps) && provisioner?.steps.length === 0) {
      delete provisioner.steps
      isChanged = true
    }
    if (!isNil(provisioner?.rollbackSteps) && provisioner?.rollbackSteps.length === 0) {
      delete provisioner.rollbackSteps
      isChanged = true
    }

    if (
      !provisioner?.steps &&
      !provisioner?.rollbackSteps &&
      stage?.stage?.spec?.infrastructure?.infrastructureDefinition?.provisioner
    ) {
      delete stage.stage.spec.infrastructure.infrastructureDefinition.provisioner
      isChanged = true
    }

    return isChanged
  }

  useEffect(() => {
    setProvisionerEnabled(!isProvisionerEmpty(stage || {}))

    return () => {
      const isChanged = cleanUpEmptyProvisioner()

      if (isChanged) {
        debounceUpdatePipeline(pipeline)
      }
    }
  }, [])

  const getProvisionerData = (stageData: ExecutionWrapper): InfraProvisioningData => {
    let provisioner = get(stageData, 'stage.spec.infrastructure.infrastructureDefinition.provisioner')
    let originalProvisioner: InfraProvisioningData['originalProvisioner'] = undefined
    if (selectedStageId) {
      const originalStage = getStageFromPipeline(selectedStageId, originalPipeline).stage
      originalProvisioner = get(originalStage, 'stage.spec.infrastructure.infrastructureDefinition.provisioner')
    }

    provisioner = isNil(provisioner) ? {} : { ...provisioner }

    if (isNil(provisioner.steps)) {
      provisioner.steps = []
    }
    if (isNil(provisioner.rollbackSteps)) {
      provisioner.rollbackSteps = []
    }

    return {
      provisioner: { ...provisioner },
      provisionerEnabled,
      provisionerSnippetLoading,
      originalProvisioner: { ...originalProvisioner }
    }
  }

  const getInfrastructureDefaultValue = (
    stageData: StageElementWrapper | undefined,
    deploymentType: string | undefined
  ): Infrastructure => {
    const infrastructure = get(stageData, 'stage.spec.infrastructure.infrastructureDefinition', null)
    const type = infrastructure?.type || deploymentType
    const allowSimultaneousDeployments = get(stageData, 'stage.spec.infrastructure.allowSimultaneousDeployments', false)
    const infrastructureKey = get(stageData, 'stage.spec.infrastructure.infrastructureKey', DEFAULT_INFRA_KEY)
    switch (type) {
      case 'KubernetesDirect': {
        const connectorRef = infrastructure?.spec?.connectorRef
        const namespace = infrastructure?.spec?.namespace
        const releaseName = infrastructure?.spec?.releaseName
        return {
          connectorRef,
          namespace,
          releaseName,
          allowSimultaneousDeployments,
          infrastructureKey
        }
      }
      case 'KubernetesGcp': {
        const connectorRef = infrastructure?.spec?.connectorRef
        const namespace = infrastructure?.spec?.namespace
        const releaseName = infrastructure?.spec?.releaseName
        const cluster = infrastructure?.spec?.cluster

        return {
          connectorRef,
          namespace,
          releaseName,
          cluster,
          allowSimultaneousDeployments,
          infrastructureKey
        }
      }
      default: {
        return {}
      }
    }
  }

  const getClusterConfigurationStep = (type: string): React.ReactElement => {
    switch (type) {
      case 'KubernetesDirect': {
        return (
          <StepWidget<K8SDirectInfrastructure>
            factory={factory}
            key={updateKey}
            readonly={isReadonly}
            initialValues={initialInfrastructureDefinitionValues as K8SDirectInfrastructure}
            type={StepType.KubernetesDirect}
            stepViewType={StepViewType.Edit}
            onUpdate={value =>
              onUpdateInfrastructureDefinition(
                {
                  connectorRef: value.connectorRef,
                  namespace: value.namespace,
                  releaseName: value.releaseName,
                  allowSimultaneousDeployments: value.allowSimultaneousDeployments,
                  infrastructureKey: value.infrastructureKey
                },
                'KubernetesDirect'
              )
            }
          />
        )
      }
      case 'KubernetesGcp': {
        return (
          <StepWidget<GcpInfrastructureSpec>
            factory={factory}
            key={updateKey}
            readonly={isReadonly}
            initialValues={initialInfrastructureDefinitionValues as GcpInfrastructureSpec}
            type={StepType.KubernetesGcp}
            stepViewType={StepViewType.Edit}
            onUpdate={value =>
              onUpdateInfrastructureDefinition(
                {
                  connectorRef: value.connectorRef,
                  cluster: value.cluster,
                  namespace: value.namespace,
                  releaseName: value.releaseName,
                  allowSimultaneousDeployments: value.allowSimultaneousDeployments,
                  infrastructureKey: value.infrastructureKey
                },
                'KubernetesGcp'
              )
            }
          />
        )
      }
      default: {
        return <div>Undefined deployment type</div>
      }
    }
  }

  return (
    <div className={css.serviceOverrides} key="1">
      <DeployServiceErrors />
      <div className={css.contentSection} ref={scrollRef}>
        <Layout.Vertical>
          <div className={css.tabHeading} id="environment">
            <String stringID="environment" />
          </div>
          <Card className={cx(css.sectionCard, css.shadow)}>
            <StepWidget
              type={StepType.DeployEnvironment}
              readonly={isReadonly}
              initialValues={{
                environment: get(stage, 'stage.spec.infrastructure.environment', {}),
                environmentRef: get(stage, 'stage.spec.infrastructure.environmentRef', '')
              }}
              onUpdate={(value: PipelineInfrastructure) => {
                const infraObj = get(stage, 'stage.spec.infrastructure', {})
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
        <SelectDeploymentType
          isReadonly={isReadonly}
          selectedDeploymentType={selectedDeploymentType}
          onChange={deploymentType => {
            setSelectedDeploymentType(deploymentType)
            resetInfrastructureDefinition(deploymentType, true)
          }}
        />
        {!!selectedDeploymentType && isProvisionerEnabled ? (
          <Accordion className={css.sectionCard} activeId="dynamicProvisioning">
            <Accordion.Panel
              id="dynamicProvisioning"
              addDomId={true}
              summary={'Dynamic provisioning'}
              details={
                <StepWidget<InfraProvisioningData>
                  factory={factory}
                  readonly={isReadonly}
                  key={stage?.stage?.identifier}
                  initialValues={getProvisionerData(stage || {})}
                  type={StepType.InfraProvisioning}
                  stepViewType={StepViewType.Edit}
                  onUpdate={(value: InfraProvisioningData) => {
                    if (stage) {
                      stage.stage.spec.infrastructure.infrastructureDefinition.provisioner = value.provisioner
                      cleanUpEmptyProvisioner()
                    }
                    debounceUpdatePipeline(pipeline)
                    setProvisionerEnabled(value.provisionerEnabled)
                  }}
                />
              }
            />
          </Accordion>
        ) : null}

        {selectedDeploymentType ? (
          <Card className={css.sectionCard} id="clusterDetails">
            <Text style={{ fontWeight: 600, fontSize: 16 }} color={Color.GREY_700} margin={{ bottom: 'medium' }}>
              {getString('cd.steps.common.clusterDetails')}
            </Text>
            {getClusterConfigurationStep(selectedDeploymentType)}
          </Card>
        ) : null}

        <div className={css.navigationButtons}>{props.children}</div>
      </div>
    </div>
  )
}
