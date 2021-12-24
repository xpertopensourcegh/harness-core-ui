import React from 'react'
import { ButtonSize, ButtonVariation, Card, Icon, IconName, Layout, Heading, Color } from '@wings-software/uicore'
import cx from 'classnames'
import produce from 'immer'
import { defaultTo, set } from 'lodash-es'
import { parse } from 'yaml'
import { useStrings } from 'framework/strings'
import { ComingSoonIcon } from '@common/components/ComingSoonIcon/ComingSoonIcon'
import { useTelemetry } from '@common/hooks/useTelemetry'
import { StageActions } from '@common/constants/TrackingConstants'
import { StageType } from '@pipeline/utils/stageHelpers'
import type { TemplateLinkConfig } from 'services/cd-ng'
import type { TemplateSummaryResponse } from 'services/template-ng'
import { useTemplateSelector } from '@pipeline/utils/useTemplateSelector'
import { PipelineContextType } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { FeatureFlag } from '@common/featureFlags'
import { useFeatureFlag } from '@common/hooks/useFeatureFlag'
import { generateRandomString } from '@pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraphUtil'
import RbacButton from '@rbac/components/Button/Button'
import { FeatureIdentifier } from 'framework/featureStore/FeatureIdentifier'
import type { PipelineStageProps } from '../PipelineStage'
import EmptyStageView from './EmptyStageView'
import StageHoverView from './StageHoverView'
import css from './AddStageView.module.scss'

export interface AddStageViewProps<T = Record<string, unknown>> {
  callback: (type: string) => void
  stages: Array<PipelineStageProps>
  isParallel?: boolean
  contextType?: string
  onSelectStage?: (selectedStage?: T) => void
}

export interface SelectedAddStageTypeData {
  title?: string
  description?: string
  type?: string
  icon?: IconName
  hoverIcon?: IconName
  isComingSoon?: boolean
}

export function AddStageView<T>({
  callback,
  isParallel = false,
  stages,
  contextType,
  onSelectStage
}: AddStageViewProps<T>): JSX.Element {
  const isTemplatesEnabled = useFeatureFlag(FeatureFlag.NG_TEMPLATES)
  const { getString } = useStrings()
  const { trackEvent } = useTelemetry()
  const { openTemplateSelector, closeTemplateSelector } = useTemplateSelector()
  const [selectedType, setSelectedType] = React.useState<SelectedAddStageTypeData | undefined>(undefined)

  const onUseTemplate = React.useCallback(
    (template: TemplateLinkConfig) => {
      closeTemplateSelector()
      const processNode = produce({}, draft => {
        set(draft, 'stage.identifier', generateRandomString(template.templateRef))
        set(draft, 'stage.template', template)
      }) as T
      onSelectStage?.(processNode)
    },
    [closeTemplateSelector, onSelectStage]
  )

  const onCopyTemplate = React.useCallback(
    (copiedTemplate: TemplateSummaryResponse) => {
      closeTemplateSelector()
      const processNode = produce({}, draft => {
        set(draft, 'stage', parse(copiedTemplate?.yaml || '')?.template.spec)
        set(draft, 'stage.identifier', generateRandomString(defaultTo(copiedTemplate.identifier, '')))
      }) as T
      onSelectStage?.(processNode)
    },
    [closeTemplateSelector, onSelectStage]
  )

  const onOpenTemplateSelector = React.useCallback(() => {
    openTemplateSelector({
      templateType: 'Stage',
      onUseTemplate,
      onCopyTemplate
    })
  }, [openTemplateSelector, onUseTemplate, onCopyTemplate])

  return (
    <div className={cx(css.createNewContent, { [css.parallel]: isParallel })}>
      <div className={css.stageTypeSection}>
        <Layout.Horizontal className={css.stageTitle} margin={{ bottom: 'large' }}>
          <Heading level={6} color={Color.GREY_800}>
            {getString('pipeline.addStage.title')}
          </Heading>
          {contextType === PipelineContextType.Pipeline && isTemplatesEnabled && (
            <RbacButton
              text={getString('common.useTemplate')}
              variation={ButtonVariation.SECONDARY}
              size={ButtonSize.SMALL}
              icon="template-library"
              iconProps={{ size: 12 }}
              onClick={onOpenTemplateSelector}
              featuresProps={{
                featuresRequest: {
                  featureNames: [FeatureIdentifier.TEMPLATE_SERVICE]
                }
              }}
            />
          )}
        </Layout.Horizontal>
        <div className={css.createNewCards}>
          {stages
            .filter(stage => stage.type !== StageType.Template)
            .map(stage => (
              <React.Fragment key={stage.type}>
                {stage.isHidden !== true && (!stage.isApproval || !isParallel) ? (
                  <div>
                    <Card
                      data-testid={`stage-${stage.type}`}
                      onMouseOver={() => selectedType?.type !== stage.type && setSelectedType(stage)}
                      onMouseLeave={() => setSelectedType(undefined)}
                      interactive={true}
                      disabled={stage.isDisabled}
                      className={cx(css.cardNew)}
                      onClick={e => {
                        if (stage.isDisabled) {
                          e.stopPropagation()
                        } else {
                          // call telemetry
                          trackEvent(StageActions.SelectStage, { stageType: stage.type })
                          callback(stage.type)
                        }
                      }}
                    >
                      {stage.isComingSoon && (
                        <ComingSoonIcon className={css.comingSoon} active={selectedType?.type === stage.type} />
                      )}
                      <Icon name={stage.icon} size={24} {...stage.iconsProps} style={stage.iconsStyle} />
                    </Card>
                    <div className={cx(css.cardTitle, { [css.selected]: selectedType?.type === stage.type })}>
                      {stage.name}
                    </div>
                  </div>
                ) : null}
              </React.Fragment>
            ))}
        </div>
      </div>
      {selectedType ? <StageHoverView selectedStageType={selectedType} /> : <EmptyStageView />}
    </div>
  )
}
