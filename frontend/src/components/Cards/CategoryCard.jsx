//STYLES
import styles from "../../styles/Cards/CategoryCard.module.scss";
import { FiBox } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { BsHouseDoor } from "react-icons/bs";
import { HiOutlineFire } from "react-icons/hi";

//UTILS
import { useEffect, useState } from "react";


//CATEGORYCARDU PODAMO IZBRANO KATEGORIJO IN PA DENAR
const CategoryCard = ({ category, money }) => {
  //NASTAVIMO STIL(VSAKA KATEGORIJA IMA SVOJO BARVO)
  const [style, setStyle] = useState({});

  //SWITCH Z VSEMI KATEGORIJAMI
  const categoryStyle = () => {
    switch (category) {
      default: {
        return {
          ctg: "Other",
          icon: <HiOutlineFire style={{ color: "#333" }} />,
          background: "#30D5c8",
        };
      }
      case "Products":
      case 1: {
        return {
          ctg: "Products",
          icon: <FiBox style={{ color: "#fdeacc" }} />,
          background: "#f8aa35",
        };
      }

      case "Entertainment":
      case 2:
        return {
          ctg: "Entertainment",
          icon: <IoGameControllerOutline style={{ color: "#e4f1d5" }} />,
          background: "#92c44c",
        };

      case "Bills":
      case 3: {
        return {
          ctg: "Bills",
          icon: <BsHouseDoor style={{ color: "#b7dffd" }} />,
          background: "#5a92d6",
        };
      }
    }
  };

  useEffect(() => {
    setStyle(categoryStyle());
  }, []);

  //VRNEMO IZBRANO KATEGORIJO Z DOLOČENIM STILOM(BARVO) TER PODAMO ŠE IME KATEGORIJE IN PA VSOTO VSEH TRANSAKCIJ KI SPADAJO POD TO KATEGORIJO
  return (
    <div className={styles.container} style={{ background: style.background }}>
      <div className={styles.inner}>
        <div className={styles.iconContainer}>{style.icon}</div>
        <div className={styles.info}>
          <div className={styles.title}>{style.ctg}</div>
          <div className={styles.money}>{`-$${money}`}</div>
        </div>
      </div>
    </div>
  );
};

CategoryCard.defaultProps = {
  category: "other",
  money: "50k",
};

export default CategoryCard;