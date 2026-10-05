import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './pages/OverviewPage';
import { ProblemPage } from './pages/ProblemPage';
import { RequirementsPage } from './pages/RequirementsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { InventoryPage } from './pages/InventoryPage';
import { ReservationPage } from './pages/ReservationPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderPage } from './pages/OrderPage';
import { DatabasePage } from './pages/DatabasePage';
import { ApiPage } from './pages/ApiPage';
import { IdempotencyPage } from './pages/IdempotencyPage';
import { OutboxPage } from './pages/OutboxPage';
import { ScalabilityPage } from './pages/ScalabilityPage';
import { RateLimitingPage } from './pages/RateLimitingPage';
import { ReliabilityPage } from './pages/ReliabilityPage';
import { ObservabilityPage } from './pages/ObservabilityPage';
import { SecurityPage } from './pages/SecurityPage';
import { TestingPage } from './pages/TestingPage';
import { SimulationPage } from './pages/SimulationPage';
import { TradeoffsPage } from './pages/TradeoffsPage';
import { AdrPage } from './pages/AdrPage';
import { JuryQAPage } from './pages/JuryQAPage';
import { PresentationPage } from './pages/PresentationPage';

export function App() {
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'overview';
  };

  const [activePage, setActivePage] = useState<string>(getInitialPage());

  useEffect(() => {
    const handleHashChange = () => {
      const page = getInitialPage();
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageId: string) => {
    window.location.hash = `#/${pageId}`;
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section 39: If presentation mode is active, render without sidebar or global shell for true keynote feel
  if (activePage === 'presentation') {
    return <PresentationPage onNavigate={handleNavigate} />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage onNavigate={handleNavigate} />;
      case 'problem':
        return <ProblemPage />;
      case 'requirements':
        return <RequirementsPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'inventory':
        return <InventoryPage />;
      case 'reservation':
        return <ReservationPage />;
      case 'payment':
        return <PaymentPage />;
      case 'order':
        return <OrderPage />;
      case 'database':
        return <DatabasePage />;
      case 'apis':
        return <ApiPage />;
      case 'idempotency':
        return <IdempotencyPage />;
      case 'outbox':
        return <OutboxPage />;
      case 'scalability':
        return <ScalabilityPage />;
      case 'ratelimiting':
        return <RateLimitingPage />;
      case 'reliability':
        return <ReliabilityPage />;
      case 'observability':
        return <ObservabilityPage />;
      case 'security':
        return <SecurityPage />;
      case 'testing':
        return <TestingPage />;
      case 'simulation':
        return <SimulationPage />;
      case 'tradeoffs':
        return <TradeoffsPage />;
      case 'adrs':
        return <AdrPage />;
      case 'juryqa':
        return <JuryQAPage />;
      default:
        return <OverviewPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate}>
      {renderActivePage()}
    </Layout>
  );
}

export default App;
