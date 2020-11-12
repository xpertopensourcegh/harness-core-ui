import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { StepProps, ModalErrorHandlerBinding } from '@wings-software/uikit'
import { pick } from 'lodash-es'
import type { Organization } from 'services/cd-ng'
import { usePostOrganization } from 'services/cd-ng'
import { useToaster } from '@common/components/Toaster/useToaster'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import i18n from './StepAboutOrganization.i18n'
import OrganizationForm from './OrganizationForm'
import type { OrgModalData } from './StepAboutOrganization'

const CreateOrganization: React.FC<StepProps<Organization> & OrgModalData> = props => {
  const { nextStep, onSuccess } = props
  const { accountId } = useParams()
  const { showSuccess } = useToaster()
  const { mutate: createOrganization } = usePostOrganization({
    queryParams: {
      accountIdentifier: accountId
    }
  })
  const { organisationsMap } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()

  const onComplete = async (values: Organization): Promise<void> => {
    const dataToSubmit: Organization = pick<Organization, keyof Organization>(values, [
      'name',
      'description',
      'identifier',
      'tags'
    ])
    ;(dataToSubmit as Organization)['accountIdentifier'] = accountId
    try {
      const { data: organization } = await createOrganization(dataToSubmit as Organization, {
        queryParams: {
          accountIdentifier: accountId
        }
      })
      nextStep?.(organization)
      showSuccess(i18n.form.createSuccess)
      updateAppStore({ organisationsMap: organisationsMap.set(values.identifier || '', values) })
      onSuccess?.(organization)
    } catch (e) {
      /* istanbul ignore next */
      modalErrorHandler?.showDanger(e.data.message)
    }
  }
  return (
    <OrganizationForm
      title={i18n.aboutTitle}
      enableEdit={true}
      disableSubmit={false}
      submitTitle={i18n.form.saveAndContinue}
      setModalErrorHandler={setModalErrorHandler}
      onComplete={onComplete}
    />
  )
}

export default CreateOrganization
