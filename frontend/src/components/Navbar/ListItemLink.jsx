import { NavLink } from 'react-router-dom';
import styles from '../../style/navbarComponents/ListItemLink.module.scss';

const ListItemlink = ({ url, children, clickHandler, optionClass }) => {
    return (
        <li className={`${styles.listIem} ${optionClass}`} onClick={clickHandler}>
            <NavLink to={`/${url}`}
                className={({ isActive }) => (isActive ? styles.active : undefined)}
                >
                    {children}
                </NavLink>
        </li>
    );
}

ListItemlink.defaultProps = {
    url: "",
    optionClass: undefined,
}

export default ListItemlink