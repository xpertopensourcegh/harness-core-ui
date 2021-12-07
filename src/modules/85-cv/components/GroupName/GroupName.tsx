import React, { Dispatch, SetStateAction } from 'react'
import {
  FormInput,
  SelectOption,
  Formik,
  useModalHook,
  FormikForm,
  Text,
  Container,
  Layout,
  Button
} from '@wings-software/uicore'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { StringKeys, useStrings, UseStringsReturn } from 'framework/strings'

export interface GroupNameProps {
  fieldName: string
  newGroupDialogTitle: StringKeys
  groupNames?: SelectOption[]
  onChange: (name: string, value: SelectOption) => void
  item?: SelectOption
  setGroupNames: Dispatch<SetStateAction<SelectOption[]>>
  disabled?: boolean
}

const DialogProps: IDialogProps = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: false,
  style: { width: 600, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }
}

type CreateGroupName = {
  name: string
}

export function validate(
  values: CreateGroupName,
  groupNames: SelectOption[],
  getString: UseStringsReturn['getString']
): { [key: string]: string } {
  const errors: { [key: string]: string } = {}
  if (!values.name?.trim().length) {
    errors.name = getString('cv.onboarding.selectProductScreen.validationText.name')
  } else if (groupNames.filter(name => name.value === values.name).length) {
    errors.name = getString('cv.monitoringSources.prometheus.validation.uniqueName', { existingName: values.name })
  }
  return errors
}

export default function GroupName(props: GroupNameProps): JSX.Element {
  const { fieldName, newGroupDialogTitle, groupNames = [], onChange, item, setGroupNames, disabled } = props
  const { getString } = useStrings()
  const addNewOption = { label: getString('cv.addNew'), value: '' }

  const [openModal, hideModal] = useModalHook(
    () => (
      <Dialog {...DialogProps} onClose={hideModal}>
        <Formik<CreateGroupName>
          initialValues={{ name: '' }}
          validate={values => validate(values, groupNames, getString)}
          formName="groupName"
          onSubmit={values => {
            const createdGroupName = { label: values.name, value: values.name }
            setGroupNames(oldNames => [...oldNames, createdGroupName])
            hideModal()
            onChange(fieldName, createdGroupName)
          }}
        >
          <FormikForm>
            <Container margin="medium">
              <Text font={{ size: 'medium', weight: 'bold' }} margin={{ bottom: 'large' }}>
                {getString(newGroupDialogTitle)}
              </Text>
              <FormInput.Text name="name" label={getString('cv.monitoringSources.prometheus.groupName')} />
              <Layout.Horizontal spacing="medium" margin={{ top: 'large', bottom: 'large' }}>
                <Button text={getString('submit')} type="submit" intent="primary" />
                <Button text={getString('cancel')} onClick={hideModal} />
              </Layout.Horizontal>
            </Container>
          </FormikForm>
        </Formik>
      </Dialog>
    ),
    [groupNames]
  )

  return (
    <FormInput.Select
      disabled={disabled}
      value={item}
      name={fieldName}
      label={getString('cv.monitoringSources.prometheus.groupName')}
      items={groupNames || []}
      onChange={selectedItem => {
        if (selectedItem?.label === addNewOption.label) {
          openModal()
        }
        onChange(fieldName, selectedItem)
      }}
    />
  )
}