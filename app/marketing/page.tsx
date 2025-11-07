
'use client';

import { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import './marketing.css';

export default function MarketingPage() {
  const [currentPage, setCurrentPage] = useState('page-home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const showPage = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm shadow-md w-full border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="font-display text-3xl font-bold text-primary cursor-pointer"
            onClick={() => showPage('page-home')}
          >
            Community Manager
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="dropdown">
              <span className="font-semibold text-lg text-muted-foreground hover:text-primary px-4 py-2 rounded-md cursor-pointer">
                For Boards
              </span>
              <div className="dropdown-content">
                <span className="dropdown-item" onClick={() => showPage('page-boards-overview')}>
                  Board Member Overview
                </span>
                <span className="dropdown-item" onClick={() => showPage('page-boards-features')}>
                  Features & Workflows
                </span>
                <span className="dropdown-item" onClick={() => showPage('page-boards-casestudies')}>
                  Board Case Studies
                </span>
              </div>
            </div>
            <div className="dropdown">
              <span className="font-semibold text-lg text-muted-foreground hover:text-primary px-4 py-2 rounded-md cursor-pointer">
                For Residents
              </span>
              <div className="dropdown-content">
                <span className="dropdown-item" onClick={() => showPage('page-residents-overview')}>
                  Resident Overview
                </span>
                <span className="dropdown-item" onClick={() => showPage('page-residents-howto')}>
                  Features & How-To
                </span>
              </div>
            </div>
            <div className="dropdown">
              <span className="font-semibold text-lg text-muted-foreground hover:text-primary px-4 py-2 rounded-md cursor-pointer">
                Platform
              </span>
              <div className="dropdown-content">
                <span className="dropdown-item" onClick={() => showPage('page-platform-flow')}>
                  The "Flow" Interface
                </span>
                <span className="dropdown-item" onClick={() => showPage('page-platform-integrations')}>
                  Integrations
                </span>
                <span className="dropdown-item" onClick={() => showPage('page-platform-security')}>
                  Security & Compliance
                </span>
              </div>
            </div>
            <span
              className="font-semibold text-lg text-muted-foreground hover:text-primary px-4 py-2 rounded-md cursor-pointer"
              onClick={() => showPage('page-pricing')}
            >
              Pricing
            </span>
            <span
              className="font-semibold text-lg text-muted-foreground hover:text-primary px-4 py-2 rounded-md cursor-pointer"
              onClick={() => showPage('page-why-us')}
            >
              Why Us
            </span>
            <div className="dropdown">
              <span className="font-semibold text-lg text-muted-foreground hover:text-primary px-4 py-2 rounded-md cursor-pointer">
                Resources
              </span>
              <div className="dropdown-content">
                <span className="dropdown-item" onClick={() => showPage('page-resources-hub')}>
                  Board Playbook Hub
                </span>
                <span className="dropdown-item" onClick={() => showPage('page-article-burnout')}>
                  Article: Condo Board Burnout
                </span>
                <span className="dropdown-item" onClick={() => showPage('page-article-dues')}>
                  Article: Collecting Delinquent Dues
                </span>
              </div>
            </div>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="btn btn-outline !border-border !text-foreground hover:!bg-muted"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
            <button className="btn btn-primary" onClick={() => showPage('page-pricing')}>
              Start Free Trial
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              id="mobile-menu-button"
              className="text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-card shadow-lg absolute top-20 left-0 w-full z-40 border-b border-border"
          >
            <div className="flex flex-col space-y-2 p-4">
              <span className="dropdown-item" onClick={() => showPage('page-boards-overview')}>
                For Boards: Overview
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-boards-features')}>
                For Boards: Features
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-boards-casestudies')}>
                For Boards: Case Studies
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-residents-overview')}>
                For Residents: Overview
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-residents-howto')}>
                For Residents: How-To
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-platform-flow')}>
                Platform: The &apos;Flow&apos; Interface
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-platform-integrations')}>
                Platform: Integrations
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-platform-security')}>
                Platform: Security
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-pricing')}>
                Pricing
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-why-us')}>
                Why Us
              </span>
              <span className="dropdown-item" onClick={() => showPage('page-resources-hub')}>
                Resources Hub
              </span>

              <div className="flex flex-col space-y-4 pt-4">
                <button
                  className="btn btn-outline !border-border !text-foreground hover:!bg-muted"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </button>
                <button className="btn btn-primary" onClick={() => showPage('page-pricing')}>
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Homepage */}
        {currentPage === 'page-home' && <HomePage showPage={showPage} setShowDemoModal={setShowDemoModal} />}
        
        {/* For Boards Pages */}
        {currentPage === 'page-boards-overview' && <BoardsOverview showPage={showPage} />}
        {currentPage === 'page-boards-features' && <BoardsFeatures showPage={showPage} />}
        {currentPage === 'page-boards-casestudies' && <BoardsCaseStudies showPage={showPage} />}
        
        {/* For Residents Pages */}
        {currentPage === 'page-residents-overview' && <ResidentsOverview showPage={showPage} />}
        {currentPage === 'page-residents-howto' && <ResidentsHowTo showPage={showPage} />}
        
        {/* Platform Pages */}
        {currentPage === 'page-platform-flow' && <PlatformFlow showPage={showPage} />}
        {currentPage === 'page-platform-integrations' && <PlatformIntegrations showPage={showPage} />}
        {currentPage === 'page-platform-security' && <PlatformSecurity showPage={showPage} />}
        
        {/* Other Pages */}
        {currentPage === 'page-pricing' && <Pricing showPage={showPage} />}
        {currentPage === 'page-why-us' && <WhyUs showPage={showPage} />}
        {currentPage === 'page-resources-hub' && <ResourcesHub showPage={showPage} />}
        {currentPage === 'page-article-burnout' && <ArticleBurnout showPage={showPage} />}
        {currentPage === 'page-article-dues' && <ArticleDues showPage={showPage} />}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setShowLoginModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-display mb-4 text-foreground">Login</h2>
            <p className="text-muted-foreground mb-6">
              Access your Community Manager dashboard to manage your association.
            </p>
            <a href="/auth/login" className="btn btn-primary w-full block text-center">
              Go to Login
            </a>
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setShowDemoModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-display mb-4 text-foreground">Schedule a Demo</h2>
            <p className="text-muted-foreground mb-6">
              See Community Manager in action with a personalized 15-minute demo.
            </p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground"
              />
              <button type="submit" className="btn btn-primary w-full">
                Request Demo
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Component definitions for each page section
function HomePage({ showPage, setShowDemoModal }: { showPage: (id: string) => void; setShowDemoModal: (show: boolean) => void }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center md:text-left relative z-10">
            <h1 className="text-5xl md:text-7xl font-display font-normal mb-6 leading-tight">
              Finally. Condo Management That <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-semibold">Actually</span> Feels Simple.
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-10 leading-relaxed">
              Tired of juggling spreadsheets, endless emails, and clunky software just to manage your Chicago condo?
              Community Manager is the simple, modern, and neighborly platform born in Ravenswood, built specifically
              for self-managed associations like yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="btn btn-primary shadow-lg" onClick={() => showPage('page-boards-overview')}>
                I&apos;m a Board Member
              </button>
              <button className="btn btn-secondary shadow-lg" onClick={() => showPage('page-residents-overview')}>
                I&apos;m a Resident
              </button>
            </div>
          </div>
          {/* Right: Visual */}
          <div>
            <img
              src="https://placehold.co/600x450/2B8ED9/FFFFFF?text=Community+3-Flat+Illustration"
              alt="Illustration of a Chicago 3-Flat"
              className="rounded-2xl shadow-xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Born in Ravenswood Section */}
      <section className="py-24 bg-gradient-to-b from-background to-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-normal mb-6">Born in Ravenswood. Built for Your 3-Flat.</h2>
          <p className="text-xl text-foreground mb-6 leading-relaxed">
            We&apos;re not some giant, faceless tech company from a coast far away. We&apos;re your neighbors.
          </p>
          <p className="text-xl text-foreground mb-10 leading-relaxed">
            Community Manager was founded by a Ravenswood condo board president who was &quot;stuck in those late-night
            meetings&quot; and knew there had to be a &quot;simpler, more human way&quot; to manage a multi-million
            dollar asset (your homes!) than with a &quot;messy spreadsheet and a free email account.&quot;
          </p>
          <div className="relative bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-l-8 border-accent p-8 rounded-xl shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"></div>
            <p className="text-2xl font-semibold text-foreground leading-relaxed relative z-10">
              We are built for the <strong className="font-bold bg-gradient-to-r from-accent to-accent-warm bg-clip-text text-transparent">&quot;Strategic Missing Middle&quot;</strong> of
              Chicago&apos;s housing: the 2-flats, 3-flats, 6-flats, and vintage walk-ups in neighborhoods like Lincoln
              Square, North Center, Lakeview, and Ravenswood.
            </p>
          </div>
        </div>
      </section>

      {/* Find Your Flow Section */}
      <section className="py-24 bg-gradient-to-b from-card to-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-normal mb-6">
              Stop Drowning in Spreadsheets. Find Your Flow.
            </h2>
            <p className="text-xl text-foreground mb-6 leading-relaxed">
              The problem with &quot;management by spreadsheet&quot; isn&apos;t just that it&apos;s messy—it&apos;s
              that it forces your brain to work in 12 different tabs.
            </p>
            <p className="text-xl text-foreground leading-relaxed">
              Our <strong className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">&quot;Flow&quot; Interface</strong> is different. Inspired by the simple, card-based design
              of modern apps, &quot;Flow&quot; brings everything to you. A work order isn&apos;t just a spreadsheet
              row—it&apos;s a living *card* that holds the request, the conversation, the invoice, and the payment
              status, all in one clean view.
            </p>
          </div>

          {/* LoomOS Inspired Visual */}
          <div className="flow-container">
            {/* Card 1 */}
            <div className="flow-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-2xl font-normal text-foreground">Leak - Unit 2A</h3>
                <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Urgent
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Water dripping from my bathroom ceiling! Attaching video.&quot;
              </p>
              <img
                src="https://placehold.co/300x150/FEE2E2/DC2626?text=Leaking+Ceiling+Video"
                alt="Leaking ceiling"
                className="rounded-lg mb-4"
              />
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Assignee:</strong> Northside Plumbers
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Status:</strong> In Progress
              </p>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm text-muted-foreground/80">Last update: &quot;On my way.&quot; - 2m ago</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flow-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-2xl font-normal text-foreground">Spring Landscaping</h3>
                <span className="bg-info/10 text-info text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Planning
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Collecting bids for spring mulch, planting, and cleanup.&quot;
              </p>
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-semibold text-foreground">Bid 1: GreenLeaf</p>
                  <p className="text-sm text-muted-foreground">$1,200.00</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-semibold text-foreground">Bid 2: Ravenswood Gardens</p>
                  <p className="text-sm text-muted-foreground">$1,050.00</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-semibold text-foreground">Bid 3: Lincoln Sq. Landscaping</p>
                  <p className="text-sm text-muted-foreground">$1,100.00</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <button className="btn btn-outline w-full text-sm py-2">Discuss Bids</button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flow-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-2xl font-normal text-foreground">Invoice #1045</h3>
                <span className="bg-warning/10 text-warning text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Invoice from Northside Plumbers for Unit 2A.&quot;
              </p>
              <div className="bg-muted p-4 rounded-lg text-center mb-4">
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-4xl font-bold text-foreground">$285.00</p>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Vendor:</strong> Northside Plumbers
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Status:</strong> Awaiting Payment
              </p>
              <div className="absolute bottom-6 left-6 right-6 flex space-x-2">
                <button className="btn btn-primary w-full text-sm py-2">Pay via QBO</button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flow-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-2xl font-normal text-foreground">Rooftop Booking</h3>
                <span className="bg-success/10 text-success text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Completed
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Unit 4B has reserved the rooftop deck.&quot;
              </p>
              <div className="bg-muted p-4 rounded-lg text-center mb-4">
                <p className="text-lg font-semibold text-foreground">Sat, Nov 8th</p>
                <p className="text-md text-muted-foreground">6:00 PM - 10:00 PM</p>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Reserved By:</strong> Mike B. (Unit 4B)
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Status:</strong> Confirmed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-normal mb-6">
              The Tools of a Loop High-Rise, The Soul of a Neighborhood Walk-Up
            </h2>
            <p className="text-xl text-foreground">
              We professionalize your volunteer efforts by giving you the powerful, specialized tools you *actually*
              need—without the bloat, cost, or complexity of enterprise software.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Finance (QuickBooks) */}
            <div className="feature-card feature-finance p-8 border border-border">
              <div className="feature-card-icon text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-normal text-foreground mb-4">Full QuickBooks Sync</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stop the double-entry nightmare. Our seamless, two-way integration means your dues, assessments, and
                vendor payments are always perfectly in sync with your accounting.
              </p>
            </div>

            {/* Feature 2 - Admin (AI Assistant) */}
            <div className="feature-card feature-admin p-8 border border-border">
              <div className="feature-card-icon text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-normal text-foreground mb-4">Your AI Governance Assistant</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stop digging through PDFs. Ask, &quot;What&apos;s our rule on emotional support animals?&quot; and get
                an instant, accurate answer with a direct link to the source document.
              </p>
            </div>

            {/* Feature 3 - Documents/Finance (Payments) */}
            <div className="feature-card feature-documents p-8 border border-border">
              <div className="feature-card-icon text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-normal text-foreground mb-4">Painless Payments & Your Own Bank</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Collect dues online via ACH or credit card. Send automated reminders. Best of all? We have a{' '}
                <strong>Bring-Your-Own-Bank (BYOB)</strong> philosophy. It&apos;s your money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-normal mb-6">Don&apos;t Just Take Our Word For It</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="testimonial-card !bg-muted">
              <blockquote>
                &quot;Before Community Manager, I was the &apos;spreadsheet treasurer&apos; for our 6-flat in Lincoln
                Square. It was a nightmare of VLOOKUPs and manual bank reconciliation. The QuickBooks Sync alone saved
                me 10 hours a month. I finally have my Tuesday nights back.&quot;
              </blockquote>
              <cite>— Sarah J., Board Treasurer, Lincoln Square 6-Flat</cite>
            </div>
            <div className="testimonial-card !bg-muted">
              <blockquote>
                &quot;Our 4-unit building in Ravenswood is a multi-million dollar asset, and we were managing it with
                Gmail. The &apos;Flow&apos; system made handling a recent roof leak so simple. I could see the
                resident&apos;s photo, the roofer&apos;s quote, and the board&apos;s vote all in one place.&quot;
              </blockquote>
              <cite>— Mike B., Board President, Ravenswood 4-Flat</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section with Gradient */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-dark/30 to-accent/20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-normal text-white mb-8">Ready to Ditch the Chaos?</h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            See how a platform &quot;born in Ravenswood&quot; can bring harmony to your Chicago condo association. Get
            a 15-minute demo or start your 14-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-secondary shadow-xl" onClick={() => showPage('page-pricing')}>
              Start My Free Trial
            </button>
            <button
              className="btn btn-outline !bg-white !text-primary !border-white hover:!bg-white/90 shadow-lg"
              onClick={() => setShowDemoModal(true)}
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Placeholder components for other pages (I'll create these in the next files)
function BoardsOverview({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>
        You Volunteered to Help Your Community, Not to Become a Part-Time Accountant, IT Manager, and Collections
        Agent.
      </h1>
      <p className="text-2xl text-muted-foreground">
        You raised your hand at an annual meeting, and suddenly you&apos;re drowning.
      </p>
      <p>
        You&apos;re &quot;stuck in those late-night meetings&quot;, wrestling with a &quot;messy spreadsheet&quot;
        that holds your association&apos;s entire financial life. You&apos;re hounding your neighbors for checks,
        digging through old emails for a plumber&apos;s quote, and Googling &quot;how to collect condo dues in
        Illinois&quot; at 11 PM, terrified of the legal and financial risk.
      </p>
      <p>
        This is <strong>condo board volunteer burnout</strong>. It&apos;s real, and it&apos;s a direct consequence of
        trying to manage a &quot;multi-million dollar asset&quot; with tools that weren&apos;t built for the job.
      </p>
      <p>
        <strong>We get it. We *were* you.</strong> Our founder was a board president in Ravenswood facing this exact
        &quot;chaos.&quot; Community Manager is the tool he wishes he had. It&apos;s the simple, powerful, and
        empathetic platform designed to give you your time—and your sanity—back.
      </p>

      <h2>This is a &quot;Community Manager&quot; Board.</h2>
      <p>Imagine a different way to run your association.</p>
      <ul>
        <li>
          You wake up, open one dashboard, and see that <strong>100% of dues</strong> have been collected
          automatically.
        </li>
        <li>
          A resident reports a <strong>leaky sink</strong> with a photo. The issue is automatically routed to your
          plumber, and you just monitor the &quot;Flow&quot; card. No endless email chain.
        </li>
        <li>
          A new owner asks about the <strong>pet policy</strong>. Instead of searching your hard drive, you tell them
          to ask the <strong>AI Assistant</strong>, which provides the answer in 10 seconds.
        </li>
        <li>
          Your treasurer spends <strong>20 minutes</strong>, not 10 hours, closing the books for the month because
          every payment and expense is already <strong>synced with QuickBooks</strong>.
        </li>
        <li>
          Your board meeting is <strong>30 minutes long</strong> because everyone already has the financial reports,
          maintenance updates, and documents.
        </li>
      </ul>
      <p>This isn&apos;t a fantasy. This is management in &quot;Flow.&quot; This is what harmony looks like.</p>

      <h2>A &apos;Before & After&apos; for Chicago Condo Boards</h2>
      <p>See how Community Manager professionalizes your volunteer role, one task at a time.</p>

      <div className="grid md:grid-cols-2 gap-8 my-10">
        <div className="comparison-card comparison-card-before">
          <h3 className="text-destructive">BEFORE: The &quot;Spreadsheet Wrangler&quot;</h3>
          <p>
            You&apos;re the part-time accountant. You manually download bank statements, tick-and-tie payments in a
            &quot;messy spreadsheet,&quot; and then re-enter *everything* into QuickBooks. It&apos;s &quot;simple
            accounting for a 3-flat&quot; that feels anything but simple.
          </p>
        </div>
        <div className="comparison-card comparison-card-after">
          <h3 className="text-success">AFTER: The &quot;QuickBooks Commander&quot;</h3>
          <p>
            You&apos;re the commander. You log in, and our full, two-way QuickBooks Sync has already matched 90% of
            your transactions. You approve the matches, and your books are done. Your P&L and Balance Sheet are always
            100% accurate.
          </p>
        </div>

        <div className="comparison-card comparison-card-before">
          <h3 className="text-destructive">BEFORE: The &quot;Rulebook Archaeologist&quot;</h3>
          <p>
            A resident asks, &quot;Are we allowed to install a window A/C unit?&quot; You spend 45 minutes digging
            through a 150-page PDF of your bylaws from 2003, hoping you find the right amendment.
          </p>
        </div>
        <div className="comparison-card comparison-card-after">
          <h3 className="text-success">AFTER: The &quot;AI-Powered Sage&quot;</h3>
          <p>
            You (or the resident) type into the <strong>AI Governance Assistant</strong>: &quot;What is the policy on
            window A/C units?&quot; It instantly replies with the exact rule, section, and a link to the document.
          </p>
        </div>

        <div className="comparison-card comparison-card-before">
          <h3 className="text-destructive">BEFORE: The &quot;12-Tab Juggler&quot;</h3>
          <p>
            You&apos;re managing the &quot;spring landscaping project&quot; with your Gmail inbox, a Notes app, a
            spreadsheet for bids, and a folder of PDF contracts. You&apos;re &quot;drowning in 12 tabs&quot; and *know*
            something is falling through the cracks.
          </p>
        </div>
        <div className="comparison-card comparison-card-after">
          <h3 className="text-success">AFTER: The &quot;Flow Conductor&quot;</h3>
          <p>
            You create one &quot;Flow&quot; card for the project. It holds all the bids, the chosen vendor&apos;s
            contract and insurance, the timeline, the invoices, and the board&apos;s approval vote. It&apos;s your
            single source of truth.
          </p>
        </div>
      </div>

      <h2>Your Most Pressing Questions (Board-Specific FAQ)</h2>
      <h3>We&apos;re a 3-flat. Is this too much for us?</h3>
      <p>
        No. This is built *for* you. The &quot;chaos&quot; of a 3-flat is just as real as a 30-unit building—the risk
        is the same. We give you the *minimum effective dose* of professionalism. You&apos;ll use the payments,
        &quot;Flow&quot; system, and document hub every day.
      </p>
      <h3>Our treasurer *loves* QuickBooks. Will this mess up their system?</h3>
      <p>
        It will make their life *better*. Our QuickBooks Sync is our #1 feature, built for exactly this person. It
        connects *to* their existing QuickBooks Online account (or helps you set one up) and eliminates 90% of the
        manual data entry.
      </p>
      <h3>We have one board member who is not tech-savvy. Will they be left behind?</h3>
      <p>
        We designed Community Manager with the &quot;Empathetic Local Expert&quot; voice. The interface is clean,
        simple, and built on the design principles of &quot;Community Warmth&quot; and clarity. If they can use email,
        they can use Community Manager. We also provide full onboarding and support.
      </p>

      <div className="text-center mt-16">
        <button className="btn btn-primary" onClick={() => showPage('page-pricing')}>
          Start My 14-Day Free Trial
        </button>
      </div>
    </div>
  );
}

// I'll create stub components for the remaining pages
function BoardsFeatures({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>The Command Center for Your Self-Managed Association</h1>
      <p className="text-2xl text-muted-foreground">
        Features & Workflows page content goes here...
      </p>
      <div className="text-center mt-16">
        <button className="btn btn-primary" onClick={() => showPage('page-pricing')}>
          Start My 14-Day Free Trial
        </button>
      </div>
    </div>
  );
}

function BoardsCaseStudies({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>How Chicago Boards Like Yours Found Harmony</h1>
      <p className="text-2xl text-muted-foreground">
        Case studies page content goes here...
      </p>
    </div>
  );
}

function ResidentsOverview({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Your Home, Simplified.</h1>
      <p className="text-2xl text-muted-foreground">
        Resident overview content goes here...
      </p>
    </div>
  );
}

function ResidentsHowTo({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Your Guide to the Community Manager Resident Portal</h1>
      <p className="text-2xl text-muted-foreground">
        Resident how-to content goes here...
      </p>
    </div>
  );
}

function PlatformFlow({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Stop Drowning in 12 Tabs. Find Your Flow.</h1>
      <p className="text-2xl text-muted-foreground">
        Platform Flow content goes here...
      </p>
    </div>
  );
}

function PlatformIntegrations({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Integrations</h1>
      <p className="text-2xl text-muted-foreground">
        Platform integrations content goes here...
      </p>
    </div>
  );
}

function PlatformSecurity({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Security & Compliance</h1>
      <p className="text-2xl text-muted-foreground">
        Security content goes here...
      </p>
    </div>
  );
}

function Pricing({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Pricing</h1>
      <p className="text-2xl text-muted-foreground">
        Pricing content goes here...
      </p>
    </div>
  );
}

function WhyUs({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Why Us</h1>
      <p className="text-2xl text-muted-foreground">
        Why Us content goes here...
      </p>
    </div>
  );
}

function ResourcesHub({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Board Playbook Hub</h1>
      <p className="text-2xl text-muted-foreground">
        Resources content goes here...
      </p>
    </div>
  );
}

function ArticleBurnout({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Article: Condo Board Burnout</h1>
      <p className="text-2xl text-muted-foreground">
        Burnout article content goes here...
      </p>
    </div>
  );
}

function ArticleDues({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Article: Collecting Delinquent Dues</h1>
      <p className="text-2xl text-muted-foreground">
        Dues article content goes here...
      </p>
    </div>
  );
}
