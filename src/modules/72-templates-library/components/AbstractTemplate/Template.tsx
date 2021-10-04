import type { Color } from '@wings-software/uicore'
import type { FormikProps } from 'formik'
import type { TemplateType } from '@templates-library/utils/templatesUtils'
import type { TemplateFormRef } from '@templates-library/components/TemplateStudio/TemplateStudio'

export interface TemplateProps<T, U = unknown> {
  readonly?: boolean
  customTemplateProps?: U
  openStepSelection?: (onSelection: (step: T) => void) => void
  formikRef?: TemplateFormRef<T>
  formikProps: FormikProps<T>
}

export abstract class Template<T> {
  protected abstract type: TemplateType
  protected abstract name: string
  protected abstract defaultValues: T
  protected abstract color: Color

  getType(): TemplateType {
    return this.type
  }

  getName(): string {
    return this.name
  }

  getColor(): Color {
    return this.color
  }

  abstract renderTemplateDiagram(props: TemplateProps<T>): JSX.Element

  abstract renderTemplateForm(props: TemplateProps<T>): JSX.Element
}
