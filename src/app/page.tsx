"use client";

import { useState, useEffect } from "react";
import EarthScene from "../Components/EarthScene";
import styles from "./page.module.css";
import Link from "next/link";

const NASA_API_KEY = "DEMO_KEY";

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [cmeData, setCmeData] = useState<any[]>([]);
  const [gstData, setGstData] = useState<any[]>([]);
  const [sepData, setSepData] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);

      try {
        const [cmeRes, gstRes, sepRes] = await Promise.all([
          fetch(`https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`, { signal }),
          fetch(`https://api.nasa.gov/DONKI/GST?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`, { signal }),
          fetch(`https://api.nasa.gov/DONKI/SEP?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`, { signal })
        ]);

        const cme = await cmeRes.json();
        const gst = await gstRes.json();
        const sep = await sepRes.json();

        setCmeData(Array.isArray(cme) ? cme : []);
        setGstData(Array.isArray(gst) ? gst : []);
        setSepData(Array.isArray(sep) ? sep : []);

      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching data", error);
        }
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [startDate, endDate]);

  const hasNoData = cmeData.length === 0 && gstData.length === 0 && sepData.length === 0;

  return (
    <div className={styles.container}>
      <EarthScene />

      <div className={styles.content}>
        <div className={`glass-panel ${styles.searchPanel}`}>
          <h1>Check Space Weather</h1>
          <p>Select a date range to view Coronal Mass Ejections, Geomagnetic Storms, and Solar Particles.</p>
          
          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Start Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>End Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
            {loading && <p style={{color: 'var(--accent)', marginTop: '8px', fontWeight: 'bold'}}>Scanning space weather data...</p>}
          </div>
        </div>

        {hasSearched && !loading && (
          <div className={styles.resultsContainer}>
            {hasNoData ? (
              <div className={`glass-panel ${styles.emptyState}`}>
                <h3>No Solar Events Recorded</h3>
                <p>The space weather was calm during this date range. No major flares or storms were detected by NASA's DONKI system.</p>
              </div>
            ) : (
              <div className={styles.cardsGrid}>
                {cmeData.length > 0 && (
                  <div className={`glass-panel ${styles.dataCard}`}>
                    <h3>Coronal Mass Ejections</h3>
                    <p className={styles.eventCount}>{cmeData.length} Events Detected</p>
                    <Link href={`/cme?start=${startDate}&end=${endDate}`} className="button">View Details</Link>
                  </div>
                )}
                {gstData.length > 0 && (
                  <div className={`glass-panel ${styles.dataCard}`}>
                    <h3>Geomagnetic Storms</h3>
                    <p className={styles.eventCount}>{gstData.length} Events Detected</p>
                    <Link href={`/gst?start=${startDate}&end=${endDate}`} className="button">View Details</Link>
                  </div>
                )}
                {sepData.length > 0 && (
                  <div className={`glass-panel ${styles.dataCard}`}>
                    <h3>Solar Energetic Particles</h3>
                    <p className={styles.eventCount}>{sepData.length} Events Detected</p>
                    <Link href={`/sep?start=${startDate}&end=${endDate}`} className="button">View Details</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
