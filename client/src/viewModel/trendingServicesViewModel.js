import { useEffect, useState } from "react";
import { getTrendingServices } from "../model/trendingServices";

export const useTrendingServicesViewModel = () => {
  const [trendingServices, setTrendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTrendingServices();
        setTrendingServices(res || []);
      } catch (err) {
        setError(err.message || "Failed to load trending services");
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return { trendingServices, loading, error };
};
