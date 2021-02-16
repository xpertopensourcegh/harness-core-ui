import React, { useEffect, useState } from 'react'
import { FormInput, SelectOption } from '@wings-software/uicore'
import { useGetDelegateProfiles, DelegateProfile } from 'services/portal'
import type { UseGetMockData } from '@common/utils/testUtils'
import i18n from './InstallDelegateForm.i18n'

import css from './InstallDelegateForm.module.scss'

interface InstallDelegateFormProps {
  accountId: string
  mockData?: UseGetMockData<any>
}
// Adding any because of type issue
const formatProfileList = (data: any) => {
  const fetchedProfileList: Array<DelegateProfile> = data?.resource?.response

  return fetchedProfileList?.map((items: DelegateProfile) => {
    return { label: items.name || '', value: items.uuid || '' }
  })
}

const InstallDelegateForm = (props: InstallDelegateFormProps) => {
  const [, setProfileData] = useState()
  const { accountId = '' } = props
  const { loading, data } = useGetDelegateProfiles({ queryParams: { accountId }, mock: props.mockData })
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
