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

const appSections: AppSection[] = ['dashboard', 'members', 'destinations', 'voting', 'random', 'activities', 'itinerary', 'budget', 'memories', 'final', 'settings']

function getInitialSection(): AppSection {
  const section = new URLSearchParams(window.location.search).get('section')
  return appSections.includes(section as AppSection) ? (section as AppSection) : 'dashboard'
}

function App() {
  const [active, setActive] = useState<AppSection>(getInitialSection)
  const store = useTripStore()
  const { plan, setPlan } = store

  const navigate = (section: AppSection) => {
    setActive(section)
    const url = new URL(window.location.href)
    if (section === 'dashboard') {
      url.searchParams.delete('section')
    } else {
      url.searchParams.set('section', section)
    }
    window.history.replaceState(null, '', url)
  }

  return (
    <AppShell active={active} brand={plan.brand} onNavigate={navigate}>
      {active === 'dashboard' && <Dashboard plan={plan} onNavigate={(id) => navigate(id as AppSection)} />}
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
