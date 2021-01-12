import React from 'react'
import {
  Text,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Collapse,
  Button,
  Switch,
  TextInput
} from '@wings-software/uicore'
import * as Yup from 'yup'
import type { IconName } from '@blueprintjs/core'
import { isEmpty } from 'lodash-es'
import { useParams } from 'react-router-dom'
import type { CodeBase, StageElementWrapper } from 'services/cd-ng'
import { ConnectorInfoDTO, useGetConnector } from 'services/cd-ng'
import { PipelineContext } from '@pipeline/exports'
import { useStrings } from 'framework/exports'
import {
  ConnectorReferenceField,
  ConnectorReferenceFieldProps
} from '@connectors/components/ConnectorReferenceField/ConnectorReferenceField'
import {
  getIdentifierFromValue,
  getScopeFromDTO,
  getScopeFromValue
} from '@common/components/EntityReference/EntityReference'
import { Scope } from '@common/interfaces/SecretsInterface'
import css from './EditStageView.module.scss'

export interface EditStageView {
  data?: StageElementWrapper
  onSubmit?: (values: StageElementWrapper, identifier: string) => void
  onChange?: (values: StageElementWrapper) => void
}

interface Values {
  identifier: string
  name: string
  description?: string
  cloneCodebase?: boolean
  connectorRef?: ConnectorReferenceFieldProps['selected']
  repositoryName?: string
}

interface CodeBase2 {
  connectorRef: string
  repositoryName: string
}

