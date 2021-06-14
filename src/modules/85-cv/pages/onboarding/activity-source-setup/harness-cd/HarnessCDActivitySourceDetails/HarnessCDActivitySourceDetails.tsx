import React from 'react'
import { Container, Formik, FormikForm } from '@wings-software/uicore'
import * as Yup from 'yup'
import { useHistory, useParams } from 'react-router-dom'
import SyncStepDataValues from '@cv/utils/SyncStepDataValues'
import routes from '@common/RouteDefinitions'
import { IdentifierSchema, NameSchema } from '@common/utils/Validation'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import ActivitySourceDetails from '../../ActivitySourceDetails/ActivitySourceDetails'

export interface HarnessCDActivitySourceDetailsProps {
  initialValues?: any
  onSubmit?: (data: any) => void
}

const HarnessCDActivitySourceDetails: React.FC<HarnessCDActivitySourceDetailsProps> = props => {
  const { getString } = useStrings()
  const { initialValues } = props
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId, activitySourceId } = useParams<
    ProjectPathProps & { activitySourceId: string }
  >()
  return (
    <Container style={{ position: 'relative', top: 80 }}>
      <Formik
        initialValues={initialValues}
        formName="cdActivity"
        validationSchema={Yup.object().shape({
          name: NameSchema(),
          identifier: IdentifierSchema()
        })}
        onSubmit={values => {
          props.onSubmit?.(values)
        }}
      >
        {formik => {
          return (
            <FormikForm>
              <ActivitySourceDetails
                heading={getString('cv.activitySources.harnessCD.select')}
                iconLabel={getString('cv.activitySources.harnessCD.iconLabel')}
                iconName={'harness'}
                isEditMode={!!activitySourceId}
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
              <SyncStepDataValues values={formik.values} listenToValues={initialValues} onUpdate={formik.setValues} />
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default HarnessCDActivitySourceDetails
