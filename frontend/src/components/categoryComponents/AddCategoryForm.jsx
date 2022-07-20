import styles from '../../styles/CategoriesComponents/AddCategoryForm.module.scss';

import { Title } from '../Titles/Titles';

import { useEffect, useState } from 'react';
import { useCategoriesGet } from '../../queries/category'
import { useCategoryPost } from '../../queries/category';
import { DateTime } from 'luxon';
import { queryClient } from '../../constants/config';

const AddTransactionForm = () => {
    //VREDNOSTI ZA NOVO DODANO TRANSAKCIJO
    const [title, setTitle] = useState('');
    const [money, setMoney] = useState('');
    const [date, setDate] = useState(DateTime.now().toISODate());
    const [info, setInfo] = useState('');
    const [category, setCategory] = useState(10);

    //DOBIMO VSE KATEGORIJE KI SO NA VOLJO DA LAHKO TRANSAKCIJI PODAMO KATEGORIJO
    const { data: ctgs } = useCategoriesGet();
     useEffect(() => {
         if (ctgs) setCategory(ctgs.data[1].id);
         else setCategory(1);
     }, [ctgs]);

    //POST TRANSACTION, KLIČE SE USETRANSACTIONPOST FUNKCIJA
    const {
        mutate: postCategory,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useCategoryPost();

    //V BODY ZAPIŠEMO VSE PODATKE KI JIH MORAMO POSLATI NA BAZO DA LAHKO USTVARIMO NOVO KATEGORIJO
    let body = {
        title: title,
    };

    return (

        <div className={styles.container}>
            <Title>Add a Category</Title>
            <div className={styles.inner}>
                <input
                    type="text"
                    placeholder='title'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
               
                <input
                    type="text"
                    placeholder='info'
                    onChange={(e) => setInfo(e.target.value)}
                    value={info}
                />

                <button
                    onClick={() => {
                        postCategory(body, {
                            onSuccess: async () => {
                                await queryClient.invalidateQueries('Categories_Sum');
                            },
                        });
                    }}
                >
                    {isLoading ? 'Loading...' : 'Add Category'}
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