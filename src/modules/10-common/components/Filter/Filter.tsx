import React from 'react'
import { Drawer, IDrawerProps } from '@blueprintjs/core'
import { Formik, FormikProps, FormikErrors } from 'formik'
import { truncate } from 'lodash-es'
import { FormikForm, Button, Layout, OverlaySpinner } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import { FilterCRUD } from './FilterCRUD/FilterCRUD'
import type { FilterInterface, FilterDataInterface } from './Constants'

import css from './Filter.module.scss'

const MAX_FILTER_NAME_LENGTH = 30
const KEY_CODE_FOR_ENTER_KEY = 13

export interface FilterProps<T, U> extends Partial<Omit<FormikProps<T>, 'onSubmit' | 'initialValues'>> {
  formFields: JSX.Element[]
  initialFilter: FilterDataInterface<T, U>
  filters?: U[]
  isRefreshingFilters: boolean
  /*TODO @vardan fix the type later on*/
  // onApply: FormikProps<T>['onSubmit']
  onApply: (formData: T) => void
  onClose: () => void
  onSaveOrUpdate: (isUpdate: boolean, data: FilterDataInterface<T, U>) => Promise<void>
  onDelete: (identifier: string) => Promise<void>
  onDuplicate: (identifier: string) => Promise<void>
  onFilterSelect: (identifier: string) => void
  onValidate?: (values: Partial<T>) => FormikErrors<Partial<T>>
}

export const Filter = <T, U extends FilterInterface>(props: FilterProps<T, U>) => {
  const {
    formFields,
    onApply,
    onClose,
    initialFilter,
    filters,
    onSaveOrUpdate,
    onDelete,
    onDuplicate,
    onFilterSelect,
    onValidate,
    isRefreshingFilters
  } = props
  const { getString } = useStrings()

  const defaultPageDrawerProps: IDrawerProps = {
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    isOpen: true,
    size: 700,
    position: 'right'
  }

  const getDrawerTitle = (isUpdate: boolean, filterName?: string): JSX.Element => {
    return (
      <Layout.Horizontal spacing="small" className={css.titleLayout}>
        <div className={css.title} title={filterName}>
          {isUpdate
            ? truncate(filterName, {
                length: MAX_FILTER_NAME_LENGTH
              })
            : getString('filters.newFilter')}
        </div>
      </Layout.Horizontal>
    )
  }

  const { name, visible, identifier } = initialFilter?.metadata
  const isUpdate = (name !== '' && visible !== undefined) as boolean

  return (
    <Drawer {...defaultPageDrawerProps} onClose={onClose}>
      <Formik<T>
        onSubmit={onApply}
        initialValues={initialFilter.formValues}
        enableReinitialize={true}
        validate={values => {
          return onValidate?.(values)
        }}
      >
        {formik => {
          return (
            <FormikForm
              onKeyDown={(keyEvent: KeyboardEvent) => {
                /* istanbul ignore else */ if ((keyEvent.charCode || keyEvent.keyCode) === KEY_CODE_FOR_ENTER_KEY) {
                  keyEvent.preventDefault()
                }
              }}
            >
              <div className={css.main}>
                <section className={css.formSection}>
                  <Layout.Vertical
                    spacing="large"
                    padding={{ top: 'xlarge', left: 'xlarge', right: 'xlarge' }}
                    height="100%"
                  >
                    {getDrawerTitle(isUpdate, name)}
                    <Layout.Vertical spacing="large" className={css.layout} padding={{ bottom: 'large' }}>
                      {isRefreshingFilters ? (
                        <OverlaySpinner show={true} className={css.loading}>
                          <></>
                        </OverlaySpinner>
                      ) : (
                        <>
                          <div>{formFields}</div>
                          <Layout.Horizontal spacing={'medium'} margin={{ top: 'xxlarge' }}>
                            <Button type="submit" intent="primary" text={getString('filters.apply')} />
                            <Button
                              type={'reset'}
                              intent={'none'}
                              text={getString('filters.clearAll')}
                              onClick={(event: React.MouseEvent<Element, MouseEvent>) => {
                                event.preventDefault()
                                formFields?.map((formField: JSX.Element) => {
                                  if (formField?.key === 'tags') {
                                    formik?.setFieldValue(formField?.key as string, {})
                                  } else {
                                    formik?.setFieldValue(formField?.key as string, undefined)
                                  }
                                })
                              }}
                            />
                          </Layout.Horizontal>
                        </>
                      )}
                    </Layout.Vertical>
                  </Layout.Vertical>
                </section>
                <section className={css.filterSection}>
                  <FilterCRUD<U>
                    isRefreshingFilters={isRefreshingFilters}
                    filters={filters}
                    onSaveOrUpdate={async (_isUpdate: boolean, formdata: U): Promise<void> => {
                      await onSaveOrUpdate(_isUpdate, {
                        metadata: formdata,
                        formValues: formik.values
                      } as FilterDataInterface<T, U>)
                    }}
                    initialValues={{ name, visible, identifier } as U}
                    onClose={onClose}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onFilterSelect={onFilterSelect}
                    enableEdit={formik.dirty}
                  />
                </section>
              </div>
            </FormikForm>
          )
        }}
      </Formik>
    </Drawer>
  )
}
