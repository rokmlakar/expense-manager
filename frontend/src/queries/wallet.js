import { useQuery, useMutation } from "react-query";
import Ax from "../utils/Axios";


const useWalletGet = ({ key }) => useQuery(key,
    () => getWall({
       
    }),
    {
        refetchOnWindowFocus: false,
        enabled: false,
        keepPreviousData: true
    }
)

const getWall = async (params) => {
    return await Ax.get('wallet', { params: params }).catch((e) =>
        console.log(e)
    );
};

const postWall = async (params) => {
    return await Ax.post('wallet', params)
};

const useWalletPost = () => useMutation("postWallet", postWall)

export { useWalletPost, useWalletGet }