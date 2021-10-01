import React, { Dispatch, useState, SetStateAction } from 'react'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import {
  Formik,
  Layout,
  FormikForm,
  FormInput,
  Text,
  Color,
  Button,
  ButtonVariation,
  Container
} from '@wings-software/uicore'
import { noop } from 'lodash-es'
import { useStrings } from 'framework/strings'
import { NameIdDescriptionTags } from '@common/components/NameIdDescriptionTags/NameIdDescriptionTags'
import { DefaultNewTemplateId } from '@templates-library/components/TemplateStudio/TemplateContext/TemplateReducer'
import type { NGTemplateInfoConfig } from 'services/template-ng'
import { TemplatePreview } from '@templates-library/components/TemplatePreview/TemplatePreview'
import css from './TemplateConfigModal.module.scss'

export enum Fields {
  Name = 'name',
  Identifier = 'identifier',
  VersionLabel = 'versionLabel'
}

export interface ModalProps {
  title: string
  onSubmit: (values: NGTemplateInfoConfig) => void
  disabledFields?: Fields[]
}

export interface ConfigModalProps {
  initialValues: NGTemplateInfoConfig
  onClose: () => void
  modalProps?: ModalProps
}

interface BasicDetailsInterface extends ConfigModalProps {
  setPreviewValues: Dispatch<SetStateAction<NGTemplateInfoConfig>>
}

const BasicTemplateDetails = (props: BasicDetailsInterface) => {
  const { initialValues, setPreviewValues, onClose, modalProps } = props
  const { getString } = useStrings()
  const [isEdit, setIsEdit] = React.useState<boolean>()
  const currentTemplateType = initialValues.type
  const formName = `create${currentTemplateType}Template`
  const disabledFields = props.modalProps?.disabledFields || []

  React.useEffect(() => {
    const edit = initialValues.identifier !== DefaultNewTemplateId
    setIsEdit(edit)
  }, [initialValues])

  return (
    <Container width={'55%'} className={css.basicDetails} background={Color.FORM_BG} padding={'huge'}>
      <Text
        color={Color.GREY_800}
        font={{ weight: 'bold', size: 'medium' }}
        margin={{ bottom: 'xlarge', left: 0, right: 0 }}
      >
        {modalProps?.title || ''}
      </Text>
      <Formik<NGTemplateInfoConfig>
        initialValues={initialValues}
        onSubmit={modalProps?.onSubmit || noop}
        validate={values => setPreviewValues(values)}
        formName={formName}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('templatesLibrary.createNewModal.validation.name')),
          versionLabel: Yup.string().required(getString('templatesLibrary.createNewModal.validation.versionLabel'))
        })}
      >
        {(formik: FormikProps<NGTemplateInfoConfig>) => {
          return (
            <FormikForm>
              <Layout.Vertical spacing={'huge'}>
                <Container>
                  <Layout.Vertical>
                    <NameIdDescriptionTags
                      tooltipProps={{ dataTooltipId: formName }}
                      inputGroupProps={{
                        disabled: !!disabledFields?.includes(Fields.Name)
                      }}
                      formikProps={formik}
                      identifierProps={{
                        isIdentifierEditable: !disabledFields?.includes(Fields.Identifier)
                      }}
                      className={css.nameIdDescriptionTags}
                    />
                    <FormInput.Text
                      name="versionLabel"
                      placeholder={getString('templatesLibrary.createNewModal.versionPlaceholder')}
                      label={getString('templatesLibrary.createNewModal.versionLabel')}
                      disabled={!!disabledFields?.includes(Fields.VersionLabel)}
                    />
                  </Layout.Vertical>
                </Container>
                <Container>
                  <Layout.Horizontal spacing="small" flex={{ alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                    <Button
                      text={isEdit ? getString('save') : getString('start')}
                      type="submit"
                      variation={ButtonVariation.PRIMARY}
                    />
                    <Button text={getString('cancel')} variation={ButtonVariation.SECONDARY} onClick={onClose} />
                  </Layout.Horizontal>
                </Container>
              </Layout.Vertical>
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export const TemplateConfigModal = (props: ConfigModalProps) => {
  const { initialValues, ...rest } = props
  const [previewValues, setPreviewValues] = useState<NGTemplateInfoConfig>(props.initialValues)
  const [formInitialValues, setFormInitialValues] = React.useState<NGTemplateInfoConfig>(initialValues)

  React.useEffect(() => {
    if (initialValues.identifier === DefaultNewTemplateId) {
      setFormInitialValues({ ...initialValues, identifier: '', versionLabel: '' })
    }
  }, [initialValues])

  React.useEffect(() => {
    setPreviewValues(formInitialValues)
  }, [formInitialValues])

  return (
    <Layout.Horizontal>
      <BasicTemplateDetails {...rest} initialValues={formInitialValues} setPreviewValues={setPreviewValues} />
      <TemplatePreview previewValues={previewValues} />
      <Button
        className={css.closeIcon}
        iconProps={{ size: 24, color: Color.GREY_500 }}
        icon="cross"
        variation={ButtonVariation.ICON}
        onClick={props.onClose}
      />
    </Layout.Horizontal>
  )
}
