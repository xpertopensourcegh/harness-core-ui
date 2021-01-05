import React from 'react'
import { Drawer, IDrawerProps } from '@blueprintjs/core'
import { Formik, FormikProps } from 'formik'

import { FormikForm, Button, Layout } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import { FilterCRUD } from './FilterCRUD/FilterCRUD'
import type { FilterInterface, FilterDataInterface } from './Constants'

import css from './Filter.module.scss'
export interface FilterProps<T, U> extends Partial<Omit<FormikProps<T>, 'onSubmit' | 'initialValues'>> {
  initialFilter: FilterDataInterface<T, U>
  filters?: U[]
  children?: React.ReactElement
  /*TODO @vardan fix the type later on*/
  // onApply: FormikProps<T>['onSubmit']
  onApply: (formData: T) => void
  onClose: () => void
  onSaveOrUpdate: (isUpdate: boolean, data: FilterDataInterface<T, U>) => Promise<void>
  onDelete: (name: string) => Promise<void>
  onDuplicate: (name: string) => Promise<void>
}

export const Filter = <T, U extends FilterInterface>(props: FilterProps<T, U>) => {
  const { onApply, onClose, initialFilter, children, filters, onSaveOrUpdate, onDelete, onDuplicate } = props
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
        <div className={css.title}>{isUpdate ? filterName : getString('filters.newFilter')}</div>
      </Layout.Horizontal>
    )
  }

  const { name, visible, identifier } = initialFilter?.metadata
  const isUpdate = (name !== '' && visible !== undefined) as boolean

  return (
    <Drawer {...defaultPageDrawerProps} onClose={onClose}>
      <Formik<T> onSubmit={onApply} initialValues={initialFilter.formValues} enableReinitialize={true}>
        {formik => {
          return (
            <FormikForm>
              <div className={css.main}>
                <section className={css.formSection}>
                  <Layout.Vertical
                    spacing="large"
                    padding={{ top: 'xlarge', left: 'xlarge', right: 'xlarge' }}
                    height="100%"
                  >
                    {getDrawerTitle(isUpdate, name)}
                    <Layout.Vertical spacing="large" className={css.layout} padding={{ bottom: 'large' }}>
                      <div>{children}</div>
                      <Layout.Horizontal spacing={'medium'} margin={{ top: 'xxlarge' }}>
                        <Button
                          type="submit"
                          intent="primary"
                          text={getString('filters.apply')}
                          disabled={!formik.dirty}
                        />
                        <Button
                          type={'reset'}
                          intent={'none'}
                          text={getString('filters.clearAll')}
                          disabled={!formik.dirty}
                        />
                      </Layout.Horizontal>
                    </Layout.Vertical>
                  </Layout.Vertical>
                </section>
                <section className={css.filterSection}>
                  <FilterCRUD<U>
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
