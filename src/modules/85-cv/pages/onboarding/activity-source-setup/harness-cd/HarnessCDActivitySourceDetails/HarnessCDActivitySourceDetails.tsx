import React from 'react'
import { Container, Formik, FormikForm } from '@wings-software/uikit'
import * as Yup from 'yup'

import { useHistory, useParams } from 'react-router-dom'
import { routeCVAdminSetup } from 'navigation/cv/routes'
import { StringUtils } from '@common/exports'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { useStrings } from 'framework/exports'
import ActivitySourceDetails from '../../ActivitySourceDetails/ActivitySourceDetails'

export interface HarnessCDActivitySourceDetailsProps {
  initialValues?: any
  onSubmit?: (data: any) => void
}

const HarnessCDActivitySourceDetails: React.FC<HarnessCDActivitySourceDetailsProps> = props => {
  const { getString: globalGetString } = useStrings()
  const { getString } = useStrings('cv')
  const { initialValues } = props
  const history = useHistory()
  const { projectIdentifier, orgIdentifier } = useParams()
  return (
    <Container>
      <Formik
        initialValues={initialValues || {}}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(globalGetString('validation.name')),
          identifier: Yup.string().when('name', {
            is: val => val?.length,
            then: Yup.string()
              .trim()
              .required(globalGetString('validation.identifier'))
              .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, globalGetString('validation.validIdRegex'))
              .notOneOf(StringUtils.illegalIdentifiers)
          })
        })}
        onSubmit={values => {
          props.onSubmit?.(values)
        }}
      >
        {formik => {
          return (
            <FormikForm>
              <ActivitySourceDetails
                heading={getString('activitySources.harnessCD.select')}
                iconLabel={getString('activitySources.harnessCD.iconLabel')}
                iconName={'cd-main'}
              />
              <SubmitAndPreviousButtons
                onPreviousClick={() =>
                  history.push(
                    routeCVAdminSetup.url({
                      projectIdentifier: projectIdentifier as string,
                      orgIdentifier: orgIdentifier as string
                    })
                  )
                }
                onNextClick={() => {
                  formik.submitForm()
                }}
              />
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default HarnessCDActivitySourceDetails
