import React, { useMemo, useState } from 'react'
import * as yup from 'yup'
import { v4 as nameSpace, v5 as uuid } from 'uuid'
import {
  Layout,
  Formik,
  FormikForm,
  FormInput,
  Text,
  Card,
  Accordion,
  FontVariation,
  ThumbnailSelect,
  IconName,
  Container,
  Icon
} from '@wings-software/uicore'
import { isEmpty, isUndefined, set, uniqBy } from 'lodash-es'
import { Link, useParams } from 'react-router-dom'
import cx from 'classnames'
import { produce } from 'immer'
import type { FormikProps } from 'formik'
import MultiTypeMap from '@common/components/MultiTypeMap/MultiTypeMap'
import {
  FormMultiTypeDurationField,
  getDurationValidationSchema
} from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { useStrings, UseStringsReturn } from 'framework/strings'
import type { StringsMap } from 'stringTypes'
import { loggerFor } from 'framework/logging/logging'
import { ModuleName } from 'framework/types/ModuleName'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import {
  getStageIndexFromPipeline,
  getFlattenedStages
} from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilderUtil'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import { Separator } from '@common/components'
import type { MultiTypeMapType, MultiTypeMapUIType, MapType } from '@pipeline/components/PipelineSteps/Steps/StepsTypes'
import { useGitScope } from '@ci/services/CIUtils'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import type { BuildStageElementConfig } from '@pipeline/utils/pipelineTypes'
import type { K8sDirectInfraYaml, UseFromStageInfraYaml } from 'services/ci'
import { StageErrorContext } from '@pipeline/context/StageErrorContext'
import { regexIdentifier } from '@common/utils/StringUtils'
import ErrorsStripBinded from '@pipeline/components/ErrorsStrip/ErrorsStripBinded'
import { BuildTabs } from '../CIPipelineStagesUtils'
import css from './BuildInfraSpecifications.module.scss'

const logger = loggerFor(ModuleName.CD)
const k8sClusterKeyRef = 'connectors.title.k8sCluster'
const namespaceKeyRef = 'pipelineSteps.build.infraSpecifications.namespace'

interface BuildInfraTypeItem {
  label: string
  icon: IconName
  value: BuildInfraType
  disabled?: boolean
}

enum BuildInfraType {
  KUBERNETES = 'KUBERNETES',
  AWS_VM = 'AWS_VM'
}

type FieldValueType = yup.Ref | yup.Schema<any> | yup.MixedSchema<any>

const getInitialMapValues: (value: MultiTypeMapType) => MultiTypeMapUIType = value => {
  const map =
    typeof value === 'string'
      ? value
      : Object.keys(value || {}).map(key => ({
          id: uuid('', nameSpace()),
          key: key,
          value: value[key]
        }))

  return map
}

const getMapValues: (value: MultiTypeMapUIType) => MultiTypeMapType = value => {
  const map: MapType = {}
  if (Array.isArray(value)) {
    value.forEach(mapValue => {
      if (mapValue.key) {
        map[mapValue.key] = mapValue.value
      }
    })
  }

  return typeof value === 'string' ? value : map
}

const testLabelKey = (value: string): boolean => {
  return (
    ['accountid', 'orgid', 'projectid', 'pipelineid', 'pipelineexecutionid', 'stageid', 'buildnumber'].indexOf(
      value.toLowerCase()
    ) === -1
  )
}

const getFieldSchema = (value: FieldValueType, getString?: UseStringsReturn['getString']): Record<string, any> => {
  if (Array.isArray(value)) {
    return yup
      .array()
      .of(
        yup.object().shape(
          {
            key: yup.string().when('value', {
              is: val => val?.length,
              then: yup
                .string()
                .matches(regexIdentifier, getString?.('validation.validKeyRegex'))
                .required(getString?.('validation.keyRequired'))
            }),
            value: yup.string().when('key', {
              is: val => val?.length,
              then: yup.string().required(getString?.('validation.valueRequired'))
            })
          },
          [['key', 'value']]
        )
      )
      .test('keysShouldBeUnique', getString?.('validation.uniqueKeys') || '', map => {
        if (!map) return true

        return uniqBy(map, 'key').length === map.length
      })
  } else {
    return yup.string()
  }
}

