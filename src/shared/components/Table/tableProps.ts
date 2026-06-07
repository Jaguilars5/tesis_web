import React from "react";

export interface TableColumnProps<T> {
  /**
   * Identificador único de la columna.
   * Generalmente corresponde a una clave en el objeto de datos `T`.
   */
  key: string;
  /**
   * Texto que se mostrará en el encabezado (`<th>`) de la columna.
   */
  label?: string;
  /**
   * Función opcional para personalizar el renderizado del contenido de la celda (`<td>`).
   * @param data - El objeto de datos de la fila actual.
   * @param rowIndex - El índice de la fila actual.
   * @returns Un `ReactNode` para renderizar en la celda.
   */
  render?: (data: T, rowIndex: number) => React.ReactNode;
  /**
   * Función opcional para personalizar el renderizado del encabezado de la columna.
   * @returns Un `ReactNode` para renderizar en el encabezado.
   */
  renderHeader?: () => React.ReactNode;
  /**
   * Función opcional que determina si la columna debe ser visible.
   * Útil para tablas con estructuras de datos variables.
   * @param data - El primer elemento del array de datos para evaluar la condición.
   * @returns `true` si la columna debe mostrarse, `false` en caso contrario.
   */
  condition?: (data: T) => boolean;
  /**
   * Objeto con clases CSS para personalizar el `<th>` y `<td>` de la columna.
   * `td` puede ser una función para aplicar clases dinámicas basadas en los datos de la fila.
   */
  className?: {
    th?: string;
    td?: string | ((row: T, col: TableColumnProps<T>) => string);
  };
}

export interface TableClassNameProps<T> {
  /** Clases para el elemento `<table>`. */
  table?: string;
  /** Clases para el elemento `<thead>`. */
  thead?: string;
  /** Clases para el elemento `<tr>` en el encabezado. */
  trHead?: string;
  /** Clases para el elemento `<tbody>`. */
  tbody?: string;
  /**
   * Clases para el elemento `<tr>` en el cuerpo.
   * Puede ser una cadena o una función que devuelve una cadena de clases basada en los datos de la fila.
   */
  trBody?: string | ((row: T) => string);
  /** Clases para la celda que muestra el mensaje cuando no hay datos. */
  notFound?: string;
  /** Clases para el encabezado de la columna "Más" (para filas expandibles). */
  moreHeader?: string;
  /** Clases para la celda que contiene el botón para expandir la fila. */
  moreCell?: string;
  /** Clases para el botón de expansión. */
  moreButton?: string;
  /** Clases para la fila expandida que muestra datos adicionales. */
  expandedRow?: string;

  /** Clases para las acciones */
  actions?: string;

  /** Clases para el contenedor principal de la tabla */
  container?: string;
}

export interface TableProps<T> {
  /** Objeto con clases CSS para personalizar la apariencia de la tabla y sus elementos. */
  className?: TableClassNameProps<T>;
  /** Array de objetos para configurar las columnas de la tabla. */
  columns: TableColumnProps<T>[];
  /** Array de datos a mostrar en la tabla. */
  data: T[];
  /** Si es `true`, muestra un mensaje de carga. */
  isLoading: boolean;
  /** Mensaje o componente a mostrar cuando `data` está vacío. */
  emptyMessage?: React.ReactNode;
  /** Mensaje o componente a mostrar mientras `isLoading` es `true`. */
  loadingMessage?: React.ReactNode;
  /** Opciones para configurar el comportamiento de las filas expandibles. */
  expandOptions?: {
    /**
     * @deprecated Esta propiedad no se utiliza actualmente.
     */
    breakpoint?: string;
    /** Clases para personalizar los elementos de la fila expandible. */
    className: {
      button?: string;
      cell?: string;
      expandedCell?: string;
    };
  };
  /**
   * Objeto para controlar el estado de las filas expandidas desde un componente padre (modo controlado).
   * La clave es el `id` de la fila y el valor es `true` si está expandida.
   */
  expandedRows?: Record<string | number, boolean>;
  /**
   * Función callback que se ejecuta al expandir o contraer una fila.
   * Requerido si se usa `expandedRows` para el modo controlado.
   * @param id - El `id` de la fila que se está modificando.
   */
  onToggleRow?: (id: string | number) => void;
  /**
   * Titulo de acciones
   */
  actionsTitle?: string;

  /**
   * Función que devuelve un `ReactNode` (ej. botones) para mostrar en una columna de acciones al final de cada fila.
   * @param row - El objeto de datos de la fila actual.
   * @returns Un `ReactNode` con las acciones para la fila.
   */
  rowActions?: (row: T) => React.ReactNode;
}
