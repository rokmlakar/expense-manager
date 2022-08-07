import styles from '../../styles/walletComponents/AddWalletForm.module.scss';
import { useEffect, useState } from 'react';
import { queryClient } from '../../constants/config';
import { Title } from '../Titles/Titles';
import { CirclePicker } from 'react-color';
import { useWalletPost } from '../../queries/wallet';


const AddWalletForm = ({reloadSetter, reload}) => {
    const [title, setTitle] = useState('');
    const [money, setMoney] = useState('');
    const [info, setInfo] = useState('');
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState('#5a92d6');

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
        description: info,
        color: color.background,
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

    const vis = () => {
        setVisible(!visible);
    }

    const handleChange = (color) => {
        setVisible(!visible)
        setColor({ background: color.hex })
    }

    const handleClick = () => {

        postWallet(body, {
            onSuccess: async () => {
                await reloadSetter(!reload)
            },
        });

        // postCategory(body, {
        //     onSuccess: async () => {
        //         await queryClient.invalidateQueries('Categories_Sum')
        //             .then(await reloadSetter(!reload))
        //             .catch;
        //     },
        // });
        // fetchTransactions()
    }

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

                <button className={styles.color} onClick={vis} style={{ background: color.background }}>
                    Pick a Wallet Color
                </button>

                {visible &&
                    <CirclePicker
                        color={color.background}
                        onChangeComplete={handleChange}
                    />
                }

                <button
                    onClick={handleClick}
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