const getValidationSchema = (getString?: UseStringsReturn['getString'], currentMode?: Modes): yup.Schema<unknown> =>
  yup.object().shape({
    connectorRef: yup
      .string()
      .nullable()
      .test(
        'connectorRef required only for New configuration',
        getString?.('fieldRequired', { field: getString?.(k8sClusterKeyRef) }) || '',
        function (connectorRef) {
          if (isEmpty(connectorRef) && currentMode === Modes.NewConfiguration) {
            return false
          }
          return true
        }
      ),
    namespace: yup
      .string()
      .nullable()
      .test(
        'namespace required only for New configuration',
        getString?.('fieldRequired', { field: getString?.(namespaceKeyRef) }) || '',
        function (namespace) {
          if (isEmpty(namespace) && currentMode === Modes.NewConfiguration) {
            return false
          }
          return true
        }
      ),
    useFromStage: yup
      .string()
      .nullable()
      .test(
        'useFromStage required only when Propagate from an existing stage',
        getString?.('pipeline.infraSpecifications.validation.requiredExistingStage') || '',
        function (useFromStage) {
          if (isEmpty(useFromStage) && currentMode === Modes.Propagate) {
            return false
          }
          return true
        }
      ),
    runAsUser: yup.string().test(
      'Must be a number and allows runtimeinput or expression',
      getString?.('pipeline.stepCommonFields.validation.mustBeANumber', {
        label: getString?.('pipeline.stepCommonFields.runAsUser')
      }) || '',
      function (runAsUser) {
        if (isUndefined(runAsUser) || !runAsUser) {
          return true
        } else if (runAsUser.startsWith('<+')) {
          return true
        }
        return !isNaN(runAsUser)
      }
    ),
    annotations: yup.lazy((value: FieldValueType) => getFieldSchema(value) as yup.Schema<FieldValueType>),
    labels: yup.lazy((value: FieldValueType) => getFieldSchema(value) as yup.Schema<FieldValueType>)
  })

interface Values {
  connectorRef?: string
  namespace?: string
  serviceAccountName?: string
  runAsUser?: string
  initTimeout?: string
  useFromStage?: string
  annotations?: MultiTypeMapUIType
  labels?: MultiTypeMapUIType
  buildInfraType?: BuildInfraType
}

enum Modes {
  Propagate,
  NewConfiguration
}

