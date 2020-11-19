import React, { useMemo } from 'react'
import { Formik } from 'formik'
import { Container, Text, Select, SelectOption, useModalHook, FormikForm, Layout, Button } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import * as Yup from 'yup'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { AddDescriptionAndTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { useRouteParams } from 'framework/exports'
import { useCreateEnvironment } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { EnvironmentTypes } from '../../utils'

interface EnvironmentSelectProps {
  value?: string
  options: Array<SelectOption>
  onSelect(value: string): void
  onNewCreated(value: object): void
}

const ADD_NEW_VALUE = '@@add_new'

export default function EnvironmentSelect({ value, options, onSelect, onNewCreated }: EnvironmentSelectProps) {
  const { getString } = useStrings('cv')
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = useRouteParams()
  const { mutate: createEnvironment, loading } = useCreateEnvironment({ queryParams: { accountId } })
  const selectOptions = useMemo(
    () => [
      {
        label: '+ Add New',
        value: ADD_NEW_VALUE
      },
      ...options
    ],
    [options]
  )
  const item = useMemo(() => selectOptions.find(o => o.value === value), [selectOptions, value])

  const onSubmit = async (values: any): Promise<void> => {
    if (loading) {
      return
    }
    const res = await createEnvironment({
      name: values.name,
      identifier: values.identifier,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string,
      type: values.environmentType
    })
    if (res.status === 'SUCCESS') {
      onNewCreated(res.data!)
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
          tags: [],
          environmentType: EnvironmentTypes[0].value
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(),
          identifier: Yup.string().required()
        })}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <FormikForm>
            <Container margin="medium">
              <Text font={{ size: 'medium', weight: 'bold' }} margin={{ bottom: 'large' }}>
                {getString('monitoringSources.appD.newEnvironment')}
              </Text>
              <Text font={{ size: 'small' }} margin={{ bottom: 'xxxlarge' }}>
                {getString('monitoringSources.appD.envDescription')}
              </Text>
              <AddDescriptionAndTagsWithIdentifier identifierProps={{ inputLabel: 'Name' }} />
              <Layout.Vertical spacing="large" margin={{ top: 'large' }}>
                <Text>{getString('monitoringSources.appD.envType')}</Text>
                <Layout.Horizontal spacing="medium">
                  {EnvironmentTypes.map((type: any, index: number) => {
                    return (
                      <CVSelectionCard
                        isSelected={values.environmentType === type.value}
                        key={index}
                        isLarge
                        cardLabel={type.label}
                        iconProps={{
                          name: 'service-appdynamics',
                          size: 30
                        }}
                        onCardSelect={selected => selected && setFieldValue('environmentType', type.value)}
                      />
                    )
                  })}
                </Layout.Horizontal>
              </Layout.Vertical>
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
      onSelect(val.value as string)
    }
  }

  return (
    <Select
      value={item}
      items={selectOptions}
      inputProps={{ placeholder: 'select or create an environment' }}
      onChange={onSelectChange}
    />
  )
}
