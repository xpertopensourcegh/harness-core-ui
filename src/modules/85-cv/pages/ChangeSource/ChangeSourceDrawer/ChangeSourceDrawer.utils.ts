import type { SelectOption } from '@wings-software/uicore'
import { isEmpty, cloneDeep } from 'lodash-es'
import type { Item } from '@wings-software/uicore/dist/components/ThumbnailSelect/ThumbnailSelect'
import type { StringsMap } from 'stringTypes'
import type { UseStringsReturn } from 'framework/strings'
import type { ChangeSourceDTO, PagerDutyChangeSourceSpec } from 'services/cv'
import { Connectors } from '@connectors/constants'
import { getIconBySource } from '../ChangeSource.utils'
import { CARD_OPTIONS, CHANGESOURCE_OPTIONS, HarnessCD } from './ChangeSourceDrawer.constants'

export const createChangesourceList = (
  changeSource: ChangeSourceDTO[],
  healthSourcesPayload: ChangeSourceDTO
): ChangeSourceDTO[] => {
  let updatedHealthSources = []
  if (
    changeSource &&
    !isEmpty(changeSource) &&
    changeSource.some(
      (el: any) => el?.identifier === healthSourcesPayload?.identifier && el?.type === healthSourcesPayload?.type
    )
  ) {
    updatedHealthSources = changeSource?.map((el: any) =>
      el?.identifier === healthSourcesPayload?.identifier ? healthSourcesPayload : el
    )
  } else if (changeSource && !isEmpty(changeSource)) {
    updatedHealthSources = [...changeSource, healthSourcesPayload]
  } else {
    updatedHealthSources = [healthSourcesPayload]
  }
  return updatedHealthSources
}

export const createCardOptions = (
  category: ChangeSourceDTO['category'],
  getString: UseStringsReturn['getString']
): Item[] => {
  return (
    cloneDeep(CARD_OPTIONS)
      .filter(item => item.category === category)
      .map(item => {
        item.icon = getIconBySource(item.value as ChangeSourceDTO['type'])
        item.label = getString(item.label.toString() as keyof StringsMap)
        return item
      }) || []
  )
}

export const validateChangeSource = (
  values: ChangeSourceDTO,
  tableData: ChangeSourceDTO[],
  isEdit: boolean,
  getString: UseStringsReturn['getString']
): any => {
  const { identifier, name, category, type, spec } = values
  const errors: {
    identifier?: string
    name?: string
    category?: string
    type?: string
    spec?: { [key: string]: any }
  } = {}

  if (!isEdit && tableData?.some(item => item.identifier === identifier)) {
    errors.name = getString('cv.changeSource.duplicateIdentifier')
  }
  if (!name) {
    errors.name = getString('cv.changeSource.selectChangeSourceName')
  }
  if (!category) {
    errors.category = getString('cv.changeSource.selectChangeSourceProvider')
  }
  if (!type) {
    errors.type = getString('cv.changeSource.selectChangeSourceType')
  }

  if (!spec?.connectorRef && type !== HarnessCD) {
    errors.spec = {
      connectorRef: getString('cv.onboarding.selectProductScreen.validationText.connectorRef')
    }
  }

  if (type === Connectors.PAGER_DUTY) {
    const { pagerDutyServiceId } = (spec as PagerDutyChangeSourceSpec) || {}
    if (!pagerDutyServiceId) {
      errors.spec = {
        ...errors.spec,
        pagerDutyServiceId: getString('cv.changeSource.PageDuty.selectPagerDutyService')
      }
    }
  }

  return errors
}

export const getChangeSourceOptions = (getString: UseStringsReturn['getString']): SelectOption[] =>
  cloneDeep(CHANGESOURCE_OPTIONS).map(item => {
    item.label = getString(item.label as keyof StringsMap)
    return item
  })
