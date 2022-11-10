import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useCallback } from "react";

//mando una fn con Promise y un generic Type q se va a inferir
function useTestApiCall<Args, AxiosData>({
  apiCallPromise,
  args,
}: {
  //
  apiCallPromise: (ver: Args) => Promise<AxiosResponse<AxiosData, any>>;
  args: Args; //aca tengo q ver como agarro los args de la fn
  /*   url: string;
  body?: {};
  method: AxiosMethodsCustomApiCall; */
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AxiosData>([] as AxiosData);
  const execute = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiCallPromise(args);

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

export default useTestApiCall;
