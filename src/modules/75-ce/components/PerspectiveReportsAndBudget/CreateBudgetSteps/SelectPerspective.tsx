import React from 'react'
import {
  Color,
  Container,
  Text,
  FontVariation,
  FormikForm,
  FormInput,
  Formik,
  Layout,
  Button,
  FlexExpander,
  ButtonVariation,
  StepProps
} from '@wings-software/uicore'
import { get } from 'lodash-es'
import type { Budget } from 'services/ce'
import { useStrings } from 'framework/strings'
import { QlceView, useFetchPerspectiveListQuery } from 'services/ce/services'
import css from '../PerspectiveCreateBudget.module.scss'

interface PerspectiveForm {
  perspective: string
}
interface SelectPerspectiveProps {
  name: string
  perspective?: string
  isEditMode?: boolean
}

const SelectPerspective: (props: StepProps<Budget & PerspectiveForm> & SelectPerspectiveProps) => JSX.Element =
  props => {
    const { getString } = useStrings()
    const { nextStep, prevStepData, perspective, isEditMode } = props

    const [{ data: perspectiveData }] = useFetchPerspectiveListQuery()

    const perspectiveList = (perspectiveData?.perspectives?.customerViews || []) as QlceView[]

    const items = perspectiveList.map(name => ({
      label: name.name as string,
      value: name.id as string
    }))

    const handleSubmit = (data: PerspectiveForm) => {
      const nextStepData = {
        ...(prevStepData || {}),
        perspective: data.perspective
      }
      nextStep?.(nextStepData)
    }

    return (
      <Container>
        <Formik<PerspectiveForm>
          onSubmit={data => {
            handleSubmit(data)
          }}
          formName="selectPerspective"
          enableReinitialize={true}
          initialValues={{
            perspective: perspective || get(prevStepData, 'perspective') || ''
          }}
        >
          {formikProps => {
            return (
              <FormikForm>
                <Container className={css.selectPerspectiveContainer}>
                  <Text font={{ variation: FontVariation.H4 }}>
                    {getString('ce.perspectives.budgets.defineTarget.title')}
                  </Text>

                  <Container
                    margin={{
                      top: 'xxlarge'
                    }}
                  >
                    <Container padding="large" background={Color.PRIMARY_1}>
                      <Text>{getString('ce.perspectives.budgets.defineTarget.text')}</Text>
                    </Container>

                    <Layout.Horizontal
                      margin={{
                        top: 'xxlarge'
                      }}
                      spacing="large"
                    >
                      <Container width={280}>
                        <FormInput.Select
                          items={items}
                          name={'perspective'}
                          disabled={isEditMode}
                          label={getString('ce.perspectives.budgets.defineTarget.selectPerspective')}
                        />
                      </Container>
                      {!isEditMode ? (
                        <Button
                          margin={{
                            top: 'large',
                            left: 'xlarge'
                          }}
                          text={getString('ce.perspectives.budgets.defineTarget.createNewPerspective')}
                          icon="plus"
                          variation={ButtonVariation.SECONDARY}
                        />
                      ) : null}
                    </Layout.Horizontal>
                  </Container>
                  <FlexExpander />
                  <Container>
                    <Button
                      type="submit"
                      intent="primary"
                      rightIcon={'chevron-right'}
                      disabled={!formikProps.values.perspective}
                    >
                      {getString('continue')}
                    </Button>
                  </Container>
                </Container>
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
    )
  }

export default SelectPerspective
