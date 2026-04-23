"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SunScene from "../../Components/SunScene";
import styles from "../page.module.css";
import Link from "next/link";

const NASA_API_KEY = "DEMO_KEY";

export default function GSTPage() {
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(async () => {
      if (!start || !end) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://api.nasa.gov/DONKI/GST?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`, { signal });
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching GST data", error);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [start, end]);

  return (
    <div className={styles.container}>
      <SunScene />
      
      <div className={styles.content}>
        <div className={`glass-panel ${styles.searchPanel}`}>
          <h1>Geomagnetic Storms (GST)</h1>
          {start && end ? (
            <p>Showing events from {start} to {end}</p>
          ) : (
            <p>Please go back to the home page to select a date range.</p>
          )}
          <Link href="/" className="button">Back to Home</Link>
        </div>

        {loading ? (
          <div className={`glass-panel ${styles.emptyState}`}>
            <h3>Loading...</h3>
          </div>
        ) : data.length === 0 && start ? (
          <div className={`glass-panel ${styles.emptyState}`}>
            <h3>No GST events recorded for this period.</h3>
          </div>
        ) : (
          <div className={styles.cardsGrid} style={{ marginTop: '20px' }}>
            {data.map((event, index) => (
              <div key={index} className={`glass-panel ${styles.dataCard}`}>
                <h3>Event: {event.gstID}</h3>
                <p><strong>Start Time:</strong> {event.startTime}</p>
                <p><strong>Kp Index:</strong> {event.allKpIndex && event.allKpIndex.length > 0 ? event.allKpIndex[0].kpIndex : 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
