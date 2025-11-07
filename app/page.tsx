
'use client';

import { useState, useEffect } from 'react';
import { X, Menu, BookCheck, Sparkles, Banknote, CreditCard, Wrench, Calendar, Folder } from 'lucide-react';
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
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-normal mb-6">
              A Professional, Simple Approach to Condo Management.
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-10">
              Managing a self-run Chicago condo association can be overwhelming, often involving complex spreadsheets, constant emails, and inefficient software. Community Manager is the simple, modern platform—developed in Ravenswood—built specifically for self-managed associations like yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="btn btn-primary" onClick={() => showPage('page-boards-overview')}>
                I&apos;m a Board Member
              </button>
              <button className="btn btn-secondary" onClick={() => showPage('page-residents-overview')}>
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
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-normal mb-6">Born in Ravenswood. Built for Your 3-Flat.</h2>
          <p className="text-xl text-foreground mb-6">
            We&apos;re not some giant, faceless tech company from a coast far away. We&apos;re your neighbors.
          </p>
          <p className="text-xl text-foreground mb-10">
            Community Manager was founded by a Ravenswood condo board president who was &quot;stuck in those late-night
            meetings&quot; and knew there had to be a &quot;simpler, more human way&quot; to manage a multi-million
            dollar asset (your homes!) than with an &quot;inefficient spreadsheet and a free email account.&quot;
          </p>
          <div className="bg-accent/10 border-l-8 border-accent p-8 rounded-lg text-left">
            <p className="text-2xl font-semibold text-foreground">
              We are built for the <strong className="font-bold">&quot;Strategic Missing Middle&quot;</strong> of
              Chicago&apos;s housing: the 2-flats, 3-flats, 6-flats, and vintage walk-ups in neighborhoods like Lincoln
              Square, North Center, Lakeview, and Ravenswood.
            </p>
          </div>
        </div>
      </section>

      {/* Find Your Flow Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-normal mb-6">Move Beyond Spreadsheets. Find Your Flow.</h2>
            <p className="text-xl text-foreground mb-6">
              The problem with &quot;management by spreadsheet&quot; isn&apos;t just that it&apos;s inefficient—it&apos;s that it creates a disjointed workflow across multiple applications.
            </p>
            <p className="text-xl text-foreground">
              Our <strong>&quot;Flow&quot; Interface</strong> is different. Inspired by the simple, card-based design of modern apps, &quot;Flow&quot; brings everything to you. A work order isn&apos;t just a spreadsheet row—it&apos;s a living *card* that holds the request, the conversation, the invoice, and the payment status, all in one clear, consolidated view.
            </p>
          </div>

          {/* WebOS Inspired Visual */}
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
              We professionalize your volunteer efforts by providing the powerful, specialized tools you need—without the bloat, cost, or complexity of enterprise software.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
              <BookCheck className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-2xl font-normal text-foreground mb-4">Full QuickBooks Sync</h3>
              <p className="text-lg text-muted-foreground">
                End the double-entry challenges. Our seamless, two-way integration means your dues, assessments, and
                vendor payments are always perfectly in sync with your accounting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
              <Sparkles className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-2xl font-normal text-foreground mb-4">Your AI Governance Assistant</h3>
              <p className="text-lg text-muted-foreground">
                Find answers without digging through PDFs. Ask, &quot;What&apos;s our rule on emotional support animals?&quot; and get
                an instant, accurate answer with a direct link to the source document.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
              <Banknote className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-2xl font-normal text-foreground mb-4">Painless Payments & Your Own Bank</h3>
              <p className="text-lg text-muted-foreground">
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
                Square. It was a challenge of VLOOKUPs and manual bank reconciliation. The QuickBooks Sync alone saved
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

      {/* Final CTA Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-normal text-white mb-8">Ready for a Simpler Way to Manage?</h2>
          <p className="text-xl text-primary-foreground/90 mb-10">
            See how a platform &quot;born in Ravenswood&quot; can bring order and harmony to your Chicago condo association. Get
            a 15-minute demo or start your 14-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-secondary" onClick={() => showPage('page-pricing')}>
              Start My Free Trial
            </button>
            <button
              className="btn btn-outline !bg-primary-foreground !text-primary !border-primary-foreground hover:!bg-white/80"
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

// Placeholder components for other pages
function BoardsOverview({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Focus on Your Community, Not the Administrative Burdens.</h1>
      <p className="text-2xl text-muted-foreground">
        You raised your hand at an annual meeting, and suddenly you&apos;re overwhelmed.
      </p>
      <p>
        You&apos;re &quot;stuck in those late-night meetings&quot;, wrestling with an &quot;inefficient spreadsheet&quot;
        that holds your association&apos;s entire financial life. You&apos;re hounding your neighbors for checks,
        digging through old emails for a plumber&apos;s quote, and Googling &quot;how to collect condo dues in
        Illinois&quot; at 11 PM, concerned about the legal and financial risk.
      </p>
      <p>
        This is <strong>condo board volunteer burnout</strong>. It&apos;s real, and it&apos;s a direct consequence of
        trying to manage a &quot;multi-million dollar asset&quot; with tools that weren&apos;t built for the job.
      </p>
      <p>
        <strong>We get it. We *were* you.</strong> Our founder was a board president in Ravenswood facing this exact
        &quot;challenge.&quot; Community Manager is the tool he wishes he had. It&apos;s the simple, powerful, and
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
        <div className="bg-destructive/10 p-6 rounded-lg border-l-4 border-destructive">
          <h3 className="text-foreground">BEFORE: The &quot;Spreadsheet Wrangler&quot;</h3>
          <p>
            You&apos;re the part-time accountant. You manually download bank statements, tick-and-tie payments in an
            &quot;inefficient spreadsheet,&quot; and then re-enter *everything* into QuickBooks. It&apos;s &quot;simple
            accounting for a 3-flat&quot; that feels anything but simple.
          </p>
        </div>
        <div className="bg-success/10 p-6 rounded-lg border-l-4 border-success">
          <h3 className="text-foreground">AFTER: The &quot;QuickBooks Commander&quot;</h3>
          <p>
            You&apos;re the commander. You log in, and our full, two-way QuickBooks Sync has already matched 90% of
            your transactions. You approve the matches, and your books are done. Your P&L and Balance Sheet are always
            100% accurate.
          </p>
        </div>

        <div className="bg-destructive/10 p-6 rounded-lg border-l-4 border-destructive">
          <h3 className="text-foreground">BEFORE: The &quot;Rulebook Archaeologist&quot;</h3>
          <p>
            A resident asks, &quot;Are we allowed to install a window A/C unit?&quot; You spend 45 minutes digging
            through a 150-page PDF of your bylaws from 2003, hoping you find the right amendment.
          </p>
        </div>
        <div className="bg-success/10 p-6 rounded-lg border-l-4 border-success">
          <h3 className="text-foreground">AFTER: The &quot;AI-Powered Sage&quot;</h3>
          <p>
            You (or the resident) type into the <strong>AI Governance Assistant</strong>: &quot;What is the policy on
            window A/C units?&quot; It instantly replies with the exact rule, section, and a link to the document.
          </p>
        </div>

        <div className="bg-destructive/10 p-6 rounded-lg border-l-4 border-destructive">
          <h3 className="text-foreground">BEFORE: The &quot;12-Tab Juggler&quot;</h3>
          <p>
            You&apos;re managing the &quot;spring landscaping project&quot; with your Gmail inbox, a Notes app, a
            spreadsheet for bids, and a folder of PDF contracts. You&apos;re &quot;drowning in 12 tabs&quot; and *know*
            something is falling through the cracks.
          </p>
        </div>
        <div className="bg-success/10 p-6 rounded-lg border-l-4 border-success">
          <h3 className="text-foreground">AFTER: The &quot;Flow Conductor&quot;</h3>
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
        No. This is built *for* you. The &quot;challenge&quot; of a 3-flat is just as real as a 30-unit building—the risk
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

// Stub components for remaining pages
function BoardsFeatures({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>The Command Center for Your Self-Managed Association</h1>
      <p className="text-2xl text-muted-foreground">
        You don&apos;t need *more* features. You need the *right* features, working together in harmony. Community Manager is an integrated platform where every tool is designed to solve a specific problem for self-managed boards—from &quot;simple accounting for a 3-flat&quot; to complex maintenance tracking.
      </p>

      <h2>Finance That *Actually* Makes Sense. (Built for Treasurers)</h2>
      <p>This is our cornerstone. We believe that managing your association&apos;s money should be transparent, accurate, and simple.</p>

      <h3>Full, Two-Way QuickBooks Sync: The Core of Your Financials</h3>
      <p>This isn&apos;t the &quot;CSV export&quot; some competitors offer. This is a real-time, two-way API integration with QuickBooks Online.</p>
      <ul>
        <li><strong>How it Works:</strong> When a resident pays dues in Community Manager, the invoice is automatically created in QBO and marked as paid. When you pay a plumber&apos;s bill in QBO, the expense is synced back to Community Manager and attached to the correct vendor and maintenance ticket.</li>
        <li><strong>The Benefit:</strong> Your treasurer lives in QuickBooks, the system they know and trust. Your board lives in Community Manager, the simple interface for operations. They stay perfectly in sync, always. No double-entry.</li>
      </ul>
      <img src="https://placehold.co/800x450/EBF5FE/2B8ED9?text=QuickBooks+Sync+Dashboard" alt="QuickBooks Sync Dashboard" className="rounded-2xl shadow-xl w-full my-8" />

      <h3>Bring-Your-Own-Bank (BYOB) Philosophy</h3>
      <p>We are not a bank, and we won&apos;t force you to switch to one. Unlike competitors who lock your funds into their preferred, high-fee partners, we believe in an open platform. We integrate securely with your *existing* association bank account. It&apos;s your money; you should keep it where you want.</p>

      <h3>Painless Payments & Dues Collection</h3>
      <p>Stop being the part-time collections agent.</p>
      <ul>
        <li><strong>Resident Portal:</strong> Residents can pay dues, special assessments, and other fees via secure ACH (e-check) or credit card.</li>
        <li><strong>Auto-Pay:</strong> Encourage residents to &quot;set it and forget it&quot; with auto-pay, just like their other bills.</li>
        <li><strong>Automated Reminders:</strong> Our system automatically sends polite, professional reminders before and after the due date.</li>
        <li><strong>Automated Late Fees:</strong> We automatically apply late fees based on the rules *you* set, ensuring fair and consistent enforcement.</li>
      </ul>

      <h2>Operations & Maintenance, Simplified (Built for Presidents)</h2>
      <p>Turn maintenance complexity into a calm, trackable &quot;Flow.&quot;</p>

      <h3>The &apos;Flow&apos; Work Order System</h3>
      <p>This is our card-based approach to task management.</p>
      <ul>
        <li><strong>How it Works:</strong> A resident submits a &quot;work order&quot; (e.g., &quot;Hallway light is out&quot;) with a photo. This creates a &quot;Flow Card.&quot;</li>
        <li><strong>Triage:</strong> Your board can discuss the card internally, assign it to a board member, or assign it to a vendor.</li>
        <li><strong>Track:</strong> The card holds all communication, bids, invoices, and status updates. When the plumber messages you, it&apos;s *on the card*, not lost in your personal email.</li>
        <li><strong>Resolve:</strong> When the work is done and the invoice is paid (synced from QBO!), you close the card. It&apos;s now part of your building&apos;s permanent, searchable history.</li>
      </ul>
      <img src="https://placehold.co/800x450/E0E7FF/2B8ED9?text=Flow+Work+Order+System" alt="Flow Work Order System" className="rounded-2xl shadow-xl w-full my-8" />

      <h2>Governance & Communication, Without the Confusion (Built for Secretaries)</h2>
      <p>Professionalize your communication and protect your association&apos;s legal standing.</p>

      <h3>Your AI Governance Assistant: &apos;Ask Your Bylaws&apos;</h3>
      <p>This is your secret weapon. We index all your governing documents (Bylaws, Declarations, Rules & Regs).</p>
      <div className="bg-accent/10 p-8 rounded-lg">
        <p className="text-foreground text-lg mb-4"><strong>You ask:</strong> &quot;What is our rule on hardwood floors?&quot;</p>
        <p className="text-foreground text-lg mb-4"><strong>AI answers:</strong> &quot;Floors, other than in kitchens and bathrooms, must be covered with wall-to-wall carpeting, per Section 8.2a of the Rules & Regs. (See source document)&quot;</p>
      </div>
      <p>The AI provides a direct answer and a *citation*, linking you to the exact page and paragraph in your documents. It stops arguments, empowers new board members, and ensures you&apos;re enforcing rules consistently.</p>

      <h3>Workflow: A Resident Reports a Leak (The &apos;Flow&apos;)</h3>
      <ol className="list-decimal list-inside space-y-4 text-lg">
        <li><strong>Submit:</strong> A resident in 3A uses the app to submit a work order: &quot;Water dripping from my bathroom ceiling!&quot; and attaches a video.</li>
        <li><strong>Triage:</strong> A &quot;Flow Card&quot; is created. The board president is notified, views the video, and @-mentions the treasurer: &quot;This looks serious.&quot;</li>
        <li><strong>Assign:</strong> The president assigns the card to &quot;Northside Plumbers&quot; (your saved vendor). The plumber gets a text and email with all the info.</li>
        <li><strong>Track:</strong> The plumber posts an update *to the card*: &quot;On my way. Looks like the 4A toilet wax ring.&quot; The resident in 3A and the board *both* see the update.</li>
        <li><strong>Resolve:</strong> The plumber finishes, uploads the invoice to the card. The treasurer pays it in QuickBooks, which automatically syncs, marking the invoice as &quot;Paid&quot; in Community Manager.</li>
        <li><strong>Close:</strong> The president closes the card. Total time for the board: 15 minutes of *oversight*, not 3 hours of *coordination*.</li>
      </ol>

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
        You&apos;re not alone. Hundreds of self-managed associations across Chicago are overwhelmed by spreadsheets and suffering from &quot;volunteer burnout.&quot; See how Community Manager provided the simple, professional tools they needed to take back control.
      </p>

      <div className="space-y-16 mt-16">
        <div className="bg-card p-8 sm:p-12 rounded-2xl shadow-xl border border-border">
          <h2>Case Study 1: The Lincoln Square 6-Flat That Reclaimed Its Budget</h2>
          <h3>The Problem: &quot;Spreadsheet Inefficiency&quot; and No Visibility</h3>
          <p>The treasurer was managing *everything* in a massive, multi-tab Excel file. It was a &quot;masterpiece of formulas&quot; but completely opaque to the rest of the board. &quot;I spent 10 hours a month just reconciling the bank statement,&quot; the treasurer told us. &quot;It was &apos;simple accounting&apos; that had become my entire life.&quot;</p>
          <h3>The Solution: QuickBooks Sync & Painless Payments</h3>
          <p>We migrated their &quot;spreadsheet&quot; data into Community Manager and connected their QuickBooks Online account. We set up all six units on the &quot;Painless Payments&quot; portal.</p>
          <div className="testimonial-card !bg-muted mt-8">
            <blockquote>
              &quot;Within 48 hours, all six units were set up on auto-pay. For the first time ever, we had 100% of our dues on the 1st of the month. The QuickBooks Sync is magical. I log in, I see the payments, I click &apos;Approve,&apos; and my books are done. What used to take 10 hours now takes 10 minutes.&quot;
            </blockquote>
            <cite>— David R., Board Treasurer, Lincoln Square 6-Flat</cite>
          </div>
        </div>

        <div className="bg-card p-8 sm:p-12 rounded-2xl shadow-xl border border-border">
          <h2>Case Study 2: The Ravenswood 3-Flat That Ended &apos;Volunteer Burnout&apos;</h2>
          <h3>The Problem: Disjointed Communication, Burnout, and 2 AM Emails</h3>
          <p>&quot;Every text, every email about the building came to my personal phone,&quot; the president explained. &quot;A resident would text me a photo of a running toilet, and I&apos;d have to forward it to a plumber, then email the treasurer... I was suffering from classic condo board burnout.&quot;</p>
          <h3>The Solution: The &quot;Flow&quot; Interface & AI Assistant</h3>
          <p>We implemented the &quot;Flow&quot; system as their single source of truth for all maintenance. We also uploaded their 20-year-old bylaws to the <strong>AI Governance Assistant</strong>.</p>
          <div className="testimonial-card !bg-muted mt-8">
            <blockquote>
              &quot;The &apos;Flow&apos; system saved my sanity. I told residents, &apos;If it&apos;s not in the Flow, it doesn&apos;t exist.&apos; Now, the plumber, the treasurer, and I all see the *same* conversation in *one* place. The AI assistant is the surprise hero. We had a disagreement about storage unit rules, and instead of digging, I just *asked* the AI. It gave us the answer in 5 seconds.&quot;
            </blockquote>
            <cite>— Emily C., Board President, Ravenswood 3-Flat</cite>
          </div>
        </div>

        <div className="bg-card p-8 sm:p-12 rounded-2xl shadow-xl border border-border">
          <h2>Case Study 3: The North Center 12-Unit That Avoided the &quot;Enterprise&quot; Trap</h2>
          <h3>The Problem: The &quot;Strategic Missing Middle&quot;</h3>
          <p>The board got quotes from AppFolio and Buildium. &quot;The systems were *massive*,&quot; the new president said. &quot;AppFolio had a $298 *minimum* spend. We&apos;re 12 units! We were trapped. We were too small for the &apos;pros&apos; but too new to want to use Gmail.&quot;</p>
          <h3>The Solution: The &quot;Missing Middle&quot; Platform</h3>
          <p>The board found Community Manager through a search for &quot;self-managed condo software chicago&quot;. They signed up before their first annual meeting.</p>
          <div className="testimonial-card !bg-muted mt-8">
            <blockquote>
              &quot;Community Manager was the *only* platform that spoke our language. The pricing was transparent and scaled to our size. We look and feel like a professionally managed building, but we&apos;re saving $10,000 a year by doing it ourselves. We&apos;re the &apos;Missing Middle,&apos; and this is our platform.&quot;
            </blockquote>
            <cite>— Tom L., Board President, North Center 12-Unit</cite>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResidentsOverview({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Your Home, Simplified.</h1>
      <p className="text-2xl text-muted-foreground">
        Living in a self-managed condo is wonderful. But it can also mean slipping a paper check under your neighbor&apos;s door, endless email chains to report a leak, and texting three different people to find out the &quot;real&quot; rule on pets.
      </p>
      <p>Community Manager is the simple, modern resident portal that streamlines all of that. It&apos;s the one app on your phone that connects you to your home, your board, and your community—no mess, no confusion.</p>

      <h2>Everything You Need, All in One Place</h2>
      <div className="grid md:grid-cols-2 gap-8 my-10">
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <CreditCard className="w-10 h-10 text-accent mb-3" />
          <h3 className="text-foreground">Pay Dues in Seconds</h3>
          <p>Stop writing checks. Pay your monthly dues securely online via ACH or credit card. Set up &quot;auto-pay&quot; and never think about it again.</p>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <Wrench className="w-10 h-10 text-accent mb-3" />
          <h3 className="text-foreground">Report a Maintenance Issue</h3>
          <p>Submit a work order in 60 seconds with photos or videos. You&apos;ll get real-time status updates as the board assigns a vendor and resolves the issue.</p>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <Calendar className="w-10 h-10 text-accent mb-3" />
          <h3 className="text-foreground">Book the Rooftop Deck</h3>
          <p>Need to reserve the party room or the rooftop grill? See the building&apos;s shared calendar and book your time slot instantly. No more double-bookings.</p>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <Folder className="w-10 h-10 text-accent mb-3" />
          <h3 className="text-foreground">Find Any Document, Instantly</h3>
          <p>Need the pet policy, board meeting minutes, or the annual budget? All your association&apos;s important documents are in one secure, searchable hub.</p>
        </div>
      </div>

      <h2>How to Get Your Board to Sign Up</h2>
      <p>If you&apos;re a resident who wants this, your board will be the one to sign up. Send them this page. Let them know you&apos;re tired of the old way and want the simplicity of a modern platform.</p>
      <div className="bg-primary/10 p-8 rounded-lg my-8 border border-primary/20">
        <p className="text-lg text-foreground mb-4"><strong>Here&apos;s what you can tell them:</strong></p>
        <p className="text-lg text-foreground">&quot;Hey [Board Member Name], I was just looking at this platform called <strong>Community Manager</strong>. It&apos;s built in Ravenswood specifically for self-managed Chicago condos like ours. For us residents, it means we can finally <strong>pay our dues online</strong> and <strong>track maintenance requests</strong>. For you as a board, it looks like it <strong>automates most of the busywork</strong> and even <strong>syncs with QuickBooks</strong>. Check it out!&quot;</p>
      </div>
      <div className="text-center">
        <button className="btn btn-primary" onClick={() => showPage('page-boards-overview')}>
          Learn More About Board Features
        </button>
      </div>
    </div>
  );
}

function ResidentsHowTo({ showPage }: { showPage: (id: string) => void }) {
  return (
    <div className="page-content">
      <h1>Your Guide to the Community Manager Resident Portal</h1>
      <p className="text-2xl text-muted-foreground">
        Welcome to your new, simplified home experience. This guide will walk you through the most common features you&apos;ll use as a resident.
      </p>

      <h2>How-To: Set Up Payments & Auto-Pay (The #1 Feature)</h2>
      <p>This is the feature you&apos;ll love the most. Stop writing checks and worrying about due dates.</p>
      <ol>
        <li><strong>Navigate to &quot;Payments&quot;:</strong> From your dashboard, click on the &quot;Payments&quot; or &quot;My Account&quot; section.</li>
        <li><strong>Add a Payment Method:</strong> Securely link your checking account (ACH) or add a credit card.</li>
        <li><strong>Find Your &quot;Dues&quot; Ledger:</strong> You will see your monthly dues listed as a recurring charge.</li>
        <li><strong>Enable &quot;Auto-Pay&quot;:</strong> Click the &quot;Set Up Auto-Pay&quot; button.</li>
        <li><strong>Confirm:</strong> That&apos;s it. On the 1st of every month, your dues will be paid automatically.</li>
      </ol>
      <img src="https://placehold.co/800x400/EBF5FE/2B8ED9?text=Resident+Auto-Pay+Setup" alt="Resident Auto-Pay Setup" className="rounded-2xl shadow-xl w-full my-8" />

      <h2>How-To: Report a Maintenance Issue</h2>
      <p>Got a leaky faucet or a broken light? Submit a work order in seconds.</p>
      <ol>
        <li><strong>Navigate to &quot;Maintenance&quot;:</strong> From your dashboard, click on &quot;Maintenance&quot; or &quot;Report an Issue&quot;.</li>
        <li><strong>Create a Work Order:</strong> Click &quot;New Request&quot;.</li>
        <li><strong>Describe the Issue:</strong> Write a brief description (e.g., &quot;Kitchen faucet is dripping&quot;).</li>
        <li><strong>Add Photos or Videos:</strong> Attach a photo or video to help the board and vendors understand the issue.</li>
        <li><strong>Submit:</strong> Click &quot;Submit&quot;. You&apos;ll get real-time updates as the board assigns a vendor and resolves the issue.</li>
      </ol>

      <h2>How-To: Book the Rooftop Deck or Party Room</h2>
      <p>Need to reserve a shared amenity? It&apos;s easy.</p>
      <ol>
        <li><strong>Navigate to &quot;Amenities&quot;:</strong> From your dashboard, click on &quot;Amenities&quot; or &quot;Reservations&quot;.</li>
        <li><strong>Select the Amenity:</strong> Choose the rooftop deck, party room, or other shared space.</li>
        <li><strong>Pick a Date & Time:</strong> Use the calendar to select your desired date and time slot.</li>
        <li><strong>Confirm:</strong> Submit your reservation. You&apos;ll receive a confirmation email.</li>
      </ol>
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
