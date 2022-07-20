import styles from '../styles/walletComponents/Wallet.module.scss';
import { Title } from '../components/Titles/Titles';
import WalletCard from '../components/Cards/WalletCard';
import AddWalletForm from '../components/walletComponents/AddWalletForm';

import { DateTime } from 'luxon';
import { useState, useEffect } from 'react';
import { useCategoriesGet } from '../queries/category';
import { useTransactionsGet } from '../queries/transaction';
import { useWalletsGet } from '../queries/wallet';


const Wallet = () => {
  //SEARCH FILTERS
  const [timeSpan, setTimeSpan] = useState(
    DateTime.now()
      .minus({
        days: 7,
      })
      .toISODate()
  );
  const [categories, setCategories] = useState('');
  const [sortingField, setSortingField] = useState('dateSort');
  const [order, setOrder] = useState('asc');
  const [skip, setSkip] = useState(0);


  const { data: ctgs, isFetched: isCtgsFetched } = useCategoriesGet();

  const { data: wallets } = useWalletsGet();

   useEffect(() => {
     if (wallets) {
       console.log(wallets)
     }

   }, [wallets])

  useEffect(() => {
    if (ctgs) setCategories(ctgs.data[0].id);
    // console.log(ctgs);
  }, [ctgs])

  const { data: FilteredTransactions, refetch: fetchTransactions } =
    useTransactionsGet({
      firstDate: timeSpan,
      category: categories ? categories : undefined,
      [sortingField]: order,
      skip: skip,
      take: 10,
      key: 'CategoriesTrs',
    });


  return (
    <div className={styles.flexContainer}>

      <div className={styles.mainContent}>
        <Title>Wallets</Title>

        {wallets && wallets.data.map((wallet) => (
          <WalletCard name={wallet.name} money={wallet.money} />
        ))}
      </div>

      <div className={styles.sideContent}>
        <AddWalletForm />
      </div>
    </div>
  )
}

export default Wallet