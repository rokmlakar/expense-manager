//STYLES
import styles from "../../styles/Cards/WalletHomeCard.module.scss";
import { FiBox } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { BsHouseDoor } from "react-icons/bs";
import { HiOutlineFire } from "react-icons/hi";
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
//UTILS
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { BsPlusSquare } from "react-icons/bs";
import { useWalletDelete, useWalletEdit, useWalletViewerPost, useWalletViewerGet, } from "../../queries/wallet";
import { queryClient } from '../../constants/config';
import { useViewerTransactionsGet, useTransactionsGet } from '../../queries/transaction';
import TransactionCard from "./TransactionCard";
import { DateTime } from 'luxon';
import { Title } from "../Titles/Titles";
import { Link, useNavigate } from 'react-router-dom';

import { WalletContext } from '../../context/WalletProvider';
import { useContext } from 'react';



//CATEGORYCARDU PODAMO IZBRANO KATEGORIJO IN PA DENAR
const WalletViewerCard = ({ title, wallet, money, color, reloadSetter, reload, ftch, walletId, description, username, transactions, admin }) => {
  //NASTAVIMO STIL(VSAKA KATEGORIJA IMA SVOJO BARVO)
  const [style, setStyle] = useState({});
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const {walletCon, setWalletCon} = useContext(WalletContext);



  const { mutate: deleteWall } = useWalletDelete();
  const { mutate: editWall } = useWalletEdit();
  const {
    mutate: postWalletViewer,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useWalletViewerPost();

  // const { data: walletViewers, refetch: fetchWalletViews } =
  //   useWalletViewerGet({
  //     key: 'WallViewers',
  //   });

  const { data: viewedTrns, refetch: fetchViewedTrns } = useTransactionsGet({
    key: 'ViewedTrns',
    walletId: walletId
  });


  useEffect(() => {
    if (viewedTrns) {
      viewedTrns.data.forEach(trs => {

      });
    }
  }, [viewedTrns])

  // console.log(viewedTrns)

  const [addMoney, setAddMoney] = useState('');
  const [walletViewer, setWalletViewer] = useState('');

  let body = {
    wallet: walletId,
    money: addMoney
  }

  let trnsBody = {
    walletId: walletId,
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

  const handleShowTrns = () => {
    setVisible(!visible);
    fetchViewedTrns();

  }

  const clickHandler = () => {
    setWalletCon(wallet)
  }

  //VRNEMO IZBRANO KATEGORIJO Z DOLOČENIM STILOM(BARVO) TER PODAMO ŠE IME KATEGORIJE IN PA VSOTO VSEH TRANSAKCIJ KI SPADAJO POD TO KATEGORIJO
  return (
    < Link to='/transactions' >
    <div className={styles.container} style={{ background: color }} onClick={clickHandler}>
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

          </div>
        </div>
        {/* <div className={`${visible ? styles.descriptionActive : styles.descriptionInactive} `}
        >
          <p>{description}</p>
        </div> */}

      </div>
    </div >
    </Link >
  );
};

WalletViewerCard.defaultProps = {
  category: "other",
  money: "50k",
};

export default WalletViewerCard;