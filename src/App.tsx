import { useState } from 'react'
import { ActivitiesPage } from './components/Activities/ActivitiesPage'
import { BudgetPage } from './components/Budget/BudgetPage'
import { Dashboard } from './components/Dashboard/Dashboard'
import { DestinationsPage } from './components/Destinations/DestinationsPage'
import { FinalPlanPage } from './components/FinalPlan/FinalPlanPage'
import { ItineraryPage } from './components/Itinerary/ItineraryPage'
import { AppShell, type AppSection } from './components/Layout/AppShell'
import { MembersPage } from './components/Members/MembersPage'
import { TripMemoriesPage } from './components/TripMemories/TripMemoriesPage'
import { RandomTripPage } from './components/RandomTrip/RandomTripPage'
import { SettingsPage } from './components/Settings/SettingsPage'
import { VotingPage } from './components/Voting/VotingPage'
import { useTripStore } from './hooks/useTripStore'

function App() {
  const [active, setActive] = useState<AppSection>('dashboard')
  const store = useTripStore()
  const { plan, setPlan } = store

  return (
    <AppShell active={active} brand={plan.brand} onNavigate={(section) => setActive(section)}>
      {active === 'dashboard' && <Dashboard plan={plan} onNavigate={(id) => setActive(id as AppSection)} />}
      {active === 'members' && <MembersPage plan={plan} setPlan={setPlan} />}
      {active === 'destinations' && <DestinationsPage plan={plan} setPlan={setPlan} />}
      {active === 'voting' && <VotingPage plan={plan} />}
      {active === 'random' && <RandomTripPage plan={plan} setPlan={setPlan} />}
      {active === 'activities' && <ActivitiesPage plan={plan} setPlan={setPlan} />}
      {active === 'itinerary' && <ItineraryPage plan={plan} setPlan={setPlan} />}
      {active === 'budget' && <BudgetPage plan={plan} setPlan={setPlan} />}
      {active === 'memories' && <TripMemoriesPage plan={plan} setPlan={setPlan} />}
      {active === 'final' && <FinalPlanPage plan={plan} setPlan={setPlan} />}
      {active === 'settings' && <SettingsPage plan={plan} setPlan={setPlan} resetDemo={store.resetDemo} clearLocal={store.clearLocal} exportJson={store.exportJson} importJson={store.importJson} />}
    </AppShell>
  )
}

export default App