export const EditStageView: React.FC<EditStageView> = ({ data, onSubmit, onChange }): JSX.Element => {
  const { getString } = useStrings()
  const [connectionType, setConnectionType] = React.useState('')
  const [connectorUrl, setConnectorUrl] = React.useState('')

  const {
    state: {
      pipeline,
      pipeline: { ciCodebase }
    },
    updatePipeline
  } = React.useContext(PipelineContext)

  const ciCodebase2: CodeBase2 | undefined = (ciCodebase as unknown) as CodeBase2 | undefined

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const initialValues: Values = {
    identifier: data?.stage.identifier,
    name: data?.stage.name,
    cloneCodebase: data?.stage.spec?.cloneCodebase || true
  }

  if (data?.stage.description) initialValues.description = data?.stage.description
  if (data?.stage.spec?.cloneCodebase) initialValues.cloneCodebase = data?.stage.spec?.cloneCodebase
  if (ciCodebase2?.repositoryName) initialValues.repositoryName = ciCodebase2?.repositoryName

  const connectorId = getIdentifierFromValue((ciCodebase2?.connectorRef as string) || '')
  const initialScope = getScopeFromValue((ciCodebase2?.connectorRef as string) || '')

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

  if (connector?.data?.connector) {
    const scope = getScopeFromDTO<ConnectorInfoDTO>(connector?.data?.connector)
    initialValues.connectorRef = {
      label: connector?.data?.connector.name || '',
      value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector?.data?.connector.identifier}`,
      scope: scope,
      live: connector?.data?.status?.status === 'SUCCESS',
      connector: connector?.data?.connector
    }
  }

  React.useEffect(() => {
    if (!isEmpty(ciCodebase2?.connectorRef)) {
      refetch()
    }
  }, [ciCodebase2?.connectorRef])

  const validationSchema = () =>
    Yup.lazy((values: Values): any =>
      Yup.object().shape({
        name: Yup.string()
          .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, getString('pipelineSteps.build.create.stageNameRegExpError'))
          .required(getString('pipelineSteps.build.create.stageNameRequiredError')),
        description: Yup.string().matches(
          /^(?![0-9])[0-9a-zA-Z_$]*$/,
          getString('pipelineSteps.build.create.stageDescriptionRegExpError')
        ),
        ...(!ciCodebase2 &&
          values.cloneCodebase && {
            connectorRef: Yup.mixed().required(getString('pipelineSteps.build.create.connectorRequiredError')),
            ...(connectionType === 'Account' && {
              repositoryName: Yup.string().required(getString('pipelineSteps.build.create.repositoryUrlRequiredError'))
            })
          })
      })
    )

  const handleValidate = (values: Values): void => {
    if (data) {
      onChange?.(values)
    }
  }

  const handleSubmit = (values: Values): void => {
    if (data) {
      // TODO: Add Codebase verification
      if (values.cloneCodebase && values.connectorRef) {
        pipeline.ciCodebase = ({
          connectorRef: values.connectorRef.value,
          ...(values.repositoryName && { repositoryName: values.repositoryName })
        } as unknown) as CodeBase
        updatePipeline(pipeline)
      }

      data.stage.identifier = values.identifier
      data.stage.name = values.name

      if (values.description) data.stage.description = values.description
      if (values.cloneCodebase) data.stage.spec.cloneCodebase = values.cloneCodebase

      onSubmit?.(data, values.identifier)
    }
  }

  const collapseProps = {
    collapsedIcon: 'small-plus' as IconName,
    expandedIcon: 'small-minus' as IconName,
    isOpen: false,
    isRemovable: false,
    className: 'collapse',
    heading: getString('description')
  }

  return (
    <div className={css.stageCreate}>
      <Container padding="medium">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          validate={handleValidate}
          onSubmit={handleSubmit}
        >
          {formikProps => (
            <FormikForm>
              <Text
                font={{ size: 'medium', weight: 'semi-bold' }}
                icon="pipeline-build"
                iconProps={{ size: 16 }}
                margin={{ bottom: 'medium' }}
              >
                {getString('pipelineSteps.build.create.aboutYourStage')}
              </Text>
              <FormInput.InputWithIdentifier inputLabel={getString('stageNameLabel')} />
              <div className={css.collapseDiv}>
                <Collapse
                  {...collapseProps}
                  isOpen={(formikProps.values.description && formikProps.values.description?.length > 0) || false}
                >
                  <FormInput.TextArea name="description" />
                </Collapse>
              </div>
              <Switch
                label={getString('cloneCodebaseLabel')}
                onChange={e => formikProps.setFieldValue('cloneCodebase', e.currentTarget.checked)}
                defaultChecked={formikProps.values.cloneCodebase}
              />
              <div className={css.cloneCodebaseInfo}>
                <Button icon="info" minimal tooltip={getString('details')} iconProps={{ size: 8 }} />
                <Text font="xsmall">{getString('pipelineSteps.build.create.cloneCodebaseHelperText')}</Text>
              </div>
              {/* We don't need to configure CI Codebase if it is already configured or we are skipping Clone Codebase step */}
              {!ciCodebase && formikProps.values.cloneCodebase && (
                <div className={css.configureCodebase}>
                  <Text
                    font={{ size: 'medium', weight: 'semi-bold' }}
                    icon="cog"
                    iconProps={{ size: 18 }}
                    margin={{ bottom: 'medium' }}
                  >
                    {getString('pipelineSteps.build.create.configureCodebase')}
                  </Text>
                  <Text margin={{ bottom: 'medium' }}>
                    {getString('pipelineSteps.build.create.configureCodebaseHelperText')}
                  </Text>
                  <ConnectorReferenceField
                    error={
                      formikProps.submitCount && formikProps.errors.connectorRef
                        ? formikProps.errors.connectorRef
                        : undefined
                    }
                    name="connectorRef"
                    type="Git"
                    selected={formikProps.values.connectorRef}
                    label={getString('pipelineSteps.build.create.connectorLabel')}
                    placeholder={loading ? getString('loading') : getString('select')}
                    disabled={loading}
                    accountIdentifier={accountId}
                    projectIdentifier={projectIdentifier}
                    orgIdentifier={orgIdentifier}
                    onChange={(value, scope) => {
                      setConnectionType(value.spec.connectionType)
                      setConnectorUrl(value.spec.url)

                      formikProps.setFieldValue('connectorRef', {
                        label: value.name || '',
                        value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${value.identifier}`,
                        scope: scope
                      })
                    }}
                  />
                  {connectionType === 'Repo' ? (
                    <>
                      <Text margin={{ bottom: 'xsmall' }}>{getString('repositoryUrlLabel')}</Text>
                      <TextInput name="repositoryName" value={connectorUrl} style={{ flexGrow: 1 }} disabled />
                    </>
                  ) : (
                    <FormInput.Text
                      label={getString('repositoryUrlLabel')}
                      name="repositoryName"
                      inputGroup={{
                        leftElement: (
                          <div className={css.predefinedValue}>
                            {connectorUrl[connectorUrl.length - 1] === '/' ? connectorUrl : connectorUrl + '/'}
                          </div>
                        )
                      }}
                      style={{ flexGrow: 1 }}
                    />
                  )}
                </div>
              )}
              <Button
                type="submit"
                intent="primary"
                text={getString('pipelineSteps.build.create.setupStage')}
                onClick={() => formikProps.submitForm()}
                margin={{ top: 'small' }}
              />
            </FormikForm>
          )}
        </Formik>
      </Container>
    </div>
  )
}
