import styles from '../../styles/Cards/TransactionCard.module.scss';
import { FiBox } from 'react-icons/fi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { BsHouseDoor } from 'react-icons/bs';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { HiOutlineFire } from 'react-icons/hi';
import { useEffect, useState, useContext } from 'react';
import { useCategoriesGet } from '../../queries/category';
import { useTransactionsGet, useTransactionDelete, useTransactionEdit, useEditTrGet } from '../../queries/transaction';
import { DateTime } from 'luxon';

//STYLES
import { BsTrash, BsPencilSquare, BsPlusSquare } from "react-icons/bs";
//UTILS
import { queryClient } from "../../constants/config";
import { WalletContext } from '../../context/WalletProvider';
import { EditTrsContext } from '../../context/EditTransactionProvider';
import WalletHomeCard from '../../components/Cards/WalletHomeCard';
import AdminCard from './AdminCard';

//TRANSACTIONCARDU PODAMO KATEGORIJO, DATUM, DENAR, OPIS in NASLOV
const UserCard = ({ userName, email, wallets }) => {
    //lahko še odpremo transaction card kjer se nam prikaže opis, po defaultu pa ni visible, na visible ga nastavimo z onclick
    const [visible, setVisible] = useState(false);
    const [currentCat, setCurrentCat] = useState();
    const [newName, setNewName] = useState();
    const [newDescription, setNewDescription] = useState();
    const [newMoney, setNewMoney] = useState();
    const [showEdit, setShowEdit] = useState(false);
    const [edited, setEdited] = useState(false);
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

    const { trsCon, setTrsCon } = useContext(EditTrsContext);



    const { data: transaction, refetch: fetchTransaction } =
        useEditTrGet({
            transactionId: trsCon,
            take: 10,
        });

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

    const { data: FilteredTransactions, refetch: fetchTransactionss } =
        useTransactionsGet({
            take: 10,
            key: 'CategoriesTrs',
        });


    console.log(wallets)
    wallets&& wallets.map(element => {
        console.log('hee', element.transactions)
    });


    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                {/* INFO */}
                <div className={styles.info}>
                    {/* <CategoryIcon category={category} /> */}
                    <div className={styles.categoryContainer}>
                        <span className={styles.title}>{userName}</span>
                        <span className={styles.categoryName}>{email}</span>
                        {/* {visible && */}
                            {wallets && wallets.map((wallet, index) => {
                                return (
                                    <AdminCard
                                        key={index}
                                        name={wallet.name}
                                        money={wallet.money}
                                        transactions={wallet.transactions}
                                        admin={true}
                                    />
                                );
                            })}
                        {/* } */}
                    </div>
                </div>
                {/* MONEY */}
                <div className={styles.moneyContainer}>
                    <div
                        className={styles.iconContainer}
                        onClick={() => setVisible(!visible)}

                    >
                        {visible ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                    </div>
                </div>

            </div>
        </div>
    );
};


export default UserCard