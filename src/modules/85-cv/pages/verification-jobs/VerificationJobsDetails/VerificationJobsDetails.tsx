import React from 'react'
import { Container, Formik, FormikForm, Layout, Text, Color, FormInput } from '@wings-software/uicore'

import * as Yup from 'yup'
import { useParams, useHistory } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { AddDescriptionAndTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { StringUtils } from '@common/exports'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import routes from '@common/RouteDefinitions'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { VerificationJobType } from '@cv/constants'
import { ActivitySource, DataSources } from '@cv/pages/verification-jobs/VerificationJobForms/VerificationJobFields'
interface VerificationJobsDetailsProps {
  stepData: any
  onNext: (data: any) => void
}
const VerificationJobsDetails: React.FC<VerificationJobsDetailsProps> = props => {
  const { getString } = useStrings()
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()

  return (
    <Container style={{ position: 'relative', top: 50 }}>
      <Formik
        initialValues={{ ...props.stepData }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(getString('validation.nameRequired')),
          identifier: Yup.string().when('name', {
            is: val => val?.length,
            then: Yup.string()
              .trim()
              .required(getString('validation.identifierRequired'))
              .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, getString('validation.validIdRegex'))
              .notOneOf(StringUtils.illegalIdentifiers)
          }),
          type: Yup.string().required(getString('cv.verificationJobs.validation.type')),
          dataSource: Yup.string().required(getString('cv.verificationJobs.validation.dataSource'))
        })}
        onSubmit={data => {
          props.onNext(data)
        }}
        enableReinitialize={true}
      >
        {formik => {
          return (
            <FormikForm>
              <Layout.Vertical width="50%" style={{ margin: 'auto' }}>
                <Text font={{ size: 'medium', weight: 'bold' }} color={Color.GREY_800} margin={{ bottom: 'small' }}>
                  {getString('cv.verificationJobs.details.heading')}
                </Text>
                <Text margin={{ bottom: 'large' }}>{getString('cv.onboarding.verificationJobs.infoText')}</Text>
                <AddDescriptionAndTagsWithIdentifier
                  identifierProps={{ inputLabel: getString('cv.verificationJobs.details.name') }}
                />

                <Layout.Horizontal spacing="small" margin={{ bottom: 'large' }}>
                  <Container width="250px">
                    <ActivitySource />
                  </Container>
                  <Container width="250px">
                    <DataSources formik={formik} />
                  </Container>
                </Layout.Horizontal>

                <FormInput.CustomRender
                  label={<Text color={Color.GREY_800}>{getString('cv.verificationJobs.details.selectType')}</Text>}
                  name="type"
                  render={() => {
                    return (
                      <Layout.Horizontal spacing="xxxlarge">
                        <Container>
                          <Text margin={{ top: 'medium', bottom: 'medium' }} width="150px">
                            {getString('cv.verificationJobs.details.preDeploymentTests')}
                          </Text>
                          <CVSelectionCard
                            isSelected={formik.values.type === VerificationJobType.TEST}
                            isLarge={true}
                            iconProps={{
                              name: 'lab-test',
                              size: 20
                            }}
                            onCardSelect={() => {
                              formik.setFieldValue('type', VerificationJobType.TEST)
                            }}
                            cardLabel={getString('test')}
                            cardProps={{ disabled: formik.values.activitySource?.type === 'KUBERNETES' }}
                          />
                        </Container>
                        <Container>
                          <Text margin={{ top: 'medium', bottom: 'medium' }} width="200px">
                            {getString('cv.verificationJobs.details.productionDep')}
                          </Text>
                          <Layout.Horizontal>
                            <CVSelectionCard
                              isSelected={formik.values.type === VerificationJobType.BLUE_GREEN}
                              isLarge={true}
                              iconProps={{
                                name: 'bluegreen',
                                size: 20
                              }}
                              onCardSelect={() => {
                                formik.setFieldValue('type', VerificationJobType.BLUE_GREEN)
                              }}
                              cardLabel={getString('blueGreen')}
                              cardProps={{ disabled: !!formik.values.activitySource }}
                            />
                            <CVSelectionCard
                              isSelected={formik.values.type === VerificationJobType.CANARY}
                              isLarge={true}
                              iconProps={{
                                name: 'canary-outline',
                                size: 20
                              }}
                              onCardSelect={() => {
                                formik.setFieldValue('type', VerificationJobType.CANARY)
                              }}
                              cardLabel={getString('canary')}
                              cardProps={{ disabled: !!formik.values.activitySource }}
                            />
                          </Layout.Horizontal>
                        </Container>
                        <Container>
                          <Text margin={{ top: 'medium', bottom: 'medium' }} width="150px">
                            {getString('cv.verificationJobs.details.postDeploymentTests')}
                          </Text>
                          <CVSelectionCard
                            isSelected={formik.values.type === VerificationJobType.HEALTH}
                            isLarge={true}
                            iconProps={{
                              name: 'health',
                              size: 20,
                              color: 'red'
                            }}
                            onCardSelect={() => {
                              formik.setFieldValue('type', VerificationJobType.HEALTH)
                            }}
                            cardLabel={getString('health')}
                          />
                        </Container>
                      </Layout.Horizontal>
                    )
                  }}
                />

                <SubmitAndPreviousButtons
                  onPreviousClick={() =>
                    history.push(
                      routes.toCVAdminSetup({
                        projectIdentifier: projectIdentifier as string,
                        orgIdentifier: orgIdentifier as string,
                        accountId
                      })
                    )
                  }
                  onNextClick={() => {
                    formik.submitForm()
                  }}
                />
              </Layout.Vertical>
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default VerificationJobsDetails
