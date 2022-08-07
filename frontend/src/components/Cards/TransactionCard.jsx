import styles from '../../styles/Cards/TransactionCard.module.scss';
import { FiBox } from 'react-icons/fi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { BsHouseDoor } from 'react-icons/bs';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { HiOutlineFire } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useCategoriesGet } from '../../queries/category';
import { useTransactionsGet, useTransactionDelete } from '../../queries/transaction';
import { DateTime } from 'luxon';
//STYLES
import { BsTrash } from "react-icons/bs";
//UTILS
import { queryClient } from "../../constants/config";


//CATEGORY ICON PREJME KATEGORIJO TAKO DA GELEDE NA KATEGORIJO PODAMO IKONO KATEGORIJE IN USTREZNO BARVO
// const CategoryIcon = ({ category }) => {
//     const [style, setStyle] = useState({});
//     const categoryStyle = () => {
//         switch (category) {
//             default: {
//                 return {
//                     background: '#ffbece',
//                     icon: <HiOutlineFire />,
//                     color: "#ff6275",
//                 };
//             }
//             case "Products":
//             case 1: {
//                 return {
//                     background: '#fdeacc',
//                     icon: <FiBox />,
//                     color: "#f8aa35",
//                 };
//             }

//             case "Entertainment":
//             case 2:
//                 return {
//                     background: '#e4f1d5',
//                     icon: <IoGameControllerOutline />,
//                     color: "#92c44c",
//                 };

//             case "Bills":
//             case 3: {
//                 return {
//                     background: '#b7dffd',
//                     icon: <BsHouseDoor />,
//                     color: "#5a92d6",
//                 };
//             }
//         }
//     };



//     useEffect(() => {
//         setStyle(categoryStyle());
//     }, [category]);

//     return (<div className={styles.iconContainer}
//         style={{ background: style.background, color: style.color }}
//     >
//         {style.icon}
//     </div>
//     );
// };

// CategoryIcon.defaultProps = {
//     category: 'Products',
// }

//TRANSACTIONCARDU PODAMO KATEGORIJO, DATUM, DENAR, OPIS in NASLOV
const TransactionCard = ({ categoryName, date, money, description, title, transactionId, reloadSetter, reload }) => {
    //lahko še odpremo transaction card kjer se nam prikaže opis, po defaultu pa ni visible, na visible ga nastavimo z onclick
    const [visible, setVisible] = useState(false);
    const [currentCat, setCurrentCat] = useState()
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

    // setterChange('neki')

    const { data: categories, refetch: fetchCategories } = useCategoriesGet();

    categories && categories.data.map((cat) => {
        //   console.log('ctg',category)
        if (categoryName === cat.name && !currentCat) {
            setCurrentCat(cat)
        }
        //  console.log('KAT' , currentCat)
    })

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




    return (
        <div className={styles.container}>
            <div className={styles.inner}>
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
                        {visible ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                    </div>
                </div>
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
            </div>
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