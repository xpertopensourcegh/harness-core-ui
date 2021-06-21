import React from 'react'
import type { FormikProps } from 'formik'
import { useParams } from 'react-router-dom'

import MultiTypeDelegateSelector from '@common/components/MultiTypeDelegateSelector/MultiTypeDelegateSelector'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'

export interface DelegatePanelProps {
  formikProps: FormikProps<{
    delegateSelectors?: string[]
  }>
  isReadonly: boolean
}

export default function DelegateSelectorPanel(props: DelegatePanelProps): React.ReactElement {
  const { isReadonly } = props
  const { projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { expressions } = useVariablesExpression()

  return (
    <MultiTypeDelegateSelector
      name="delegateSelectors"
      disabled={isReadonly}
      inputProps={{ projectIdentifier, orgIdentifier }}
      expressions={expressions}
    />
  )
}