export default function BuildInfraSpecifications({ children }: React.PropsWithChildren<unknown>): JSX.Element {
  const [selectedBuildInfraType, setSelectedBuildInfraType] = useState<BuildInfraType>(BuildInfraType.KUBERNETES)
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()
  const gitScope = useGitScope()
  const enableAWSVMType = false

  const buildInfraTypes: BuildInfraTypeItem[] = [
    {
      label: getString('serviceDeploymentTypes.kubernetes'),
      icon: 'service-kubernetes',
      value: BuildInfraType.KUBERNETES
    },
    {
      label: getString('ci.buildInfa.awsVMs'),
      icon: 'service-aws',
      value: BuildInfraType.AWS_VM
    }
  ]

  const scrollRef = React.useRef<HTMLDivElement | null>(null)

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const {
    state: {
      pipeline,
      selectionState: { selectedStageId }
    },
    isReadonly,
    updateStage,
    getStageFromPipeline
  } = usePipelineContext()

  const { stage } = getStageFromPipeline<BuildStageElementConfig>(selectedStageId || '')

  const [currentMode, setCurrentMode] = React.useState(() =>
    (stage?.stage?.spec?.infrastructure as UseFromStageInfraYaml)?.useFromStage
      ? Modes.Propagate
      : Modes.NewConfiguration
  )

  const { index: stageIndex } = getStageIndexFromPipeline(pipeline, selectedStageId || '')
  const { stages } = getFlattenedStages(pipeline)
  const { stage: propagatedStage } = getStageFromPipeline<BuildStageElementConfig>(
    (stage?.stage?.spec?.infrastructure as UseFromStageInfraYaml)?.useFromStage || ''
  )

  const otherBuildStagesWithInfraConfigurationOptions: { label: string; value: string }[] = []

  if (stages && stages.length > 0) {
    stages.forEach((item, index) => {
      if (
        index < stageIndex &&
        item.stage?.type === 'CI' &&
        ((item.stage as BuildStageElementConfig)?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
      ) {
        otherBuildStagesWithInfraConfigurationOptions.push({
          label: `Stage ${item.stage.name}`,
          value: item.stage.identifier
        })
      }
    })
  }

  const connectorId = ((stage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.connectorRef as string) || ''

  const getPayload = useMemo((): Values => {
    return {
      namespace: (stage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.namespace,
      serviceAccountName: (stage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.serviceAccountName,
      runAsUser: (stage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.runAsUser as unknown as string,
      initTimeout: (stage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.initTimeout,
      annotations: getInitialMapValues(
        (stage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.annotations || {}
      ),
      labels: getInitialMapValues((stage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.labels || {}),
      buildInfraType: selectedBuildInfraType
    }
  }, [stage])

  const getInitialValues = useMemo((): Values => {
    if (stage?.stage?.spec?.infrastructure) {
      if ((stage?.stage?.spec?.infrastructure as UseFromStageInfraYaml)?.useFromStage) {
        return {
          useFromStage: (stage?.stage?.spec?.infrastructure as UseFromStageInfraYaml)?.useFromStage,
          buildInfraType: selectedBuildInfraType
        }
      }
      // else if(){}
      else if (!isEmpty(connectorId)) {
        return {
          connectorRef: (stage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.connectorRef,
          ...getPayload
        }
      } else {
        return {
          connectorRef: undefined,
          ...getPayload
        }
      }
    } else {
      return {
        connectorRef: undefined,
        namespace: '',
        annotations: '',
        labels: '',
        buildInfraType: selectedBuildInfraType
      }
    }
  }, [stage])

  const { subscribeForm, unSubscribeForm } = React.useContext(StageErrorContext)

  const formikRef = React.useRef<FormikProps<unknown> | null>(null)

  React.useEffect(() => {
    subscribeForm({ tab: BuildTabs.INFRASTRUCTURE, form: formikRef })
    return () => unSubscribeForm({ tab: BuildTabs.INFRASTRUCTURE, form: formikRef })
  }, [])

  const handleValidate = (values: any): void => {
    if (stage) {
      const errors: { [key: string]: string } = {}
      const stageData = produce(stage, draft => {
        if (currentMode === Modes.Propagate && values.useFromStage) {
          set(draft, 'stage.spec.infrastructure', {
            useFromStage: values.useFromStage
          })
        } else {
          const filteredLabels = getMapValues(
            Array.isArray(values.labels) ? values.labels.filter((val: any) => testLabelKey(val.key)) : values.labels
          )
          try {
            getDurationValidationSchema().validateSync(values.initTimeout)
          } catch (e) {
            errors.initTimeout = e.message
          }
          set(draft, 'stage.spec.infrastructure', {
            type: 'KubernetesDirect',
            spec: {
              connectorRef:
                values?.connectorRef?.value ||
                values?.connectorRef ||
                (draft.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec?.connectorRef,
              namespace: values.namespace,
              serviceAccountName: values.serviceAccountName,
              runAsUser: values.runAsUser,
              initTimeout: errors.initTimeout ? undefined : values.initTimeout,
              annotations: getMapValues(values.annotations),
              labels: !isEmpty(filteredLabels) ? filteredLabels : undefined
            }
          })

          if (
            !values.annotations ||
            !values.annotations.length ||
            (values.annotations.length === 1 && !values.annotations[0].key)
          ) {
            delete (draft.stage?.spec?.infrastructure as K8sDirectInfraYaml).spec.annotations
          }
        }
      })

      if (stageData.stage) {
        updateStage(stageData.stage)
      }

      return values.labels?.reduce?.((acc: Record<string, string>, curr: any, index: number) => {
        if (!testLabelKey(curr.key)) {
          acc[`labels[${index}].key`] = curr.key + ' is not allowed.'
        }
        return acc
      }, errors)
    }
  }

  const renderUserAndTimeOutFields = React.useCallback((): React.ReactElement => {
    return (
      <>
        <Container className={css.bottomMargin7}>
          <MultiTypeTextField
            label={
              <Text
                font={{ variation: FontVariation.FORM_LABEL }}
                margin={{ bottom: 'xsmall' }}
                tooltipProps={{ dataTooltipId: 'runAsUser' }}
              >
                {getString('pipeline.stepCommonFields.runAsUser')}
              </Text>
            }
            name="runAsUser"
            style={{ width: 300, marginBottom: 'var(--spacing-xsmall)' }}
            multiTextInputProps={{
              multiTextInputProps: { expressions },
              disabled: isReadonly,
              placeholder: '1000'
            }}
          />
        </Container>
        <Container className={css.bottomMargin7}>
          <FormMultiTypeDurationField
            name="initTimeout"
            multiTypeDurationProps={{ expressions }}
            label={
              <Text
                font={{ variation: FontVariation.FORM_LABEL }}
                margin={{ bottom: 'xsmall' }}
                tooltipProps={{ dataTooltipId: 'timeout' }}
              >
                {getString('pipeline.infraSpecifications.initTimeout')}
              </Text>
            }
            disabled={isReadonly}
            style={{ width: 300 }}
          />
        </Container>
      </>
    )
  }, [])

  const renderMultiTypeMap = React.useCallback(
    (fieldName: string, stringKey: keyof StringsMap): React.ReactElement => (
      <Container className={cx(css.bottomMargin7, css.formGroup, { [css.md]: enableAWSVMType })}>
        <MultiTypeMap
          appearance={'minimal'}
          cardStyle={{ width: '50%' }}
          name={fieldName}
          valueMultiTextInputProps={{ expressions }}
          multiTypeFieldSelectorProps={{
            label: (
              <Text font={{ variation: FontVariation.FORM_LABEL }} margin={{ bottom: 'xsmall' }}>
                {getString(stringKey)}
              </Text>
            ),
            disableTypeSelection: true
          }}
          disabled={isReadonly}
        />
      </Container>
    ),
    []
  )

  const renderBuildInfra = React.useCallback(() => {
    return (
      <>
        {renderBuildInfraMainSection()}
        {renderBuildInfraAdvancedSection()}
      </>
    )
  }, [selectedBuildInfraType])

  const renderBuildInfraAdvancedSection = React.useCallback(
    (showCardView?: boolean): React.ReactElement => {
      return (
        <>
          {selectedBuildInfraType === BuildInfraType.KUBERNETES ? (
            <Accordion activeId={''}>
              <Accordion.Panel
                id="advanced"
                addDomId={true}
                summary={
                  <div
                    className={css.tabHeading}
                    id="advanced"
                    style={{ paddingLeft: 'var(--spacing-small)', marginBottom: 0 }}
                  >
                    {getString('advancedTitle')}
                  </div>
                }
                details={
                  showCardView ? (
                    <Card disabled={isReadonly} className={css.sectionCard}>
                      {renderAccordianDetailSection()}
                    </Card>
                  ) : (
                    renderAccordianDetailSection()
                  )
                }
              />
            </Accordion>
          ) : null}
        </>
      )
    },
    [selectedBuildInfraType]
  )

  const renderBuildInfraMainSection = React.useCallback((): React.ReactElement => {
    return selectedBuildInfraType === BuildInfraType.KUBERNETES ? (
      renderKubernetesBuildInfraForm()
    ) : selectedBuildInfraType === BuildInfraType.AWS_VM ? (
      renderAWSVMBuildInfraForm()
    ) : (
      <></>
    )
  }, [selectedBuildInfraType])

  const renderAWSVMBuildInfraForm = React.useCallback((): React.ReactElement => {
    return (
      <MultiTypeTextField
        label={
          <Text
            tooltipProps={{ dataTooltipId: 'poolId' }}
            font={{ variation: FontVariation.FORM_LABEL }}
            margin={{ bottom: 'xsmall' }}
          >
            {getString('ci.buildInfa.awsVM.poolId')}
          </Text>
        }
        name={'poolId'}
        style={{ width: 300 }}
        multiTextInputProps={{
          multiTextInputProps: { expressions },
          disabled: isReadonly
        }}
      />
    )
  }, [])

  const renderKubernetesBuildInfraForm = React.useCallback((): React.ReactElement => {
    return (
      <>
        <Container className={css.bottomMargin3}>
          <FormMultiTypeConnectorField
            width={300}
            name="connectorRef"
            label={
              <Text font={{ variation: FontVariation.FORM_LABEL }} margin={{ bottom: 'xsmall' }}>
                {getString(k8sClusterKeyRef)}
              </Text>
            }
            placeholder={getString('pipelineSteps.build.infraSpecifications.kubernetesClusterPlaceholder')}
            accountIdentifier={accountId}
            projectIdentifier={projectIdentifier}
            orgIdentifier={orgIdentifier}
            gitScope={gitScope}
            multiTypeProps={{ expressions, disabled: isReadonly }}
          />
        </Container>
        <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
          <MultiTypeTextField
            label={
              <Text
                tooltipProps={{ dataTooltipId: 'namespace' }}
                font={{ variation: FontVariation.FORM_LABEL }}
                margin={{ bottom: 'xsmall' }}
              >
                {getString(namespaceKeyRef)}
              </Text>
            }
            name={'namespace'}
            style={{ width: 300 }}
            multiTextInputProps={{
              multiTextInputProps: { expressions },
              disabled: isReadonly,
              placeholder: getString('pipeline.infraSpecifications.namespacePlaceholder')
            }}
          />
        </div>
      </>
    )
  }, [])

  const renderAccordianDetailSection = React.useCallback((): React.ReactElement => {
    return (
      <>
        <Container className={css.bottomMargin7}>
          <FormInput.MultiTextInput
            label={
              <Text
                font={{ variation: FontVariation.FORM_LABEL }}
                margin={{ bottom: 'xsmall' }}
                tooltipProps={{ dataTooltipId: 'serviceAccountName' }}
              >
                {getString('pipeline.infraSpecifications.serviceAccountName')}
              </Text>
            }
            name="serviceAccountName"
            placeholder={getString('pipeline.infraSpecifications.serviceAccountNamePlaceholder')}
            style={{
              width: 300
            }}
            multiTextInputProps={{ expressions, disabled: isReadonly }}
          />
        </Container>
        {renderUserAndTimeOutFields()}
        <Container className={css.bottomMargin7}>{renderMultiTypeMap('annotations', 'ci.annotations')}</Container>
        <Container className={css.bottomMargin7}>{renderMultiTypeMap('labels', 'ci.labels')}</Container>
      </>
    )
  }, [])

  return (
    <div className={css.wrapper}>
      <ErrorsStripBinded />
      <div className={css.contentSection} ref={scrollRef}>
        <Formik
          initialValues={getInitialValues}
          validationSchema={getValidationSchema(getString, currentMode)}
          validate={handleValidate}
          formName="ciBuildInfra"
          onSubmit={values => logger.info(JSON.stringify(values))}
        >
          {formik => {
            const { setFieldValue } = formik
            window.dispatchEvent(new CustomEvent('UPDATE_ERRORS_STRIP', { detail: BuildTabs.INFRASTRUCTURE }))
            formikRef.current = formik
            return (
              <Layout.Vertical>
                <Text font={{ variation: FontVariation.H5 }} id="infrastructureDefinition">
                  {getString('pipelineSteps.build.infraSpecifications.whereToRun')}
                </Text>
                <FormikForm>
                  <Layout.Horizontal spacing="large">
                    <Layout.Vertical>
                      {otherBuildStagesWithInfraConfigurationOptions.length ? (
                        <>
                          <Card disabled={isReadonly} className={cx(css.sectionCard)}>
                            <Layout.Horizontal spacing="xxlarge">
                              <div
                                className={cx(css.card, { [css.active]: currentMode === Modes.Propagate })}
                                style={{ width: 410 }}
                                onClick={() => {
                                  setCurrentMode(Modes.Propagate)
                                }}
                              >
                                <Text className={css.cardTitle} color="black" margin={{ bottom: 'large' }}>
                                  {getString('pipelineSteps.build.infraSpecifications.propagate')}
                                </Text>
                                <FormInput.Select
                                  name="useFromStage"
                                  items={otherBuildStagesWithInfraConfigurationOptions}
                                  disabled={isReadonly}
                                />
                                {(propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                  ?.connectorRef && (
                                  <>
                                    <Text font={{ variation: FontVariation.FORM_LABEL }} margin={{ bottom: 'xsmall' }}>
                                      {getString(k8sClusterKeyRef)}
                                    </Text>
                                    <Text color="black" margin={{ bottom: 'medium' }}>
                                      {
                                        (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                          ?.connectorRef
                                      }
                                    </Text>
                                  </>
                                )}
                                {(propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                  ?.namespace && (
                                  <>
                                    <Text
                                      font={{ variation: FontVariation.FORM_LABEL }}
                                      margin={{ bottom: 'xsmall' }}
                                      tooltipProps={{ dataTooltipId: 'namespace' }}
                                    >
                                      {getString(namespaceKeyRef)}
                                    </Text>
                                    <Text color="black">
                                      {
                                        (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                          ?.namespace
                                      }
                                    </Text>
                                  </>
                                )}
                                {((propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                  ?.serviceAccountName ||
                                  (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                    ?.runAsUser ||
                                  (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                    ?.initTimeout ||
                                  (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                    ?.annotations ||
                                  (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                    ?.labels) && (
                                  <Accordion activeId={''}>
                                    <Accordion.Panel
                                      id="advanced"
                                      addDomId={true}
                                      summary={
                                        <div
                                          className={css.tabHeading}
                                          id="advanced"
                                          style={{ paddingLeft: 'var(--spacing-small)', marginBottom: 0 }}
                                        >
                                          {getString('advancedTitle')}
                                        </div>
                                      }
                                      details={
                                        <>
                                          {(propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                            ?.serviceAccountName && (
                                            <>
                                              <Text
                                                font={{ variation: FontVariation.FORM_LABEL }}
                                                margin={{ bottom: 'xsmall' }}
                                                tooltipProps={{ dataTooltipId: 'serviceAccountName' }}
                                              >
                                                {getString('pipeline.infraSpecifications.serviceAccountName')}
                                              </Text>
                                              <Text color="black" margin={{ bottom: 'medium' }}>
                                                {
                                                  (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)
                                                    ?.spec?.serviceAccountName
                                                }
                                              </Text>
                                            </>
                                          )}
                                          {(propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                            ?.runAsUser && (
                                            <>
                                              <Text
                                                font={{ variation: FontVariation.FORM_LABEL }}
                                                margin={{ bottom: 'xsmall' }}
                                                tooltipProps={{ dataTooltipId: 'runAsUser' }}
                                              >
                                                {getString('pipeline.stepCommonFields.runAsUser')}
                                              </Text>
                                              <Text color="black" margin={{ bottom: 'medium' }}>
                                                {
                                                  (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)
                                                    ?.spec?.runAsUser
                                                }
                                              </Text>
                                            </>
                                          )}
                                          {(propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                            ?.initTimeout && (
                                            <>
                                              <Text
                                                font={{ variation: FontVariation.FORM_LABEL }}
                                                margin={{ bottom: 'xsmall' }}
                                                tooltipProps={{ dataTooltipId: 'timeout' }}
                                              >
                                                {getString('pipeline.infraSpecifications.initTimeout')}
                                              </Text>
                                              <Text color="black" margin={{ bottom: 'medium' }}>
                                                {
                                                  (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)
                                                    ?.spec?.initTimeout
                                                }
                                              </Text>
                                            </>
                                          )}
                                          {(propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                            ?.annotations && (
                                            <>
                                              <Text
                                                font={{ variation: FontVariation.FORM_LABEL }}
                                                margin={{ bottom: 'xsmall' }}
                                              >
                                                {getString('ci.annotations')}
                                              </Text>
                                              {typeof (
                                                propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml
                                              )?.spec?.annotations === 'string' ? (
                                                <Text color="black">
                                                  {
                                                    (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)
                                                      ?.spec.annotations
                                                  }
                                                </Text>
                                              ) : (
                                                <ul className={css.plainList}>
                                                  {Object.entries(
                                                    (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)
                                                      ?.spec?.annotations || {}
                                                  )?.map((entry, idx) => (
                                                    <li key={idx}>
                                                      <Text color="black">
                                                        {entry[0]}:{entry[1]}
                                                      </Text>
                                                    </li>
                                                  ))}
                                                </ul>
                                              )}
                                            </>
                                          )}
                                          {(propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)?.spec
                                            ?.labels && (
                                            <>
                                              <Text
                                                font={{ variation: FontVariation.FORM_LABEL }}
                                                margin={{ bottom: 'xsmall' }}
                                              >
                                                {getString('ci.labels')}
                                              </Text>
                                              {typeof (
                                                propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml
                                              )?.spec?.labels === 'string' ? (
                                                <Text color="black">
                                                  {
                                                    (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)
                                                      ?.spec?.labels
                                                  }
                                                </Text>
                                              ) : (
                                                <ul className={css.plainList}>
                                                  {Object.entries(
                                                    (propagatedStage?.stage?.spec?.infrastructure as K8sDirectInfraYaml)
                                                      ?.spec?.labels || {}
                                                  )?.map((entry, idx) => (
                                                    <li key={idx}>
                                                      <Text color="black">
                                                        {entry[0]}:{entry[1]}
                                                      </Text>
                                                    </li>
                                                  ))}
                                                </ul>
                                              )}
                                            </>
                                          )}
                                        </>
                                      }
                                    />
                                  </Accordion>
                                )}
                              </div>

                              <div
                                className={cx(css.card, { [css.active]: currentMode === Modes.NewConfiguration })}
                                style={{ width: 460 }}
                                onClick={() => {
                                  setCurrentMode(Modes.NewConfiguration)

                                  if (currentMode === Modes.Propagate) {
                                    const newStageData = produce(stage, draft => {
                                      if (draft) {
                                        set(draft, 'stage.spec.infrastructure', {
                                          type: 'KubernetesDirect',
                                          spec: {
                                            connectorRef: '',
                                            namespace: '',
                                            annotations: {},
                                            labels: {}
                                          }
                                        })
                                      }
                                    })
                                    setFieldValue('useFromStage', '')

                                    if (newStageData?.stage) {
                                      updateStage(newStageData.stage)
                                    }
                                  }
                                }}
                              >
                                <>
                                  <Text className={css.cardTitle} color="black" margin={{ bottom: 'large' }}>
                                    {enableAWSVMType
                                      ? getString('ci.buildInfa.useNewInfra')
                                      : getString('pipelineSteps.build.infraSpecifications.newConfiguration')}
                                  </Text>
                                  {enableAWSVMType ? (
                                    <ThumbnailSelect
                                      name={'buildInfraType'}
                                      items={buildInfraTypes}
                                      isReadonly={isReadonly}
                                      onChange={val => setSelectedBuildInfraType(val as BuildInfraType)}
                                    />
                                  ) : null}
                                  {enableAWSVMType ? null : renderBuildInfra()}
                                </>
                              </div>
                            </Layout.Horizontal>
                            {enableAWSVMType && currentMode === Modes.NewConfiguration ? (
                              <>
                                <Separator topSeparation={30} />
                                {renderBuildInfra()}
                              </>
                            ) : null}
                          </Card>
                        </>
                      ) : (
                        <>
                          <Card disabled={isReadonly} className={cx(css.sectionCard)}>
                            <Layout.Vertical spacing="small">
                              {enableAWSVMType ? (
                                <>
                                  <Text font={{ variation: FontVariation.FORM_HELP }} padding={{ bottom: 'medium' }}>
                                    {getString('ci.buildInfa.selectInfra')}
                                  </Text>
                                  <ThumbnailSelect
                                    name={'buildInfraType'}
                                    items={buildInfraTypes}
                                    isReadonly={isReadonly}
                                    onChange={val => setSelectedBuildInfraType(val as BuildInfraType)}
                                  />
                                  <Separator topSeparation={12} />
                                </>
                              ) : null}
                              {renderBuildInfraMainSection()}
                            </Layout.Vertical>
                          </Card>
                          {renderBuildInfraAdvancedSection(true)}
                        </>
                      )}
                    </Layout.Vertical>
                    {enableAWSVMType ? (
                      <Container className={css.helptext} margin={{ top: 'medium' }} padding="large">
                        <Layout.Horizontal spacing="xsmall" flex={{ justifyContent: 'start' }}>
                          <Icon name="info-messaging" size={20} />
                          <Text font={{ variation: FontVariation.H5 }}>
                            {getString('ci.buildInfa.infrastructureTypesLabel')}
                          </Text>
                        </Layout.Horizontal>
                        <>
                          <Text font={{ variation: FontVariation.BODY2 }} padding={{ top: 'xlarge', bottom: 'xsmall' }}>
                            {getString('ci.buildInfa.k8sLabel')}
                          </Text>
                          <Text font={{ variation: FontVariation.SMALL }}>
                            {getString('ci.buildInfa.kubernetesHelpText')}
                          </Text>
                        </>
                        <Separator />
                        <>
                          <Text font={{ variation: FontVariation.BODY2 }} padding={{ bottom: 'xsmall' }}>
                            {getString('ci.buildInfa.vmLabel')}
                          </Text>
                          <Text font={{ variation: FontVariation.SMALL }}>{getString('ci.buildInfa.awsHelpText')}</Text>
                        </>
                        <Container padding={{ top: 'medium' }}>
                          <Link to="/">{getString('learnMore')}</Link>
                        </Container>
                      </Container>
                    ) : null}
                  </Layout.Horizontal>
                </FormikForm>
              </Layout.Vertical>
            )
          }}
        </Formik>
        {children}
      </div>
    </div>
  )
}
