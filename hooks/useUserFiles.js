// hooks/useUserFiles.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUserFiles } from "@/service/fetchUserFiles";


// hooks/useUserFiles.ts
export const useUserFiles = ({ userId, parentId }) => {
  return useQuery({
    queryKey: ["files", userId, parentId],
    queryFn: () => fetchUserFiles({ userId, parentId}),
    enabled: !!userId,
    staleTime: 5 * 60_000,
    cacheTime: 10 * 60_000,
    keepPreviousData: true,
    placeholderData: (previousData) => previousData, // 🔥 KEY LINE
  });
};

