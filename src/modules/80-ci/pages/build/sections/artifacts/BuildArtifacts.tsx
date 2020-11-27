import React from 'react'
import ArtifactsComponent from '@ci/components/ArtifactsComponent/ArtifactsComponent'
import css from './BuildArtifacts.module.scss'

const BuildArtifacts: React.FC = () => {
  return (
    <div className={css.main}>
      <div className={css.wrapper}>
        <div className={css.artifactsHolder}>
          <ArtifactsComponent className={css.artifacts} />
        </div>
      </div>
    </div>
  )
}

export default BuildArtifacts
