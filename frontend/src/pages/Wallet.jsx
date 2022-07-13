import MainContainer from '../components/Containers/MainContainer';
import styles from '../styles/walletComponents/Wallet.module.scss';
import AddWalletForm from '../components/walletComponents/AddWalletForm'
const Wallet = () => {

  return (
    <MainContainer>
      <AddWalletForm />
    </MainContainer>
  )
}

export default Wallet