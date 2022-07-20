import { useQuery, useMutation } from "react-query";
import Ax from "../utils/Axios";


const getWall = async () => {
    return await Ax.get('/wallets');
};

const postWall = async (params) => {
    return await Ax.post('wallet', params)
};

const useWalletPost = () => useMutation("postWallet", postWall)

const useWalletsGet = () =>
    useQuery("Wallets", getWall, {
        staleTime: 50000,
    });

// const useWalletGet = ({ key }) => useQuery(key,
//     () => getWall({

//     }),
//     {
//         refetchOnWindowFocus: false,
//         enabled: false,
//         keepPreviousData: true
//     }
// )

export { useWalletPost, useWalletsGet }