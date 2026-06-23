import type { ReactNode } from "react";

export interface PaginationClassNameProps {
  /** Clases para el contenedor principal */
  wrapper?: string;
  /** Clases para la sección izquierda (info de resultados) */
  info?: string;
  /** Clases para la sección derecha (controles) */
  controls?: string;
  /** Clases para el `<select>` de filas por página */
  select?: string;
  /** Clases para los botones de navegación */
  button?: string;
  /** Clases para el botón deshabilitado */
  buttonDisabled?: string;
  /** Clases para el indicador de página actual */
  pageIndicator?: string;
}

export interface PaginationProps {
  /** Página actual (1-indexed) */
  page: number;
  /** Cantidad de elementos por página */
  pageSize: number;
  /** Total de elementos (opcional, para mostrar "X resultados") */
  totalItems?: number;
  /** Indica si está cargando (deshabilita controles) */
  isLoading?: boolean;
  /** Si es `true`, la siguiente página existe (se habilita botón "siguiente") */
  hasNextPage: boolean;
  /** Opciones para el selector de filas por página */
  pageSizeOptions?: number[];
  /** Etiqueta para el selector de filas por página */
  pageSizeLabel?: string;
  /** Callback al cambiar de página */
  onPageChange: (page: number) => void;
  /** Callback al cambiar el tamaño de página */
  onPageSizeChange: (pageSize: number) => void;
  /** Clases personalizadas */
  className?: PaginationClassNameProps;
  /** Icono personalizado para flecha izquierda */
  iconPrev?: ReactNode;
  /** Icono personalizado para flecha derecha */
  iconNext?: ReactNode;
}
