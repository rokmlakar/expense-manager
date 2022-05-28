import MainContainer from "../components/Containers/MainContainer";
import SearchBar from "../components/homeComponents/SearchBar";
import { Title } from "../components/Titles/Titles";
import CategoryCard from "../components/Cards/CategoryCard";

import styles from '../styles/homeComponents/Home.module.scss';

const Home = () => {
    return (
        <MainContainer optionClass={styles.container}>
            <div className={styles.main}>
                {/* SEARCHBAR */}
                <div className={styles.searchbar}>
                    <SearchBar />
                </div>


                {/* CATEGORIES */}
                <div className={styles.categories}>
                    <Title>Categories Last 30 Days</Title>
                    <div className={styles.content}>
                        <CategoryCard/>
                        <CategoryCard/>
                        <CategoryCard/>
                        <CategoryCard/>
                    </div>
                </div>
            </div>
        </MainContainer>
    )
}

export default Home