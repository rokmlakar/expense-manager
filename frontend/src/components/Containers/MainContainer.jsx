import styles from '../../styles/Containers/MainContainer.module.scss';

//prejme children in wrappa content za lepsi izgled
const MainContainer = ({children, optionClass}) => {
  return <div
    className={`${styles.container} ${optionClass}`}
    >{children}</div>
};

MainContainer.defaultProps = {
    optionClass: undefined,
};

export default MainContainer