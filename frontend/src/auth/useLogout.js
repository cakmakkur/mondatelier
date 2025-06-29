import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
  const axiosPrivate = useAxiosPrivate();
  const LOGOUT = import.meta.env.VITE_LOGOUT_PATH;

  const logout = async () => {
    try {
      const response = await axiosPrivate.get(LOGOUT);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  return logout;
};
export default useLogout;
