import React, { FC, useMemo, useRef } from 'react'
import {
  Button,
  ButtonVariation,
  Container,
  Dialog,
  Formik,
  FormikForm,
  FormInput,
  Layout,
  MultiSelectOption,
  SelectOption
} from '@wings-software/uicore'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { useStrings } from 'framework/strings'
import type { Target, Variation } from 'services/cf'

interface IncludeTargetVariationDialogFormValues {
  variation: Variation['identifier']
  targets: SelectOption[]
}

export interface IncludeTargetVariationDialogProps {
  isOpen?: boolean
  closeDialog: () => void
  selectedTargets?: Target[]
  selectedVariation?: Variation
  targets: Target[]
  variations: Variation[]
  onChange: (selectedTargets: Target[], selectedVariation: Variation) => void
}

const IncludeTargetVariationDialog: FC<IncludeTargetVariationDialogProps> = ({
  isOpen = false,
  closeDialog,
  selectedTargets = [],
  selectedVariation,
  targets,
  variations,
  onChange
}) => {
  const { getString } = useStrings()
  const formRef = useRef<FormikProps<IncludeTargetVariationDialogFormValues>>()

  const initialTargets = useMemo<IncludeTargetVariationDialogFormValues['targets']>(
    () => selectedTargets.map(({ name, identifier }) => ({ label: name, value: identifier })),
    [selectedTargets]
  )

  const targetItems = useMemo<MultiSelectOption[]>(
    () => targets.map<MultiSelectOption>(({ name, identifier }) => ({ label: name, value: identifier })),
    [targets]
  )

  const variationItems = useMemo<SelectOption[]>(
    () => variations.map<SelectOption>(({ name, identifier }) => ({ label: name || identifier, value: identifier })),
    [variations]
  )

  const handleSubmit = (values: IncludeTargetVariationDialogFormValues): void => {
    onChange(
      targets.filter(({ identifier }) => !!values.targets.find(({ value }) => value === identifier)),
      variations.find(({ identifier }) => values.variation === identifier) as Variation
    )
    closeDialog()
  }

  const handleSubmitButtonClicked = (): void => {
    formRef.current?.submitForm()
  }

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      title={getString('cf.pipeline.flagConfiguration.addEditVariationToSpecificTargets')}
      onClose={closeDialog}
      style={{ paddingBottom: 'var(--spacing-13)' }} // 😭 can't do this via a class
      footer={
        <Layout.Horizontal spacing="small">
          <Button
            variation={ButtonVariation.PRIMARY}
            text={getString('done')}
            onClick={handleSubmitButtonClicked}
            disabled={!!formRef.current?.isValid}
          />
          <Button variation={ButtonVariation.SECONDARY} text={getString('cancel')} onClick={closeDialog} />
        </Layout.Horizontal>
      }
    >
      <Formik<IncludeTargetVariationDialogFormValues>
        formName="IncludeTargetVariation"
        initialValues={{ targets: initialTargets, variation: selectedVariation?.identifier || '' }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={Yup.object().shape({
          targets: Yup.array()
            .of(
              Yup.object().shape({
                value: Yup.string().oneOf(targetItems.map(({ value }) => value as string)),
                label: Yup.string()
              })
            )
            .required(),
          variation: Yup.string()
            .oneOf(variations.map(({ identifier }) => identifier))
            .required()
        })}
      >
        {formikProps => {
          formRef.current = formikProps

          return (
            <FormikForm>
              <Container height="250px">
                <FormInput.MultiSelect
                  placeholder={getString('cf.pipeline.flagConfiguration.enterTarget')}
                  name="targets"
                  items={targetItems}
                  multiSelectProps={{ allowCreatingNewItems: false }}
                  label={getString('cf.shared.targets')}
                />
                <FormInput.Select
                  placeholder={getString('cf.pipeline.flagConfiguration.selectVariation')}
                  usePortal={true}
                  name="variation"
                  items={variationItems}
                  label={getString('cf.pipeline.flagConfiguration.variationServed')}
                />
              </Container>
            </FormikForm>
          )
        }}
      </Formik>
    </Dialog>
  )
}

export default IncludeTargetVariationDialog
