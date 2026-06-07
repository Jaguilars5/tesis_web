import { useAppSelector } from "@shared/redux/hooks";
import { selectAuthState } from "../../reducers/auth.selectors";

export const useAuthController = () => {
  return useAppSelector(selectAuthState);
};
