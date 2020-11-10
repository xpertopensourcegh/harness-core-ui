import { deployStageStep } from './mockResponses'
import { DrawerContext } from '../AddDrawer'
import type { AddDrawerProps } from '../AddDrawer'
import { getAddDrawerMap } from '../../../../70-pipeline/components/PipelineStudio/PipelineCanvas/PipelineCanvasUtils'
import { getCategoryItems } from '../../../../70-pipeline/pages/triggers/Views/TriggersList/TriggersListUtils'

export const getPipelineStudioStageDefaultProps = (stageType: string): AddDrawerProps => ({
  addDrawerMap: getAddDrawerMap(deployStageStep.data, stageType),
  drawerContext: DrawerContext.STUDIO,
  onSelect: jest.fn(),
  onClose: jest.fn()
})

export const getTriggerListDefaultProps = () => ({
  // temporary import from TriggerListUtils
  addDrawerMap: getCategoryItems(),
  drawerContext: DrawerContext.PAGE,
  onSelect: jest.fn(),
  onClose: jest.fn()
})
