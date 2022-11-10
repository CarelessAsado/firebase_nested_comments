import { customApiCall } from "API/commentsAPI";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";

function useApiCall<T>({
  url,
  body = {},
  method,
}: {
  url: string;
  body?: {};
  method: AxiosMethodsCustomApiCall;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const execute = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await customApiCall<T[]>({ body, url, method });

      setData(data);
    } catch (error: any) {
      setError(error?.response?.data || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  return { data, error, loading, execute };
}

export default useApiCall;
