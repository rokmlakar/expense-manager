import { useQuery, useMutation } from "react-query";
import Ax from "../utils/Axios";

//AXIOS CALLS
const deleteTr = async (params) => {
  return await Ax.delete(`transaction/delete/${params}`);
};

const getTrs = async (params) => {
  return await Ax.get("transactions", { params: params }).catch((e) =>
    console.log(e)
  );
};

const getTrsCount = async (params) => {
  return await Ax.get('transactionsCount', { params: params }).catch((e) =>
    console.log(e)
  );
}

const postTr = async (params) => {
  return await Ax.post("transaction", params);
};
const useTransactionDelete = () => useMutation("deleteTr", deleteTr);

const useTransactionsGetCount = ({
  category,
  key
}) =>
  useQuery(
    key,
    () =>
      getTrsCount({
        category
      }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      keepPreviousData: true,
    }
  );

const useTransactionsGet = ({
  firstDate,
  lastDate,
  category,
  dateSort,
  priceSort,
  skip,
  take,
  key,
}) =>
  useQuery(
    key,
    () =>
      getTrs({
        firstDate,
        lastDate,
        category,
        dateSort,
        priceSort,
        skip,
        take,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      keepPreviousData: true,
    }
  );

const useTransactionPost = () => useMutation("postTransaction", postTr);
export { useTransactionsGet, useTransactionDelete, useTransactionPost, useTransactionsGetCount };