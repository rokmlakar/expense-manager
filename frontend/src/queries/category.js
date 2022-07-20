import { useQuery, useMutation } from "react-query";
import Ax from "../utils/Axios";

//AXIOS CALLS
const getCtgs = async () => {
  return await Ax.get("/categories");
};

const getCtgsSum = async () => {
  console.log()
  //return await(await Ax.get("/categories/sum")) -- da počaka json, mogoce povzroci bug da se ne nalodajo podatki
  return await Ax.get("/categories/sum");
};

const postCtg = async (params) => {
  return await Ax.post("category", params);
};

//HOOKS
const useCategoriesGet = () =>
  useQuery("Categories", getCtgs
  );

const useCategoriesSum = () =>
  useQuery("Categories_Sum", getCtgsSum, { staleTime: 30000 });

const useCategoryPost = () => useMutation("postCategory", postCtg);

export { useCategoriesGet, useCategoriesSum, useCategoryPost };