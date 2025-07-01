// homeViewModel.js
import { useQuery } from "@tanstack/react-query";
import { providerAPI } from "../services/providerAPI";
export const useHomeData = () => console.log("hellooo");
useQuery({
  queryKey: ["homeData"],
  queryFn: () => providerAPI.getProviders(),
});
