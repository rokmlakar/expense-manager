import styles from '../../styles/transactionComponents/AddTransactionForm.module.scss';

import { Title } from '../Titles/Titles';

import { useEffect, useState, useContext } from 'react';
import { useCategoriesGet } from '../../queries/category'
import { useTransactionPost, useTransactionsGet, useEditTrGet, useTransactionEdit } from '../../queries/transaction';
import { DateTime } from 'luxon';
import { queryClient } from '../../constants/config';
import { useWalletsGet } from '../../queries/wallet';
import { WalletContext } from '../../context/WalletProvider';
import { EditTrsContext } from '../../context/EditTransactionProvider';

const AddTransactionForm = ({ reloadSetter, reload }) => {
    //VREDNOSTI ZA NOVO DODANO TRANSAKCIJO
    const [title, setTitle] = useState('');
    const [money, setMoney] = useState('');
    const [date, setDate] = useState(DateTime.now().toISODate());
    const [info, setInfo] = useState('');
    const [category, setCategory] = useState(10);
    const [wallet, setWallet] = useState();
    const [editMode, setEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState();
    const [editMoney, setEditMoney] = useState();
    const [editInfo, setEditInfo] = useState();

    // console.log(date)

    const { walletCon, setWalletCon } = useContext(WalletContext);
    const { trsCon, setTrsCon } = useContext(EditTrsContext);


    //DOBIMO VSE KATEGORIJE KI SO NA VOLJO DA LAHKO TRANSAKCIJI PODAMO KATEGORIJO

    const { data: ctgs, refetch: fetchCategories } = useCategoriesGet();
    useEffect(() => {
        fetchCategories()
        if (ctgs) setCategory(ctgs.data[0].id);
        else setCategory(1);
        if (wallets) setWallet(wallets.data[0].id)
    }, []);




    const { data: transaction, refetch: fetchTransaction } =
        useEditTrGet({
            transactionId: trsCon
        });

    const { data: transactions, refetch: fetchTransactions } =
        useTransactionsGet({ take: 10, key: 'CategoriesTrs', });


    const { mutate: editTrs } = useTransactionEdit();

    const { data: wallets } = useWalletsGet();
    // console.log(wallets)
    // console.log(wallet)
    useEffect(() => {

        setWallet(walletCon)

    }, [walletCon, wallets])


    //EDIT TRANSS
    useEffect(() => {
        console.log('efff', trsCon)
        fetchTransactions()
        setEditMode(true);
        setTitle();
        setMoney();
        setInfo();
    }, [trsCon])

    useEffect(() => {
        transactions && transactions.data.map((tr) => {
            if (tr.id === trsCon) {
                // setEditedTr(tr);
                setEditTitle(tr.title)
                setEditMoney(tr.money)
                setEditInfo(tr.info)
            }
        })
    }, [transactions])


    //POST TRANSACTION, KLIČE SE USETRANSACTIONPOST FUNKCIJA
    const {
        mutate: postTransaction,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useTransactionPost();

    //V BODY ZAPIŠEMO VSE PODATKE KI JIH MORAMO POSLATI NA BAZO DA LAHKO USTVARIMO NOVO TRANSAKCIJO
    let body = {
        title: title,
        money: parseFloat(money),
        date: date,
        info: info,
        transactionCategoryId: parseInt(category),
        walletId: parseInt(wallet)
    };

    let bodyEdit = {
        transactionId: trsCon,
        title: editTitle,
        money: editMoney,
        info: editInfo,
    }

    const handleTransaction = () => {
        console.log('clik')
        fetchTransaction()
        console.log(transaction)

    }

    const handleTitle = () => {
        console.log('ss')
        setEditTitle();
    }
    const handleMoney = () => {
        setEditMoney();
    }
    const handleInfo = () => {
        setEditInfo();
    }

    const cancelEdit = () => {
        setEditTitle();
        setEditMoney();
        setEditInfo();
        setEditMode(false);
        setTrsCon();
    }

    const handleEdit = () => {
        console.log(bodyEdit)
        editTrs(bodyEdit, {
            onSuccess: async () => {
                await queryClient
                    .invalidateQueries("Trs")
                    .then(await reloadSetter(!reload))
                    .catch();
            },
        });
        setTrsCon()
        setEditTitle();
        setEditMoney();
        setEditInfo();
    }

    const handleAdd = () => {
        postTransaction(body, {
            onSuccess: async () => {
                await queryClient.invalidateQueries('Categories_Sum')
                    .then(await reloadSetter(!reload))
                    .catch;
            },
        });
        setTitle();
        setMoney();
        setInfo();
    }

    // useEffect(() => {
    //     window.scrollTo(0, 0)
    //   }, [])

    return (

        <div className={!trsCon ? styles.container : styles.editContainer} onClick={() => fetchTransaction}>
            <Title onClick={() => fetchTransactions()}>{!trsCon ? 'Add a Transaction' : 'Edit Transaction'}</Title>
            <div className={styles.inner}>
                <input
                    type="text"
                    placeholder='title'
                    onChange={(e) => !trsCon ? setTitle(e.target.value) : setEditTitle(e.target.value)}
                    onFocus={handleTitle}
                    value={trsCon ? editTitle ? editTitle : '' : title ? title : ''}
                />
                <input
                    type="number"
                    placeholder='money'
                    onChange={(e) => !trsCon ? setMoney(e.target.value) : setEditMoney(e.target.value)}
                    onFocus={handleMoney}
                    value={trsCon ? editMoney ? editMoney : '' : money ? money : ''}
                />
                <input
                    type="date"
                    placeholder='date'
                    onChange={(e) => setDate(e.target.value)}
                    onFocus={handleInfo}
                    value={
                        // editedTr ? editedTr.date : 
                        date}
                />
                <input
                    type="text"
                    placeholder='info'
                    onChange={(e) => !trsCon ? setInfo(e.target.value) : setEditInfo(e.target.value)}
                    onFocus={handleInfo}
                    value={trsCon ? editInfo ? editInfo : '' : info ? info : ''}
                />

                {/* CATEGORIES */}
                {ctgs ? (
                    <select onChange={(e) => setCategory(e.target.value)}>
                        {ctgs.data.map((ctg) => {
                            return (
                                <option key={ctg.id} value={ctg.id}>
                                    {ctg.name}
                                </option>
                            );
                        })}
                    </select>
                ) : (
                    <div>loading...</div>
                )}

                {/* WALLET */}
                {wallets ? (
                    <select onChange={(e) => setWallet()}>
                        {wallets.data.map((wal) => {
                            return (
                                <option key={wal.id} value={wal.id}>
                                    {wal.name}
                                </option>
                            );
                        })}
                    </select>
                ) : (
                    <div>loading...</div>
                )}

                {/* POST/EDIT TRANSACTION */}
                {!trsCon ?
                    <button
                        onClick={handleAdd}
                    >
                        {isLoading ? 'Loading...' : 'Add Transaction'}
                    </button>
                    :
                    <div className={styles.editBtns}>
                        < button style={{ background: '#e3e3e3' }}
                            onClick={handleEdit}
                        >
                            {isLoading ? 'Loading...' : 'Edit Transaction'}
                        </button>
                        < button style={{ background: '#e3e3e3' }}
                            onClick={cancelEdit}
                        >
                            Cancel
                        </button>
                    </div>
                }

                {/* ERROR */}
                <div style={{ marginBottom: '1rem' }}>
                    {isError &&
                        error.response.data.map((err, index) => {
                            return (
                                <div style={{ color: 'red' }} key={index}>
                                    {`${err.instancePath
                                        } : ${err.message ? err.message : ""} `}</div>
                            );
                        })}
                    {isSuccess && <div style={{ color: 'green' }}>Success</div>}
                </div>
            </div>
        </div >
    );
}

export default AddTransactionForm