import type { SelectOption } from '@wings-software/uicore'
import type { Dispatch, SetStateAction } from 'react'

export interface GroupNameProps {
  groupNames?: SelectOption[]
  onChange: (name: string, value: SelectOption) => void
  item?: SelectOption
  setGroupNames: Dispatch<SetStateAction<SelectOption[]>>
}

export type CreateGroupName = {
  name: string
}
