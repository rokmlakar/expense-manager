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

//TRANSACTIONCARDU PODAMO KATEGORIJO, DATUM, DENAR, OPIS in NASLOV
const TransactionCard = ({ categoryName, date, money, description, title, transactionId, reloadSetter, reload, viewer, home, walletColor }) => {
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

    const { mutate: editTr } = useTransactionEdit();

    const { data: categories, refetch: fetchCategories } = useCategoriesGet();

    const handleClick = () => {
        fetchTransaction()
        if (!trsCon) {
            setTrsCon(transactionId)
        } else setTrsCon();
        setEdited(true);
        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth'
        // })
    }

    categories && categories.data.map((cat) => {
        //   console.log('ctg',category)
        if (categoryName === cat.name && !currentCat) {
            setCurrentCat(cat)
        }
        //  console.log('KAT' , currentCat)
    })

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


    return (
        <div className={!home ? trsCon === transactionId ? styles.containerEdit : styles.container : styles.container}
            style={home && { background: walletColor }}>

            {/* <div style={{padding: '2rem', background:`${walletColor}`}}></div> */}
            <div className={styles.inner} style={home && { borderRadius: '20px', padding: '1.5rem' }}>
                {/* INFO */}
                <div className={styles.info}>
                    {/* <CategoryIcon category={category} /> */}
                    <div className={styles.categoryContainer}>
                        <span className={styles.title}>{title}</span>
                        <span className={styles.categoryName}>{categoryName}</span>
                        <span className={styles.date}>{date}</span>
                        <span>{description}</span>
                        {/* <div className={`${visible ? styles.descriptionActive : undefined} ${styles.description}`}
                        >
                            <p>{description}</p>
                        </div> */}
                    </div>
                </div>
                {/* MONEY */}
                <div className={styles.moneyContainer}>
                    <span>{`-$${money}`}</span>
                    <div
                        className={styles.iconContainer}
                        onClick={() => setVisible(!visible)}
                        style={description ? {} : { opacity: 0, pointerEvents: 'none' }}

                    >
                        {/* {visible ? <RiArrowUpSLine /> : <RiArrowDownSLine />} */}
                    </div>
                </div>
                {!viewer && !home &&
                    <>
                        <div
                            className={styles.iconContainerEdit}
                            style={
                                transactionsLoading
                                    ? {
                                        pointerEvents: "none",
                                        background: "#333",
                                    }
                                    : {}
                            }
                            onClick={handleClick}
                        ><BsPencilSquare /></div>
                        {!trsCon ?
                            <div
                                className={styles.iconContainerDelete}
                                style={
                                    transactionsLoading
                                        ? {
                                            pointerEvents: "none",
                                            background: "#333",
                                        }
                                        : {}
                                }
                                onClick={() => {
                                    deleteTr(transactionId, {
                                        onSuccess: async () => {
                                            await queryClient
                                                .invalidateQueries("Trs")
                                                .then(await reloadSetter(!reload))
                                                .catch();
                                        },
                                    });
                                }}
                            ><BsTrash /></div>
                            : <div className={styles.iconContainerDeleteDisabled}
                            ><BsTrash /></div>
                        }
                    </>
                }
            </div>
            {
                showEdit &&
                <div
                    className={styles.iconContainerAdd}>
                    <input
                        type="number"
                        placeholder='Add Funds'
                        onChange={(e) => setNewMoney(e.target.value)}
                        value={newName}
                    />
                    <BsPlusSquare onClick={handleClick} />
                    <input
                        type="number"
                        placeholder='Add Funds'
                        onChange={(e) => setNewMoney(e.target.value)}
                        value={newName}
                    />
                    <BsPlusSquare onClick={handleClick} />
                    <input
                        type="number"
                        placeholder='Add Funds'
                        onChange={(e) => setNewMoney(e.target.value)}
                        value={newName}
                    />
                    <BsPlusSquare onClick={handleClick} />
                </div>
            }
        </div>
    );
};

TransactionCard.defaultProps = {
    category: 'Products',
    date: '29 Feb 2020',
    description: 'Lorem Iipsum',
    money: '30.65'
};

export default TransactionCard