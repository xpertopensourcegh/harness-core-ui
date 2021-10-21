export enum AlertStatus {
  Danger,
  Warning,
  Info
}

interface CostStatusInfo {
  cost: number
  ratio: number
  percentage: number
  status: AlertStatus
}

export interface getAllBudgetCostInfoReturnType {
  actualCostStatus: CostStatusInfo
  forecastedCostStatus: CostStatusInfo
  budgetAmountStatus: CostStatusInfo
}

export const getAllBudgetCostInfo: (
  forecastedCost: number,
  actualCost: number,
  budgetAmount: number
) => getAllBudgetCostInfoReturnType = (forecastedCost, actualCost, budgetAmount) => {
  /**
   * Find out the max cost of all and it will be considered as 100%
   * and the rest of the cost percentages will be calculated based on that
   */

  const baseCost = Math.max(actualCost, forecastedCost, budgetAmount)
  const actualCostRatio = actualCost / baseCost
  const forecastCostRatio = forecastedCost / baseCost
  const budgetAmountRatio = budgetAmount / baseCost

  const actualCostPerWithBudget = (actualCost / budgetAmount) * 100
  const forecastCostPerWithBudget = (forecastedCost / budgetAmount) * 100

  const getAlertStatus: (percentage: number) => AlertStatus = percentage => {
    if (percentage > 100) {
      return AlertStatus.Danger
    }
    if (percentage > 90) {
      return AlertStatus.Warning
    }
    return AlertStatus.Info
  }

  const actualCostStatus: CostStatusInfo = {
    cost: actualCost,
    ratio: actualCostRatio,
    percentage: actualCostPerWithBudget,
    status: getAlertStatus(actualCostPerWithBudget)
  }
  const forecastedCostStatus: CostStatusInfo = {
    cost: forecastedCost,
    ratio: forecastCostRatio,
    percentage: forecastCostPerWithBudget,
    status: getAlertStatus(forecastCostPerWithBudget)
  }
  const budgetAmountStatus: CostStatusInfo = {
    cost: budgetAmount,
    ratio: budgetAmountRatio,
    percentage: 100,
    status: AlertStatus.Info
  }

  return {
    actualCostStatus,
    forecastedCostStatus,
    budgetAmountStatus
  }
}
