import MainContainer from "../components/Containers/MainContainer";
import SearchBar from "../components/homeComponents/SearchBar";
import { Title } from "../components/Titles/Titles";
import CategorySumCard from "../components/Cards/CategorySumCard";
import TransactionCard from "../components/Cards/TransactionCard";
import HomeProfile from "../components/homeComponents/HomeProfile";


import { DateTime } from 'luxon';
import { useTransactionsGet } from "../queries/transaction";
import { useCategoriesSum } from "../queries/category";
import { useCategoriesGet } from '../queries/category';
import { useEffect } from "react";

import styles from '../styles/homeComponents/Home.module.scss';
import { useState } from "react";

const Home = () => {

    const [ctgs, setCtgs] = useState();

    //LATEST TRANSACTIONS
    //OBJEKT USETRANSACTIONS KI PREJME PARAMETRE KEY SKIP TAKE IN NASTAVI OBJEKT KI IMA DATA KJER SO VSI 
    //TRANSACTIONI IN REFETCH KI PONOVNO POŠLJE FETCH    
    const { data: transactions, refetch: fetchTransactions } = useTransactionsGet(
        {
            key: 'Trs_latest',  //key v tem primeru je string ID
            skip: 0,  //koliko transactionov skipa
            take: 5,  //koliko jih vzame oz. prikaze
        }
    );

    //ISTO KOT ZGORAJ
    // useTransactionsGet({key: 'Trs_latest', skip: 0, take: 5,}) = {
    //     data:transactions, 
    //     refetch: fetchTransactions
    // }

    const { data: cat, refetch: fetchCategories } = useCategoriesGet();
    
    useEffect(() => {
        setCtgs(cat)
    }, [])

    if (!ctgs) {

        // setctgs(cat)
    }
    // if (cat) {
    //     setctgs(cat)
    // }

    const { data: CategoriesSum, refetch: fetchCategoriesSum } = useCategoriesSum();
    // useCategoriesSum() = {
    //     data: CategoriesSum
    // } 

    //DOBI TRENUTNE TRANSAKCIJE, SPROZI SE OB LOADU IN POŠLJE FETCH
    useEffect(() => {
        fetchTransactions();
        fetchCategories();
        fetchCategoriesSum();
    }, [])
    console.log(ctgs)

    return (
        <MainContainer optionClass={styles.container}>
            <div className={styles.main}>
                {/* SEARCHBAR */}
                {/* <div className={styles.searchbar}>
                    <SearchBar />
                </div> */}


                {/* CATEGORIES */}
                <div className={styles.categories}>
                    <Title>Categories Last 30 Days</Title>
                    <div className={styles.content}>
                        {/* SUM */}
                        {CategoriesSum && ctgs && CategoriesSum.data.map((category, index) => {
                            return (
                                <CategorySumCard
                                    key={index}
                                    category={category.transactionCategoryId}
                                    money={category._sum.money.toFixed(2)}
                                    ctgs={ctgs.data}
                                    color={ctgs.color}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* TRANSACTIONS */}
                <div className={styles.transactions}>
                    <Title>Latest Transactions</Title>
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
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={styles.profile}>
                <HomeProfile />
            </div>
        </MainContainer>
    )
}

export default Home