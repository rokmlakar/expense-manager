import MainContainer from "../components/Containers/MainContainer";
import SearchBar from "../components/homeComponents/SearchBar";
import { Title } from "../components/Titles/Titles";
import CategorySumCard from "../components/Cards/CategorySumCard";
import WalletHomeCard from '../components/Cards/WalletHomeCard';
import TransactionCard from "../components/Cards/TransactionCard";
import CategoryCard from '../components/Cards/CategoryCard';
import HomeProfile from "../components/homeComponents/HomeProfile";
import UserCard from '../components/Cards/UserCard';


import { WalletContext } from '../context/WalletProvider';
import { useContext } from 'react';
import { DateTime } from 'luxon';
import { useTransactionsGet } from "../queries/transaction";
import { useCategoriesSum } from "../queries/category";
import { useCategoriesGet } from '../queries/category';
import { useWalletsGet } from '../queries/wallet';
import { useUsers } from "../queries/user";
import { useEffect } from "react";

import styles from '../styles/homeComponents/Home.module.scss';
import { useState } from "react";

const AdminHome = () => {
    
    const {walletCon, setWalletCon} = useContext(WalletContext);
    const [ctgs, setCtgs] = useState();
    const [showTrns, setShowTrns] = useState(true);
    const [showCtgs, setShowCtgs] = useState(false);
    const [showWall, setShowWall] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [selectedView, setSelectedView] = useState('Transactions');


    //LATEST TRANSACTIONS
    //OBJEKT USETRANSACTIONS KI PREJME PARAMETRE KEY SKIP TAKE IN NASTAVI OBJEKT KI IMA DATA KJER SO VSI 
    //TRANSACTIONI IN REFETCH KI PONOVNO POŠLJE FETCH    
    // const { data: transactions, refetch: fetchTransactions } = useTransactionsGet(
    //     {
    //         key: 'Trs_latest',  //key v tem primeru je string ID
    //         skip: 0,  //koliko transactionov skipa
    //         take: 5,  //koliko jih vzame oz. prikaze
    //     }
    // );

    const { data, refetch: fetchUsrs } = useUsers();
   
    //DOBI TRENUTNE TRANSAKCIJE, SPROZI SE OB LOADU IN POŠLJE FETCH
    useEffect(() => {
        fetchUsrs()
    }, [])

    return (
        <MainContainer optionClass={styles.container}>
            <div className={styles.main}>
                {/* SEARCHBAR */}
                {/* <div className={styles.searchbar}>
                    <SearchBar />
                </div> */}


                {/* CATEGORIES */}
               
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

                    {data?.data.map((usr, index) => {
                        return(
                            <UserCard
                            userName={usr.userName}
                            email={usr.email}
                            wallets={usr.Wallet}
                            />
                        )
                    })}




                    {
                        selectedView === 'Transactions' &&
                        <div className={styles.content}>

                            

                            {/* LATEST TRANSACTIONS */}
                            {/* {transactions && transactions.data.map((transaction, index) => {
                                return (
                                    <TransactionCard
                                        key={index}
                                        category={transaction.category.name}
                                        date={DateTime.fromISO(transaction.date).toISODate()}
                                        money={transaction.money.toFixed(2)}
                                        description={transaction.info}
                                        title={transaction.title}
                                        home={true}
                                    />
                                );
                            })} */}
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

export default AdminHome