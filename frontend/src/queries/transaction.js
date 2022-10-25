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


const getHomeTrs = async (params) => {
  return await Ax.get("transactionsHome", { params: params }).catch((e) =>
    console.log(e)
  );
};


const getWallViewer = async (params) => {
  return await Ax.get('/walletViewers', params)
}


const editTr = async (params) => {
  console.log(params)
  return await Ax.put(`transaction/edit/${params.transaction}`, params)
}

const getTrEdit = async (params) => {
  console.log(params)
  return await Ax.get('trEdit', params )
  
}

const getViewerTrs = async (params) => {
  return await Ax.get('viewerTransactions', { params: params }).catch((e) =>
    console.log(e)
  );
};

// const getViewerTrs = async (params) => {
//   return await Ax.get("viewerTransactions", { params: params }).catch((e) =>
//     console.log(e)
//   );
// }

const getTrsCount = async (params) => {
  return await Ax.get('transactionsCount', { params: params }).catch((e) =>
    console.log(e)
  );
}

const postTr = async (params) => {
  return await Ax.post("transaction", params);
};
const useTransactionDelete = () => useMutation("deleteTr", deleteTr);

const useTransactionEdit = () => useMutation("editTransaction", editTr);

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

const useEditTrGet = ({
  transactionId,
  key,
}) =>
  useQuery(key, () => getTrEdit({
    transactionId,
  }));



const useTransactionsGet = ({
  firstDate,
  lastDate,
  category,
  dateSort,
  priceSort,
  walletId,
  transactionId,
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
        walletId,
        transactionId,
        skip,
        take,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      keepPreviousData: true,
    }
  );

  
const useHomeTransactionsGet = ({
  firstDate,
  lastDate,
  category,
  dateSort,
  priceSort,
  walletId,
  transactionId,
  skip,
  take,
  key,
}) =>
  useQuery(
    key,
    () =>
      getHomeTrs({
        firstDate,
        lastDate,
        category,
        dateSort,
        priceSort,
        walletId,
        transactionId,
        skip,
        take,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      keepPreviousData: true,
    }
  );

const useViewerTransactionsGet = ({ key, walletId }) => useQuery(key, () => getViewerTrs({ walletId }), {
  refetchOnWindowFocus: false,
  enabled: false,
  keepPreviousData: true,
});


const useTransactionPost = () => useMutation("postTransaction", postTr);
export { useTransactionsGet, useTransactionDelete, useTransactionPost, useTransactionsGetCount, useViewerTransactionsGet, useTransactionEdit, useEditTrGet, useHomeTransactionsGet };