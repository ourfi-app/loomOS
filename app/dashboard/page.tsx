

'use client';

import { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Globe, Mail, Calendar, 
  MapPin, Paperclip, Star, Home, MessageSquare, 
  Users, FileText, Settings, X, Minimize
} from 'lucide-react';

// Card data structure
const cardData = [
  {
    id: 'work-orders',
    title: 'Work Orders',
    type: 'stack',
    color: '#f0f8e8',
    icon: 'wrench',
    cards: [
      { id: 'active', title: 'Active', count: 3, color: '#e8f8f0' },
      { id: 'pending', title: 'Pending', count: 5, color: '#f8f0e8' }
    ]
  },
  {
    id: 'browser',
    title: 'Browser',
    type: 'single',
    color: '#f5f5f5',
    icon: 'globe',
    content: {
      url: 'sfchronicle.com',
      title: 'San Francisco Chronicle',
      headlines: [
        'Tech Industry Sees Major Growth',
        'Local Community Events This Weekend',
        'Weather Update: Sunny Days Ahead'
      ],
      bookmarks: [
        { name: 'News', url: 'news.com', icon: 'globe' },
        { name: 'Weather', url: 'weather.com', icon: 'globe' },
        { name: 'Sports', url: 'sports.com', icon: 'globe' }
      ]
    }
  },
  {
    id: 'mail',
    title: 'Mail',
    type: 'single',
    color: '#f8f8f8',
    icon: 'mail'
  },
  {
    id: 'calendar',
    title: 'Calendar',
    type: 'single',
    color: '#f5f5f5',
    icon: 'calendar',
    content: {
      date: 'Today',
      events: [
        { time: '9:00 AM', title: 'Team Meeting', location: 'Conference Room A', color: '#e8f0f8' },
        { time: '2:00 PM', title: 'Project Review', location: 'Office 204', color: '#f8e8f0' },
        { time: '4:30 PM', title: 'Client Call', location: 'Virtual', color: '#f0f8e8' }
      ]
    }
  }
];

// Email data for Mail app
const emailData = {
  folders: [
    { id: 'all-inboxes', name: 'All Inboxes', count: 12 },
    { id: 'gmail', name: 'Gmail', count: 5 },
    { id: 'yahoo', name: 'Yahoo', count: 4 },
    { id: 'exchange', name: 'Exchange', count: 3 },
    { id: 'starred', name: 'Starred', count: 2, isStarred: true }
  ],
  messages: [
    {
      id: 1,
      from: 'John Smith',
      subject: 'Q4 Budget Review',
      preview: 'Please review the attached budget proposal for Q4...',
      time: '10:30 AM',
      date: 'Nov 23, 2025',
      hasAttachment: true,
      body: 'Hi team,\n\nPlease review the attached budget proposal for Q4. We need to finalize this by end of week.\n\nBest regards,\nJohn'
    },
    {
      id: 2,
      from: 'Sarah Johnson',
      subject: 'Meeting Reschedule',
      preview: 'Can we move tomorrow\'s meeting to 3 PM?',
      time: '9:15 AM',
      date: 'Nov 23, 2025',
      hasAttachment: false,
      body: 'Hi,\n\nCan we move tomorrow\'s meeting to 3 PM? I have a conflict at 2 PM.\n\nThanks,\nSarah'
    },
    {
      id: 3,
      from: 'Mike Davis',
      subject: 'Project Update',
      preview: 'The new feature is ready for testing...',
      time: 'Yesterday',
      date: 'Nov 22, 2025',
      hasAttachment: false,
      body: 'Team,\n\nThe new feature is ready for testing. Please check it out and let me know if you find any issues.\n\nMike'
    }
  ]
};

// Stack card positioning helper
function getStackCardPosition(cardIndex: number, totalCards: number, isExpanded: boolean, isCentered: boolean) {
  if (!isCentered || !isExpanded) {
    const rotationAngle = (cardIndex - (totalCards - 1) / 2) * 8;
    const horizontalOffset = (cardIndex - (totalCards - 1) / 2) * 35;
    // Keep vertical offset at 0 to maintain horizontal alignment
    const verticalOffset = 0;
    return {
      translateX: horizontalOffset,
      translateY: verticalOffset,
      rotate: rotationAngle,
      scale: 1 - (Math.abs(cardIndex - (totalCards - 1) / 2) * 0.03)
    };
  } else {
    const spread = 500;
    const offset = (cardIndex - (totalCards - 1) / 2) * spread;
    return {
      translateX: offset,
      translateY: 0,
      rotate: 0,
      scale: 1
    };
  }
}

