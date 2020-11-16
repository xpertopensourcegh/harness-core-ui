import { useState } from 'react'

type CVTabsHookReturnType = {
  currentTab: number
  setCurrentTab: (val: number) => void
  maxEnabledTab: number
  setMaxEnabledTab: (val: number) => void
  onNext: (prevTab?: number, newTab?: number) => void
  onPrevious: (prevTab?: number, newTab?: number) => void
  currentData?: any
  setCurrentData: (data?: any) => void
}

export default function useCVTabsHook(): CVTabsHookReturnType {
  const [currentTab, setCurrentTab] = useState<number>(1)
  const [currentData, setCurrentData] = useState<any>()
  const [maxEnabledTab, setMaxEnabledTab] = useState<number>(1)

  return {
    currentTab,
    currentData,
    setCurrentData,
    setCurrentTab,
    maxEnabledTab,
    setMaxEnabledTab,
    onNext: (prevTab, newTab) => {
      if (currentTab == maxEnabledTab) {
        setCurrentTab(currentTab + 1)
        setMaxEnabledTab(maxEnabledTab + 1)
      } else if (currentTab < maxEnabledTab) {
        if (prevTab && newTab) {
          setCurrentTab(newTab)
        } else {
          setCurrentTab(currentTab + 1)
        }
      }
    },
    onPrevious: (prevTab, newTab) => {
      if (prevTab && newTab) {
        setCurrentTab(newTab)
      } else {
        setCurrentTab(currentTab - 1)
      }
    }
  }
}
