import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CompressImageTool } from './components/CompressImageTool';
import { ResizeImageTool } from './components/ResizeImageTool';
import { JpgToPdfTool } from './components/JpgToPdfTool';
import { CompressPdfTool } from './components/CompressPdfTool';
import { ImageToPdfTool } from './components/ImageToPdfTool';
import { MergePdfTool } from './components/MergePdfTool';
import { PricingPage } from './components/PricingPage';
import { PlanModal } from './components/PlanModal';
import { ProModal } from './components/ProModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AboutModal } from './components/AboutModal';
import { PricingPlan, ToolId } from './types';
import { TOOLS_DATA, PRICING_PLANS } from './data/toolsData';

export default function App() {
  const [currentTool, setCurrentTool] = useState<ToolId | null>(null);
  const [isPricingPage, setIsPricingPage] = useState<boolean>(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PricingPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Initialize tool or page from URL pathname
  useEffect(() => {
    const syncRouteFromPath = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (path === 'compress-image') {
        setCurrentTool('compress-image');
        setIsPricingPage(false);
      } else if (path === 'resize-image') {
        setCurrentTool('resize-image');
        setIsPricingPage(false);
      } else if (path === 'image-to-pdf') {
        setCurrentTool('image-to-pdf');
        setIsPricingPage(false);
      } else if (path === 'merge-pdf') {
        setCurrentTool('merge-pdf');
        setIsPricingPage(false);
      } else if (path === 'jpg-to-pdf') {
        setCurrentTool('jpg-to-pdf');
        setIsPricingPage(false);
      } else if (path === 'compress-pdf') {
        setCurrentTool('compress-pdf');
        setIsPricingPage(false);
      } else if (path === 'pricing') {
        setCurrentTool(null);
        setIsPricingPage(true);
      } else {
        setCurrentTool(null);
        setIsPricingPage(false);
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, []);

  // Update document title and meta description dynamically
  useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (isPricingPage) {
      document.title = 'Simple Pricing Plans | FileFixer.online';
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Explore affordable monthly plans for FileFixer.online starting from ₹0/mo. Batch processing, higher file limits, and no ads.'
        );
      }
    } else if (!currentTool) {
      document.title = 'FileFixer.online - Fix. Convert. Compress. Free Everyday File Utility';
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Free everyday file utility website to compress images, resize photos, convert JPG/PNG/WebP to PDF, and merge PDFs securely directly in your browser with zero server uploads.'
        );
      }
    } else {
      const toolMeta = TOOLS_DATA.find((t) => t.id === currentTool);
      if (toolMeta) {
        document.title = `${toolMeta.seoTitle} | FileFixer.online`;
        if (metaDesc) {
          metaDesc.setAttribute('content', toolMeta.seoDescription);
        }
      }
    }
  }, [currentTool, isPricingPage]);

  const handleSelectTool = (id: ToolId | null) => {
    setIsPricingPage(false);
    setCurrentTool(id);
    if (id) {
      window.history.pushState(null, '', `/${id}`);
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  const handleNavigatePricing = () => {
    setCurrentTool(null);
    setIsPricingPage(true);
    window.history.pushState(null, '', '/pricing');
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlanForModal(plan);
    setIsPlanModalOpen(true);
  };

  const handleScrollToFaq = () => {
    if (currentTool !== null || isPricingPage) {
      handleSelectTool(null);
      setTimeout(() => {
        const faq = document.getElementById('faq-section');
        faq?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const faq = document.getElementById('faq-section');
      faq?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentTool={currentTool}
        isPricingPage={isPricingPage}
        onSelectTool={handleSelectTool}
        onNavigatePricing={handleNavigatePricing}
        onOpenProModal={() => {
          const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
          handleSelectPlan(proPlan);
        }}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onScrollToFaq={handleScrollToFaq}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isPricingPage ? (
          <PricingPage
            onSelectPlan={handleSelectPlan}
            onSelectTool={handleSelectTool}
          />
        ) : currentTool === null ? (
          <HomePage
            onSelectTool={handleSelectTool}
            onOpenPro={() => {
              const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
              handleSelectPlan(proPlan);
            }}
            onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
            onSelectPlan={handleSelectPlan}
            onNavigatePricing={handleNavigatePricing}
          />
        ) : currentTool === 'compress-image' ? (
          <CompressImageTool
            onSelectTool={handleSelectTool}
            onOpenPro={() => {
              const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
              handleSelectPlan(proPlan);
            }}
          />
        ) : currentTool === 'resize-image' ? (
          <ResizeImageTool
            onSelectTool={handleSelectTool}
            onOpenPro={() => {
              const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
              handleSelectPlan(proPlan);
            }}
          />
        ) : currentTool === 'image-to-pdf' ? (
          <ImageToPdfTool
            onSelectTool={handleSelectTool}
            onOpenPro={() => {
              const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
              handleSelectPlan(proPlan);
            }}
          />
        ) : currentTool === 'merge-pdf' ? (
          <MergePdfTool
            onSelectTool={handleSelectTool}
            onOpenPro={() => {
              const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
              handleSelectPlan(proPlan);
            }}
          />
        ) : currentTool === 'jpg-to-pdf' ? (
          <JpgToPdfTool
            onSelectTool={handleSelectTool}
            onOpenPro={() => {
              const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
              handleSelectPlan(proPlan);
            }}
          />
        ) : currentTool === 'compress-pdf' ? (
          <CompressPdfTool
            onSelectTool={handleSelectTool}
            onOpenPro={() => {
              const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
              handleSelectPlan(proPlan);
            }}
          />
        ) : null}
      </main>

      {/* Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        onNavigatePricing={handleNavigatePricing}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenProModal={() => {
          const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
          handleSelectPlan(proPlan);
        }}
        onScrollToFaq={handleScrollToFaq}
      />

      {/* Plan Checkout & Selection Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        selectedPlan={selectedPlanForModal}
        onStartFree={() => {
          setIsPlanModalOpen(false);
          handleSelectTool('compress-image');
        }}
      />

      {/* Pro Waitlist / Feature Info Modal */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />

      {/* Privacy Guarantee Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* About & Technical Details Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenPro={() => {
          setIsAboutModalOpen(false);
          const proPlan = PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2];
          handleSelectPlan(proPlan);
        }}
      />
    </div>
  );
}

