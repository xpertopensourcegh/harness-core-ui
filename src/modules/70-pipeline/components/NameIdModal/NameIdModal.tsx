import { Button, ButtonVariation, Color, Container, Formik, FormikForm, Layout, Text } from '@wings-software/uicore'
import * as Yup from 'yup'
import React from 'react'
import { isDuplicateStageId } from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilderUtil'
import { IdentifierSchema, NameSchema } from '@common/utils/Validation'
import { NameId } from '@common/components/NameIdDescriptionTags/NameIdDescriptionTags'
import { useStrings } from 'framework/strings'
import type { PipelineContextInterface } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import css from './NameIdModal.module.scss'

export interface NameIdModalProps {
  onClose: () => void
  context: PipelineContextInterface
}

export interface NameIdInterface {
  name: string
  identifier: string
}

export const NameIdModal = ({ onClose, context }: NameIdModalProps) => {
  const {
    state: {
      pipeline: { stages = [] },
      selectionState: { selectedStageId = '' }
    },
    setSelectedStageId,
    updateStage,
    getStageFromPipeline
  } = context
  const { stage } = getStageFromPipeline(selectedStageId)
  const { getString } = useStrings()

  const onSubmit = React.useCallback(
    (values: NameIdInterface) => {
      onClose()
      updateStage({ ...stage?.stage, ...values }, stage?.stage).then(_ => {
        setSelectedStageId(values.identifier)
      })
    },
    [onClose, updateStage, stage?.stage, setSelectedStageId]
  )

  return (
    <Container
      className={css.container}
      padding={{ top: 'xxxlarge', right: 'xxxlarge', bottom: 'large', left: 'xxxlarge' }}
    >
      <Formik<NameIdInterface>
        initialValues={{
          name: '',
          identifier: ''
        }}
        formName="templateStagePreOverview"
        onSubmit={onSubmit}
        validate={values => {
          const errors: { name?: string } = {}
          if (isDuplicateStageId(values.identifier || '', stages, false)) {
            errors.name = getString('validation.identifierDuplicate')
          }
          return errors
        }}
        validationSchema={Yup.object().shape({
          name: NameSchema({ requiredErrorMsg: getString('pipelineSteps.build.create.stageNameRequiredError') }),
          identifier: IdentifierSchema()
        })}
      >
        <FormikForm>
          <Text margin={{ bottom: 'medium' }} color={Color.GREY_800} font={{ weight: 'bold', size: 'medium' }}>
            {getString('pipeline.aboutYourStage.stageNamePlaceholder')}
          </Text>
          <NameId
            identifierProps={{
              inputLabel: getString('stageNameLabel')
            }}
            inputGroupProps={{ placeholder: getString('common.namePlaceholder') }}
          />
          <Layout.Horizontal spacing={'medium'} margin={{ top: 'xxlarge' }} flex={{ justifyContent: 'flex-end' }}>
            <Button type={'submit'} variation={ButtonVariation.PRIMARY} text={getString('done')} />
          </Layout.Horizontal>
        </FormikForm>
      </Formik>
    </Container>
  )
}
