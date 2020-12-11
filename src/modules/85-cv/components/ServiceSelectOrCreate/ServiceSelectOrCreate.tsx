import React, { useMemo } from 'react'
import { Formik } from 'formik'
import { Container, Text, Select, SelectOption, useModalHook, FormikForm, Layout, Button } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { AddDescriptionAndTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useCreateService, ServiceResponseDTO } from 'services/cd-ng'
import { useStrings } from 'framework/exports'

interface ServiceSelectOrCreateProps {
  item?: SelectOption
  options: Array<SelectOption>
  onSelect(value: SelectOption): void
  className?: string
  onNewCreated(value: ServiceResponseDTO): void
}

const ADD_NEW_VALUE = '@@add_new'

export function generateOptions(response?: ServiceResponseDTO[]): SelectOption[] {
  return response
    ? (response
        .filter(entity => entity && entity.identifier && entity.name)
        .map(entity => ({ value: entity.identifier, label: entity.name })) as SelectOption[])
    : []
}

export const ServiceSelectOrCreate: React.FC<ServiceSelectOrCreateProps> = props => {
  const { getString } = useStrings()
  const { accountId, projectIdentifier, orgIdentifier } = useParams<AccountPathProps & ProjectPathProps>()
  const { mutate: createService, loading } = useCreateService({ queryParams: { accountId } })

  const selectOptions = useMemo(
    () => [
      {
        label: '+ Add New',
        value: ADD_NEW_VALUE
      },
      ...props.options
    ],
    [props.options]
  )

  const onSubmit = async (values: any): Promise<void> => {
    if (loading) {
      return
    }
    const res = await createService({
      name: values.name,
      identifier: values.identifier,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    })
    if (res.status === 'SUCCESS') {
      props.onNewCreated(res.data!)
    }
  }

  const [openModal, hideModal] = useModalHook(() => (
    <Dialog
      isOpen
      usePortal
      autoFocus
      canEscapeKeyClose
      canOutsideClickClose
      enforceFocus
      onClose={hideModal}
      style={{ width: 600, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }}
    >
      <Formik
        initialValues={{
          name: '',
          description: '',
          identifier: '',
          tags: []
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(),
          identifier: Yup.string().required()
        })}
        onSubmit={onSubmit}
      >
        {() => (
          <FormikForm>
            <Container margin="medium">
              <Text font={{ size: 'medium', weight: 'bold' }} margin={{ bottom: 'large' }}>
                {getString('cv.newService')}
              </Text>
              <AddDescriptionAndTagsWithIdentifier identifierProps={{ inputLabel: 'Name' }} />

              <Layout.Horizontal spacing="medium" margin={{ top: 'large', bottom: 'large' }}>
                <Button text="Submit" type="submit" intent="primary" />
                <Button text="Cancel" onClick={hideModal} />
              </Layout.Horizontal>
            </Container>
          </FormikForm>
        )}
      </Formik>
    </Dialog>
  ))

  const onSelectChange = (val: SelectOption) => {
    if (val.value === ADD_NEW_VALUE) {
      openModal()
    } else {
      props.onSelect(val)
    }
  }

  return (
    <Select
      value={props.item}
      className={props.className}
      items={selectOptions}
      inputProps={{ placeholder: getString('cv.selectCreateService') }}
      onChange={onSelectChange}
    />
  )
}
