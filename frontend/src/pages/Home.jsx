import MainContainer from "../components/Containers/MainContainer";
import { Title } from "../components/Titles/Titles";
import WalletHomeCard from '../components/Cards/WalletHomeCard';
import TransactionCard from "../components/Cards/TransactionCard";
import CategoryCard from '../components/Cards/CategoryCard';
import HomeProfile from "../components/homeComponents/HomeProfile";


import { WalletContext } from '../context/WalletProvider';
import { SuperUserCon } from "../context/SuperUserProvider";
import { useContext } from 'react';
import { DateTime } from 'luxon';
import { useCategoriesSum } from "../queries/category";
import { useCategoriesGet } from '../queries/category';
import { useWalletsGet } from '../queries/wallet';
import { useEffect } from "react"
import { useHomeTransactionsGet } from "../queries/transaction";

import styles from '../styles/homeComponents/Home.module.scss';
import { useState } from "react";
import { useUser } from '../queries/user';

const Home = () => {

    const { walletCon, setWalletCon } = useContext(WalletContext);
    const { setSuperUsrCon } = useContext(SuperUserCon);

    const [ctgs, setCtgs] = useState();
    const [selectedView, setSelectedView] = useState('Transactions');


    const { data, isError } = useUser();

    useEffect(() => {

        if (data?.data.superAdmin) {
            setSuperUsrCon(true)
        }

    }, [data]);

    useEffect(() => {
        if (walletCon) {
            console.log('yoo')
            setWalletCon(0);
        }
    }, []);
    const { data: transactions, refetch: fetchTransactions } = useHomeTransactionsGet(
        {
            key: 'Trs_latest',  //key v tem primeru je string ID
            skip: 0,  //koliko transactionov skipa
            take: 5,  //koliko jih vzame oz. prikaze
        }
    );


    const { data: cat, refetch: fetchCategories } = useCategoriesGet();

    useEffect(() => {
        setCtgs(cat)
    }, [cat])

    const { data: wallets, refetch: fetchWallets } = useWalletsGet()

    useEffect(() => {
        fetchCategories()
    }, [])

    const { data: CategoriesSum, refetch: fetchCategoriesSum } = useCategoriesSum();

    //DOBI TRENUTNE TRANSAKCIJE, SPROZI SE OB LOADU IN POŠLJE FETCH
    useEffect(() => {
        fetchTransactions();
        fetchCategories();
        fetchCategoriesSum();
    }, [])

    return (
        <MainContainer optionClass={styles.container}>
            <div className={styles.main}>

                {/* Wallets */}
                <div className={styles.categories}>
                    <Title>Wallets</Title>
                    <div className={styles.content}>
                        {/* SUM */}
                        {wallets && wallets.data.map((wallet, index) => {
                            return (
                                <WalletHomeCard
                                    key={index}
                                    title={wallet.name}
                                    wallet={wallet.id}
                                    money={wallet.money}
                                    description={wallet.description}
                                    color={wallet.color}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* TRANSACTIONS */}
                <div className={styles.overview}>
                    <div className={styles.top}>
                        <Title>Latest Transactions</Title>
                        <div className={styles.filter}>
                            <label htmlFor="selectedView">Selected View</label>
                            <select
                                name="selectedView"
                                onChange={(e) => {
                                    setSelectedView(e.target.value)
                                }}
                            >
                                <option
                                    value='Transactions'
                                >
                                    View by Transactions
                                </option>
                                <option
                                    value='Categories'
                                >
                                    View by Categories
                                </option>
                                <option
                                    value='Wallets'
                                >
                                    View by Wallets
                                </option>
                            </select>
                        </div>
                    </div>


                    {
                        selectedView === 'Transactions' &&
                        <div className={styles.content}>
                            {/* LATEST TRANSACTIONS */}
                            {transactions && transactions.data.map((transaction, index) => {
                                return (
                                    <TransactionCard
                                        key={index}
                                        category={transaction.category.name}
                                        date={DateTime.fromISO(transaction.date).toISODate()}
                                        money={transaction.money.toFixed(2)}
                                        description={transaction.info}
                                        title={transaction.title}
                                        walletColor={transaction.wallet.color}
                                        home={true}
                                    />
                                );
                            })}
                        </div>
                    }

                    {selectedView === 'Categories' &&
                        ctgs && [...ctgs.data].map((cat, index) => (
                            <CategoryCard
                                key={index}
                                title={cat.name}
                                category={cat.id}
                                color={cat.color}
                                info={cat.info}
                                userId={cat.userId}
                            />

                        ))}





                </div>
            </div>
            <div className={styles.profile}>
                <HomeProfile />
            </div>
        </MainContainer>
    )
}

export default Home