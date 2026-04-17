"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 min — data stays fresh
                        retry: 1,             // retry once on failure
                        refetchOnWindowFocus: false,        // don't refetch on tab switch
                    },
                    mutations: {
                        retry: 0,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools panel — only visible in development, auto-hidden in production */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}