export default function DashboardPage() {
  const [currentCard, setCurrentCard] = useState(0);
  const [expandedStack, setExpandedStack] = useState<string | null>(null);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('all-inboxes');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const handlePrevCard = () => {
    setCurrentCard((prev) => (prev > 0 ? prev - 1 : cardData.length - 1));
    setExpandedStack(null);
  };

  const handleNextCard = () => {
    setCurrentCard((prev) => (prev < cardData.length - 1 ? prev + 1 : 0));
    setExpandedStack(null);
  };

  const handleCardClick = (card: any) => {
    if (card.type === 'stack') {
      setExpandedStack(expandedStack === card.id ? null : card.id);
    } else {
      setActiveApp(card.id);
    }
  };

  // Render full Mail app
  const renderMailApp = () => (
    <div 
      className="absolute inset-0 flex flex-col"
      style={{
        backgroundColor: '#f5f5f5',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Mail app header */}
      <div 
        className="flex items-center justify-between px-6 py-3"
        style={{
          backgroundColor: '#e8e8e8',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5" style={{ color: '#4a4a4a' }} />
          <span className="text-base font-light" style={{ color: '#4a4a4a' }}>Mail</span>
        </div>
        <button onClick={() => setActiveApp(null)}>
          <X className="w-5 h-5" style={{ color: '#6a6a6a' }} />
        </button>
      </div>

      {/* Three-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Folders */}
        <div 
          className="w-48 border-r overflow-y-auto"
          style={{ 
            backgroundColor: '#f8f8f8',
            borderColor: 'rgba(0,0,0,0.1)'
          }}
        >
          <div className="p-3">
            <div className="text-xs font-light tracking-wider uppercase mb-3" style={{ color: '#8a8a8a' }}>
              FAVORITES
            </div>
            {emailData.folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors"
                style={{
                  backgroundColor: selectedFolder === folder.id ? 'rgba(122, 158, 181, 0.2)' : 'transparent',
                  color: '#4a4a4a'
                }}
              >
                <div className="flex items-center gap-2">
                  {folder.isStarred && <Star className="w-3 h-3" style={{ color: '#b5a07a' }} />}
                  <span className="text-sm font-light">{folder.name}</span>
                </div>
                <span className="text-xs font-light" style={{ color: '#8a8a8a' }}>
                  {folder.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div 
          className="w-80 border-r overflow-y-auto"
          style={{ 
            backgroundColor: '#fff',
            borderColor: 'rgba(0,0,0,0.1)'
          }}
        >
          {emailData.messages.map((message) => (
            <button
              key={message.id}
              onClick={() => setSelectedEmail(message)}
              className="w-full px-4 py-3 border-b text-left transition-colors hover:bg-gray-50"
              style={{
                borderColor: 'rgba(0,0,0,0.05)',
                backgroundColor: selectedEmail?.id === message.id ? '#f0f8ff' : 'transparent'
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm font-light" style={{ color: '#4a4a4a' }}>
                  {message.from}
                </span>
                <span className="text-xs font-light" style={{ color: '#8a8a8a' }}>
                  {message.time}
                </span>
              </div>
              <div className="text-sm font-light mb-1" style={{ color: '#6a6a6a' }}>
                {message.subject}
              </div>
              <div className="text-xs font-light flex items-center gap-2" style={{ color: '#9a9a9a' }}>
                {message.preview.substring(0, 50)}...
                {message.hasAttachment && <Paperclip className="w-3 h-3" />}
              </div>
            </button>
          ))}
        </div>

        {/* Detail Pane */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#fff' }}>
          {selectedEmail ? (
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#7a9eb5' }}
                >
                  <span className="text-white font-light">
                    {selectedEmail.from.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-base font-light mb-1" style={{ color: '#4a4a4a' }}>
                    {selectedEmail.from}
                  </div>
                  <div className="text-xs font-light" style={{ color: '#8a8a8a' }}>
                    {selectedEmail.date} at {selectedEmail.time}
                  </div>
                </div>
              </div>
              <h2 className="text-lg font-light mb-4" style={{ color: '#4a4a4a' }}>
                {selectedEmail.subject}
              </h2>
              <div 
                className="text-sm font-light whitespace-pre-wrap"
                style={{ color: '#6a6a6a', lineHeight: '1.6' }}
              >
                {selectedEmail.body}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-16 h-16 mx-auto mb-4" style={{ color: '#d0d0d0' }} />
                <p className="text-sm font-light" style={{ color: '#9a9a9a' }}>
                  Select a message to read
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render active app
  if (activeApp === 'mail') {
    return (
      <div className="h-full relative">
        {renderMailApp()}
      </div>
    );
  }

  // Main dashboard view with card carousel
  return (
    <div 
      className="h-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Card Carousel */}
      <div className="h-full flex items-center justify-center px-8 md:px-16">
        <div className="relative w-full max-w-5xl h-[500px]">
          {/* Navigation buttons */}
          <button
            onClick={handlePrevCard}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
            }}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: '#4a4a4a' }} />
          </button>
          <button
            onClick={handleNextCard}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
            }}
          >
            <ChevronRight className="w-6 h-6" style={{ color: '#4a4a4a' }} />
          </button>

          {/* Cards */}
          <div className="relative h-full flex items-center justify-center">
            {cardData.map((card, index) => {
              const isCentered = index === currentCard;
              const isStack = card.type === 'stack';
              const isExpanded = expandedStack === card.id;

              if (isStack && card.cards) {
                // Render stack cards - Fixed to align with other cards
                return (
                  <div
                    key={card.id}
                    className="absolute flex items-center justify-center transition-all duration-500 ease-out"
                    style={{
                      width: '400px',
                      height: '300px',
                      transform: `translateX(${(index - currentCard) * 400}px) scale(${isCentered ? 1 : 0.85})`,
                      opacity: isCentered ? 1 : 0.6,
                      zIndex: isCentered ? 10 : 1
                    }}
                  >
                    {card.cards.map((subCard, subIndex) => {
                      const pos = getStackCardPosition(subIndex, card.cards!.length, isExpanded, isCentered);
                      return (
                        <button
                          key={subCard.id}
                          onClick={() => isCentered && handleCardClick(card)}
                          className="absolute transition-all duration-500"
                          style={{
                            width: '400px',
                            height: '300px',
                            backgroundColor: subCard.color,
                            borderRadius: '24px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            transform: `translate(${pos.translateX}px, ${pos.translateY}px) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                            transformOrigin: 'center center',
                            top: '50%',
                            left: '50%',
                            marginLeft: '-200px',
                            marginTop: '-150px'
                          }}
                        >
                          <div className="p-8">
                            <h3 className="text-xl font-light mb-2" style={{ color: '#4a4a4a' }}>
                              {subCard.title}
                            </h3>
                            <p className="text-3xl font-light" style={{ color: '#6a6a6a' }}>
                              {subCard.count}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              } else {
                // Render single card
                return (
                  <button
                    key={card.id}
                    onClick={() => isCentered && handleCardClick(card)}
                    className="absolute transition-all duration-500 ease-out"
                    style={{
                      width: '400px',
                      height: '300px',
                      backgroundColor: card.color,
                      borderRadius: '24px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transform: `translateX(${(index - currentCard) * 400}px) scale(${isCentered ? 1 : 0.85})`,
                      opacity: isCentered ? 1 : 0.6,
                      zIndex: isCentered ? 10 : 1
                    }}
                  >
                    <div className="p-8 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        {card.icon === 'globe' && <Globe className="w-6 h-6" style={{ color: '#4a4a4a' }} />}
                        {card.icon === 'mail' && <Mail className="w-6 h-6" style={{ color: '#4a4a4a' }} />}
                        {card.icon === 'calendar' && <Calendar className="w-6 h-6" style={{ color: '#4a4a4a' }} />}
                        <h3 className="text-xl font-light" style={{ color: '#4a4a4a' }}>
                          {card.title}
                        </h3>
                      </div>

                      {/* Card content */}
                      {card.id === 'browser' && card.content && (
                        <div className="flex-1 overflow-hidden">
                          <div className="text-xs font-light mb-3" style={{ color: '#8a8a8a' }}>
                            {card.content.url}
                          </div>
                          <h4 className="text-base font-light mb-3" style={{ color: '#4a4a4a' }}>
                            {card.content.title}
                          </h4>
                          <div className="space-y-2">
                            {card.content.headlines.map((headline: string, i: number) => (
                              <div key={i} className="text-sm font-light" style={{ color: '#6a6a6a' }}>
                                • {headline}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {card.id === 'calendar' && card.content && (
                        <div className="flex-1 overflow-hidden">
                          <div className="text-xs font-light tracking-wider uppercase mb-3" style={{ color: '#8a8a8a' }}>
                            {card.content.date}
                          </div>
                          <div className="space-y-3">
                            {card.content.events.slice(0, 2).map((event: any, i: number) => (
                              <div 
                                key={i}
                                className="p-3 rounded-xl"
                                style={{ backgroundColor: event.color }}
                              >
                                <div className="text-sm font-light mb-1" style={{ color: '#7a9eb5' }}>
                                  {event.time}
                                </div>
                                <div className="text-sm font-light mb-1" style={{ color: '#4a4a4a' }}>
                                  {event.title}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-light" style={{ color: '#8a8a8a' }}>
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {card.id === 'mail' && (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <Mail className="w-16 h-16 mx-auto mb-3" style={{ color: '#d0d0d0' }} />
                            <p className="text-sm font-light" style={{ color: '#9a9a9a' }}>
                              Click to open Mail
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              }
            })}
          </div>
        </div>
      </div>

      {/* Dock */}
      <div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl flex items-center gap-4"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
        }}
      >
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#7a9eb5' }}
          >
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-light" style={{ color: '#6a6a6a' }}>Home</span>
        </button>
        <button 
          onClick={() => setActiveApp('mail')}
          className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#b58a7a' }}
          >
            <Mail className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-light" style={{ color: '#6a6a6a' }}>Mail</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#8ab57a' }}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-light" style={{ color: '#6a6a6a' }}>Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#b5a07a' }}
          >
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-light" style={{ color: '#6a6a6a' }}>Calendar</span>
        </button>
      </div>
    </div>
  );
}

