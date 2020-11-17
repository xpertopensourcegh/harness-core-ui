import React from 'react'
import * as yup from 'yup'
import {
  Layout,
  Formik,
  FormikForm,
  FormInput,
  Text,
  getMultiTypeFromValue,
  MultiTypeInputType
} from '@wings-software/uikit'
import { isEmpty } from 'lodash-es'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import { Scope } from '@common/interfaces/SecretsInterface'
import { loggerFor, ModuleName } from 'framework/exports'
import {
  ConfigureOptions,
  PipelineContext,
  getStageFromPipeline,
  getStageIndexFromPipeline,
  getPrevoiusStageFromIndex
} from '@pipeline/exports'
import {
  ConnectorReferenceField,
  ConnectorReferenceFieldProps
} from '@connectors/components/ConnectorReferenceField/ConnectorReferenceField'
import { ConnectorInfoDTO, useGetConnector } from 'services/cd-ng'
import {
  getIdentifierFromValue,
  getScopeFromDTO,
  getScopeFromValue
} from '@common/components/EntityReference/EntityReference'
import css from './BuildInfraSpecifications.module.scss'

const logger = loggerFor(ModuleName.CD)

const validationSchema = yup.object().shape({
  connectorRef: yup.mixed().required(),
  namespace: yup.string().trim().required()
})

interface Values {
  connectorRef?: ConnectorReferenceFieldProps['selected'] | string
  namespace?: string
  useFromStage?: string
}

enum Modes {
  Propagate,
  NewConfiguration
}

