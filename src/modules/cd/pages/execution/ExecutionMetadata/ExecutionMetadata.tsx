import React from 'react'

import css from './ExecutionMetadata.module.scss'

export interface ExecutionMetadataProps {
  dummy?: number
}

export default function ExecutionMetadata(_props: ExecutionMetadataProps): React.ReactElement {
  return <div className={css.main}>Details Go here</div>
}
