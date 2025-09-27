import { useEffect, useState } from "react";

export function useSSE<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const eventSource = new EventSource(url, { 
      withCredentials: true,
    });

    eventSource.onopen = () => {
      console.log('SSE opened');
      setLoading(false);
      setError(null);
    };

    eventSource.addEventListener('whatsapp.status', (e) => {
      console.log('SSE data:', e);
      try {
        setData(JSON.parse(e.data));
      } catch (parseError) {
        console.error("Error parsing SSE data:", parseError);
        setError(parseError as Event);
      }
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