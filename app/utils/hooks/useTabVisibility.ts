import { useCallback, useEffect, useState } from "react";

const useTabVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleVisibilityChange = useCallback(() => {
    setIsVisible(document.visibilityState === "visible");
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

export default useTabVisibility;
