import React, { useState, useEffect } from 'react'
import { ExpandingSearchInput, Card, Text, Icon, Layout, Button } from '@wings-software/uikit'

import { get, cloneDeep, uniqBy } from 'lodash-es'
import { useGet } from 'restful-react'

import cx from 'classnames'
import type { StepData } from 'modules/common/components/AbstractSteps/AbstractStepFactory'

import factory from 'modules/cd/components/PipelineSteps/PipelineStepFactory'
import i18n from './StepPalette.18n'
import { iconMap, iconMapByName } from './iconMap'
import { RightBar } from '../RightBar/RightBar'
import { getConfig } from '../../../../../services/config'
import css from './StepPalette.module.scss'

interface StepsData {
  name: string
  type: string
}

const primaryTypes = {
  SHOW_ALL: 'show_all',
  RECENTLY_USED: 'recently_used'
}

const filterContext = {
  NAV: 'NAV',
  SEARCH: 'SEARCH'
}

export interface StepPaletteProps {
  onSelect: (item: StepData) => void
  onClose: () => void
  selectedStage: object
}
export const StepPalette: React.FC<StepPaletteProps> = ({ onSelect, onClose, selectedStage }): JSX.Element => {
  const [stepCategories, setStepsCategories] = useState<{ name: string; stepCategories: []; stepsData: StepsData[] }[]>(
    []
  )
  const [originalData, setOriginalCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(primaryTypes.SHOW_ALL)
  const serviceDefinationType = get(selectedStage, 'stage.spec.service.serviceDefinition.type', null)

  const { data: stepsData } = useGet({
    path: `/pipelines/steps?serviceDefinitionType=${serviceDefinationType}`,
    base: getConfig('ng/api')
  })

  useEffect(() => {
    const stepsCategories = stepsData?.data?.stepCategories
    setStepsCategories(stepsCategories)
    setOriginalCategories(stepsCategories)
  }, [stepsData?.data])

  const filterSteps = (stepName: string, context: string = filterContext.NAV) => {
    const filteredData: { name: string }[] = []
    const name = stepName.toLowerCase()
    const cloneOriginalData = cloneDeep(originalData)
    if (name !== primaryTypes.SHOW_ALL) {
      cloneOriginalData.map(
        (k: {
          name: string
          stepCategories: { name: string; stepData: StepsData[]; type: string }[]
          stepsData: StepsData[]
        }) => {
          if (k.name.toLowerCase().search(name) !== -1) {
            filteredData.push(k)
          } else if (k.stepCategories && k.stepCategories.length > 0) {
            const _stepCategories: any = []
            k.stepCategories.map((v: { name: string }) => {
              if (v.name.toLowerCase().search(name) !== -1) {
                _stepCategories.push(v)
              }
            })
            if (_stepCategories?.length) {
              k.stepCategories = _stepCategories
              filteredData.push(k)
            }
          }
          if (context === filterContext.SEARCH && k.stepsData) {
            const _stepsData: StepsData[] = []
            k.stepsData.map((m: { name: string; type: string }) => {
              if (m.name.toLowerCase().search(name) !== -1) {
                _stepsData.push(m)
              }
            })
            if (_stepsData?.length) {
              k.stepsData = _stepsData
              filteredData.push(k)
            }
          }
        }
      )
      const uniqueData: any = uniqBy(filteredData, 'name')
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
            {stepCategories?.map((stepCategory: { stepsData: StepsData[]; stepCategories: []; name: string }) => {
              const categorySteps: JSX.Element[] = []
              if (stepCategory?.stepsData) {
                stepCategory.stepsData.forEach((stepData: { name: string; type: string }) => {
                  categorySteps.push(
                    <section
                      className={css.step}
                      key={stepData.name}
                      onClick={() => {
                        if (stepData.type !== 'Placeholder') {
                          onSelect({
                            name: stepData.name,
                            type: stepData.type,
                            icon: factory.getStepIcon(stepData.type)
                          })
                        }
                      }}
                    >
                      {factory.getStep(stepData.type) ? (
                        <Card interactive={true} elevation={0} selected={false}>
                          <Icon name={factory.getStepIcon(stepData.type)} />
                        </Card>
                      ) : (
                        <Card
                          interactive={false}
                          elevation={0}
                          selected={false}
                          disabled
                          onClick={e => e.stopPropagation()}
                        >
                          <Icon name={iconMap[stepData.name]} />
                        </Card>
                      )}
                      <section className={css.stepName}>{stepData.name}</section>
                    </section>
                  )
                })
              }

              if (stepCategory?.stepCategories?.length > 0) {
                stepCategory.stepCategories.map((subStepData: { stepsData: [] }) => {
                  subStepData?.stepsData?.map((step: { name: string; type: string }) => {
                    categorySteps.push(
                      <section
                        className={css.step}
                        key={step.name}
                        onClick={() => {
                          if (step.type !== 'Placeholder') {
                            onSelect({
                              name: step.name,
                              type: step.type,
                              icon: factory.getStepIcon(step.type)
                            })
                          }
                        }}
                      >
                        {factory.getStep(step.type) ? (
                          <Card interactive={true} elevation={0} selected={false}>
                            <Icon name={factory.getStepIcon(step.type)} />
                          </Card>
                        ) : (
                          <Card
                            interactive={false}
                            elevation={0}
                            selected={false}
                            disabled
                            onClick={e => e.stopPropagation()}
                          >
                            <Icon name={iconMap[step.name]} />
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
              {originalData?.map((category: { name: string; stepsData: StepsData[]; stepCategories: [] }) => {
                const stepRenderer = []
                if (category && category.stepCategories.length === 0) {
                  stepRenderer.push(
                    <section
                      className={cx(css.category, selectedCategory === category.name && css.active)}
                      onClick={() => {
                        filterSteps(category.name)
                      }}
                      key={category.name}
                    >
                      <Icon size={14} name={iconMapByName[category.name]} /> {category.name} (
                      {category.stepsData.length})
                    </section>
                  )
                }
                if (category && category.stepCategories.length > 0) {
                  const subCategory = category.stepCategories
                  stepRenderer.push(
                    <section
                      className={cx(css.category, selectedCategory === category.name && css.active)}
                      onClick={() => {
                        filterSteps(category.name)
                      }}
                      key={category.name}
                    >
                      <Icon size={14} name={iconMapByName[category.name]} /> {category.name}
                    </section>
                  )
                  subCategory.map((subCat: { stepsData: StepsData[]; name: string; type: string }) =>
                    stepRenderer.push(
                      <section
                        className={cx(css.category, css.offset, selectedCategory === subCat.name && css.active)}
                        onClick={() => {
                          filterSteps(subCat.name)
                        }}
                        key={subCat.name}
                      >
                        {subCat.name} ({subCat.stepsData.length})
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
