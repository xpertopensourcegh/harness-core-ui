import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { StepProps, ModalErrorHandlerBinding } from '@wings-software/uikit'
import { pick } from 'lodash-es'
import { Organization, useGetOrganization } from 'services/cd-ng'
import { usePutOrganization } from 'services/cd-ng'
import { useToaster } from '@common/components/Toaster/useToaster'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import i18n from './StepAboutOrganization.i18n'
import OrganizationForm from './OrganizationForm'

interface EditModalData {
  identifier?: string
  closeModal?: () => void
  onSuccess?: (Organization: Organization | undefined) => void
  isStep?: boolean
}

const EditOrganization: React.FC<StepProps<Organization> & EditModalData> = props => {
  const { prevStepData, nextStep, onSuccess, identifier, isStep } = props
  const { accountId } = useParams()
  const { showSuccess } = useToaster()
  const [version, setVersion] = useState<string>()
  const orgIdentifier = isStep ? prevStepData?.identifier : identifier

  const { mutate: editOrganization } = usePutOrganization({
    identifier: orgIdentifier || '',
    queryParams: {
      accountIdentifier: accountId
    },
    requestOptions: {
      headers: { 'If-Match': version as string }
    }
  })
  const { data, loading, error, response } = useGetOrganization({
    identifier: orgIdentifier || '',
    queryParams: { accountIdentifier: accountId }
  })

  useEffect(() => {
    if (!loading && !error) {
      setVersion(response?.headers.get('etag') as string)
    }
  }, [error, loading])

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
      const { data: organization } = await editOrganization(dataToSubmit as Organization, {
        queryParams: {
          accountIdentifier: accountId
        }
      })
      nextStep?.(organization)
      showSuccess(i18n.form.editSuccess)
      updateAppStore({ organisationsMap: organisationsMap.set(values.identifier || '', values) })
      onSuccess?.(organization)
    } catch (e) {
      /* istanbul ignore next */
      modalErrorHandler?.showDanger(e.data.message)
    }
  }
  return (
    <>
      {!loading ? (
        <OrganizationForm
          data={data?.data}
          title={i18n.editTitle}
          enableEdit={false}
          submitTitle={isStep ? i18n.form.saveAndContinue : i18n.form.saveAndClose}
          disableSubmit={false}
          setModalErrorHandler={setModalErrorHandler}
          onComplete={onComplete}
        />
      ) : null}
    </>
  )
}

export default EditOrganization
