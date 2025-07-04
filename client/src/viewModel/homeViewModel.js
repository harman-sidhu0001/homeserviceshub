// homeViewModel.js
import { useQuery } from "@tanstack/react-query";
import { providerAPI } from "../services/providerAPI";
useQuery({
  queryKey: ["homeData"],
  queryFn: () => providerAPI.getProviders(),
});
