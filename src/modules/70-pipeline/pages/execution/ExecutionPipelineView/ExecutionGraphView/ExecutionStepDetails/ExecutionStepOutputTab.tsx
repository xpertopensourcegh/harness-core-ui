import React from 'react'

import type { ExecutionNode } from 'services/cd-ng'

export interface ExecutionStepOutputTabProps {
  step: ExecutionNode
}

export default function ExecutionStepOutputTab(_props: ExecutionStepOutputTabProps): React.ReactElement {
  return <div>ExecutionStepOutputTab</div>
}
