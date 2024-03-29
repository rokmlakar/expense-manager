import { useQuery, useMutation } from 'react-query';
import Ax from '../utils/Axios';

const fetchUser = async () => {
    return await Ax.get('user');
}

const fetchUsers = async () => {
    return await Ax.get('users');
}
const loginUser = async (body) => {
    return await Ax.post('auth', body)
}
const registerUser = async (body) => {
    return await Ax.post('register', body)
}
const logoutUser = async (body) => {
    return await Ax.post('logout')
}

const userUpdate = async (body) => {
    return await Ax.patch('me', body)
};

const userUpdatePassword = async (body) => {
    return await Ax.patch('me/pw', body);
};

const useUser = () =>
    useQuery('user', fetchUser, {
        refetchOnWindowFocus: true,
        retry: false,
    });

const useUsers = () =>
    useQuery('users', fetchUsers, {
        refetchOnWindowFocus: true,
        retry: false,
    });

const useLoginUser = () => useMutation('loginUser', loginUser); //odstranjen prvi param ki je bil 'loginUser,' enako pri ostalih
const useLogoutUser = () => useMutation('logoutUser', logoutUser);
const useRegisterUser = () => useMutation(registerUser);
const useUserUpdate = () => useMutation(userUpdate);
const useUserUpdatePassword = () => useMutation(userUpdatePassword);

export {
    useUser,
    useLoginUser,
    useRegisterUser,
    useLogoutUser,
    useUserUpdate,
    useUserUpdatePassword,
    useUsers
};
