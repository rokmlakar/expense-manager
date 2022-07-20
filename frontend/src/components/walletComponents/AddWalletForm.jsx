import styles from '../../styles/walletComponents/AddWalletForm.module.scss';
import { useEffect, useState } from 'react';
import { queryClient } from '../../constants/config';
import { Title } from '../Titles/Titles';

import { useWalletPost } from '../../queries/wallet';


const AddWalletForm = () => {
    const [title, setTitle] = useState('');
    const [money, setMoney] = useState('');
    const [info, setInfo] = useState('');

    const {
        mutate: postWallet,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useWalletPost();

    let body = {
        title: title,
        money: parseFloat(money),
        // info: info,
    };

    // const {
    //     data,
    //     refetch: fetchWallet,
    //     isLoading: walletLoading,
    // } = useWalletGet({
    //     key: "Wall",
    // });

    // console.log(data)


    return (
        <div className={styles.container}>
            <Title>Add a Wallet</Title>
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
                    type="text"
                    placeholder='info'
                    onChange={(e) => setInfo(e.target.value)}
                    value={info}
                />

                <button
                    onClick={() => {
                        postWallet(body, {
                            onSuccess: async () => {
                                await queryClient.invalidateQueries('Categories_Sum');
                            },
                        });
                    }}
                >
                    {isLoading ? 'Loading...' : 'Add Wallet'}
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
    )

}
export default AddWalletForm