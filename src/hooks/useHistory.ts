import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  time: string;
  question: string;
  type: 'staking' | 'price' | 'general' | 'defi' | 'token' | 'market';
}

// Create objects that will only be initialized on the client side
const createStore = () => {
  // Initial empty state
  let globalHistory: HistoryItem[] = [];
  const subscribers = new Set<(history: HistoryItem[]) => void>();

  const updateGlobalHistory = (newHistory: HistoryItem[]) => {
    globalHistory = newHistory;
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatHistory', JSON.stringify(newHistory));
    }
    // Notify all subscribers
    subscribers.forEach((callback) => callback(newHistory));
  };

  // Initialize store with localStorage data (client-side only)
  const initializeStore = () => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        try {
          globalHistory = JSON.parse(savedHistory);
        } catch (error) {
          console.error('Failed to parse chat history:', error);
          localStorage.removeItem('chatHistory');
        }
      }
    }
  };

  return {
    getHistory: () => globalHistory,
    updateHistory: updateGlobalHistory,
    subscribe: (callback: (history: HistoryItem[]) => void) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    initializeStore,
  };
};

// Create the store, but don't initialize it yet
// We'll use a lazy initialization pattern to avoid hydration issues
let store: ReturnType<typeof createStore> | null = null;

// Function to safely get the store on client-side only
const getStore = () => {
  if (!store) {
    store = createStore();
    // Only initialize after we know we're on the client
    store.initializeStore();
  }
  return store;
};

export function useHistory() {
  // Start with empty history to avoid hydration mismatch
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the history from localStorage, but only on the client side
  useEffect(() => {
    const store = getStore();

    // Update local state with current store state
    setHistory(store.getHistory());
    setIsInitialized(true);

    // Subscribe to future updates
    const unsubscribe = store.subscribe((newHistory) => {
      setHistory([...newHistory]);
    });

    return unsubscribe;
  }, []);

  // Don't perform any actions until client-side initialization is complete
  if (!isInitialized && typeof window === 'undefined') {
    // Return empty data and no-op functions during SSR
    return {
      history: [],
      addToHistory: () => {},
      removeFromHistory: () => {},
      clearHistory: () => {},
      loadQuestion: () => '',
    };
  }

  // Add a new question to history
  const addToHistory = (question: string) => {
    // Don't add empty questions
    if (!question.trim()) return;

    const store = getStore();
    const currentHistory = store.getHistory();

    // Determine the type of question
    const type = determineQuestionType(question);

    // Create a new history item
    const newItem: HistoryItem = {
      id: `hist_${Date.now()}`,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      question,
      type,
    };

    // Check if this question already exists in history
    const isExisting = currentHistory.some(
      (item) => item.question.toLowerCase() === question.toLowerCase()
    );

    // Only add if not existing
    if (!isExisting) {
      const updatedHistory = [newItem, ...currentHistory];
      store.updateHistory(updatedHistory);
    }
  };

  // Remove a question from history
  const removeFromHistory = (id: string) => {
    const store = getStore();
    const currentHistory = store.getHistory();

    const updatedHistory = currentHistory.filter((item) => item.id !== id);
    store.updateHistory(updatedHistory);

    // If history is empty after removal, clear localStorage
    if (updatedHistory.length === 0 && typeof window !== 'undefined') {
      localStorage.removeItem('chatHistory');
    }
  };

  // Clear all history
  const clearHistory = () => {
    const store = getStore();
    store.updateHistory([]);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatHistory');
    }
  };

  // Load question into chat input
  const loadQuestion = (id: string) => {
    const store = getStore();
    const currentHistory = store.getHistory();
    return currentHistory.find((item) => item.id === id)?.question || '';
  };

  // Determine the type of the question
  const determineQuestionType = (question: string): HistoryItem['type'] => {
    const lowerCaseQuestion = question.toLowerCase();

    if (
      lowerCaseQuestion.includes('stake') ||
      lowerCaseQuestion.includes('risk tolerance') ||
      lowerCaseQuestion.includes('apy')
    ) {
      return 'staking';
    } else if (
      lowerCaseQuestion.includes('price') ||
      lowerCaseQuestion.includes('trend') ||
      lowerCaseQuestion.includes('history')
    ) {
      return 'price';
    } else if (
      lowerCaseQuestion.includes('defi') ||
      lowerCaseQuestion.includes('tvl') ||
      lowerCaseQuestion.includes('yield') ||
      lowerCaseQuestion.includes('protocol')
    ) {
      return 'defi';
    } else if (
      lowerCaseQuestion.includes('token') ||
      lowerCaseQuestion.includes('contract address') ||
      lowerCaseQuestion.includes('0x')
    ) {
      return 'token';
    } else if (
      lowerCaseQuestion.includes('market') ||
      lowerCaseQuestion.includes('trending') ||
      lowerCaseQuestion.includes('gainers')
    ) {
      return 'market';
    } else {
      return 'general';
    }
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    loadQuestion,
  };
}
