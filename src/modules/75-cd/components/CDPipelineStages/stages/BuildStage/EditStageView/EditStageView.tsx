import React from 'react'
import { Text, Container, Formik, FormikForm, FormInput, Collapse, Button, Switch } from '@wings-software/uikit'
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
  skipGitClone?: boolean
  connectorRef?: ConnectorReferenceFieldProps['selected']
  repositoryName?: string
}

interface CodeBase2 {
  connectorRef: string
  repositoryName: string
}

export const EditStageView: React.FC<EditStageView> = ({ data, onSubmit, onChange }): JSX.Element => {
  const { getString } = useStrings('pipeline-stages')

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
    name: data?.stage.name
  }

  if (data?.stage.description) initialValues.description = data?.stage.description
  if (data?.stage.spec?.skipGitClone) initialValues.skipGitClone = data?.stage.spec?.skipGitClone
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
      scope: scope
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
        name: Yup.string().required(getString('build.create.stageNameRequiredError')),
        ...(!ciCodebase2 &&
          !values.skipGitClone && {
            connectorRef: Yup.mixed().required(getString('build.create.connectorRequiredError')),
            repositoryName: Yup.string()
              .matches(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                getString('build.create.repositoryUrlWrongUrlError')
              )
              .required(getString('build.create.repositoryUrlRequiredError'))
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
      if (!values.skipGitClone && values.connectorRef && values.repositoryName) {
        pipeline.ciCodebase = ({
          connectorRef: values.connectorRef.value,
          repositoryName: values.repositoryName
        } as unknown) as CodeBase
        updatePipeline(pipeline)
      }

      data.stage.identifier = values.identifier
      data.stage.name = values.name

      if (values.description) data.stage.description = values.description
      if (values.skipGitClone) data.stage.spec.skipGitClone = values.skipGitClone

      onSubmit?.(data, values.identifier)
    }
  }

  const collapseProps = {
    collapsedIcon: 'small-plus' as IconName,
    expandedIcon: 'small-minus' as IconName,
    isOpen: false,
    isRemovable: false,
    className: 'collapse',
    heading: getString('build.create.description')
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
                {getString('build.create.aboutYourStage')}
              </Text>
              <FormInput.InputWithIdentifier inputLabel={getString('build.create.stageNameLabel')} />
              <div className={css.collapseDiv}>
                <Collapse
                  {...collapseProps}
                  isOpen={(formikProps.values.description && formikProps.values.description?.length > 0) || false}
                >
                  <FormInput.TextArea name="description" />
                </Collapse>
              </div>
              <Switch
                label={getString('build.create.skipGitCloneLabel')}
                onChange={e => formikProps.setFieldValue('skipGitClone', e.currentTarget.checked)}
              />
              <Text font="xsmall" padding={{ left: 'large' }}>
                <Button
                  icon="info"
                  minimal
                  tooltip={getString('build.create.skipGitCloneHelperTextDetails')}
                  iconProps={{ size: 8 }}
                />
                {getString('build.create.skipGitCloneHelperText')}
              </Text>
              {/* We don't need to configure CI Codebase if it is already configured or we are skipping Git Clone step */}
              {!ciCodebase && !formikProps.values.skipGitClone && (
                <div className={css.configureCodebase}>
                  <Text
                    font={{ size: 'medium', weight: 'semi-bold' }}
                    icon="cog"
                    iconProps={{ size: 18 }}
                    margin={{ bottom: 'medium' }}
                  >
                    {getString('build.create.configureCodebase')}
                  </Text>
                  <Text margin={{ bottom: 'medium' }}>{getString('build.create.configureCodebaseHelperText')}</Text>
                  <ConnectorReferenceField
                    name="connectorRef"
                    type="Git"
                    selected={formikProps.values.connectorRef}
                    label={getString('build.create.connectorLabel')}
                    placeholder={
                      loading ? getString('build.create.loading') : getString('build.create.connectorPlaceholder')
                    }
                    disabled={loading}
                    accountIdentifier={accountId}
                    projectIdentifier={projectIdentifier}
                    orgIdentifier={orgIdentifier}
                    onChange={(value, scope) => {
                      formikProps.setFieldValue('connectorRef', {
                        label: value.name || '',
                        value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${value.identifier}`,
                        scope: scope
                      })
                    }}
                  />
                  <FormInput.Text
                    label={getString('build.create.repositoryUrlLabel')}
                    name="repositoryName"
                    style={{ flexGrow: 1 }}
                  />
                </div>
              )}
              <Button
                type="submit"
                intent="primary"
                text={getString('build.create.setupStage')}
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
