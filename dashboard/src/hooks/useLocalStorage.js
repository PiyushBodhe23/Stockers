import { useState, useEffect, useCallback, useRef } from "react";

// Storage event type for cross-tab sync
const STORAGE_EVENT = "localStorageChange";

// Custom error types
class LocalStorageError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "LocalStorageError";
    this.code = code;
  }
}

export const useLocalStorage = (keyName, defaultValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    validate = (value) => true, // Validation function
    onError = (error) => console.error("LocalStorage error:", error),
    syncAcrossTabs = true, // Sync changes across tabs
    expireAfter = null, // Expiration time in milliseconds
    version = 1, // Data version for migrations
  } = options;

  const [storedValue, setStoredValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  // Helper to get storage key with version
  const getStorageKey = useCallback(() => {
    return version > 1 ? `${keyName}_v${version}` : keyName;
  }, [keyName, version]);

  // Helper to check storage quota
  const checkStorageQuota = useCallback((value) => {
    try {
      const testKey = "__quota_test__";
      localStorage.setItem(testKey, value);
      localStorage.removeItem(testKey);
      return true;
    } catch (err) {
      if (err.name === "QuotaExceededError") {
        throw new LocalStorageError(
          "Storage quota exceeded. Please clear some space.",
          "QUOTA_EXCEEDED"
        );
      }
      throw err;
    }
  }, []);

  // Helper to get item with expiration
  const getItemWithExpiry = useCallback(() => {
    const storageKey = getStorageKey();
    const itemStr = localStorage.getItem(storageKey);
    
    if (!itemStr) return null;
    
    try {
      const item = deserialize(itemStr);
      
      // Check if item has expiration
      if (item && item.__expiry) {
        if (Date.now() > item.__expiry) {
          localStorage.removeItem(storageKey);
          return null;
        }
        // Return the actual data without expiry metadata
        return item.data;
      }
      
      return item;
    } catch {
      return null;
    }
  }, [getStorageKey, deserialize]);

  // Helper to set item with expiration
  const setItemWithExpiry = useCallback((value) => {
    const storageKey = getStorageKey();
    let dataToStore = value;
    
    // Add expiration metadata if needed
    if (expireAfter && expireAfter > 0) {
      dataToStore = {
        data: value,
        __expiry: Date.now() + expireAfter,
      };
    }
    
    const serialized = serialize(dataToStore);
    checkStorageQuota(serialized);
    localStorage.setItem(storageKey, serialized);
    
    // Dispatch custom event for cross-tab sync
    if (syncAcrossTabs) {
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, {
        detail: { key: keyName, value: dataToStore }
      }));
    }
  }, [getStorageKey, serialize, checkStorageQuota, expireAfter, syncAcrossTabs, keyName]);

  // Load initial value
  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const existingValue = getItemWithExpiry();
      
      if (existingValue !== null) {
        // Validate the existing value
        if (validate(existingValue)) {
          if (isMountedRef.current) {
            setStoredValue(existingValue);
          }
        } else {
          // Invalid data, use default
          if (isMountedRef.current) {
            setStoredValue(defaultValue);
          }
          setItemWithExpiry(defaultValue);
        }
      } else {
        // No existing value, set default
        if (isMountedRef.current) {
          setStoredValue(defaultValue);
        }
        setItemWithExpiry(defaultValue);
      }
    } catch (err) {
      const errorMsg = `Failed to load from localStorage: ${err.message}`;
      console.error(errorMsg);
      setError(new LocalStorageError(errorMsg, "LOAD_FAILED"));
      onError(err);
      if (isMountedRef.current) {
        setStoredValue(defaultValue);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [keyName, defaultValue, getItemWithExpiry, setItemWithExpiry, validate, onError]);

  // Cross-tab sync listener
  useEffect(() => {
    if (!syncAcrossTabs) return;
    
    const handleStorageChange = (event) => {
      if (event.detail && event.detail.key === keyName) {
        try {
          const newValue = event.detail.value;
          if (validate(newValue)) {
            setStoredValue(newValue);
          }
        } catch (err) {
          console.error("Cross-tab sync error:", err);
        }
      }
    };
    
    // Also listen to native storage events
    const handleNativeStorageChange = (event) => {
      if (event.key === getStorageKey() && event.newValue !== null) {
        try {
          const newValue = deserialize(event.newValue);
          if (validate(newValue)) {
            setStoredValue(newValue);
          }
        } catch (err) {
          console.error("Native storage event error:", err);
        }
      }
    };
    
    window.addEventListener(STORAGE_EVENT, handleStorageChange);
    window.addEventListener("storage", handleNativeStorageChange);
    
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorageChange);
      window.removeEventListener("storage", handleNativeStorageChange);
    };
  }, [keyName, syncAcrossTabs, getStorageKey, deserialize, validate]);

  const setValue = useCallback((newValue) => {
    try {
      let valueToStore = newValue;
      
      // Handle function updates
      if (typeof newValue === "function") {
        valueToStore = newValue(storedValue);
      }
      
      // Validate before storing
      if (!validate(valueToStore)) {
        throw new LocalStorageError(
          "Value validation failed",
          "VALIDATION_FAILED"
        );
      }
      
      setItemWithExpiry(valueToStore);
      setStoredValue(valueToStore);
      setError(null);
    } catch (err) {
      const errorMsg = `Failed to save to localStorage: ${err.message}`;
      console.error(errorMsg);
      setError(new LocalStorageError(errorMsg, "SAVE_FAILED"));
      onError(err);
    }
  }, [storedValue, setItemWithExpiry, validate, onError]);

  const removeValue = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      setStoredValue(defaultValue);
      setError(null);
      
      // Dispatch event for cross-tab sync
      if (syncAcrossTabs) {
        window.dispatchEvent(new CustomEvent(STORAGE_EVENT, {
          detail: { key: keyName, value: null }
        }));
      }
    } catch (err) {
      const errorMsg = `Failed to remove from localStorage: ${err.message}`;
      console.error(errorMsg);
      setError(new LocalStorageError(errorMsg, "REMOVE_FAILED"));
      onError(err);
    }
  }, [keyName, getStorageKey, defaultValue, syncAcrossTabs, onError]);

  const clearAll = useCallback(() => {
    try {
      // Clear only items that start with the key pattern
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(keyName)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      setStoredValue(defaultValue);
      setError(null);
    } catch (err) {
      console.error("Failed to clear localStorage:", err);
      onError(err);
    }
  }, [keyName, defaultValue, onError]);

  const getRemainingSpace = useCallback(() => {
    try {
      // Estimate remaining space by testing with large string
      const testKey = "__space_test__";
      let testString = "a";
      let quota = 0;
      
      try {
        while (true) {
          localStorage.setItem(testKey, testString);
          testString += testString;
          quota = testString.length;
        }
      } catch (err) {
        if (err.name === "QuotaExceededError") {
          // Clean up
          localStorage.removeItem(testKey);
          // Rough estimate: 5MB - used
          const used = JSON.stringify(localStorage).length;
          const maxQuota = 5 * 1024 * 1024; // 5MB
          return Math.max(0, maxQuota - used);
        }
        return null;
      }
    } catch {
      return null;
    }
  }, []);

  return {
    value: storedValue,
    setValue,
    removeValue,
    clearAll,
    isLoading,
    error,
    getRemainingSpace,
    // Legacy array destructuring support
    // [storedValue, setValue, removeValue, { isLoading, error }]
  };
};

