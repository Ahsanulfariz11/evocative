import { useState, useEffect } from 'react';
import {
  subscribeMenu,
  subscribeEvents,
  subscribeReviews,
  subscribeGallery,
  subscribeSettings,
  subscribeSpace,
  subscribeReservations,
  subscribeAnalytics,
} from '../firebase';
export { trackClick } from '../firebase';

export function useMenuItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeMenu((data) => {
        setItems(data);
        setLoading(false);
      });
    } catch (err) {
      setError(err);
      setLoading(false);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  return { items, loading, error };
}

export function useEvents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeEvents((data) => {
        setItems(data);
        setLoading(false);
      });
    } catch (err) {
      setError(err);
      setLoading(false);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  return { items, loading, error };
}

export function useReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeReviews((data) => {
        setItems(data);
        setLoading(false);
      });
    } catch (err) {
      setError(err);
      setLoading(false);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  return { items, loading, error };
}

export function useGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeGallery((data) => {
        setItems(data);
        setLoading(false);
      });
    } catch (err) {
      setError(err);
      setLoading(false);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  return { items, loading, error };
}

export function useSettings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeSettings((val) => {
        setData(val);
        setLoading(false);
      });
    } catch (err) {
      setError(err);
      setLoading(false);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  return { data, loading, error };
}

export function useSpace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeSpace((data) => {
        setItems(data);
        setLoading(false);
      });
    } catch (err) {
      setError(err);
      setLoading(false);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  return { items, loading, error };
}
export function useReservations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeReservations((data) => {
        setItems(data);
        setLoading(false);
      });
    } catch (err) {
      setError(err);
      setLoading(false);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  return { items, loading, error };
}

export function useAnalytics() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeAnalytics((data) => {
        setStats(data || {});
        setLoading(false);
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  return { stats, loading };
}
