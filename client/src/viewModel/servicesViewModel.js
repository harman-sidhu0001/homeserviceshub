import { useState, useEffect, useCallback } from "react";
import { getServices } from "../model/services";
import { handleAsync } from "../utils/handleAsync";

/**
 * ViewModel hook for managing and fetching the list of services.
 * Follows the MVVM pattern established in the project.
 */
export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { success, data, error } = await handleAsync(getServices);

    if (success) {
      setServices(Array.isArray(data) ? data : []);
      setError(null);
    } else {
      setError(error.toString());
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
};
