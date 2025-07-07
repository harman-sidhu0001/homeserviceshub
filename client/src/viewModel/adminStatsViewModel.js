import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminStats } from "../model/admin";
import { setStats, setLoading, setError } from "../store/adminStatsSlice";

export const useAdminStatsViewModel = (dependencies = []) => {
  const dispatch = useDispatch();
  const { stats, loaded, loading, error } = useSelector(
    (state) => state.adminStats
  );

  useEffect(() => {
    if (!loaded) {
      dispatch(setLoading(true));
      getAdminStats()
        .then((res) => dispatch(setStats(res.data.data)))
        .catch(() => dispatch(setError("Failed to load stats")));
    }
    // If dependencies change (e.g. user/provider/request CRUD), refetch
    // dependencies should be an array of booleans/ids that change on CRUD
    // If you want to force reload, dispatch(clearStats()) before
  }, [loaded, dispatch, ...dependencies]);

  return { stats, loading, error };
};
