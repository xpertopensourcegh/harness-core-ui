import { useEffect } from 'react'
import pickBy from 'lodash-es/pickBy'
import merge from 'lodash-es/merge'

interface SyncStepDataValuesProps {
  values: any
  listenToValues: any
  onUpdate: (val: any) => void
}

export default function SyncStepDataValues({ values, listenToValues, onUpdate }: SyncStepDataValuesProps) {
  useEffect(() => {
    const update = pickBy({ ...listenToValues }, value => !!value)
    onUpdate(merge(values, update))
  }, [listenToValues])
  return null
}
