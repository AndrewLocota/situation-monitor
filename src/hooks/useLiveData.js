/**
 * useLiveData Hook - Automatically fetches and refreshes live data
 * Handles all data fetching with configurable refresh intervals
 * Non-blocking: loads data progressively without blocking the UI
 */

import { useEffect, useCallback, useRef } from 'react';
import { useDataStore } from '../stores';
import {
  fetchAllNews,
  fetchLiveConflictEvents,
  fetchEarthquakes,
  fetchCryptoPrices,
  fetchPolymarketEvents,
  fetchFedData,
  fetchMarketIndices,
  fetchCongressTrades,
  fetchWhaleTransactions,
  fetchGovContracts,
  fetchSectorData,
  fetchCommodityData,
  fetchTwitterIntel,
} from '../services/api/liveDataFetcher';

export function useLiveData(options = {}) {
  const {
    newsInterval = 60000,      // 1 minute
    conflictInterval = 30000,  // 30 seconds
    marketsInterval = 30000,   // 30 seconds
    earthquakeInterval = 120000, // 2 minutes
    specialDataInterval = 300000, // 5 minutes for congress, whales, contracts
    twitterInterval = 120000,  // 2 minutes for Twitter
    enabled = true,
  } = options;

  const {
    setAllNews,
    setConflictEvents,
    setEarthquakes,
    setCrypto,
    setPolymarket,
    setFedData,
    setMarkets,
    setSectors,
    setCommodities,
    setCongressTrades,
    setWhaleTransactions,
    setGovContracts,
    setTwitterEvents,
    setLastUpdate,
    setLoading,
    setError,
    setLoadingState,
    setLastUpdated,
  } = useDataStore();

  const newsTimerRef = useRef(null);
  const conflictTimerRef = useRef(null);
  const marketsTimerRef = useRef(null);
  const earthquakeTimerRef = useRef(null);
  const specialDataTimerRef = useRef(null);
  const twitterTimerRef = useRef(null);
  const isFirstNewsLoad = useRef(true);

  // Fetch news (non-blocking) - uses fast mode for initial load
  const fetchNews = useCallback(async () => {
    setLoadingState('news', true);
    try {
      // On first load, use fast mode to quickly show 20 articles
      const isFastMode = isFirstNewsLoad.current;
      const news = await fetchAllNews({
        limit: isFastMode ? 20 : 200,
        fastMode: isFastMode
      });

      setAllNews(news.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: item.pubDate.toISOString(),
        source: item.source,
        category: item.category,
        imageUrl: item.imageUrl,
        bias: item.bias,
        biasLabel: item.biasLabel,
        reliability: item.reliability,
      })));
      setLastUpdated('news');

      // After first load, fetch full news in background (keep loading state true)
      if (isFirstNewsLoad.current) {
        isFirstNewsLoad.current = false;
        // Don't set loading to false yet - we're still fetching more
        // Schedule full fetch after a short delay
        setTimeout(async () => {
          try {
            const fullNews = await fetchAllNews({ limit: 200, fastMode: false });
            setAllNews(fullNews.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              link: item.link,
              pubDate: item.pubDate.toISOString(),
              source: item.source,
              category: item.category,
              imageUrl: item.imageUrl,
              bias: item.bias,
              biasLabel: item.biasLabel,
              reliability: item.reliability,
            })));
          } catch (err) {
            console.error('Failed to fetch full news:', err);
          } finally {
            // NOW set loading to false after full fetch completes
            setLoadingState('news', false);
          }
        }, 500);
      } else {
        // Not first load, set loading false immediately
        setLoadingState('news', false);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setLoadingState('news', false);
    }
  }, [setAllNews, setLoadingState, setLastUpdated]);

  // Fetch conflict events (non-blocking)
  const fetchConflicts = useCallback(async () => {
    try {
      const events = await fetchLiveConflictEvents();
      setConflictEvents(events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        lat: event.lat,
        lon: event.lon,
        timestamp: event.timestamp.toISOString(),
        source: event.source,
        type: event.type,
        severity: event.severity,
        link: event.link,
      })));
    } catch (error) {
      console.error('Failed to fetch conflict events:', error);
    }
  }, [setConflictEvents]);

  // Fetch earthquakes (non-blocking)
  const fetchEqs = useCallback(async () => {
    setLoadingState('earthquakes', true);
    try {
      const eqs = await fetchEarthquakes();
      setEarthquakes(eqs.map(eq => ({
        lat: eq.lat,
        lon: eq.lon,
        mag: eq.mag,
        place: eq.place,
        time: eq.time.toISOString(),
      })));
      setLastUpdated('earthquakes');
    } catch (error) {
      console.error('Failed to fetch earthquakes:', error);
    } finally {
      setLoadingState('earthquakes', false);
    }
  }, [setEarthquakes, setLoadingState, setLastUpdated]);

  // Fetch Twitter Intel (non-blocking)
  const fetchTwitter = useCallback(async () => {
    setLoadingState('twitter', true);
    try {
      const tweets = await fetchTwitterIntel();
      setTwitterEvents(tweets.map(tweet => ({
        id: tweet.id,
        tweetId: tweet.tweetId,
        title: tweet.title,
        description: tweet.description,
        link: tweet.link,
        pubDate: tweet.pubDate.toISOString(),
        source: tweet.source,
        username: tweet.username,
      })));
    } catch (error) {
      console.error('Failed to fetch Twitter intel:', error);
    } finally {
      setLoadingState('twitter', false);
    }
  }, [setTwitterEvents, setLoadingState]);

  // Fetch market data (non-blocking, each source independent)
  const fetchMarketData = useCallback(async () => {
    // Fetch markets
    setLoadingState('markets', true);
    fetchMarketIndices()
      .then(markets => {
        setMarkets(markets);
        setLastUpdated('markets');
      })
      .catch(err => console.error('Failed to fetch markets:', err))
      .finally(() => setLoadingState('markets', false));

    // Fetch crypto
    fetchCryptoPrices()
      .then(crypto => {
        setCrypto(crypto);
      })
      .catch(err => console.error('Failed to fetch crypto:', err));

    // Fetch polymarket
    setLoadingState('polymarket', true);
    fetchPolymarketEvents()
      .then(polymarket => {
        setPolymarket(polymarket);
        setLastUpdated('polymarket');
      })
      .catch(err => console.error('Failed to fetch polymarket:', err))
      .finally(() => setLoadingState('polymarket', false));

    // Fetch fed data
    setLoadingState('fed', true);
    fetchFedData()
      .then(fedData => {
        setFedData(fedData);
      })
      .catch(err => console.error('Failed to fetch fed data:', err))
      .finally(() => setLoadingState('fed', false));

    // Fetch sector data
    fetchSectorData()
      .then(sectors => {
        setSectors(sectors);
      })
      .catch(err => console.error('Failed to fetch sector data:', err));

    // Fetch commodity data
    fetchCommodityData()
      .then(commodities => {
        setCommodities(commodities);
      })
      .catch(err => console.error('Failed to fetch commodity data:', err));
  }, [setCrypto, setPolymarket, setFedData, setMarkets, setSectors, setCommodities, setLoadingState, setLastUpdated]);

  // Fetch special data sources (congress trades, whale txs, gov contracts)
  const fetchSpecialData = useCallback(async () => {
    // Fetch congress trades
    setLoadingState('congress', true);
    fetchCongressTrades()
      .then(trades => {
        setCongressTrades(trades);
      })
      .catch(err => console.error('Failed to fetch congress trades:', err))
      .finally(() => setLoadingState('congress', false));

    // Fetch whale transactions
    setLoadingState('whales', true);
    fetchWhaleTransactions()
      .then(txs => {
        setWhaleTransactions(txs);
      })
      .catch(err => console.error('Failed to fetch whale transactions:', err))
      .finally(() => setLoadingState('whales', false));

    // Fetch government contracts
    setLoadingState('contracts', true);
    fetchGovContracts()
      .then(contracts => {
        setGovContracts(contracts);
      })
      .catch(err => console.error('Failed to fetch gov contracts:', err))
      .finally(() => setLoadingState('contracts', false));
  }, [setCongressTrades, setWhaleTransactions, setGovContracts, setLoadingState]);

  // Initial data fetch - NON-BLOCKING (each data source fetches independently)
  const fetchAllData = useCallback(() => {
    setLoading(true);
    setError(null);

    // Start all fetches independently - don't wait for all to complete
    // This allows the map and UI to load while data streams in
    fetchNews();
    fetchConflicts();
    fetchEqs();
    fetchMarketData();
    fetchSpecialData();
    fetchTwitter();

    // Mark global loading as done after a short delay
    // (individual loading states are managed per-source)
    setTimeout(() => {
      setLoading(false);
      setLastUpdate(new Date().toISOString());
    }, 500);
  }, [fetchNews, fetchConflicts, fetchEqs, fetchMarketData, fetchSpecialData, fetchTwitter, setLoading, setError, setLastUpdate]);

  // Set up refresh intervals
  useEffect(() => {
    if (!enabled) return;

    // Initial fetch - non-blocking
    fetchAllData();

    // Set up timers for each data source independently
    newsTimerRef.current = setInterval(fetchNews, newsInterval);
    conflictTimerRef.current = setInterval(fetchConflicts, conflictInterval);
    marketsTimerRef.current = setInterval(fetchMarketData, marketsInterval);
    earthquakeTimerRef.current = setInterval(fetchEqs, earthquakeInterval);
    specialDataTimerRef.current = setInterval(fetchSpecialData, specialDataInterval);
    twitterTimerRef.current = setInterval(fetchTwitter, twitterInterval);

    return () => {
      if (newsTimerRef.current) clearInterval(newsTimerRef.current);
      if (conflictTimerRef.current) clearInterval(conflictTimerRef.current);
      if (marketsTimerRef.current) clearInterval(marketsTimerRef.current);
      if (earthquakeTimerRef.current) clearInterval(earthquakeTimerRef.current);
      if (specialDataTimerRef.current) clearInterval(specialDataTimerRef.current);
      if (twitterTimerRef.current) clearInterval(twitterTimerRef.current);
    };
  }, [enabled, newsInterval, conflictInterval, marketsInterval, earthquakeInterval, specialDataInterval, twitterInterval,
      fetchAllData, fetchNews, fetchConflicts, fetchMarketData, fetchEqs, fetchSpecialData, fetchTwitter]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { refresh };
}

export default useLiveData;
