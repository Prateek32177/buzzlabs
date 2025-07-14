'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  ArrowUp,
  Search,
  Slack,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Lightbulb,
  BarChart3,
  Database,
  CreditCard,
  GitBranch,
  Hash,
  Info,
  X,
  History,
  Circle,
} from 'lucide-react';
import { Orb } from 'react-ai-orb';
import { Inter } from 'next/font/google';

const playfairItalic = Inter({
  subsets: ['latin'],
  weight: '300',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

interface SearchResult {
  id: string;
  webhook_id: string;
  platform: string;
  status: string;
  webhook_name: string;
  processed_at: string;
  error_message: string;
  email_sent: boolean;
  slack_sent: boolean;
  similarity: number;
}

interface UserLimits {
  searches_used: number;
  embeddings_generated: number;
  plan_type: string;
  max_searches: number;
  max_embeddings: number;
}

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom';
}

const Tooltip = ({ children, content, position = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className='relative inline-block'>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-xs text-white bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl whitespace-nowrap transition-all duration-200 ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
              : 'top-full mt-2 left-1/2 transform -translate-x-1/2'
          }`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-zinc-800/95 border border-zinc-700/50 transform rotate-45 ${
              position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-t-0 border-l-0'
                : 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-b-0 border-r-0'
            }`}
          />
        </div>
      )}
    </div>
  );
};

// AI Response Parser Component
const AIAnalysisRenderer = ({ content }: { content: string }) => {
  const parseContent = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const elements: React.ReactNode[] = [];
    let currentSection: React.ReactNode[] = [];
    let sectionTitle = '';

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle main headings (## or **)
      if (
        trimmedLine.startsWith('##') ||
        (trimmedLine.startsWith('**') && trimmedLine.endsWith('**'))
      ) {
        // Save previous section
        if (currentSection.length > 0 && sectionTitle) {
          elements.push(
            <div key={`section-${elements.length}`} className='mb-6'>
              <h4 className='text-zinc-200 font-medium mb-3 flex items-center gap-2'>
                <div className='w-1.5 h-1.5 bg-violet-400 rounded-full' />
                {sectionTitle}
              </h4>
              <div className='space-y-2 pl-4'>{currentSection}</div>
            </div>,
          );
        }

        // Start new section
        sectionTitle = trimmedLine
          .replace(/^##\s*/, '')
          .replace(/^\*\*(.*)\*\*$/, '$1');
        currentSection = [];
      }
      // Handle bullet points
      else if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
        const bulletText = trimmedLine.replace(/^[*-]\s*/, '');
        currentSection.push(
          <div key={`bullet-${index}`} className='flex items-start gap-3'>
            <div className='w-1 h-1 bg-zinc-500 rounded-full mt-2 flex-shrink-0' />
            <span className='text-zinc-300 text-sm leading-relaxed'>
              {bulletText}
            </span>
          </div>,
        );
      }
      // Handle numbered lists
      else if (/^\d+\./.test(trimmedLine)) {
        const numberMatch = trimmedLine.match(/^(\d+)\.\s*(.*)$/);
        if (numberMatch) {
          const [, number, text] = numberMatch;
          currentSection.push(
            <div key={`number-${index}`} className='flex items-start gap-3'>
              <div className='w-5 h-5 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5'>
                {number}
              </div>
              <span className='text-zinc-300 text-sm leading-relaxed'>
                {text}
              </span>
            </div>,
          );
        }
      }
      // Handle regular paragraphs
      else if (trimmedLine.length > 0) {
        // Check if it's a standalone important point (bold text)
        if (trimmedLine.includes('**')) {
          const processedText = trimmedLine.replace(
            /\*\*(.*?)\*\*/g,
            '<strong>$1</strong>',
          );
          currentSection.push(
            <div
              key={`para-${index}`}
              className='text-zinc-300 text-sm leading-relaxed'
            >
              <span dangerouslySetInnerHTML={{ __html: processedText }} />
            </div>,
          );
        } else {
          currentSection.push(
            <div
              key={`para-${index}`}
              className='text-zinc-300 text-sm leading-relaxed'
            >
              {trimmedLine}
            </div>,
          );
        }
      }
    });

    // Add final section
    if (currentSection.length > 0 && sectionTitle) {
      elements.push(
        <div key={`section-${elements.length}`} className='mb-6'>
          <h4 className='text-zinc-200 font-medium mb-3 flex items-center gap-2'>
            <div className='w-1.5 h-1.5 bg-violet-400 rounded-full' />
            {sectionTitle}
          </h4>
          <div className='space-y-2 pl-4'>{currentSection}</div>
        </div>,
      );
    } else if (currentSection.length > 0) {
      // If no section title, just add the content
      elements.push(
        <div key={`content-${elements.length}`} className='space-y-2'>
          {currentSection}
        </div>,
      );
    }

    return elements.length > 0
      ? elements
      : [
          <div key='fallback' className='text-zinc-300 text-sm leading-relaxed'>
            {content}
          </div>,
        ];
  };

  return <div className='space-y-4'>{parseContent(content)}</div>;
};

