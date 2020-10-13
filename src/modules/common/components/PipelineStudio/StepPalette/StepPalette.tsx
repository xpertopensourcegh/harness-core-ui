import React, { useState, useEffect } from 'react'
import { ExpandingSearchInput, Card, Text, Icon, Layout, Button } from '@wings-software/uikit'

import { get, cloneDeep, uniqBy } from 'lodash-es'

import cx from 'classnames'
import type {
  AbstractStepFactory,
  StepData as FactoryStepData
} from 'modules/common/components/AbstractSteps/AbstractStepFactory'

import { StepCategory, StepData, useGetSteps } from 'services/cd-ng'
import i18n from './StepPalette.18n'
import { iconMap, iconMapByName } from './iconMap'
import { RightBar } from '../RightBar/RightBar'
import css from './StepPalette.module.scss'

const primaryTypes = {
  SHOW_ALL: 'show_all',
  RECENTLY_USED: 'recently_used'
}

const filterContext = {
  NAV: 'NAV',
  SEARCH: 'SEARCH'
}

export interface StepPaletteProps {
  onSelect: (item: FactoryStepData) => void
  onClose: () => void
  stepsFactory: AbstractStepFactory
  selectedStage: object
}
export const StepPalette: React.FC<StepPaletteProps> = ({
  onSelect,
  onClose,
  selectedStage,
  stepsFactory
}): JSX.Element => {
  const [stepCategories, setStepsCategories] = useState<StepCategory[]>([])
  const [originalData, setOriginalCategories] = useState<StepCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState(primaryTypes.SHOW_ALL)
  const serviceDefinationType = get(selectedStage, 'stage.spec.service.serviceDefinition.type', 'Kubernetes')

  const { data: stepsData } = useGetSteps({ queryParams: { serviceDefinitionType: serviceDefinationType } })

  useEffect(() => {
    const stepsCategories = stepsData?.data?.stepCategories
    if (stepsCategories) {
      setStepsCategories(stepsCategories)
      setOriginalCategories(stepsCategories)
    }
  }, [stepsData?.data?.stepCategories])

  const filterSteps = (stepName: string, context: string = filterContext.NAV): void => {
    const filteredData: StepCategory[] = []
    const name = stepName.toLowerCase()
    const cloneOriginalData = cloneDeep(originalData)
    if (name !== primaryTypes.SHOW_ALL) {
      cloneOriginalData.forEach((k: StepCategory) => {
        if (k.name?.toLowerCase().search(name) !== -1) {
          filteredData.push(k)
        } else if (k.stepCategories && k.stepCategories.length > 0) {
          const _stepCategories: StepCategory[] = []
          k.stepCategories.forEach((v: StepCategory) => {
            if (v.name?.toLowerCase().search(name) !== -1) {
              _stepCategories.push(v)
            }
          })
          if (_stepCategories?.length) {
            k.stepCategories = _stepCategories
            filteredData.push(k)
          }
        }
        if (context === filterContext.SEARCH && k.stepsData) {
          const _stepsData: StepData[] = []
          k.stepsData.forEach((m: StepData) => {
            if (m.name?.toLowerCase().search(name) !== -1) {
              _stepsData.push(m)
            }
          })
          if (_stepsData?.length) {
            k.stepsData = _stepsData
            filteredData.push(k)
          }
        }
      })
      const uniqueData: StepCategory[] = uniqBy(filteredData, 'name')
      setStepsCategories(uniqueData)
      setSelectedCategory(stepName)
    } else {
      setStepsCategories(originalData)
      setSelectedCategory(stepName)
    }
  }

  return (
    <div className={css.stepPalette}>
      <div className={css.stepInside}>
        <section className={css.stepsRenderer}>
          <Layout.Vertical padding="large" spacing="large">
            <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
              <Text style={{ color: 'var(--grey-700)', fontSize: 16 }}>{i18n.title}</Text>
              <div className={css.expandSearch}>
                <ExpandingSearchInput
                  placeholder={i18n.searchPlaceholder}
                  throttle={200}
                  onChange={(text: string) => filterSteps(text, filterContext.SEARCH)}
                />
              </div>
            </Layout.Horizontal>
            {stepCategories && stepCategories.length === 0 && (
              <section style={{ paddingTop: '50%', justifyContent: 'center', textAlign: 'center' }}>
                {i18n.noSearchResultsFound}
              </section>
            )}
            {stepCategories?.map((stepCategory: StepCategory) => {
              const categorySteps: JSX.Element[] = []
              if (stepCategory?.stepsData) {
                stepCategory.stepsData.forEach((stepData: StepData) => {
                  categorySteps.push(
                    <section
                      className={css.step}
                      key={stepData.name}
                      onClick={() => {
                        if (stepData.type !== 'Placeholder') {
                          onSelect({
                            name: stepData.name || '',
                            type: stepData.type || '',
                            icon: stepsFactory.getStepIcon(stepData.type || '')
                          })
                        }
                      }}
                    >
                      {stepsFactory.getStep(stepData.type || '') ? (
                        <Card interactive={true} elevation={0} selected={false}>
                          <Icon name={stepsFactory.getStepIcon(stepData.type || '')} />
                        </Card>
                      ) : (
                        <Card
                          interactive={false}
                          elevation={0}
                          selected={false}
                          disabled
                          onClick={e => e.stopPropagation()}
                        >
                          <Icon name={iconMap[stepData.name || '']} />
                        </Card>
                      )}
                      <section className={css.stepName}>{stepData.name}</section>
                    </section>
                  )
                })
              }

              if (stepCategory?.stepCategories && stepCategory.stepCategories.length > 0) {
                stepCategory.stepCategories.forEach((subStepData: StepCategory) => {
                  subStepData?.stepsData?.map((step: StepData) => {
                    categorySteps.push(
                      <section
                        className={css.step}
                        key={step.name}
                        onClick={() => {
                          if (step.type !== 'Placeholder') {
                            onSelect({
                              name: step.name || '',
                              type: step.type || '',
                              icon: stepsFactory.getStepIcon(step.type || '')
                            })
                          }
                        }}
                      >
                        {stepsFactory.getStep(step.type || '') ? (
                          <Card interactive={true} elevation={0} selected={false}>
                            <Icon name={stepsFactory.getStepIcon(step.type || '')} />
                          </Card>
                        ) : (
                          <Card
                            interactive={false}
                            elevation={0}
                            selected={false}
                            disabled
                            onClick={e => e.stopPropagation()}
                          >
                            <Icon name={iconMap[step.name || '']} />
                          </Card>
                        )}
                        <section className={css.stepName}>{step.name}</section>
                      </section>
                    )
                  })
                })
              }

              return (
                <section className={css.categorySteps} key={stepCategory.name}>
                  <section className={cx(css.categoryName)}>{stepCategory.name}</section>
                  <section className={cx(css.steps)}>{[...categorySteps]}</section>
                </section>
              )
            })}
          </Layout.Vertical>
        </section>
        <section className={css.categoriesRenderer}>
          <Layout.Horizontal padding="medium" style={{ justifyContent: 'flex-end', marginTop: 'var(--spacing-small)' }}>
            <Button intent="primary" minimal icon="cross" onClick={onClose} />
          </Layout.Horizontal>
          <section className={css.primaryCategories}>
            <section
              className={cx(selectedCategory === primaryTypes.SHOW_ALL ? css.active : '')}
              onClick={() => {
                filterSteps(primaryTypes.SHOW_ALL)
              }}
              key={primaryTypes.SHOW_ALL}
            >
              {i18n.categories.primary.showAll} ({originalData?.length})
            </section>
            <section>{i18n.categories.primary.recentlyUsed} (0)</section>
          </section>
          <section className={css.secCategories}>
            <section className={css.title}>{i18n.secCategoriesTitle}</section>
            <Layout.Vertical>
              {originalData?.map((category: StepCategory) => {
                const stepRenderer = []
                if (category?.stepCategories && category.stepCategories.length === 0) {
                  stepRenderer.push(
                    <section
                      className={cx(css.category, selectedCategory === category.name && css.active)}
                      onClick={() => {
                        filterSteps(category.name || '')
                      }}
                      key={category.name}
                    >
                      <Icon size={14} name={iconMapByName[category.name || '']} /> {category.name} (
                      {category.stepsData?.length})
                    </section>
                  )
                }
                if (category?.stepCategories && category.stepCategories.length > 0) {
                  const subCategory = category.stepCategories
                  stepRenderer.push(
                    <section
                      className={cx(css.category, selectedCategory === category.name && css.active)}
                      onClick={() => {
                        filterSteps(category.name || '')
                      }}
                      key={category.name}
                    >
                      <Icon size={14} name={iconMapByName[category.name || '']} /> {category.name}
                    </section>
                  )
                  subCategory.forEach((subCat: StepCategory) =>
                    stepRenderer.push(
                      <section
                        className={cx(css.category, css.offset, selectedCategory === subCat.name && css.active)}
                        onClick={() => {
                          filterSteps(subCat.name || '')
                        }}
                        key={subCat.name}
                      >
                        {subCat.name} ({subCat.stepsData?.length})
                      </section>
                    )
                  )
                }
                return [...stepRenderer]
              })}
            </Layout.Vertical>
          </section>
        </section>
      </div>
      <RightBar />
    </div>
  )
}
