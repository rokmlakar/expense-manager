import styles from '../styles/walletComponents/Wallet.module.scss';
import { Title } from '../components/Titles/Titles';
import WalletCard from '../components/Cards/WalletCard';
import WalletViewerCard from '../components/Cards/WalletViewerCard';
import AddWalletForm from '../components/walletComponents/AddWalletForm';

import { DateTime } from 'luxon';
import { useState, useEffect, useContext } from 'react';
import { useCategoriesGet } from '../queries/category';
import { useTransactionsGet, useEditTrGet } from '../queries/transaction';
import { useWalletsGet, useWalletViewerGet } from '../queries/wallet';
import { EditTrsContext } from '../context/EditTransactionProvider';


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
  const [reload, setReload] = useState(false);
  const [showSharedWallets, setShowSharedWallets] = useState(false);
  const { trsCon, setTrsCon } = useContext(EditTrsContext);

  const { data: transaction, refetch: fetchTran } =
  useEditTrGet({
      transactionId: trsCon,
      key: 'TrsEdit',
  });

  const { data: ctgs, isFetched: isCtgsFetched } = useCategoriesGet();

  const { data: wallets, refetch: fetchWallets } = useWalletsGet();

  const { data: walletViewers, refetch: fetchWalletViews } = useWalletViewerGet();


  useEffect(() => {
    if (wallets) {
    }
    fetchWallets()
  }, [reload])

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

  const switchView = () => {
    setShowSharedWallets(!showSharedWallets)
  };

  // walletViewers && walletViewers.map((wall) => {
  //   console.log(wall)
  // })



  return (
    <div className={styles.flexContainer}>

      <div className={styles.mainContent}>
        <Title>Wallets</Title>

        {
          walletViewers &&
          <div className={styles.btns} >
            <button onClick={fetchWallets}>FETCH</button>
            <button onClick={switchView}>{!showSharedWallets ? 'Show Shared Wallets' : 'Show My Wallets'}</button>
          </div>
        }

        {!showSharedWallets ?

          wallets && wallets.data.map((wallet) => (
            <WalletCard title={wallet.name}
              wallet={wallet.id} money={wallet.money}
              color={wallet.color}
              reloadSetter={setReload}
              reload={reload}
              ftch={fetchWallets}
              walletId={wallet.id}
            />
          ))
          :
          walletViewers.data && walletViewers.data.map((wallet) => (
            <WalletViewerCard title={wallet[0].name}
              wallet={wallet.id} money={wallet[0].money}
              color={wallet[0].color}
              description={wallet[0].description}
              username={wallet[0].username}
              transactions={wallet[0].transactions}
              reloadSetter={setReload}
              reload={reload}
              ftch={fetchWallets}
              walletId={wallet[0].id}
            />
          ))
        }
      </div>
      <div className={styles.sideContent}>
        <AddWalletForm
          reloadSetter={setReload}
          reload={reload}

        />
      </div>
    </div>
  )
}

export default Wallet