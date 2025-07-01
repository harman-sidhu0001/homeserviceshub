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
    setError(null);
    await handleAsync(
      async () => {
        const servicesData = await getServices();
        // The API returns an object { success: true, data: [...] }, so we extract the data array.
        setServices(
          Array.isArray(servicesData?.data?.data) ? servicesData.data.data : []
        );
      },
      {
        onError: (err) => setError(err.toString()),
        onFinally: () => setLoading(false),
      }
    );
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
};
