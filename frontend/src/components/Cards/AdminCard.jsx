import styles from '../../styles/Cards/AdminCard.module.scss';
import { FiBox } from 'react-icons/fi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { BsHouseDoor } from 'react-icons/bs';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { HiOutlineFire } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import TransactionCard from "./TransactionCard";
import { DateTime } from 'luxon';

import { useCategoriesSum, useCategoryDelete } from "../../queries/category";
import { useTransactionsGet } from '../../queries/transaction';
import { queryClient } from "../../constants/config";

import { BsTrash } from "react-icons/bs";

//CATEGORY ICON PREJME KATEGORIJO TAKO DA GELEDE NA KATEGORIJO PODAMO IKONO KATEGORIJE IN USTREZNO BARVO


//TRANSACTIONCARDU PODAMO KATEGORIJO, DATUM, DENAR, OPIS in NASLOV
const AdminCard = ({ name, money, walletTransactions }) => {
    //lahko še odpremo transaction card kjer se nam prikaže opis, po defaultu pa ni visible, na visible ga nastavimo z onclick
    const [visible, setVisible] = useState(false);
    const [catSum, setCatSum] = useState();
    let [transactionsCount, setTransactionsCount] = useState();

    const { data: CategoriesSum, refetch: fetchCategoriesSum } = useCategoriesSum();

    const { mutate: deleteCat } = useCategoryDelete();

    walletTransactions &&
        console.log('WALALAL', walletTransactions)




    // console.log(CategoriesSum)
    return (
        <div className={styles.container} >
            <div className={styles.inner} >
                {/* INFO */}
                <div className={styles.info} >
                    {/* <CategoryIcon category={category} /> */}
                    <div className={styles.categoryContainer}  >
                        <div className={styles.column} style={{ justifyContent: 'center' }}>

                            <span className={styles.categoryTitle} >{name}</span>
                        </div>
                        <div className={styles.column}>
                            <span className={styles.title} style={{ padding: '2px', marginBottom: '1rem' }}>Money Spent</span>
                            <span className={styles.category}>${money} </span>
                        </div>
                    </div>
                    {walletTransactions && walletTransactions.data.map((transaction, index) => {
                        return (
                            <TransactionCard
                                key={index}
                                date={DateTime.fromISO(transaction.date).toISODate()}
                                money={transaction.money.toFixed(2)}
                                description={transaction.info}
                                title={transaction.title}
                                home={true}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


export default AdminCard