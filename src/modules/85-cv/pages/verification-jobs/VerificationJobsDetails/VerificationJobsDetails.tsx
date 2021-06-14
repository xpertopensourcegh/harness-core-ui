import React from 'react'
import { Container, Formik, FormikForm, Layout, Text, Color, FormInput, SelectOption } from '@wings-software/uicore'
import * as Yup from 'yup'
import { useParams, useHistory } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import { AddDescriptionAndTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import routes from '@common/RouteDefinitions'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { VerificationJobType } from '@cv/constants'
import {
  ActivitySource,
  DataSources,
  iconNameToActivityType
} from '@cv/pages/verification-jobs/VerificationJobForms/VerificationJobFields'
import { IdentifierSchema, NameSchema } from '@common/utils/Validation'
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
        formName="verifyJobDetails"
        validationSchema={Yup.object().shape({
          name: NameSchema(),
          identifier: IdentifierSchema(),
          type: Yup.string().required(getString('cv.verificationJobs.validation.type')),
          dataSource: Yup.string().nullable().required(getString('cv.verificationJobs.validation.dataSource')),
          activitySource: Yup.string().nullable().required(getString('cv.verificationJobs.validation.changeSource'))
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
                    <ActivitySource
                      onChange={val => {
                        const activitySourceType = iconNameToActivityType(val?.icon?.name)
                        if (activitySourceType === 'KUBERNETES' && formik.values.type !== VerificationJobType.HEALTH) {
                          formik.setFieldValue('type', '')
                        }
                        formik.setFieldValue('activitySourceType', activitySourceType)
                      }}
                      getOptions={(activitySourceOptions: SelectOption[]) => {
                        const selectedOption = activitySourceOptions?.find(
                          option => option.value === formik.values.activitySource
                        )
                        if (selectedOption) {
                          formik.setFieldValue('activitySourceType', iconNameToActivityType(selectedOption?.icon?.name))
                        }
                      }}
                    />
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
                              const currValues = formik.values
                              currValues.type = VerificationJobType.TEST
                              delete currValues.trafficSplit
                              formik.setValues({ ...currValues })
                            }}
                            cardLabel={getString('test')}
                            cardProps={{ disabled: formik.values.activitySourceType === 'KUBERNETES' }}
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
                                const currValues = formik.values
                                currValues.type = VerificationJobType.BLUE_GREEN
                                delete currValues.baseline
                                formik.setValues({ ...currValues })
                              }}
                              cardLabel={getString('blueGreen')}
                              cardProps={{ disabled: formik.values.activitySourceType === 'KUBERNETES' }}
                            />
                            <CVSelectionCard
                              isSelected={formik.values.type === VerificationJobType.CANARY}
                              isLarge={true}
                              iconProps={{
                                name: 'canary-outline',
                                size: 20
                              }}
                              onCardSelect={() => {
                                const currValues = formik.values
                                currValues.type = VerificationJobType.CANARY
                                delete currValues.baseline
                                formik.setValues({ ...currValues })
                              }}
                              cardLabel={getString('canary')}
                              cardProps={{ disabled: formik.values.activitySourceType === 'KUBERNETES' }}
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
                              const currValues = formik.values
                              currValues.type = VerificationJobType.HEALTH
                              delete currValues.baseline
                              delete currValues.sensitivity
                              delete currValues.trafficSplit
                              formik.setValues({ ...currValues })
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
                      `${routes.toCVAdminSetup({
                        projectIdentifier,
                        orgIdentifier,
                        accountId
                      })}?step=3`
                    )
                  }
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
