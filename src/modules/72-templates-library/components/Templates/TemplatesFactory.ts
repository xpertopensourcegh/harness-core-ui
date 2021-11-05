import { TemplateFactory } from '@templates-library/components/AbstractTemplate/TemplateFactory'
import { StepTemplate } from '@templates-library/components/Templates/StepTemplate/StepTemplate'
import { StageTemplate } from '@templates-library/components/Templates/StageTemplate/StageTemplate'

const templateFactory = new TemplateFactory()

// common
templateFactory.registerTemplate(new StepTemplate())
templateFactory.registerTemplate(new StageTemplate())

// build steps
export default templateFactory
