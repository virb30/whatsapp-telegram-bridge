import { useEffect, useState } from "react";

export function useSSE<T>(url: string, listenEvents: string[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  

  const registerListeners = (eventSource: EventSource, type: string, callback: (e: MessageEvent) => void) => {
    eventSource.addEventListener(type, callback);
  }

  const parseData = (e: MessageEvent) => {
    try {
      setData(JSON.parse(e.data));
    } catch (parseError) {
      console.error("Error parsing SSE data:", parseError);
      setError(parseError as Event);
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(url, { 
      withCredentials: true,
    });

    eventSource.onopen = () => {
      setLoading(false);
      setError(null);
    };

    listenEvents.forEach((event) => {
      registerListeners(eventSource, event, parseData);
    });

    eventSource.onmessage = (e) => {
      try {
        setData(JSON.parse(e.data));
      } catch (parseError) {
        console.error("Error parsing SSE data:", parseError);
        setError(parseError as Event);
      }
    };

    eventSource.onerror = (e) => {
      console.error("SSE Error:", e);
      setError(e);
      eventSource.close();
      setLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, error, loading };
}