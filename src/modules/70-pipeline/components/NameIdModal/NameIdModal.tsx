import { Button, ButtonVariation, Color, Container, Formik, FormikForm, Layout, Text } from '@wings-software/uicore'
import * as Yup from 'yup'
import React from 'react'
import { cloneDeep, defaultTo, get } from 'lodash-es'
import {
  isDuplicateStageId,
  removeNodeFromPipeline
} from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilderUtil'
import { IdentifierSchema, NameSchema } from '@common/utils/Validation'
import { NameId } from '@common/components/NameIdDescriptionTags/NameIdDescriptionTags'
import { useStrings } from 'framework/strings'
import type { PipelineContextInterface } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { getIdentifierFromValue } from '@common/components/EntityReference/EntityReference'
import { stagesCollection } from '@pipeline/components/PipelineStudio/Stages/StagesCollection'
import { getTemplateNameWithLabel } from '@pipeline/utils/templateUtils'
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
      pipeline,
      pipeline: { stages = [] },
      selectionState: { selectedStageId = '' },
      templateTypes
    },
    setSelectedStageId,
    updateStage,
    getStageFromPipeline,
    updatePipeline
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

  const onCancel = () => {
    const cloned = cloneDeep(pipeline)
    const stageToDelete = getStageFromPipeline(selectedStageId, cloned)
    const isRemove = removeNodeFromPipeline(stageToDelete, cloned)
    if (isRemove) {
      updatePipeline(cloned)
    }
  }

  const getStageIcon = React.useCallback(
    () =>
      defaultTo(
        stagesCollection.getStageAttributes(
          defaultTo(
            stage?.stage?.type,
            get(templateTypes, getIdentifierFromValue(defaultTo(stage?.stage?.template?.templateRef, '')))
          ),
          getString
        )?.icon,
        'disable'
      ),
    [templateTypes, stage?.stage]
  )

  return (
    <Container className={css.container} padding={'xxxlarge'}>
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
          <Layout.Vertical spacing={'xxlarge'}>
            <Text
              icon={getStageIcon()}
              iconProps={{ size: 24, margin: { right: 'small' } }}
              font={{ size: 'medium', weight: 'bold' }}
              color={Color.GREY_800}
              className={css.addStageHeading}
            >
              {getString('pipelineSteps.build.create.aboutYourStage')}
            </Text>
            <NameId
              namePlaceholder={getString('stageNameLabel')}
              identifierProps={{
                inputLabel: getString('stageNameLabel')
              }}
              inputGroupProps={{ placeholder: getString('common.namePlaceholder') }}
            />
          </Layout.Vertical>
          <Text
            icon={'template-library'}
            margin={{ top: 'medium' }}
            font={{ size: 'small' }}
            iconProps={{ size: 12, margin: { right: 'xsmall' } }}
            color={Color.BLACK}
          >
            {`Using Template: ${getTemplateNameWithLabel(stage?.stage?.template)}`}
          </Text>
          <Layout.Horizontal spacing={'small'} margin={{ top: 'xxxlarge' }}>
            <Button type={'submit'} variation={ButtonVariation.PRIMARY} text={getString('next')} />
            <Button text={getString('cancel')} variation={ButtonVariation.TERTIARY} onClick={onCancel} />
          </Layout.Horizontal>
        </FormikForm>
      </Formik>
    </Container>
  )
}
