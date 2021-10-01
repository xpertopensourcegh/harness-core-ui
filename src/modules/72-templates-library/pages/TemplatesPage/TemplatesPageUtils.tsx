import type { IconProps } from '@wings-software/uicore/dist/icons/Icon'
import { TemplateType } from '@templates-library/utils/templatesUtils'
import type { TemplateSummaryResponse } from 'services/template-ng'

export const templateColorStyleMap: { [keyof in TemplateType]: React.CSSProperties } = {
  [TemplateType.Step]: {
    color: '#592BAA',
    stroke: '#E1D0FF',
    fill: '#EADEFF'
  },
  [TemplateType.Stage]: {
    color: '#06B7C3',
    stroke: '#C3ECEE',
    fill: '#D3FCFE'
  },
  [TemplateType.Service]: {
    color: '#299B2C',
    stroke: '#D4E7D1',
    fill: '#E4F7E1'
  },
  [TemplateType.Pipeline]: {
    color: '#004BA4',
    stroke: '#E4E6EF',
    fill: '#F4F6FF'
  },
  [TemplateType.StepGroup]: {
    color: '#299B2C',
    stroke: '#D4E7D1',
    fill: '#E4F7E1'
  },
  [TemplateType.Execution]: {
    color: '#299B2C',
    stroke: '#D4E7D1',
    fill: '#E4F7E1'
  },
  [TemplateType.Infrastructure]: {
    color: '#299B2C',
    stroke: '#D4E7D1',
    fill: '#E4F7E1'
  }
}

export enum Sort {
  DESC = 'DESC',
  ASC = 'ASC'
}

export enum TemplateListType {
  Stable = 'Stable',
  LastUpdated = 'LastUpdated',
  All = 'All'
}

export enum SortFields {
  LastUpdatedAt = 'lastUpdatedAt',
  RecentActivity = 'executionSummaryInfo.lastExecutionTs',
  AZ09 = 'AZ09',
  ZA90 = 'ZA90',
  Name = 'name'
}

export const getIconsForTemplates = (_data: TemplateSummaryResponse): IconProps[] => {
  const icons: IconProps[] = []
  icons.push({ name: 'cd-main', size: 20 })
  icons.push({ name: 'ci-main', size: 16 })
  icons.push({ name: 'cv-main', size: 16 })
  return icons
}
