import { useQuery, useMutation } from "react-query";
import Ax from "../utils/Axios";


const getWall = async () => {
    return await Ax.get('/wallets');
};

const postWall = async (params) => {
    return await Ax.post('wallet', params)
};

const postWallViewer = async (params) => {
    return await Ax.post('walletViewer', params)
}

const getWallViewer = async (params) => {
    return await Ax.get('/walletViewers', params)
}

const editWall = async (params) => {
    console.log(params)
    return await Ax.put(`wallet/edit/${params.wallet}`, params)
}

const deleteWall = async (params) => {
    return await Ax.delete(`wallet/delete/${params}`);
};

const useWalletPost = () => useMutation("postWallet", postWall)

const useWalletViewerPost = () => useMutation("postWalletViewer", postWallViewer)

const useWalletViewerGet = () => useQuery("WallViewers", getWallViewer);

const useWalletDelete = () => useMutation("deleteWall", deleteWall);

const useWalletEdit = () => useMutation("editWallet", editWall);

const useWalletsGet = () => useQuery("Wallets", getWall);

// const useWalletGet = ({ key }) => useQuery(key,
//     () => getWall({

//     }),
//     {
//         refetchOnWindowFocus: false,
//         enabled: false,
//         keepPreviousData: true
//     }
// )

export { useWalletPost, useWalletsGet, useWalletDelete, useWalletEdit, useWalletViewerPost, useWalletViewerGet }