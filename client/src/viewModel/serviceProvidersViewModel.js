import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getProviders } from "../model/providers";
import { handleAsync } from "../utils/handleAsync";

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
      q: query, // So backend can prioritize q
    };

    await handleAsync(
      async () => {
        const response = await getProviders(params);
        setCategoriesMatched(response.data.data1 || []);
        setCompaniesMatched(response.data.data2 || []);
      },
      {
        onError: (err) =>
          setError(err.response?.data?.message || err.toString()),
        onFinally: () => setLoading(false),
      }
    );
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
