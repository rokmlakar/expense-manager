//STYLES
import styles from "../../styles/Cards/WalletCard.module.scss";
import { FiBox } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { BsHouseDoor } from "react-icons/bs";
import { HiOutlineFire } from "react-icons/hi";
//UTILS
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { BsPlusSquare } from "react-icons/bs";
import { useWalletDelete, useWalletEdit, useWalletViewerPost } from "../../queries/wallet";
import { queryClient } from '../../constants/config';



//CATEGORYCARDU PODAMO IZBRANO KATEGORIJO IN PA DENAR
const WalletCard = ({ title, wallet, money, color, reloadSetter, reload, ftch, walletId }) => {
  //NASTAVIMO STIL(VSAKA KATEGORIJA IMA SVOJO BARVO)
  const [style, setStyle] = useState({});

  const { mutate: deleteWall } = useWalletDelete();
  const { mutate: editWall } = useWalletEdit();
  const {
    mutate: postWalletViewer,
    isLoading,
    isError,
    isSuccess,
    message,
    error,
  } = useWalletViewerPost();



  const [addMoney, setAddMoney] = useState('');
  const [walletViewer, setWalletViewer] = useState('');

  let body = {
    wallet: walletId,
    money: addMoney
  }

  let viewerBody = {
    wallet: walletId,
    viewer: walletViewer
  }

  const handleClick = () => {

    editWall(body, {
      onSuccess: async () => {
        await queryClient
          .invalidateQueries("Trs")
          .then(await reloadSetter(!reload))
          .catch();
      },
    });
    reloadSetter(!reload)
  }

  const handleUserMonitor = () => {
    postWalletViewer(viewerBody, {
      onSuccess: async () => {
        await reloadSetter(!reload)
      }
    });
  }

  //VRNEMO IZBRANO KATEGORIJO Z DOLOČENIM STILOM(BARVO) TER PODAMO ŠE IME KATEGORIJE IN PA VSOTO VSEH TRANSAKCIJ KI SPADAJO POD TO KATEGORIJO
  return (
    <div className={styles.container} style={{ background: color }}>
      <div className={styles.inner} >
        {/* INFO */}
        <div className={styles.info} >
          {/* <CategoryIcon category={category} /> */}
          <div className={styles.categoryContainer}  >
            <div className={styles.column} style={{ justifyContent: 'center', borderRight: `2px solid ${color}`, width: '170px' }}>
              <span className={styles.categoryTitle} >{title}</span>
            </div>
            <div className={styles.column}>
              <span className={styles.title} style={{ borderBottom: `1px solid ${color}`, padding: '2px', width: '90px' }}>Balance</span>
              <span className={styles.money} style={{ width: '90px' }}>${money}</span>
            </div>
            <div className={styles.column}>
              {/* <span onClick={addFunds} className={styles.title} style={{ borderBottom: `1px solid ${color}` }}>Add Funds</span> */}
              <div
                className={styles.iconContainerAdd}>
                <input
                  type="number"
                  placeholder='Add Funds'
                  onChange={(e) => setAddMoney(e.target.value)}
                  value={addMoney}
                />
                <BsPlusSquare onClick={handleClick} /></div>
            </div>

            <div className={styles.column}>
              {/* <span onClick={addFunds} className={styles.title} style={{ borderBottom: `1px solid ${color}` }}>Add Funds</span> */}
              <div className={styles.iconContainerAdd}>
                <input
                  style={{ width: '200px' }}
                  type="text"
                  placeholder='Add wallet viewer email'
                  onChange={(e) => setWalletViewer(e.target.value)}
                  value={walletViewer}
                />
                <BsPlusSquare onClick={handleUserMonitor} /></div>
              {isError &&
                error.response.data.map((err, index) => {
                  return (
                    <div style={{ color: 'red' }} key={index}>
                      {` ${err.message ? err.message : ""} `}</div>
                  );
                })}
              {isSuccess && <div style={{ color: 'green' }}>Email verification has been sent </div>}
            </div>
            <div
              className={styles.iconContainerDelete}
              onClick={() => {
                deleteWall(wallet, {
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
      </div>
    </div >
  );
};

WalletCard.defaultProps = {
  category: "other",
  money: "50k",
};

export default WalletCard;