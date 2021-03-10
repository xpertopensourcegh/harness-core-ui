import React from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { Layout, Button, Text, Formik, Color, StepProps, Card, Icon } from '@wings-software/uicore'
import { Form } from 'formik'
import * as Yup from 'yup'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'

import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { useStrings } from 'framework/exports'
import type { ConnectorConfigDTO, ConnectorInfoDTO } from 'services/cd-ng'
import { getConnectorTitleIdByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { getIconByType } from '@connectors/exports'
import type { ManifestStepInitData } from '../ManifestInterface'
import css from './ManifestWizardSteps.module.scss'

interface ManifestStorePropType {
  stepName: string
  newConnectorLabel: string
  manifestStoreTypes: Array<ConnectorInfoDTO['type']>
  initialValues: ManifestStepInitData
  handleConnectorViewChange: () => void
  handleStoreChange: (store: ConnectorInfoDTO['type']) => void
}

const ManifestStore: React.FC<StepProps<ConnectorConfigDTO> & ManifestStorePropType> = ({
  handleConnectorViewChange,
  handleStoreChange,
  stepName,
  manifestStoreTypes,
  initialValues,
  previousStep,
  prevStepData,
  nextStep,
  newConnectorLabel
}) => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { expressions } = useVariablesExpression()
  const { getString } = useStrings()

  const selectedManifest = initialValues.store

  const submitFirstStep = async (formData: any): Promise<void> => {
    nextStep?.({ ...formData })
  }
  const handleOptionSelection = (selected: ConnectorInfoDTO['type']): void => {
    if (selected === selectedManifest) {
      handleStoreChange('' as ConnectorInfoDTO['type'])
    } else {
      handleStoreChange(selected)
    }
  }

  return (
    <Layout.Vertical spacing="xxlarge" padding="small" className={css.manifestStore}>
      <Text font="large" color={Color.GREY_800}>
        {stepName}
      </Text>

      <Layout.Horizontal spacing="xxlarge">
        {manifestStoreTypes.map(store => (
          <div key={store} className={css.squareCardContainer}>
            <Card
              disabled={selectedManifest !== '' && selectedManifest !== store}
              interactive={true}
              selected={store === selectedManifest}
              cornerSelected={store === selectedManifest}
              className={cx({ [css.disabled]: selectedManifest !== '' && selectedManifest !== store }, css.squareCard)}
              onClick={() => {
                if (selectedManifest === '' || selectedManifest === store) {
                  handleOptionSelection(store)
                }
              }}
            >
              <Icon name={getIconByType(store)} size={26} />
            </Card>
            <Text
              style={{
                fontSize: '12px',
                color: selectedManifest !== '' && selectedManifest !== store ? 'var(--grey-350)' : 'var(--grey-900)',
                textAlign: 'center'
              }}
            >
              {getString(getConnectorTitleIdByType(store))}
            </Text>
          </div>
        ))}
      </Layout.Horizontal>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          connectorRef: Yup.string().trim().required(getString('validation.gitServerRequired'))
        })}
        onSubmit={formData => {
          submitFirstStep({ ...formData, store: selectedManifest })
        }}
      >
        {() => (
          <Form>
            <div className={css.formContainerStepOne}>
              {selectedManifest !== '' ? (
                <div className={css.connectorContainer}>
                  <FormMultiTypeConnectorField
                    name="connectorRef"
                    disabled={selectedManifest === ''}
                    label={<Text style={{ marginBottom: '5px' }}>{getString('manifestType.selectManifestStore')}</Text>}
                    placeholder={getString('selectServer')}
                    accountIdentifier={accountId}
                    projectIdentifier={projectIdentifier}
                    orgIdentifier={orgIdentifier}
                    width={400}
                    multiTypeProps={{ expressions }}
                    isNewConnectorLabelVisible={false}
                    type={selectedManifest as ConnectorInfoDTO['type']}
                    enableConfigureOptions={false}
                  />
                  <Button
                    intent="primary"
                    minimal
                    text={newConnectorLabel}
                    className={css.addNewManifest}
                    icon="plus"
                    onClick={() => {
                      handleConnectorViewChange()
                      nextStep?.({ ...prevStepData, store: selectedManifest })
                    }}
                  />
                </div>
              ) : null}
            </div>

            <Layout.Horizontal spacing="xxlarge" className={css.saveBtn}>
              <Button text={getString('back')} icon="chevron-left" onClick={() => previousStep?.(prevStepData)} />
              <Button
                intent="primary"
                type="submit"
                text={getString('continue')}
                rightIcon="chevron-right"
                disabled={!selectedManifest}
              />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default ManifestStore
