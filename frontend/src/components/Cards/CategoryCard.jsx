import styles from '../../styles/Cards/CategoryCard.module.scss';
import { FiBox } from 'react-icons/fi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { BsHouseDoor } from 'react-icons/bs';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { HiOutlineFire } from 'react-icons/hi';
import { useEffect, useState } from 'react';

import { useCategoriesSum, useCategoryDelete } from "../../queries/category";
import { useTransactionsGet } from '../../queries/transaction';
import { queryClient } from "../../constants/config";

import { BsTrash } from "react-icons/bs";

//CATEGORY ICON PREJME KATEGORIJO TAKO DA GELEDE NA KATEGORIJO PODAMO IKONO KATEGORIJE IN USTREZNO BARVO
const CategoryIcon = ({ category }) => {
    const [style, setStyle] = useState({});
    const categoryStyle = () => {
        // switch (category) {
        //     default: {
        //         return {
        //             background: '#ffbece',
        //             icon: <HiOutlineFire />,
        //             color: "#ff6275",
        //         };
        //     }
        //     case "Products":
        //     case 1: {
        //         return {
        //             background: '#fdeacc',
        //             icon: <FiBox />,
        //             color: "#f8aa35",
        //         };
        //     }

        //     case "Entertainment":
        //     case 2:
        //         return {
        //             background: '#e4f1d5',
        //             icon: <IoGameControllerOutline />,
        //             color: "#92c44c",
        //         };

        //     case "Bills":
        //     case 3: {
        //         return {
        //             background: '#b7dffd',
        //             icon: <BsHouseDoor />,
        //             color: "#5a92d6",
        //         };
        //     }
        // }
    };

    useEffect(() => {
        setStyle(categoryStyle());
    }, [category]);

    return (<div className={styles.iconContainer}
        style={{ background: style.background, color: style.color }}
    >
        {style.icon}
    </div>
    );
};


//TRANSACTIONCARDU PODAMO KATEGORIJO, DATUM, DENAR, OPIS in NASLOV
const CategoryCard = ({ title, category, color, info: description, userId, reloadSetter, reload }) => {
    //lahko še odpremo transaction card kjer se nam prikaže opis, po defaultu pa ni visible, na visible ga nastavimo z onclick
    const [visible, setVisible] = useState(false);
    const [catSum, setCatSum] = useState();
    let [transactionsCount, setTransactionsCount] = useState();

    const { data: CategoriesSum, refetch: fetchCategoriesSum } = useCategoriesSum();

    const { mutate: deleteCat } = useCategoryDelete();


    const { data: transactions, refetch: fetchTransactions } =
        useTransactionsGet({
            key: 'CategoriesTrs',
        });

    // console.log(transactions)

    //DOBI ŠT TRANSAKCIJ V KATEGORIJI
    useEffect(() => {
        let count = 0;
        transactions && transactions.data.forEach(tran => {
            if (tran.category.name === title) {
                count++
                // setTransactionsCount(transactionsCount++)
            }
        });

        setTransactionsCount(count)

        if (CategoriesSum) {
            CategoriesSum.data.map((cat) => {
                //   console.log(cat, '--', category)
                if (cat.transactionCategoryId === category && !catSum) {
                    setCatSum(cat._sum.money)
                }
            })
        }

    }, [transactions, title, category, color, description, userId])

    const handleClick = () => {

        deleteCat(category, {
            // onSuccess: async () => {
            //  await reloadSetter(!reload)
            // },
        });
        reloadSetter(!reload)

        // postCategory(body, {
        //     onSuccess: async () => {
        //         await queryClient.invalidateQueries('Categories_Sum')
        //             .then(await reloadSetter(!reload))
        //             .catch;
        //     },
        // });
    }
    return (
        <div className={styles.container} style={{ background: color }}>
            <div className={styles.inner} >
                {/* INFO */}
                <div className={styles.info} >
                    {/* <CategoryIcon category={category} /> */}
                    <div className={styles.categoryContainer}  >
                        <div className={styles.column} style={{ justifyContent: 'center', borderRight: `2px solid ${color}` }}>
                            <span className={styles.categoryTitle} >{title}</span>
                        </div>
                        <div className={styles.column}>
                            <span className={styles.title} style={{ borderBottom: `1px solid ${color}`, padding: '2px', marginBottom: '1rem' }}>Money Spent</span>
                            <span className={styles.category}>${catSum} </span>
                        </div>
                        <div className={styles.column}>
                            <span className={styles.title} style={{ borderBottom: `1px solid ${color}`, padding: '2px', marginBottom: '1rem' }}>Transactions</span>
                            <span className={styles.category}>{transactionsCount}</span>
                        </div>
                        <div className={styles.column}>
                            <span className={styles.title} style={{ borderBottom: `1px solid ${color}`, padding: '2px', marginBottom: '1rem' }}>Description</span>
                            <span className={styles.description}>{description}</span>
                        </div>
                        <div
                            className={styles.iconContainerDelete}
                            // style={
                            //     transactionsLoading
                            //         ? {
                            //             pointerEvents: "none",
                            //             background: "#333",
                            //         }
                            //         : {}
                            // }
                            onClick={handleClick}
                        ><BsTrash /></div>
                        {/*
                        <span className={styles.date}>{date}</span>
                        <div className={`${visible ? styles.descriptionActive : undefined} ${styles.description}`}
                        >
                            <p>desc</p>
                        </div>*/}
                    </div>
                </div>
                {/* MONEY */}
                {/* <div className={styles.moneyContainer}>
                    <span>{`-$${money}`}</span>
                    <div
                        className={styles.iconContainer}
                        onClick={() => setVisible(!visible)}
                        style={description ? {} : { opacity: 0, pointerEvents: 'none' }}

                    >
                        {visible ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                    </div>
                </div> */}
            </div>
        </div>
    );
};

CategoryCard.defaultProps = {
    category: 'Products',
    date: '29 Feb 2020',
    description: 'Lorem Iipsum',
    money: '30.65'
};

export default CategoryCard