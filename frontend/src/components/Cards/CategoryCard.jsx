import styles from '../../styles/Cards/CategoryCard.module.scss';
import { FiBox } from 'react-icons/fi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { BsHouseDoor } from 'react-icons/bs';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { HiOutlineFire } from 'react-icons/hi';
import { useEffect, useState } from 'react';

import { useCategoriesSum } from "../../queries/category";
import { useTransactionsGet } from '../../queries/transaction';


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
const CategoryCard = ({ title, category, color, info, userId }) => {
    //lahko še odpremo transaction card kjer se nam prikaže opis, po defaultu pa ni visible, na visible ga nastavimo z onclick
    const [visible, setVisible] = useState(false);
    const [catSum, setCatSum] = useState();
    let [transactionsCount, setTransactionsCount] = useState();
    // console.log(title, category, color, info, userId)

    const { data: CategoriesSum, refetch: fetchCategoriesSum } = useCategoriesSum();



    if (CategoriesSum) {
        CategoriesSum.data.map((cat) => {
            //   console.log(cat, '--', category)
            if (cat.transactionCategoryId === category && !catSum) {
                setCatSum(cat._sum.money)
            }
        })
    }

    const { data: transactions, refetch: fetchTransactions } =
        useTransactionsGet({
            key: 'CategoriesTrs',
        });

    // console.log(transactions)

    //DOBI ŠT TRANSAKCIJ V KATEGORIJI
    useEffect(() => {
        let count = 0;
        transactions.data.forEach(tran => {
            if (tran.category.name === title) {
                console.log(tran)
                count++
                // setTransactionsCount(transactionsCount++)
            }
            console.log(count)
        });

        setTransactionsCount(count)

    }, [transactions])



    // console.log(CategoriesSum)
    return (
        <div className={styles.container} >
            <div className={styles.inner} >
                {/* INFO */}
                <div className={styles.info}>
                    {/* <CategoryIcon category={category} /> */}
                    <div className={styles.categoryContainer} >
                        <span className={styles.title} style={{ background: color }}>{title}</span>
                        <span className={styles.category}>{catSum}$ </span>
                        <span className={styles.category}>{info}</span>
                        <span className={styles.category}>{transactionsCount}</span>
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