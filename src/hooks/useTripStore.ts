import { useEffect, useMemo, useState } from 'react'
import { defaultBrandSettings, initialTripPlan, tripMemories } from '../data/mockData'
import type { TripPlan } from '../types'

const STORAGE_KEY = 'tripvote-local-plan-v1'

function normalizePlan(plan: Partial<TripPlan>): TripPlan {
  return {
    ...initialTripPlan,
    ...plan,
    brand: {
      ...defaultBrandSettings,
      ...(plan.brand ?? {}),
      groupName: plan.brand?.groupName || defaultBrandSettings.groupName,
      groupSubtitle: plan.brand?.groupSubtitle ?? '',
    },
    tripMemories: plan.tripMemories ?? tripMemories,
  }
}

function loadPlan(): TripPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalizePlan(JSON.parse(raw) as Partial<TripPlan>) : initialTripPlan
  } catch {
    return initialTripPlan
  }
}

export function useTripStore() {
  const [plan, setPlan] = useState<TripPlan>(loadPlan)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
  }, [plan])

  const actions = useMemo(
    () => ({
      setPlan,
      resetDemo: () => setPlan(initialTripPlan),
      clearLocal: () => {
        localStorage.removeItem(STORAGE_KEY)
        setPlan(initialTripPlan)
      },
      exportJson: () => JSON.stringify(plan, null, 2),
      importJson: (json: string) => {
        const next = JSON.parse(json) as Partial<TripPlan>
        setPlan(normalizePlan(next))
      },
    }),
    [plan],
  )

  return { plan, ...actions }
}
