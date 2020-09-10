import React from 'react'
import {
  IconName,
  Text,
  Color,
  Layout,
  Formik,
  FormikForm,
  FormInput,
  getMultiTypeFromValue,
  MultiTypeInputType,
  Icon
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { debounce, noop, isEmpty } from 'lodash-es'
import { Step, StepViewType, ConfigureOptions } from 'modules/common/exports'
import { K8SDirectInfrastructure, useGetConnector, ConnectorDTO } from 'services/cd-ng'
import {
  FormMultiTypeConnectorField,
  MultiTypeConnectorFieldProps
} from 'modules/common/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import {
  getScopeFromDTO,
  Scope,
  getIdentifierFromValue,
  getScopeFromValue
} from 'modules/common/components/EntityReference/EntityReference'
import { getIconByType } from 'modules/dx/exports'
import { StepType } from '../../PipelineStepInterface'
import i18n from './KubernetesInfraSpec.18n'

interface KubernetesInfraSpecEditableProps {
  initialValues: K8SDirectInfrastructure
  onUpdate?: (data: K8SDirectInfrastructure) => void
  stepViewType?: StepViewType
}

interface FormValues extends Omit<K8SDirectInfrastructure, 'connectorIdentifier'> {
  connectorIdentifier: MultiTypeConnectorFieldProps['selected'] | string
}

const KubernetesInfraSpecEditable: React.FC<KubernetesInfraSpecEditableProps> = ({
  initialValues,
  onUpdate
}): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const delayedOnUpdate = React.useRef(debounce(onUpdate || noop, 300)).current
  const connectorIdentifier = getIdentifierFromValue(initialValues.connectorIdentifier || '')
  const initialScope = getScopeFromValue(initialValues.connectorIdentifier || '')
  const { data: connector, loading, refetch } = useGetConnector({
    accountIdentifier: accountId,
    connectorIdentifier,
    queryParams: {
      orgIdentifier: initialScope === Scope.ORG || initialScope === Scope.PROJECT ? orgIdentifier : undefined,
      projectIdentifier: initialScope === Scope.PROJECT ? projectIdentifier : undefined
    },
    lazy: true,
    debounce: 300
  })

  React.useEffect(() => {
    if (
      !isEmpty(initialValues.connectorIdentifier) &&
      getMultiTypeFromValue(initialValues.connectorIdentifier || '') === MultiTypeInputType.FIXED
    ) {
      refetch()
    }
  }, [initialValues.connectorIdentifier])
  const values: FormValues = { ...initialValues, connectorIdentifier: undefined }
  if (connector?.data && getMultiTypeFromValue(initialValues.connectorIdentifier || '') === MultiTypeInputType.FIXED) {
    const scope = getScopeFromDTO<ConnectorDTO>(connector?.data)
    values.connectorIdentifier = {
      label: connector.data.name || '',
      value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector.data.identifier}`,
      scope: scope
    }
  } else {
    values.connectorIdentifier = initialValues.connectorIdentifier
  }

  return (
    <Layout.Vertical spacing="medium">
      <Text style={{ fontSize: 16, color: Color.BLACK, marginTop: 15 }}>{i18n.stepName}</Text>
      <Formik
        enableReinitialize
        initialValues={values}
        validate={value => {
          const data: K8SDirectInfrastructure = {
            namespace: value.namespace,
            releaseName: value.releaseName,
            connectorIdentifier: undefined
          }
          if (value.connectorIdentifier) {
            data.connectorIdentifier = (value.connectorIdentifier as any)?.value || value.connectorIdentifier
          }
          delayedOnUpdate(data)
        }}
        onSubmit={noop}
      >
        {formik => {
          return (
            <FormikForm>
              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                <FormMultiTypeConnectorField
                  name="connectorIdentifier"
                  label={i18n.k8ConnectorDropDownLabel}
                  placeholder={loading ? i18n.loading : i18n.k8ConnectorDropDownPlaceholder}
                  disabled={loading}
                  accountIdentifier={accountId}
                  projectIdentifier={projectIdentifier}
                  orgIdentifier={orgIdentifier}
                  width={400}
                />
                {getMultiTypeFromValue(formik.values.connectorIdentifier) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formik.values.connectorIdentifier as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Icon name={getIconByType('K8sCluster')}></Icon>
                        <Text>{i18n.kubernetesConnector}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="dockerConnector"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => {
                      formik.setFieldValue('connectorIdentifier', value)
                    }}
                  />
                )}
              </Layout.Horizontal>
              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                <FormInput.MultiTextInput
                  name="namespace"
                  style={{ width: 400 }}
                  label={i18n.nameSpaceLabel}
                  placeholder={i18n.nameSpacePlaceholder}
                />
                {getMultiTypeFromValue(formik.values.namespace) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formik.values.namespace as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Icon name={getIconByType('K8sCluster')}></Icon>
                        <Text>{i18n.kubernetesConnector}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="namespace"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => {
                      formik.setFieldValue('namespace', value)
                    }}
                  />
                )}
              </Layout.Horizontal>
              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                <FormInput.MultiTextInput
                  name="releaseName"
                  style={{ width: 400 }}
                  label={i18n.releaseName}
                  placeholder={i18n.releaseNamePlaceholder}
                />
                {getMultiTypeFromValue(formik.values.releaseName) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formik.values.releaseName as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Icon name={getIconByType('K8sCluster')}></Icon>
                        <Text>{i18n.kubernetesConnector}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="releaseName"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => {
                      formik.setFieldValue('releaseName', value)
                    }}
                  />
                )}
              </Layout.Horizontal>
            </FormikForm>
          )
        }}
      </Formik>
    </Layout.Vertical>
  )
}

export class KubernetesInfraSpec extends Step<K8SDirectInfrastructure> {
  protected type = StepType.KubernetesInfraSpec
  protected defaultValues: K8SDirectInfrastructure = {}

  protected stepIcon: IconName = 'service-kubernetes'
  protected stepName: string = i18n.stepName
  protected stepPaletteVisible = false
  renderStep(
    initialValues: K8SDirectInfrastructure,
    onUpdate?: ((data: K8SDirectInfrastructure) => void) | undefined,
    stepViewType?: StepViewType | undefined
  ): JSX.Element {
    return <KubernetesInfraSpecEditable initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
}