export default function BuildInfraSpecifications(): JSX.Element {
  const { getString } = useStrings('pipeline-stages')

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },

    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage = {} } = getStageFromPipeline(pipeline, selectedStageId || '')

  const [currentMode, setCurrentMode] = React.useState(() =>
    stage?.stage?.spec?.infrastructure?.useFromStage?.stage ? Modes.Propagate : Modes.NewConfiguration
  )

  const { index: stageIndex } = getStageIndexFromPipeline(pipeline, selectedStageId || '')
  const { stages } = getPrevoiusStageFromIndex(pipeline)
  const { stage: propagatedStage = {} } = getStageFromPipeline(
    pipeline,
    stage?.stage?.spec?.infrastructure?.useFromStage?.stage || ''
  )

  const otherBuildStagesWithInfraConfigurationOptions: { label: string; value: string }[] = []

  if (stages && stages.length > 0) {
    stages.forEach((item, index) => {
      if (index < stageIndex && item.stage.type === 'ci' && item.stage.spec.infrastructure?.spec) {
        otherBuildStagesWithInfraConfigurationOptions.push({
          label: `Stage ${item.stage.name}`,
          value: item.stage.identifier
        })
      }
    })
  }

  const connectorId = getIdentifierFromValue((stage?.stage?.spec?.infrastructure?.spec?.connectorRef as string) || '')
  const initialScope = getScopeFromValue((stage?.stage?.spec?.infrastructure?.spec?.connectorRef as string) || '')

  const { data: connector, loading, refetch } = useGetConnector({
    identifier: connectorId,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: initialScope === Scope.ORG || initialScope === Scope.PROJECT ? orgIdentifier : undefined,
      projectIdentifier: initialScope === Scope.PROJECT ? projectIdentifier : undefined
    },
    lazy: true,
    debounce: 300
  })

  const getInitialValues = (): Values => {
    if (stage?.stage?.spec?.infrastructure) {
      if (stage?.stage?.spec?.infrastructure?.useFromStage?.stage) {
        return {
          useFromStage: stage?.stage?.spec?.infrastructure?.useFromStage?.stage
        }
      } else if (connector?.data?.connector) {
        const scope = getScopeFromDTO<ConnectorInfoDTO>(connector?.data?.connector)
        return {
          connectorRef: {
            label: connector?.data?.connector.name || '',
            value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector?.data?.connector.identifier}`,
            scope: scope
          },
          namespace: stage?.stage?.spec?.infrastructure?.spec?.namespace
        }
      } else {
        return {
          connectorRef: '',
          namespace: stage?.stage?.spec?.infrastructure?.spec?.namespace
        }
      }
    } else {
      return {
        connectorRef: '',
        namespace: ''
      }
    }
  }

  React.useEffect(() => {
    if (!isEmpty(stage?.stage?.spec?.infrastructure?.spec?.connectorRef)) {
      refetch()
    }
  }, [stage?.stage?.spec?.infrastructure?.spec?.connectorRef])

  const handleValidate = (values: any): void => {
    if (stage) {
      if (currentMode === Modes.Propagate && values.useFromStage) {
        stage.stage.spec.infrastructure = {
          useFromStage: {
            stage: values.useFromStage
          }
        }
      } else {
        stage.stage.spec.infrastructure = {
          type: 'kubernetes-direct',
          spec: {
            connectorRef: values.connectorRef.value,
            namespace: values.namespace
          }
        }
      }

      updatePipeline(pipeline)
    }
  }

  return (
    <Layout.Vertical>
      <Layout.Vertical spacing="large" style={{ alignItems: 'center' }}>
        <Layout.Vertical width="100%" spacing="large">
          <Formik
            enableReinitialize
            initialValues={getInitialValues()}
            validationSchema={validationSchema}
            validate={handleValidate}
            onSubmit={values => logger.info(JSON.stringify(values))}
          >
            {({ values: formValues, setFieldValue }) => (
              <>
                <div className={cx(css.section, css.noPadTop)}>
                  <Layout.Vertical flex={true} className={css.specTabs}>
                    <Text font={{ size: 'medium', weight: 'semi-bold' }} width={220}>
                      {getString('build.infraSpecifications.whereToRun')}
                    </Text>
                  </Layout.Vertical>
                  <FormikForm>
                    {otherBuildStagesWithInfraConfigurationOptions.length ? (
                      <Layout.Horizontal spacing="xxlarge">
                        <div
                          className={cx(css.card, { [css.active]: currentMode === Modes.Propagate })}
                          style={{ width: 480 }}
                          onClick={() => setCurrentMode(Modes.Propagate)}
                        >
                          <Text className={css.cardTitle} font="normal" color="black" margin={{ bottom: 'large' }}>
                            {getString('build.infraSpecifications.propagate')}
                          </Text>
                          <FormInput.Select name="useFromStage" items={otherBuildStagesWithInfraConfigurationOptions} />
                          {propagatedStage?.stage?.spec?.infrastructure?.spec?.connectorRef && (
                            <>
                              <Text font="small" margin={{ top: 'large', bottom: 'xsmall' }}>
                                {getString('build.infraSpecifications.propagateConnectorLabel')}
                              </Text>
                              <Text font="normal" color="black" margin={{ bottom: 'medium' }}>
                                {propagatedStage?.stage?.spec?.infrastructure?.spec?.connectorRef}
                              </Text>
                            </>
                          )}
                          {propagatedStage?.stage?.spec?.infrastructure?.spec?.namespace && (
                            <>
                              <Text font="small" margin={{ bottom: 'xsmall' }}>
                                {getString('build.infraSpecifications.namespace')}
                              </Text>
                              <Text font="normal" color="black">
                                {propagatedStage?.stage?.spec?.infrastructure?.spec?.namespace}
                              </Text>
                            </>
                          )}
                        </div>

                        <div
                          className={cx(css.card, { [css.active]: currentMode === Modes.NewConfiguration })}
                          style={{ width: 530 }}
                          onClick={() => {
                            setCurrentMode(Modes.NewConfiguration)

                            if (currentMode === Modes.Propagate) {
                              stage.stage.spec.infrastructure = {
                                type: 'kubernetes-direct',
                                spec: {
                                  connectorRef: '',
                                  namespace: ''
                                }
                              }

                              setFieldValue('useFromStage', undefined)

                              updatePipeline(pipeline)
                            }
                          }}
                        >
                          <Text className={css.cardTitle} font="normal" color="black" margin={{ bottom: 'large' }}>
                            {getString('build.infraSpecifications.newConfiguration')}
                          </Text>
                          <Text font="small" margin={{ bottom: 'xsmall' }}>
                            {getString('build.infraSpecifications.newConfigurationConnectorLabel')}
                          </Text>
                          <ConnectorReferenceField
                            width={300}
                            name="connectorRef"
                            selected={formValues.connectorRef as ConnectorReferenceFieldProps['selected']}
                            label={''}
                            placeholder={
                              loading
                                ? getString('build.infraSpecifications.loading')
                                : getString('build.infraSpecifications.connectorPlaceholder')
                            }
                            disabled={loading}
                            accountIdentifier={accountId}
                            projectIdentifier={projectIdentifier}
                            orgIdentifier={orgIdentifier}
                            onChange={(value, scope) => {
                              setFieldValue('connectorRef', {
                                label: value.name || '',
                                value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${value.identifier}`,
                                scope: scope
                              })
                            }}
                          />
                          <Text font="small" margin={{ bottom: 'xsmall' }}>
                            {getString('build.infraSpecifications.namespace')}
                          </Text>
                          <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                            <FormInput.MultiTextInput label="" name={'namespace'} style={{ width: 300 }} />
                            {getMultiTypeFromValue(formValues.namespace) === MultiTypeInputType.RUNTIME && (
                              <ConfigureOptions
                                value={formValues.namespace as string}
                                type={
                                  <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                    <Text>{getString('build.infraSpecifications.namespace')}</Text>
                                  </Layout.Horizontal>
                                }
                                variableName={'namespace'}
                                showRequiredField={false}
                                showDefaultField={false}
                                showAdvanced={true}
                                onChange={value => setFieldValue('namespace', value)}
                              />
                            )}
                          </div>
                        </div>
                      </Layout.Horizontal>
                    ) : (
                      <>
                        <ConnectorReferenceField
                          width={300}
                          name="connectorRef"
                          selected={formValues.connectorRef as ConnectorReferenceFieldProps['selected']}
                          label={getString('build.infraSpecifications.newConfigurationConnectorLabel')}
                          placeholder={
                            loading
                              ? getString('build.infraSpecifications.loading')
                              : getString('build.infraSpecifications.connectorPlaceholder')
                          }
                          disabled={loading}
                          accountIdentifier={accountId}
                          projectIdentifier={projectIdentifier}
                          orgIdentifier={orgIdentifier}
                          onChange={(value, scope) => {
                            setFieldValue('connectorRef', {
                              label: value.name || '',
                              value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${value.identifier}`,
                              scope: scope
                            })
                          }}
                        />
                        <Text margin={{ bottom: 'xsmall' }}>{getString('build.infraSpecifications.namespace')}</Text>
                        <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                          <FormInput.MultiTextInput label="" name={'namespace'} style={{ width: 300 }} />
                          {getMultiTypeFromValue(formValues.namespace) === MultiTypeInputType.RUNTIME && (
                            <ConfigureOptions
                              value={formValues.namespace as string}
                              type={
                                <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                  <Text>{getString('build.infraSpecifications.namespace')}</Text>
                                </Layout.Horizontal>
                              }
                              variableName={'namespace'}
                              showRequiredField={false}
                              showDefaultField={false}
                              showAdvanced={true}
                              onChange={value => setFieldValue('namespace', value)}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </FormikForm>
                </div>
              </>
            )}
          </Formik>
        </Layout.Vertical>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
