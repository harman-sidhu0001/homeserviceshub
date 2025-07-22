import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getProviders } from "../model/providers";
import { handleAsync } from "../utils/handleAsync";
import { getTopProvidersInAmritsar } from "../model/providers";

export const useServiceProviders = () => {
  const { serviceName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL params
  const query = searchParams.get("q") || "";
  const city = searchParams.get("city") || "amritsar";
  const sortBy = searchParams.get("sortBy") || "reviews";

  const [categoriesMatched, setCategoriesMatched] = useState([]);
  const [companiesMatched, setCompaniesMatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("categories");

  // Controlled form state
  const [searchInputValue, setSearchInputValue] = useState(query);
  const [cityInputValue, setCityInputValue] = useState(city);
  const [sortByValue, setSortByValue] = useState(sortBy);

  useEffect(() => {
    setSearchInputValue(query);
    setCityInputValue(city);
    setSortByValue(sortBy);
  }, [query, city, sortBy]);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const effectiveSearch = query || serviceName.replace(/-/g, " ");

    const params = {
      service: effectiveSearch,
      city,
      sortBy,
      q: query,
    };

    const { success, data, error } = await handleAsync(() =>
      getProviders(params)
    );
    if (success) {
      setCategoriesMatched(data.data?.data1 || []);
      setCompaniesMatched(data.data?.data2 || []);
    } else {
      setError(error?.response?.data?.message || error.toString());
    }

    setLoading(false);
  }, [serviceName, city, sortBy, query]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const updateSearch = (newQuery, newCity, newSortBy) => {
    const params = new URLSearchParams(searchParams);
    params.set("q", newQuery);
    params.set("city", newCity);
    params.set("sortBy", newSortBy);
    setSearchParams(params, { replace: true });
  };

  return {
    loading,
    error,
    query,
    city,
    sortBy,
    serviceName,
    activeTab,
    setActiveTab,
    categoriesMatched,
    companiesMatched,
    searchInputValue,
    cityInputValue,
    sortByValue,
    setSearchInputValue,
    setCityInputValue,
    setSortByValue,
    updateSearch,
  };
};

export const useTopProvidersInAmritsar = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTopProvidersInAmritsar();
        setProviders(data);
      } catch (err) {
        setError(err.message || "Failed to load top providers");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  return { providers, loading, error };
};
