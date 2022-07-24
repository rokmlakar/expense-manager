import styles from '../styles/CategoriesComponents/Categories.module.scss';
import { Title } from '../components/Titles/Titles';
import CategoryCard from '../components/Cards/CategoryCard';
import AddCategoryForm from '../components/categoryComponents/AddCategoryForm';

import { DateTime } from 'luxon';
import { useState, useEffect } from 'react';
import { useCategoriesGet } from '../queries/category';
import { useTransactionsGet } from '../queries/transaction';
import MainContainer from '../components/Containers/MainContainer';


const Categories = () => {

    //SEARCH FILTERS
    const [timeSpan, setTimeSpan] = useState(
        DateTime.now()
            .minus({
                days: 7,
            })
            .toISODate()
    );
    const [categories, setCategories] = useState('');
    const [sortingField, setSortingField] = useState('dateSort');
    const [order, setOrder] = useState('asc');
    const [skip, setSkip] = useState(0);
    const [reload, setReload] = useState(false)

    const { data: ctgs, refetch:fetchCategories, isFetched: isCtgsFetched } = useCategoriesGet();



    // useEffect(() => {
    //     if (ctgs) setCategories(ctgs.data);
    //      console.log(ctgs);
    // }, [ctgs])

    const { data: FilteredTransactions, refetch: fetchTransactions } =
        useTransactionsGet({
            firstDate: timeSpan,
            category: categories ? categories : undefined,
            [sortingField]: order,
            skip: skip,
            take: 10,
            key: 'CategoriesTrs',
        });

    useEffect(() => {
        fetchCategories()
    }, [reload])


    console.log(ctgs)
    return (
        <div className={styles.flexContainer}>

            <div className={styles.mainContent}>
                <Title>Categories</Title>
                <div className={styles.inner}>

                    {/* FILTERS */}
                    LIST OF CATEGORIES
                    {ctgs && [...ctgs.data].reverse().map((cat, index) => (
                        <CategoryCard
                            key={index}
                            title={cat.name}
                            category={cat.id}
                            color={cat.color}
                            info={cat.info}
                            userId={cat.userId}
                        />

                    ))}
                </div>

            </div>

            <div className={styles.sideContent}>
                <AddCategoryForm
                    reloadSetter={setReload}
                    reload={reload}
                />
            </div>
        </div>
    )
}

export default Categories