"use client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, Suspense, useState } from "react";
import { handleNetworkError } from "@/app/utils/showerrorResponse";
import { handleSuccessMessage } from "@/app/utils/showSuccessmessage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Spin } from "antd";

interface ReactQueryWrapperProps {
  children: ReactNode;
}

const ReactQueryProvider: React.FC<ReactQueryWrapperProps> = ({ children }) => {
  // Create QueryClient only once per mount:
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error: any) => {
              handleNetworkError(error);
            },
            onSuccess: (variables: any, context: any) => {
              const method =
                context?.method?.toUpperCase() ||
                variables?.method?.toUpperCase();
              const customMessage = context?.customMessage || undefined;
              handleSuccessMessage(method, customMessage);
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error: any) => {
            if (process.env.NODE_ENV !== "production") {
              handleNetworkError(error);
            }
          },
        }),
      })
  );

  const FullPageSpinner = () => (
    <div className="w-full min-h-screen fixed top-0 left-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white  z-50 flex justify-center items-center">
      <Spin size="large" />
    </div>
  );

  return (
    <Suspense fallback={<FullPageSpinner />}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Suspense>
  );
};

export default ReactQueryProvider;
