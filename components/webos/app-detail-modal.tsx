
'use client';

import { AppDefinition } from '@/lib/enhanced-app-registry';
import { cn } from '@/lib/utils';
import { 
  MdClose, MdStar, MdStarBorder, MdLaunch, MdNewReleases,
  MdScience, MdUpdate, MdCheck, MdArrowForward, MdInfo,
  MdSecurity, MdBugReport, MdThumbUp, MdThumbDown
} from 'react-icons/md';
import { useState } from 'react';
import { useCardManager } from '@/lib/card-manager-store';
import { useRouter } from 'next/navigation';

interface AppDetailModalProps {
  app: AppDefinition;
  onClose: () => void;
}

export function AppDetailModal({ app, onClose }: AppDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'feedback'>('overview');
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'praise' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const { launchApp } = useCardManager();
  const router = useRouter();

  const handleLaunch = () => {
    // Dashboard and Onboarding are special - navigate to full page (don't launch as cards)
    if (app.path === '/dashboard' || app.path === '/onboarding') {
      router.push(app.path);
    } else {
      router.push(app.path);
      launchApp({
        id: app.id,
        title: app.title,
        path: app.path,
        color: app.gradient,
        icon: app.id,
      });
    }
    onClose();
  };

  const handleSubmitFeedback = () => {
    // In a real app, this would send to an API
    console.log('Feedback submitted:', { app: app.id, type: feedbackType, rating: userRating, text: feedbackText });
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackType(null);
      setFeedbackText('');
    }, 2000);
  };

  const renderStars = (rating: number, total: number = 5) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <MdStar
            key={i}
            className={cn(
              "w-4 h-4",
              i < rating ? "text-yellow-400" : "text-white/10"
            )}
          />
        ))}
      </div>
    );
  };

  const renderInteractiveStars = () => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          return (
            <button
              key={i}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setUserRating(starValue)}
              className="transition-transform hover:scale-110"
            >
              {(hoveredRating || userRating) >= starValue ? (
                <MdStar className="w-6 h-6 text-yellow-400" />
              ) : (
                <MdStarBorder className="w-6 h-6 text-white/30" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className={cn(
          "relative p-5 bg-gradient-to-br flex-shrink-0",
          app.gradient
        )}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all z-10"
            title="Close"
          >
            <MdClose className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3 pr-10">
            <div className={cn(
              "w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0"
            )}>
              <app.icon className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-xl font-display text-white truncate max-w-[300px]">{app.title}</h2>
                {app.isNew && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs font-medium rounded-full flex items-center gap-1 flex-shrink-0">
                    <MdNewReleases className="w-3 h-3" />
                    New
                  </span>
                )}
                {app.isBeta && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full flex items-center gap-1 flex-shrink-0">
                    <MdScience className="w-3 h-3" />
                    Beta
                  </span>
                )}
              </div>
              
              <p className="text-white/70 text-sm mb-2 line-clamp-2">{app.description}</p>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 flex-shrink-0">
                  {renderStars(Math.round(app.averageRating || 0))}
                  <span className="text-white/90 text-sm font-medium ml-1">
                    {app.averageRating?.toFixed(1) || '—'}
                  </span>
                  <span className="text-white/40 text-xs">
                    ({app.totalRatings || 0})
                  </span>
                </div>
                
                {app.version && (
                  <span className="text-white/40 text-xs flex-shrink-0">
                    v{app.version}
                  </span>
                )}
                
                <button
                  onClick={handleLaunch}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg font-medium transition-all flex items-center gap-1.5 flex-shrink-0 ml-auto"
                >
                  <MdLaunch className="w-3.5 h-3.5" />
                  Launch
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5 px-5 flex-shrink-0">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {['overview', 'details', 'feedback'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-3 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex-shrink-0",
                  activeTab === tab
                    ? "text-white border-white"
                    : "text-white/40 border-transparent hover:text-white/70"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content - with better scrolling */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide min-h-0">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Long Description */}
              {app.longDescription && (
                <div className="overflow-hidden">
                  <h3 className="text-base font-semibold text-white/90 mb-2">About</h3>
                  <p className="text-white/60 text-sm leading-relaxed break-words">
                    {app.longDescription}
                  </p>
                </div>
              )}

              {/* Tags */}
              {app.tags && app.tags.length > 0 && (
                <div className="overflow-hidden">
                  <h3 className="text-base font-semibold text-white/90 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-full transition-colors whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {app.features && app.features.length > 0 && (
                <div className="overflow-hidden">
                  <h3 className="text-base font-semibold text-white/90 mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    {app.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-white/60 text-sm">
                        <MdCheck className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Version Info */}
              <div className="grid grid-cols-2 gap-3 overflow-hidden">
                {app.version && (
                  <div className="min-w-0">
                    <p className="text-white/40 text-xs mb-0.5">Version</p>
                    <p className="text-white/90 text-sm font-medium truncate">{app.version}</p>
                  </div>
                )}
                {app.developer && (
                  <div className="min-w-0">
                    <p className="text-white/40 text-xs mb-0.5">Developer</p>
                    <p className="text-white/90 text-sm font-medium truncate">{app.developer}</p>
                  </div>
                )}
                {app.releaseDate && (
                  <div className="min-w-0">
                    <p className="text-white/40 text-xs mb-0.5">Release Date</p>
                    <p className="text-white/90 text-sm font-medium truncate">
                      {new Date(app.releaseDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
                {app.lastUpdated && (
                  <div className="min-w-0">
                    <p className="text-white/40 text-xs mb-0.5 flex items-center gap-1">
                      <MdUpdate className="w-3 h-3" />
                      Last Updated
                    </p>
                    <p className="text-white/90 text-sm font-medium truncate">
                      {new Date(app.lastUpdated).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Permissions */}
              {app.permissions && app.permissions.length > 0 && (
                <div className="overflow-hidden">
                  <h3 className="text-base font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <MdSecurity className="w-4 h-4" />
                    Permissions
                  </h3>
                  <ul className="space-y-1.5">
                    {app.permissions.map((permission, index) => (
                      <li key={index} className="flex items-start gap-2 text-white/60 text-sm">
                        <MdInfo className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white/5 rounded-lg p-3 space-y-2 overflow-hidden">
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="text-white/60 truncate">Category</span>
                  <span className="text-white/90 capitalize truncate">{app.category}</span>
                </div>
                {app.canPinToDock && (
                  <div className="flex items-center justify-between text-sm gap-2">
                    <span className="text-white/60 truncate">Pin to Dock</span>
                    <span className="text-green-400 flex-shrink-0">Supported</span>
                  </div>
                )}
                {app.hasWidget && (
                  <div className="flex items-center justify-between text-sm gap-2">
                    <span className="text-white/60 truncate">Widget Size</span>
                    <span className="text-white/90 capitalize truncate">{app.widgetSize}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {!feedbackSubmitted ? (
                <>
                  {/* Rating */}
                  <div>
                    <h3 className="text-lg font-semibold text-white/90 mb-2">Rate this app</h3>
                    <div className="flex items-center gap-3">
                      {renderInteractiveStars()}
                      {userRating > 0 && (
                        <span className="text-white/60 text-sm">
                          {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][userRating - 1]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-white/90 mb-2">Feedback Type</h3>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setFeedbackType('bug')}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0",
                          feedbackType === 'bug'
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
                        )}
                      >
                        <MdBugReport className="w-4 h-4" />
                        Report Bug
                      </button>
                      <button
                        onClick={() => setFeedbackType('feature')}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0",
                          feedbackType === 'feature'
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
                        )}
                      >
                        <MdArrowForward className="w-4 h-4" />
                        Request Feature
                      </button>
                      <button
                        onClick={() => setFeedbackType('praise')}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0",
                          feedbackType === 'praise'
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
                        )}
                      >
                        <MdThumbUp className="w-4 h-4" />
                        Give Praise
                      </button>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div>
                    <h3 className="text-lg font-semibold text-white/90 mb-2">Your Feedback</h3>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or issues..."
                      className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/8 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackType || !feedbackText.trim()}
                    className={cn(
                      "w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                      feedbackType && feedbackText.trim()
                        ? "bg-white/10 hover:bg-white/20 text-white"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    )}
                  >
                    Submit Feedback
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <MdCheck className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white/90 mb-2">Thank you!</h3>
                  <p className="text-white/60 text-sm">
                    Your feedback has been submitted and will help improve this app.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
