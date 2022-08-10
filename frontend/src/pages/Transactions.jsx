import styles from '../styles/transactionComponents/Transactions.module.scss';
import { Title } from '../components/Titles/Titles';
import MainContainer from '../components/Containers/MainContainer';
import AddTransactionForm from '../components/transactionComponents/AddTransactionForm';
import DeleteTransactionForm from '../components/transactionComponents/DeleteTransactionForm';
import TransactionCard from '../components/Cards/TransactionCard';
import { useState, useEffect } from 'react';

import { DateTime } from 'luxon';
import { useCategoriesGet } from '../queries/category';
import { useTransactionsGet } from '../queries/transaction';



//STYLES

//UTILS
import {
  useTransactionDelete,
} from "../queries/transaction";
import { queryClient } from "../constants/config";
import { useContext } from 'react';
import { WalletContext } from '../context/WalletProvider';


const Transactions = () => {

  const {walletCon, setWalletCon} = useContext(WalletContext);

  console.log('WALALLA', walletCon)

  //SEARCH FILTERS
  const [timeSpan, setTimeSpan] = useState(
    DateTime.now()
      .minus({
        days: 7,
      })
      .toISODate()
  );
  const [categories, setCategories] = useState();
  const [sortingField, setSortingField] = useState('dateSort');
  const [order, setOrder] = useState('asc');
  const { data: ctgs, isFetched: isCtgsFetched } = useCategoriesGet();
  const [skip, setSkip] = useState(0);
  const [reload, setReload] = useState(false)
  // useEffect(() => {
  //    if (ctgs) setCategories(ctgs.data[0].id);
  // }, [ctgs])

  const { data: FilteredTransactions, refetch: fetchTransactions } =
    useTransactionsGet({
      firstDate: timeSpan,
      category: categories ? categories : undefined,
      [sortingField]: order,
      skip: skip,
      take: 10,
      key: 'CategoriesTrs',
    });

  useEffect(() => {
    fetchTransactions()
    
  }, [reload])
  
  const [firstDate, setFirstDate] = useState(
    DateTime.now()
      .minus({
        days: 6,
      })
      .toISODate()
  );
  const [lastDate, setLastDate] = useState(
    DateTime.now()
      .toISODate()
  );
  const { mutate: deleteTr } = useTransactionDelete();
  const {
    data,
    refetch: fetchTransactionsDel,
    isLoading: transactionsLoading,
  } = useTransactionsGet({
    firstDate: firstDate,
    lastDate: lastDate,
    key: "Trs",
  });

  return (

    <div className={styles.flexContainer}>

      <div className={styles.mainContent}>
        <Title>Transactions</Title>
        {/* FILTERS */}
        <div className={styles.filters}>
          <div className={styles.filterContainer}>
            {/* TIME SPAN */}
            <div className={styles.filter}>
              <label htmlFor="timeSpan">Time Span :</label>
              <select
                name="timeSpan"
                onChange={(e) => {
                  setTimeSpan(e.target.value)
                }}
              >
                <option
                  value={DateTime.now()
                    .minus({
                      days: 7,
                    })
                    .toISODate()}
                >
                  Last 7 days
                </option>
                <option
                  value={DateTime.now()
                    .minus({
                      days: 28,
                    })
                    .toISODate()}
                >
                  Last 28 days
                </option>
                <option
                  value={DateTime.now()
                    .minus({
                      days: 90,
                    })
                    .toISODate()}
                >
                  Last 90 days
                </option>
                <option
                  value={DateTime.now()
                    .minus({
                      days: 365,
                    })
                    .toISODate()}
                >
                  Last 365 days
                </option>
              </select>
            </div>
          </div>
          {/* CATEGORIES */}
          <div className={styles.filterContainer}>
            <div className={styles.filter}>
              <label htmlFor="categories">Categories :</label>
              {isCtgsFetched ? (
                <select
                  name='categories'
                  onChange={(e) => {
                    setCategories(e.target.value);

                  }}>
                  <option value="">All</option>
                  {ctgs?.data?.map((category, index) => {
                    return (
                      <option key={index} value={category.id}>
                        {category.name}
                      </option>
                    )
                  })}
                </select>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>

          {/* SORTING FIELD */}
          <div className={styles.filterContainer}>
            <div className={styles.filter}>
              <label htmlFor="sortingField">Sorting Field :</label>
              <select
                name="sortingField"
                onChange={(e) => {
                  setSortingField(e.target.value);
                }}
              >
                <option value="date">Date</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          {/* ASC OR DESC ORDER */}
          <div className={styles.filterContainer}>
            <div className={styles.filter}>
              <label htmlFor="order">Order :</label>
              <select
                name="order"
                onChange={(e) => {
                  setOrder(e.target.value);
                }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
        {/* RESULTS */}
        <div className={styles.results}>
          <button className={styles.btn} onClick={() => fetchTransactions()}>
            Show Results
          </button>
          <div className={styles.inner}>
            {FilteredTransactions &&
              FilteredTransactions.data?.map((transaction, index) => {
                return (
                  <div className={styles.transactionsContainer}>
                    <TransactionCard
                      key={index}
                      categoryName={transaction.category.name}
                      money={transaction.money}
                      date={DateTime.fromISO(transaction.date).toISODate()}
                      description={transaction.info}
                      title={transaction.title}
                      transactionId={transaction.id}
                      reloadSetter={setReload}
                      reload={reload}
                    />

                  </div>
                );

              })}

          </div>
        </div>
      </div>

      <div className={styles.sideContent}>
        <AddTransactionForm
          reloadSetter={setReload}
          reload={reload} />
        <DeleteTransactionForm />
      </div>
    </div>
  )


  // <MainContainer>
  //   <Title>Transactions</Title>
  //   <AddTransactionForm/>
  //   <DeleteTransactionForm/>
  // </MainContainer>

}

export default Transactions