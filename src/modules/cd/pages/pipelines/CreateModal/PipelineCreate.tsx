import React from 'react'
import { loggerFor, ModuleName } from 'framework/exports'
import {
  Container,
  Heading,
  Formik,
  FormikForm,
  FormInput,
  Button,
  Collapse,
  IconName,
  Text
} from '@wings-software/uikit'
import * as Yup from 'yup'
import css from './PipelineCreate.module.scss'
import i18n from './PipelineCreate.i18n'
import type { CDPipelineDTO } from 'services/ng-temp'
import { DefaultNewPipelineId } from '../PipelineContext/PipelineActions'

const logger = loggerFor(ModuleName.CD)
const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse'
}

interface PipelineCreateProps {
  afterSave?: (values: CDPipelineDTO) => void
  initialValues?: CDPipelineDTO
  closeModal?: () => void
}

const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.description })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.tags })

export default function CreatePipelines({
  afterSave,
  initialValues = { identifier: '', displayName: '' },
  closeModal
}: PipelineCreateProps): JSX.Element {
  const identifier = initialValues?.identifier
  if (identifier === DefaultNewPipelineId) {
    initialValues.identifier = ''
  }
  const isEdit = (initialValues?.identifier?.length || '') > 0
  return (
    <Container padding="small" className={css.container}>
      {isEdit && <Button icon="cross" minimal className={css.closeModal} onClick={closeModal} />}
      <Heading className={css.heading} level={2}>
        {i18n.welcomeToPipelineStudio}
      </Heading>
      <Container padding="xsmall" className={css.layout}>
        <div>
          {!isEdit && <Text className={css.helpText}>{i18n.letsStart}</Text>}
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              displayName: Yup.string().trim().required(i18n.pipelineNameRequired)
            })}
            onSubmit={values => {
              logger.info(JSON.stringify(values))
              afterSave && afterSave(values)
            }}
          >
            <FormikForm>
              <div className={css.formInput}>
                <FormInput.InputWithIdentifier
                  inputLabel={i18n.pipelineNameLabel}
                  inputName="displayName"
                  inputGroupProps={{ placeholder: i18n.pipelineNamePlaceholder }}
                />
                <div className={css.collapseDiv}>
                  <Collapse {...descriptionCollapseProps}>
                    <FormInput.TextArea name="description" />
                  </Collapse>
                </div>
                <div className={css.collapseDiv}>
                  <Collapse {...tagCollapseProps}>
                    <FormInput.TagInput
                      name="tags"
                      items={['pipeline', 'canary']}
                      labelFor={name => (typeof name === 'string' ? name : '')}
                      itemFromNewTag={newTag => newTag}
                      tagInputProps={{
                        noInputBorder: true,
                        openOnKeyDown: false,
                        showAddTagButton: true,
                        showClearAllButton: true,
                        allowNewTag: true,
                        placeholder: i18n.enterTags,
                        getTagProps: (value, _index, _selectedItems, createdItems) => {
                          return createdItems.includes(value)
                            ? { intent: 'danger', minimal: true }
                            : { intent: 'primary', minimal: true }
                        }
                      }}
                    />
                  </Collapse>
                </div>
              </div>
              <Button intent="primary" className={css.startBtn} type="submit" text={isEdit ? i18n.save : i18n.start} />
            </FormikForm>
          </Formik>
        </div>
        <div className={css.helpImages}>Pipeline Concepts - TBD</div>
      </Container>
    </Container>
  )
}
