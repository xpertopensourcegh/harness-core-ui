import React from 'react'
import { Accordion, Layout, Button, FormInput, Formik, StepProps } from '@wings-software/uicore'

import { Form } from 'formik'
import * as Yup from 'yup'
import { useStrings } from 'framework/exports'

import type { ConnectorConfigDTO } from 'services/cd-ng'
import { Connectors } from '@connectors/constants'
import type { CommandFlags } from '../../ManifestInterface'
import HelmAdvancedStepSection from '../HelmAdvancedStepSection'

import css from '../ManifestWizardSteps.module.scss'
import helmcss from '../HelmWithGIT/HelmWithGIT.module.scss'

interface HelmWithHttpPropType {
  initialValues: any
  handleSubmit: (data: any) => void
}

const commandFlagOptions = [
  { label: 'Fetch', value: 'Fetch' },
  { label: 'Version ', value: 'Version' },
  { label: 'Template ', value: 'Template' }
]

const HelmWithHttp: React.FC<StepProps<ConnectorConfigDTO> & HelmWithHttpPropType> = ({
  prevStepData,
  initialValues,
  handleSubmit,
  previousStep
}) => {
  const { getString } = useStrings()

  const submitFormData = (formData: any): void => {
    const manifestObj = {
      manifest: {
        identifier: formData.identifier,
        type: 'HelmChart',
        spec: {
          store: {
            type: Connectors.HttpHelmRepo,
            spec: {
              connectorRef: formData?.connectorRef
            },
            chartName: formData?.chartName,
            chartVersion: formData?.chartVersion,
            helmVersion: formData?.helmVersion,
            skipResourceVersioning: formData?.skipResourceVersioning,

            commandFlags: formData?.commandFlags.map((commandFlag: CommandFlags) => ({
              commandType: commandFlag.commandType,
              flag: commandFlag.flag
            }))
          }
        }
      }
    }
    handleSubmit(manifestObj)
  }

  return (
    <Layout.Vertical spacing="xxlarge" padding="small" className={css.manifestStore}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          chartName: Yup.string().trim().required(getString('manifestType.http.chartNameRequired')),
          chartVersion: Yup.string().trim().required(getString('manifestType.http.chartVersionRequired')),
          helmVersion: Yup.string().trim().required(getString('manifestType.http.helmVersionRequired'))
        })}
        onSubmit={formData => {
          submitFormData({
            ...prevStepData,
            ...formData
          })
        }}
      >
        {(formik: { setFieldValue: (a: string, b: string) => void; values: any }) => (
          <Form>
            <div className={helmcss.helmGitForm}>
              <Layout.Vertical padding={{ left: 'xsmall', right: 'xsmall' }}>
                <FormInput.MultiTextInput
                  name="chartName"
                  label={getString('manifestType.http.chartName')}
                  placeholder={getString('manifestType.http.chartNamePlaceHolder')}
                  className={helmcss.halfWidth}
                />
                <FormInput.MultiTextInput
                  name="chartVersion"
                  label={getString('manifestType.http.chartVersion')}
                  placeholder={getString('manifestType.http.chartVersionPlaceHolder')}
                  className={helmcss.halfWidth}
                />
                <FormInput.MultiTextInput
                  name="helmVersion"
                  label={getString('helmVersion')}
                  placeholder={getString('manifestType.http.helmVersionPlaceHolder')}
                  className={helmcss.halfWidth}
                />
              </Layout.Vertical>
              <Accordion activeId={getString('advancedTitle')}>
                <Accordion.Panel
                  id={getString('advancedTitle')}
                  addDomId={true}
                  summary={getString('advancedTitle')}
                  details={<HelmAdvancedStepSection formik={formik} commandFlagOptions={commandFlagOptions} />}
                />
              </Accordion>
            </div>

            <Layout.Horizontal spacing="xxlarge" className={css.saveBtn}>
              <Button text={getString('back')} icon="chevron-left" onClick={() => previousStep?.(prevStepData)} />
              <Button intent="primary" type="submit" text={getString('submit')} rightIcon="chevron-right" />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default HelmWithHttp
