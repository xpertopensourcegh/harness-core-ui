import React, { useEffect, useState } from 'react'
import { FormInput, SelectOption } from '@wings-software/uikit'
import i18n from './InstallDelegateForm.i18n'

import css from './InstallDelegateForm.module.scss'
import { useGetDelegateProfiles, DelegateProfile } from 'services/portal'

interface InstallDelegateFormProps {
  accountId: string
}
// Adding any because of type issue
const formatProfileList = (data: any) => {
  const fetchedProfileList: Array<DelegateProfile> = data?.resource?.response

  return fetchedProfileList?.map((items: DelegateProfile) => {
    return { label: items.name || '', value: items.name || '' }
  })
}

const InstallDelegateForm = (props: InstallDelegateFormProps) => {
  const [, setProfileData] = useState()
  const { accountId = '' } = props
  const { loading, data } = useGetDelegateProfiles({ queryParams: { accountId } })

  let list: SelectOption[] = [{ label: '', value: '' }]

  if (data) {
    list = formatProfileList(data)
  }

  useEffect(() => {
    setProfileData(data)
  }, [loading])

  return !loading ? (
    <div className={css.delegateInfo}>
      <FormInput.Text name={i18n.delegateName} label={i18n.delegateNameLabel} />
      <FormInput.Select name={i18n.profile} label={i18n.profileLabel} items={list} />
    </div>
  ) : null
}

export default InstallDelegateForm
