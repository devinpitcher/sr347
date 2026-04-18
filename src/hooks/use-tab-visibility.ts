import { useCallback, useEffect, useState } from "react";

export function useTabVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  const handleVisibilityChange = useCallback(() => {
    setIsVisible(document.visibilityState === "visible");
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return isVisible;
}