// Legacy support for array destructuring
export const useLocalStorageLegacy = (keyName, defaultValue, options = {}) => {
  const { value, setValue, removeValue, isLoading, error } = useLocalStorage(keyName, defaultValue, options);
  return [value, setValue, removeValue, { isLoading, error }];
};

// Helper HOC for persistent state
export const withLocalStorage = (WrappedComponent, keyName, defaultValue, options = {}) => {
  return (props) => {
    const { value, setValue, removeValue, isLoading } = useLocalStorage(keyName, defaultValue, options);
    
    if (isLoading) {
      return <div>Loading saved preferences...</div>;
    }
    
    return (
      <WrappedComponent
        {...props}
        persistedValue={value}
        setPersistedValue={setValue}
        clearPersistedValue={removeValue}
      />
    );
  };
};

// Advanced: useLocalStorage with migrations
export const useMigratedLocalStorage = (keyName, migrations, defaultValue, options = {}) => {
  const [currentVersion, setCurrentVersion] = useState(migrations[migrations.length - 1]?.version || 1);
  
  const migrateData = useCallback((data, fromVersion, toVersion) => {
    let migratedData = { ...data };
    for (let v = fromVersion + 1; v <= toVersion; v++) {
      const migration = migrations.find(m => m.version === v);
      if (migration && migration.migrate) {
        migratedData = migration.migrate(migratedData);
      }
    }
    return migratedData;
  }, [migrations]);
  
  const { value, setValue, ...rest } = useLocalStorage(keyName, defaultValue, {
    ...options,
    validate: (value) => {
      // Add version validation logic here
      return true;
    },
  });
  
  return { value, setValue, currentVersion, ...rest };
};

// Example usage component
export const LocalStorageExample = () => {
  // Basic usage
  const { value: theme, setValue: setTheme, isLoading } = useLocalStorage("theme", "dark");
  
  // With validation and expiration
  const { 
    value: session, 
    setValue: setSession,
    removeValue: removeSession,
    error 
  } = useLocalStorage("session", null, {
    validate: (value) => value === null || (value.token && typeof value.token === "string"),
    expireAfter: 3600000, // 1 hour
    onError: (err) => console.error("Session storage error:", err),
  });
  
  // Array destructuring (legacy support)
  const [notifications, setNotifications] = useLocalStorageLegacy("notifications", []);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Toggle Theme (Current: {theme})
      </button>
      
      <button onClick={() => setSession({ token: "abc123", userId: 1 })}>
        Set Session
      </button>
      
      <button onClick={removeSession}>Clear Session</button>
      
      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
      
      <button onClick={() => setNotifications([...notifications, Date.now()])}>
        Add Notification
      </button>
    </div>
  );
};