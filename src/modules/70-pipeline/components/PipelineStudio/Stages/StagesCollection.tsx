import type { UseStringsReturn } from 'framework/exports'
import type { StageAttributes, StagesMap } from '../PipelineContext/PipelineContext'

class StagesCollection {
  protected stagesByType = new Map<string, { stageFactory: any; stageAttributesFactory: any }>()

  registerStageFactory(
    stageType: string,
    stageAttributesFactory: (getString: UseStringsReturn['getString']) => StageAttributes,
    stageFactory: (isEnabled: boolean, getString: UseStringsReturn['getString']) => any
  ) {
    this.stagesByType.set(stageType, { stageFactory, stageAttributesFactory })
  }

  getStage(stageType: string, isEnabled: boolean, getString: UseStringsReturn['getString']): any {
    const stageFactories = this.stagesByType.get(stageType)
    return stageFactories?.stageFactory(isEnabled, getString)
  }

  getStageAttributes(stageType: string, getString: UseStringsReturn['getString']): StageAttributes {
    const stageFactories = this.stagesByType.get(stageType)
    return stageFactories?.stageAttributesFactory(getString)
  }

  getAllStagesAttributes(getString: UseStringsReturn['getString']): StagesMap {
    const stagesMap: StagesMap = {}
    this.stagesByType.forEach((value, key) => {
      stagesMap[key] = value.stageAttributesFactory(getString)
    })
    return stagesMap
  }
}

export const stagesCollection = new StagesCollection()
