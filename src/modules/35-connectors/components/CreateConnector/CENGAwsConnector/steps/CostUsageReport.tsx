import React, { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
  Button,
  Container,
  Formik,
  FormikForm,
  Heading,
  Layout,
  StepProps,
  Icon,
  FormInput
} from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { AwsCurAttributes, CEAwsConnector } from 'services/cd-ng'
import { DialogExtensionContext } from '../DialogExtention'
import CostUsageReportExisting from './CostUsageReportExisting'
import type { CEAwsConnectorDTO } from './OverviewStep'
import TextInputWithToolTip from '../TextInputWithToolTip'
import css from '../CreateCeAwsConnector.module.scss'

const CostUsageStep: React.FC<StepProps<CEAwsConnectorDTO>> = props => {
  const { getString } = useStrings()

  const { prevStepData, nextStep, previousStep } = props
  const { triggerExtension, closeExtension } = useContext(DialogExtensionContext)
  const existingCurReports = prevStepData?.existingCurReports || []
  const [isExistingCostUsageReport, setIsExistingCostUsageReport] = useState<boolean>(
    (!prevStepData?.includeBilling || false) && (existingCurReports.length > 0 || false)
  )

  const handleSubmit = (formData: AwsCurAttributes) => {
    const newspec: CEAwsConnector = {
      crossAccountAccess: { crossAccountRoleArn: '' },
      ...prevStepData?.spec,
      curAttributes: formData
    }
    const payload = prevStepData
    if (payload) {
      payload.spec = newspec
      payload.includeBilling = !isExistingCostUsageReport
    }
    closeExtension()
    nextStep?.(payload)
  }

  const handlePrev = () => {
    closeExtension()
    previousStep?.({ ...(prevStepData as CEAwsConnectorDTO) })
  }

  const getValidationScheme = () => {
    if (isExistingCostUsageReport) return {}
    else
      return Yup.object().shape({
        reportName: Yup.string().required(getString('connectors.ceAws.cur.validation.reportRequired')),
        s3BucketName: Yup.string().required(getString('connectors.ceAws.cur.validation.bucketRequired'))
      })
  }

  useEffect(() => {
    if (!isExistingCostUsageReport) triggerExtension('CostUsageEx')
  }, [isExistingCostUsageReport])

  return (
    <Layout.Vertical className={css.stepContainer} spacing="medium">
      <Heading level={2} className={css.header}>
        {getString('connectors.ceAws.cur.heading')}
      </Heading>
      <div style={{ paddingBottom: 10 }}>{getString('connectors.ceAws.cur.subheading')}</div>

      {!isExistingCostUsageReport && (
        <div>
          <div style={{ display: 'flex' }}>
            <Icon name="info-sign" color="primary5" style={{ paddingRight: 5 }}></Icon>
            <div style={{ paddingRight: 10, color: '#0278D5' }}>
              {getString('connectors.ceAws.cur.followInstruction')}
            </div>
          </div>
          <Container style={{ paddingBottom: 10, paddingTop: 10 }}>
            <Layout.Vertical style={{ width: 500 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  className={css.launchTemplateBut}
                  text={getString('connectors.ceAws.cur.launchTemplate')}
                  rightIcon="chevron-right"
                  onClick={() => {
                    window.open('https://console.aws.amazon.com/console/home')
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>{getString('connectors.ceAws.cur.login')}</div>
            </Layout.Vertical>
          </Container>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <Formik<AwsCurAttributes>
          initialValues={{
            reportName: prevStepData?.spec?.curAttributes?.reportName || '',
            s3BucketName: prevStepData?.spec?.curAttributes?.s3BucketName || ''
          }}
          validationSchema={getValidationScheme()}
          onSubmit={formData => handleSubmit(formData)}
        >
          {() => (
            <FormikForm>
              {isExistingCostUsageReport && (
                <Layout.Vertical spacing="xlarge">
                  <CostUsageReportExisting existingCurReports={prevStepData?.existingCurReports || []} />
                  <div>
                    <Button
                      className={css.newCurReport}
                      text={getString('connectors.ceAws.cur.createNew')}
                      onClick={() => {
                        setIsExistingCostUsageReport(false)
                      }}
                    />
                  </div>
                </Layout.Vertical>
              )}

              {!isExistingCostUsageReport && (
                <div>
                  <FormInput.Text
                    name={'reportName'}
                    label={
                      <TextInputWithToolTip
                        label={getString('connectors.ceAws.cur.reportName')}
                        extentionName="CostUsageEx"
                      />
                    }
                    className={css.dataFields}
                  />
                  <FormInput.Text
                    name={'s3BucketName'}
                    label={
                      <TextInputWithToolTip
                        label={getString('connectors.ceAws.cur.bucketName')}
                        extentionName="CostUsageEx"
                      />
                    }
                    className={css.dataFields}
                  />
                </div>
              )}

              <Layout.Horizontal className={css.buttonPanel} spacing="small">
                <Button text={getString('previous')} icon="chevron-left" onClick={handlePrev}></Button>
                <Button type="submit" intent="primary" text={getString('continue')} rightIcon="chevron-right" />
              </Layout.Horizontal>
            </FormikForm>
          )}
        </Formik>
      </div>
    </Layout.Vertical>
  )
}

export default CostUsageStep
