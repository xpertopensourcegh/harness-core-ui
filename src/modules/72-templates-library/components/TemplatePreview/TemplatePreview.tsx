import { Layout } from '@wings-software/uicore'
import React from 'react'
import cx from 'classnames'
import { TemplateCard } from '@templates-library/components/TemplateCard/TemplateCard'
import type { TemplateSummaryResponse } from 'services/template-ng'
import type { NGTemplateInfoConfigWithGitDetails } from 'framework/Templates/TemplateConfigModal/TemplateConfigModal'
import css from './TemplatePreview.module.scss'

interface PreviewInterface {
  previewValues?: NGTemplateInfoConfigWithGitDetails | TemplateSummaryResponse
  className?: string
}

export const TemplatePreview = (props: PreviewInterface): JSX.Element => {
  const { previewValues, className = '' } = props
  return (
    <Layout.Horizontal
      flex={{ alignItems: 'center', justifyContent: 'center' }}
      className={cx(css.preview, className)}
      padding={{ top: 'huge', bottom: 'huge' }}
    >
      {previewValues && (
        <TemplateCard
          template={{
            ...previewValues,
            gitDetails: {
              repoIdentifier: (previewValues as NGTemplateInfoConfigWithGitDetails)?.repo,
              branch: (previewValues as NGTemplateInfoConfigWithGitDetails)?.branch
            }
          }}
        />
      )}
    </Layout.Horizontal>
  )
}