const loadingStates = [
  { text: 'Thinking...', icon: '🤔' },
  { text: 'Collecting logs...', icon: '📊' },
  { text: 'Analyzing insights...', icon: '🔍' },
  { text: 'Ready!', icon: '✨' },
];

export default function WebhookAIDebugger({ userId }: { userId: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStateIndex, setLoadingStateIndex] = useState(0);
  const [limits, setLimits] = useState<UserLimits>({
    searches_used: 2,
    embeddings_generated: 45,
    plan_type: 'Pro',
    max_searches: 15,
    max_embeddings: 100,
  });
  const [embeddingStatus, setEmbeddingStatus] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const placeholders = [
    { text: 'Show me all Supabase auth failures from today', icon: Database },
    { text: 'Why are Stripe webhook payments failing?', icon: CreditCard },
    { text: 'Get GitHub webhook deliveries with 500 errors', icon: GitBranch },
    { text: 'Analyze Slack notification delivery rates', icon: Slack },
    { text: 'Get all 404 webhook endpoint errors', icon: Hash },
  ];

  useEffect(() => {
    const savedSearches = localStorage.getItem('webhook-recent-searches');
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches);
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
      } catch (error) {
        console.error('Error parsing recent searches:', error);
        setRecentSearches([]);
      }
    }
  }, []);

  // Save recent searches to localStorage whenever it changes
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem(
        'webhook-recent-searches',
        JSON.stringify(recentSearches),
      );
    }
  }, [recentSearches]);

  useEffect(() => {
    if (query || isSearchFocused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPlaceholder(prev => (prev + 1) % placeholders.length);
        setTimeout(() => {
          setIsAnimating(false);
        }, 100);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [query, isSearchFocused, placeholders.length]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingStateIndex(prev => {
        if (prev < loadingStates.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [loading]);

  const addToRecentSearches = (searchQuery: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(search => search !== searchQuery);
      const updated = [searchQuery, ...filtered].slice(0, 5);
      return updated;
    });
  };

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;

    if (limits && limits.searches_used >= limits.max_searches) {
      setAiResponse(
        'Daily search limit reached. Please try again tomorrow or upgrade your plan.',
      );
      return;
    }

    addToRecentSearches(queryToSearch);
    setIsSearchFocused(false);
    setLoading(true);
    setLoadingStateIndex(0);
    setAiResponse('');
    setSuggestions([]);
    setHasSearched(true);

    if (limits) {
      setLimits(prev => ({ ...prev, searches_used: prev.searches_used + 1 }));
    }

    try {
      const searchRes = await fetch('/api/search-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSearch,
          user_id: userId,
          match_threshold: 0.3,
          match_count: 6,
        }),
      });

      const searchData = await searchRes.json();

      if (searchRes.status === 429) {
        setAiResponse(
          `Search limit exceeded. Used: ${searchData.used}/${searchData.limit}`,
        );
        return;
      }

      setResults(searchData.results || []);

      const aiRes = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSearch,
          user_id: userId,
          context: searchData.results,
        }),
      });

      const aiData = await aiRes.json();
      setAiResponse(aiData.response);
      setSuggestions(aiData.suggestions || []);
    } catch (error) {
      console.error('Search failed:', error);
      setAiResponse('Search failed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStateIndex(0);
    }
  };

  const handleQuickSearch = (searchText: string) => {
    setQuery(searchText);
    handleSearch(searchText);
  };

  const handleRecentSearch = (searchText: string) => {
    setQuery(searchText);
    setIsSearchFocused(false);
    handleSearch(searchText);
  };

  const handleInsightsClick = () => {
    const insightQuery =
      'Show me key insights and patterns from recent webhook failures';
    setQuery(insightQuery);
    handleSearch(insightQuery);
  };

  const handleTrendsClick = () => {
    const trendsQuery =
      'Analyze webhook delivery trends and performance metrics';
    setQuery(trendsQuery);
    handleSearch(trendsQuery);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className='w-4 h-4 text-emerald-400' />;
      case 'failed':
        return <AlertCircle className='w-4 h-4 text-red-400' />;
      case 'pending':
        return <Clock className='w-4 h-4 text-amber-400' />;
      default:
        return <AlertCircle className='w-4 h-4 text-zinc-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const quickSuggestions = [
    { text: 'Supabase auth errors', icon: Database },
    { text: 'Stripe payment failures', icon: CreditCard },
    { text: 'GitHub webhook 500s', icon: GitBranch },
    { text: 'Slack delivery issues', icon: Slack },
  ];

  const currentPlaceholderItem = placeholders[currentPlaceholder];
  const currentLoadingState = loadingStates[loadingStateIndex];

  // Calculate usage percentage for visual indicator
  const usagePercentage = limits
    ? (limits.searches_used / limits.max_searches) * 100
    : 0;
  const remainingSearches = limits
    ? limits.max_searches - limits.searches_used
    : 0;

  return (
    <div className='min-h-screen flex flex-col relative'>
      {/* Usage Indicator - Floating Top Right */}
      {limits && (
        <div className='fixed top-16 right-6 z-40'>
          <Tooltip
            content={`${remainingSearches} searches remaining today`}
            position='bottom'
          >
            <div className='bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl px-4 py-2 shadow-lg'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  {[...Array(limits.max_searches)].map((_, index) => (
                    <Circle
                      key={index}
                      className={`w-2 h-2 ${
                        index < limits.searches_used
                          ? 'text-zinc-600 fill-zinc-600'
                          : 'text-zinc-400 fill-zinc-400'
                      }`}
                    />
                  ))}
                </div>
                <div className='text-xs text-zinc-400 font-medium'>
                  {remainingSearches}/{limits.max_searches}
                </div>
              </div>
              <div className='text-xs text-zinc-500 mt-1 text-center'>
                Daily limit
              </div>
            </div>
          </Tooltip>
        </div>
      )}

      {/* Main Content Container */}
      <div
        className={`flex-1 flex flex-col ${!hasSearched ? 'justify-center' : ''} transition-all duration-700`}
      >
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center '>
              <h1
                className={`text-4xl sm:text-5xl font-medium tracking-tight bg-gradient-to-r from-violet-200 to-violet-600  text-transparent bg-clip-text bg-[length:300%_300%] animate-gradient leading-tight pb-2 ${playfairItalic.className}`}
              >
                Log Intelligence
              </h1>
              <p
                className={`text-zinc-300 text-sm font-light max-w-2xl leading-relaxed tracking-wide ${inter.className}`}
              >
                Query logs in plain English.{' '}
                <span className='text-zinc-400'>get insights, fix faster.</span>
              </p>
            </div>
          </div>

          {/* Enhanced Search Interface */}
          <div className='mb-12 relative'>
            <div className='relative'>
              {/* Search Box */}
              <div className='relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 transition-all duration-200 hover:bg-zinc-900/70 focus-within:border-zinc-700 focus-within:bg-zinc-900/70 focus-within:shadow-2xl focus-within:shadow-[#A692E5]/20'>
                {/* Desktop Layout - Single Row */}
                <div className='hidden sm:flex items-center gap-4'>
                  <div className='pl-4 flex items-center brightness-90'>
                    <Orb size={0.4} animationSpeedBase={0.7} />
                  </div>
                  <div className='flex-1 relative overflow-hidden min-w-0'>
                    <input
                      ref={searchInputRef}
                      type='text'
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() =>
                        setTimeout(() => setIsSearchFocused(false), 200)
                      }
                      placeholder=''
                      className='w-full text-sm bg-transparent border-none outline-none text-zinc-100 font-light relative z-10'
                      onKeyPress={e => e.key === 'Enter' && handleSearch()}
                    />
                    {!query && !isSearchFocused && (
                      <div className='absolute left-2 top-0 h-full pointer-events-none overflow-hidden flex items-center'>
                        <span
                          className={`text-sm text-zinc-500 font-light transition-all duration-500 whitespace-nowrap transform ${
                            isAnimating
                              ? 'translate-y-8 opacity-0'
                              : 'translate-y-0 opacity-100'
                          }`}
                        >
                          {currentPlaceholderItem.text}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Desktop Action Buttons */}
                  <div className='flex items-center gap-2'>
                    <Tooltip content='Insights'>
                      <button
                        onClick={handleInsightsClick}
                        className='p-2 text-zinc-500 hover:text-zinc-400 transition-colors hover:bg-zinc-800/50 rounded-lg cursor-pointer'
                      >
                        <Lightbulb className='w-5 h-5' />
                      </button>
                    </Tooltip>
                    <Tooltip content='Summarize'>
                      <button
                        onClick={handleTrendsClick}
                        className='p-2 text-zinc-500 hover:text-zinc-400 transition-colors hover:bg-zinc-800/50 rounded-lg cursor-pointer'
                      >
                        <BarChart3 className='w-5 h-5' />
                      </button>
                    </Tooltip>
                  </div>
                  {/* Desktop Search Button */}
                  <div className='flex items-center mr-2'>
                    <button
                      onClick={() => handleSearch()}
                      disabled={
                        loading ||
                        !query.trim() ||
                        (limits && limits.searches_used >= limits.max_searches)
                      }
                      className='px-6 py-2 bg-zinc-700 text-white rounded-xl text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-600 hover:shadow-lg cursor-pointer'
                    >
                      {loading ? (
                        <div className='flex items-center gap-2'>
                          <div className='w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin' />
                          <span>{currentLoadingState.text}</span>
                        </div>
                      ) : (
                        'Search'
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile Layout - Two Rows */}
                <div className='sm:hidden'>
                  {/* First Row - Orb and Input */}
                  <div className='flex items-center gap-2'>
                    <div className='pl-4 flex items-center brightness-90'>
                      <Orb size={0.4} animationSpeedBase={0.7} />
                    </div>
                    <div className='flex-1 relative overflow-hidden min-w-0'>
                      <input
                        type='text'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() =>
                          setTimeout(() => setIsSearchFocused(false), 200)
                        }
                        placeholder=''
                        className='w-full text-sm bg-transparent border-none outline-none text-zinc-100 font-light relative z-10'
                        onKeyPress={e => e.key === 'Enter' && handleSearch()}
                      />
                      {!query && !isSearchFocused && (
                        <div className='absolute left-2 top-0 h-full pointer-events-none overflow-hidden flex items-center right-2'>
                          <span
                            className={`text-sm text-zinc-500 font-light transition-all duration-500 transform truncate max-w-full ${
                              isAnimating
                                ? 'translate-y-8 opacity-0'
                                : 'translate-y-0 opacity-100'
                            }`}
                            style={{
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                            }}
                          >
                            {currentPlaceholderItem.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Second Row - Action buttons and Search button */}
                  <div className='flex items-center justify-end mt-3'>
                    <div className='flex items-center gap-3'>
                      <Tooltip content='Insights'>
                        <button
                          onClick={handleInsightsClick}
                          className='p-2 text-zinc-500 hover:text-zinc-400 transition-colors hover:bg-zinc-800/50 rounded-lg cursor-pointer'
                        >
                          <Lightbulb className='w-4 h-4' />
                        </button>
                      </Tooltip>
                      <Tooltip content='Summarize'>
                        <button
                          onClick={handleTrendsClick}
                          className='p-2 text-zinc-500 hover:text-zinc-400 transition-colors hover:bg-zinc-800/50 rounded-lg cursor-pointer'
                        >
                          <BarChart3 className='w-4 h-4' />
                        </button>
                      </Tooltip>
                      <button
                        onClick={() => handleSearch()}
                        disabled={
                          loading ||
                          !query.trim() ||
                          (limits &&
                            limits.searches_used >= limits.max_searches)
                        }
                        className='px-4 py-2 bg-zinc-700 text-white rounded-xl text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-600 hover:shadow-lg flex items-center gap-2 cursor-pointer'
                      >
                        {loading ? (
                          <div className='w-3 h-3 border-2 border-zinc-500 border-t-white rounded-full animate-spin' />
                        ) : (
                          <ArrowUp className='w-3 h-3' />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Searches Dropdown */}
              {isSearchFocused && recentSearches.length > 0 && (
                <div className='absolute mt-0.5 left-0 right-0 bg-zinc-900/95 border border-zinc-800 rounded-xl backdrop-blur-sm shadow-2xl z-50 animate-fade-in'>
                  <div className='p-3 border-b border-zinc-800'>
                    <div className='flex items-center gap-2 text-xs text-zinc-400'>
                      <History className='w-3 h-3' />
                      <span>Recent searches</span>
                    </div>
                  </div>
                  <div className='py-2'>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearch(search)}
                        className='w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 transition-colors flex items-center gap-3'
                      >
                        <Clock className='w-3 h-3 text-zinc-500 flex-shrink-0' />
                        <span className='truncate'>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Simple Disclaimer */}
              {showDisclaimer && (
                <div className='mt-4 flex items-start justify-center gap-3 text-xs text-zinc-500 px-4'>
                  <div className='flex items-center gap-2 max-w-md'>
                    <Info className='w-3 h-3 flex-shrink-0 mt-0.5' />
                    <span className='text-center leading-relaxed'>
                      Currently analyzes only the logs from the last 7 days.
                    </span>
                    <button
                      onClick={() => setShowDisclaimer(false)}
                      className='text-zinc-500 hover:text-zinc-400 flex-shrink-0 ml-1'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                </div>
              )}

              {/* Enhanced Quick Suggestions */}
              <div className='mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto'>
                {quickSuggestions.map(suggestion => (
                  <button
                    key={suggestion.text}
                    onClick={() => handleQuickSearch(suggestion.text)}
                    disabled={
                      limits && limits.searches_used >= limits.max_searches
                    }
                    className='group inline-flex items-center gap-2 px-4 py-3 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:bg-zinc-900/50 hover:border-zinc-600 hover:text-zinc-200 transition-all duration-200 bg-transparent justify-center text-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  >
                    <suggestion.icon className='w-3.5 h-3.5 flex-shrink-0' />
                    <span className='truncate'>{suggestion.text}</span>
                    <ArrowUpRight className='w-4 h-4 stroke-1 transition-transform duration-300 group-hover:rotate-45 flex-shrink-0' />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {(aiResponse || results.length > 0) && (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full'>
          {/* AI Analysis */}
          {aiResponse && (
            <div className='mb-8 animate-fade-in'>
              <div className='bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm'>
                <div className='flex items-center gap-3 mb-4'>
                  <h3 className='text-sm font-medium text-[#A692E5] tracking-wider'>
                    ✦ AI Analysis
                  </h3>
                  <div className='flex-1 h-px bg-gradient-to-r from-zinc-700 to-transparent' />
                </div>
                <div className='mb-6'>
                  <AIAnalysisRenderer content={aiResponse} />
                </div>
                {suggestions.length > 0 && (
                  <div className='pt-6 border-t border-zinc-800'>
                    <h4 className='font-medium text-zinc-200 mb-4 flex items-center gap-2'>
                      <CheckCircle className='w-4 h-4 text-emerald-400' />
                      Recommendations
                    </h4>
                    <div className='space-y-3'>
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className='flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-800 hover:bg-zinc-800/40 transition-colors'
                        >
                          <div className='w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0'>
                            {index + 1}
                          </div>
                          <span className='text-zinc-300 text-sm leading-relaxed'>
                            {suggestion}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div className='mb-8 animate-fade-in'>
              <div className='bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm'>
                <div className='p-6 border-b border-zinc-800 bg-zinc-900/20'>
                  <h3 className='text-lg font-medium text-zinc-200 flex items-center gap-3'>
                    <h3 className='text-sm font-medium text-[#A692E5] tracking-wider'>
                      Related Logs
                    </h3>
                    <span className='px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm font-medium'>
                      {results.length}
                    </span>
                    <div className='flex-1 h-px bg-gradient-to-r from-zinc-700 to-transparent' />
                  </h3>
                </div>
                <div className='divide-y divide-zinc-800'>
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className='p-6 hover:bg-zinc-900/20 transition-all duration-200 group'
                    >
                      <div className='flex justify-between items-start mb-4'>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full' />
                            <span className='font-semibold text-zinc-200 text-base'>
                              {result.platform}
                            </span>
                          </div>
                          <span className='text-zinc-600'>•</span>
                          <span className='text-zinc-400 text-sm font-medium'>
                            {result.webhook_name}
                          </span>
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              result.status,
                            )}`}
                          >
                            {getStatusIcon(result.status)}
                            <span className='capitalize'>{result.status}</span>
                          </div>
                        </div>
                        <div className='text-right text-sm'>
                          <div className='text-zinc-400 font-medium text-sm'>
                            {new Date(result.processed_at).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div className='flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 group-hover:border-zinc-700 transition-colors'>
                          <Mail className='w-4 h-4 text-zinc-500' />
                          <span className='text-zinc-400 text-sm'>Email:</span>
                          <span
                            className={`font-semibold text-sm ${
                              result.email_sent
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {result.email_sent ? 'Delivered' : 'Failed'}
                          </span>
                          {result.email_sent && (
                            <CheckCircle className='w-3 h-3 text-emerald-400' />
                          )}
                          {!result.email_sent && (
                            <AlertCircle className='w-3 h-3 text-red-400' />
                          )}
                        </div>

                        <div className='flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 group-hover:border-zinc-700 transition-colors'>
                          <Slack className='w-4 h-4 text-zinc-500' />
                          <span className='text-zinc-400 text-sm'>Slack:</span>
                          <span
                            className={`font-semibold text-sm ${
                              result.slack_sent
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {result.slack_sent ? 'Delivered' : 'Failed'}
                          </span>
                          {result.slack_sent && (
                            <CheckCircle className='w-3 h-3 text-emerald-400' />
                          )}
                          {!result.slack_sent && (
                            <AlertCircle className='w-3 h-3 text-red-400' />
                          )}
                        </div>
                      </div>

                      {result.error_message && (
                        <div className='mb-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg'>
                          <div className='flex items-start gap-3'>
                            <AlertCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
                            <div className='min-w-0'>
                              <span className='text-red-400 font-semibold text-sm block'>
                                Error Details:
                              </span>
                              <p className='text-red-300 mt-1 text-sm leading-relaxed break-words'>
                                {result.error_message}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className='flex items-center justify-between pt-3 border-t border-zinc-800'>
                        <div className='text-xs text-zinc-600 font-mono bg-zinc-900/30 px-3 py-1 rounded-md border border-zinc-800'>
                          ID: {result.id}
                        </div>
                        <div className='text-xs text-zinc-500'>
                          Result #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State - Only show when searched but no results */}
          {hasSearched && !loading && !aiResponse && !results.length && (
            <div className='text-center py-16'>
              <div className='w-16 h-16 bg-zinc-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-800'>
                <Search className='w-8 h-8 text-zinc-500' />
              </div>
              <h3 className='text-2xl font-medium text-zinc-300 mb-4'>
                No results found
              </h3>
              <p className='text-zinc-500 max-w-md mx-auto leading-relaxed'>
                Try adjusting your search query or check if there are logs
                matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
