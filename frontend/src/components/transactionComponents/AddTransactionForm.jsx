import styles from '../../styles/transactionComponents/AddTransactionForm.module.scss';

import { Title } from '../Titles/Titles';

import { useEffect, useState } from 'react';
import { useCategoriesGet } from '../../queries/category'
import { useTransactionPost } from '../../queries/transaction';
import { DateTime } from 'luxon';
import { queryClient } from '../../constants/config';
import { useWalletsGet } from '../../queries/wallet';

const AddTransactionForm = () => {
    //VREDNOSTI ZA NOVO DODANO TRANSAKCIJO
    const [title, setTitle] = useState('');
    const [money, setMoney] = useState('');
    const [date, setDate] = useState(DateTime.now().toISODate());
    const [info, setInfo] = useState('');
    const [category, setCategory] = useState(10);

    //DOBIMO VSE KATEGORIJE KI SO NA VOLJO DA LAHKO TRANSAKCIJI PODAMO KATEGORIJO
    
    const { data: ctgs, refetch: fetchCategories } = useCategoriesGet();
     useEffect(() => {
        fetchCategories()
         if (ctgs) setCategory(ctgs.data[1].id);
         else setCategory(1);
     }, []);

     const { data: wallets } = useWalletsGet();

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
    };

    return (

        <div className={styles.container}>
            <Title>Add a Transaction</Title>
            <div className={styles.inner}>
                <input
                    type="text"
                    placeholder='title'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <input
                    type="number"
                    placeholder='money'
                    onChange={(e) => setMoney(e.target.value)}
                    value={money}
                />
                <input
                    type="date"
                    placeholder='date'
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                />
                <input
                    type="text"
                    placeholder='info'
                    onChange={(e) => setInfo(e.target.value)}
                    value={info}
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
                    <select onChange={(e) => setCategory(e.target.value)}>
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
                {/* POST TRANSACTION */}
                <button
                    onClick={() => {
                        postTransaction(body, {
                            onSuccess: async () => {
                                await queryClient.invalidateQueries('Categories_Sum');
                            },
                        });
                    }}
                >
                    {isLoading ? 'Loading...' : 'Add Transaction'}
                </button>

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