import { createAction } from '@reduxjs/toolkit'
import { BaseChartData, CumulativeChartData, RealTimeAnalytic } from 'types/analytics'

export const updateFilterDateRange = createAction<[Date, Date]>('analytics/updateFilterDateRange')
