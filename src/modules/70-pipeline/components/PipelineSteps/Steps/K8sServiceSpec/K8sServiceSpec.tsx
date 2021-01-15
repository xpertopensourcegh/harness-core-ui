import React from 'react'
import get from 'lodash-es/get'
import isEmpty from 'lodash-es/isEmpty'
import set from 'lodash-es/set'
import parseInt from 'lodash-es/parseInt'
import {
  IconName,
  Tabs,
  Tab,
  Layout,
  Text,
  Color,
  getMultiTypeFromValue,
  MultiTypeInputType,
  FormInput,
  Icon,
  NestedAccordionPanel
} from '@wings-software/uicore'
import { parse } from 'yaml'
import { useParams } from 'react-router-dom'
import { FormGroup, Tooltip } from '@blueprintjs/core'
import { useGetPipeline } from 'services/pipeline-ng'
import type { PipelineType, InputSetPathProps } from '@common/interfaces/RouteInterfaces'
import WorkflowVariables from '@pipeline/components/WorkflowVariablesSelection/WorkflowVariables'
import ArtifactsSelection from '@pipeline/components/ArtifactsSelection/ArtifactsSelection'
import ManifestSelection from '@pipeline/components/ManifestSelection/ManifestSelection'
import { StepViewType } from '@pipeline/exports'
import type { ServiceSpec, NgPipeline } from 'services/cd-ng'
import { Step, StepProps } from '@pipeline/components/AbstractSteps/Step'
import { useStrings, UseStringsReturn, String } from 'framework/exports'
import type { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { StepType } from '../../PipelineStepInterface'
import css from './K8sServiceSpec.module.scss'

export const getNonRuntimeFields = (spec: { [key: string]: any } = {}, template: { [key: string]: any }) => {
  const fields: { [key: string]: any } = {}

  Object.entries(spec).forEach(([key]): void => {
    if (getMultiTypeFromValue(template[key]) !== MultiTypeInputType.RUNTIME) {
      fields[key] = spec[key]
    }
  })
  return JSON.stringify(fields, null, 2)
}

interface KubernetesServiceInputFormProps {
  initialValues: K8SDirectServiceStep
  onUpdate?: ((data: ServiceSpec) => void) | undefined
  stepViewType?: StepViewType
  template?: ServiceSpec
  factory?: AbstractStepFactory
  path?: string
}

const setupMode = {
  PROPAGATE: 'PROPAGATE',
  DIFFERENT: 'DIFFRENT'
}
const KubernetesServiceSpecInputForm: React.FC<KubernetesServiceInputFormProps> = ({
  initialValues: { stageIndex = 0, setupModeType, handleTabChange },
  factory
}) => {
  const { getString } = useStrings()
  return (
    <Tabs id="serviceSpecifications" onChange={handleTabChange}>
      <Tab
        id={getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.artifacts')}
        title={getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.artifacts')}
        panel={
          <ArtifactsSelection
            isForOverrideSets={false}
            isForPredefinedSets={stageIndex > 0 && setupModeType === setupMode.PROPAGATE}
          />
        }
      />
      <Tab
        id={getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.manifests')}
        title={getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.manifests')}
        panel={
          <ManifestSelection
            isForOverrideSets={false}
            isForPredefinedSets={stageIndex > 0 && setupModeType === setupMode.PROPAGATE}
          />
        }
      />
      <Tab
        id={getString('pipelineSteps.build.stageSpecifications.variablesDetails')}
        title={getString('pipelineSteps.build.stageSpecifications.variablesDetails')}
        panel={
          <WorkflowVariables
            factory={factory as any}
            isForOverrideSets={false}
            isForPredefinedSets={stageIndex > 0 && setupModeType === setupMode.PROPAGATE}
          />
        }
      />
    </Tabs>
  )
}

const KubernetesServiceSpecEditable: React.FC<KubernetesServiceInputFormProps> = ({ template, path }) => {
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<
    PipelineType<InputSetPathProps> & { accountId: string }
  >()
  const [pipeline, setPipeline] = React.useState<NgPipeline>()
  const { data: pipelineResponse } = useGetPipeline({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })
  React.useEffect(() => {
    if (pipelineResponse?.data?.yamlPipeline) {
      setPipeline(parse(pipelineResponse?.data?.yamlPipeline))
    }
  }, [pipelineResponse?.data?.yamlPipeline])
  const stageIndex = parseInt(get(get(path?.match(/stages\[\d\]/g), '[0]', '').match(/\d/), '[0]', ''))
  const stageIdentifier = get(pipeline, `pipeline.stages[${stageIndex}].stage.identifier`, '')

  return (
    <Layout.Vertical spacing="medium">
      <NestedAccordionPanel
        addDomId
        id={`Stage.${stageIdentifier}.Service.Artifacts`}
        summary={
          <div className={css.stagesTreeBulletCircle}>
            <String stringID="pipelineSteps.deploy.serviceSpecifications.deploymentTypes.artifacts" />
          </div>
        }
        details={
          <>
            {template?.artifacts?.primary && (
              <Text className={css.sectionHeader}>
                {getString('primaryArtifactText')}
                {
                  <Tooltip
                    position="top"
                    content={getNonRuntimeFields(
                      get(pipeline, `${path}.artifacts.primary.spec`),
                      get(template, 'artifacts.primary.spec')
                    )}
                  >
                    <Icon name="info" />
                  </Tooltip>
                }
              </Text>
            )}
            {template?.artifacts?.primary && (
              <Layout.Vertical key="primary">
                {getMultiTypeFromValue(get(template, `artifacts.primary.spec.connectorRef`, '')) ===
                  MultiTypeInputType.RUNTIME && (
                  <FormGroup
                    labelFor={'connectorRef'}
                    label={getString('pipelineSteps.deploy.inputSet.artifactServer')}
                  >
                    <FormMultiTypeConnectorField
                      name={`${path}.artifacts.primary.spec.connectorRef`}
                      label={''}
                      placeholder={''}
                      accountIdentifier={accountId}
                      projectIdentifier={projectIdentifier}
                      orgIdentifier={orgIdentifier}
                      width={350}
                      isNewConnectorLabelVisible={false}
                      type={'DockerRegistry'}
                      enableConfigureOptions={false}
                    />
                  </FormGroup>
                )}
                {getMultiTypeFromValue(get(template, `artifacts.primary.spec.imagePath`, '')) ===
                  MultiTypeInputType.RUNTIME && (
                  <FormGroup labelFor="imagePath" label={getString('pipelineSteps.deploy.inputSet.imagePath')}>
                    <FormInput.Text style={{ width: 400 }} name={`${path}.artifacts.primary.spec.imagePath`} />
                  </FormGroup>
                )}
              </Layout.Vertical>
            )}
            {template?.artifacts?.sidecars?.length && (
              <Text className={css.sectionHeader}>{getString('sidecarArtifactText')}</Text>
            )}
            {template?.artifacts?.sidecars?.map(
              (
                {
                  sidecar: {
                    identifier,
                    spec: { connectorRef, imagePath }
                  }
                }: any,
                index: number
              ) => {
                return (
                  <Layout.Vertical key={identifier}>
                    <Text className={css.subSectonHeader}>
                      {identifier}
                      {(getMultiTypeFromValue(
                        get(template, `artifacts.sidecars[${index}].sidecar.spec.connectorRef`, '')
                      ) !== MultiTypeInputType.RUNTIME ||
                        getMultiTypeFromValue(
                          get(template, `artifacts.sidecars[${index}].sidecar.spec.imagePath`, '')
                        ) !== MultiTypeInputType.RUNTIME) && (
                        <Tooltip
                          position="top"
                          content={getNonRuntimeFields(
                            get(pipeline, `${path}.artifacts.sidecars[${index}].sidecar.spec`),
                            get(template, 'artifacts.primary.spec')
                          )}
                        >
                          <Icon name="info" />
                        </Tooltip>
                      )}
                    </Text>
                    {getMultiTypeFromValue(connectorRef) === MultiTypeInputType.RUNTIME && (
                      <FormGroup
                        labelFor={'connectorRef'}
                        label={getString('pipelineSteps.deploy.inputSet.artifactServer')}
                      >
                        <FormMultiTypeConnectorField
                          name={`${path}.artifacts.sidecars[${index}].sidecar.spec.connectorRef`}
                          label={''}
                          placeholder={''}
                          accountIdentifier={accountId}
                          projectIdentifier={projectIdentifier}
                          orgIdentifier={orgIdentifier}
                          width={350}
                          isNewConnectorLabelVisible={false}
                          type={'DockerRegistry'}
                          enableConfigureOptions={false}
                        />
                      </FormGroup>
                    )}
                    {getMultiTypeFromValue(imagePath) === MultiTypeInputType.RUNTIME && (
                      <FormGroup labelFor="imagePath" label={getString('pipelineSteps.deploy.inputSet.imagePath')}>
                        <FormInput.Text
                          style={{ width: 400 }}
                          name={`${path}.artifacts.sidecars[${index}].sidecar.spec.imagePath`}
                        />
                      </FormGroup>
                    )}
                  </Layout.Vertical>
                )
              }
            )}
          </>
        }
      />
      <NestedAccordionPanel
        addDomId
        id={`Stage.${stageIdentifier}.Service.Manifests`}
        summary={
          <div className={css.stagesTreeBulletCircle}>
            <String stringID="pipelineSteps.deploy.serviceSpecifications.deploymentTypes.manifests" />
          </div>
        }
        details={
          <>
            {template?.manifests?.length && (
              <Text style={{ fontSize: 16, color: Color.BLACK, marginTop: 15, fontWeight: 'bold' }}>
                {getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.manifests')}
              </Text>
            )}
            {template?.manifests?.map?.(
              (
                {
                  manifest: {
                    identifier,
                    spec: {
                      store: {
                        spec: { branch, connectorRef }
                      }
                    }
                  }
                }: any,
                index: number
              ) => {
                return (
                  <Layout.Vertical key={identifier}>
                    <Text style={{ fontSize: 16, color: Color.BLACK, marginTop: 15 }}>{identifier}</Text>
                    {getMultiTypeFromValue(connectorRef) === MultiTypeInputType.RUNTIME && (
                      <FormGroup
                        labelFor={'connectorRef'}
                        label={getString('pipelineSteps.deploy.inputSet.artifactServer')}
                      >
                        <FormMultiTypeConnectorField
                          name={`${path}.manifests[${index}].manifest.spec.store.spec.connectorRef`}
                          label={''}
                          placeholder={''}
                          accountIdentifier={accountId}
                          projectIdentifier={projectIdentifier}
                          orgIdentifier={orgIdentifier}
                          width={400}
                          isNewConnectorLabelVisible={false}
                          category={'CODE_REPO'}
                          enableConfigureOptions={false}
                        />
                      </FormGroup>
                    )}
                    {getMultiTypeFromValue(branch) === MultiTypeInputType.RUNTIME && (
                      <FormGroup labelFor={'branch'} label={getString('pipelineSteps.deploy.inputSet.branch')}>
                        <FormInput.Text
                          style={{ width: 400 }}
                          name={`${path}.manifests[${index}].manifest.spec.store.spec.branch`}
                        />
                      </FormGroup>
                    )}
                  </Layout.Vertical>
                )
              }
            )}
          </>
        }
      />
    </Layout.Vertical>
  )
}

export interface K8SDirectServiceStep extends ServiceSpec {
  stageIndex?: number
  setupModeType?: string
  handleTabChange?: (tab: string) => void
}

export class KubernetesServiceSpec extends Step<ServiceSpec> {
  protected type = StepType.K8sServiceSpec
  protected defaultValues: ServiceSpec = {}

  protected stepIcon: IconName = 'service-kubernetes'
  protected stepName = 'Deplyment Service'
  protected stepPaletteVisible = false

  validateInputSet(
    data: K8SDirectServiceStep,
    template?: ServiceSpec,
    getString?: UseStringsReturn['getString']
  ): object {
    const errors: K8SDirectServiceStep = {}
    if (
      isEmpty(data?.artifacts?.primary?.spec?.connectorRef) &&
      getMultiTypeFromValue(template?.artifacts?.primary?.spec?.connectorRef) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'artifacts.primary.spec.connectorRef', getString?.('fieldRequired', { field: 'ConnectorRef' }))
    }
    if (
      isEmpty(data?.artifacts?.primary?.spec?.imagePath) &&
      getMultiTypeFromValue(template?.artifacts?.primary?.spec?.imagePath) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'artifacts.primary.spec.imagePath', getString?.('fieldRequired', { field: 'Image Path' }))
    }
    data?.artifacts?.sidecars?.forEach((sidecar, index) => {
      const currentSidecarTemplate = get(template, `artifacts.sidecars[${index}].sidecar.spec`, '')
      if (
        isEmpty(sidecar?.sidecar?.spec?.connectorRef) &&
        getMultiTypeFromValue(currentSidecarTemplate?.connectorRef) === MultiTypeInputType.RUNTIME
      ) {
        set(
          errors,
          `artifacts.sidecars[${index}].sidecar.spec.connectorRef`,
          getString?.('fieldRequired', { field: 'ConnectorRef' })
        )
      }
      if (
        isEmpty(sidecar?.sidecar?.spec?.imagePath) &&
        getMultiTypeFromValue(currentSidecarTemplate?.imagePath) === MultiTypeInputType.RUNTIME
      ) {
        set(
          errors,
          `artifacts.sidecars[${index}].sidecar.spec.imagePath`,
          getString?.('fieldRequired', { field: 'Image Path' })
        )
      }
    })

    data?.manifests?.forEach((manifest, index) => {
      const currentManifestTemplate = get(template, `manifests[${index}].manifest.spec.store.spec`, '')
      if (
        isEmpty(manifest?.manifest?.spec?.store?.spec?.connectorRef) &&
        getMultiTypeFromValue(currentManifestTemplate?.connectorRef) === MultiTypeInputType.RUNTIME
      ) {
        set(
          errors,
          `manifests[${index}].manifest.spec.store.spec.connectorRef`,
          getString?.('fieldRequired', { field: 'ConnectorRef' })
        )
      }
      if (
        isEmpty(manifest?.manifest?.spec?.store?.spec?.branch) &&
        getMultiTypeFromValue(currentManifestTemplate?.branch) === MultiTypeInputType.RUNTIME
      ) {
        set(
          errors,
          `manifests[${index}].manifest.spec.store.spec.branch`,
          getString?.('fieldRequired', { field: 'Branch' })
        )
      }
    })

    return errors
  }

  renderStep(props: StepProps<K8SDirectServiceStep>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, factory } = props
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <KubernetesServiceSpecEditable
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          template={inputSetData?.template}
          path={inputSetData?.path}
        />
      )
    }

    return (
      <KubernetesServiceSpecInputForm
        factory={factory}
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        path={inputSetData?.path}
      />
    )
  }
}
