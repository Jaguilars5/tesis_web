import { useEffect } from "react";

type UseClickOutsideProps = {
  ref: React.RefObject<HTMLElement | null>;
  onClickOutside: () => void;
};

export const useClickOutside = ({
  ref,
  onClickOutside,
}: UseClickOutsideProps): void => {
  if (!ref) return;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, onClickOutside]);
};
