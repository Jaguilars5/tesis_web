# Componente de Tabla Genérico (`Table`)

Este documento proporciona una guía detallada sobre cómo utilizar el componente genérico `Table` en la aplicación.

## Descripción General

El componente `Table` es una tabla reutilizable y altamente configurable construida con React y TypeScript. Está diseñado para mostrar colecciones de datos de cualquier tipo (`<T>`) y ofrece características como renderizado personalizado, columnas condicionales, filas expandibles para datos ocultos y acciones por fila.

**Ubicación del archivo:** `src/renderer/src/components/ui/table/Table.tsx`

## Props del Componente (`TableProps<T>`)

A continuación se detallan las props que acepta el componente `Table`.

| Prop             | Tipo                                | Requerido | Descripción                                                                                                      |
| ---------------- | ----------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `columns`        | `TableColumn<T>[]`                  | Sí        | Array de objetos para configurar las columnas de la tabla.                                                       |
| `data`           | `T[]`                               | Sí        | Array de datos a mostrar en la tabla.                                                                            |
| `isLoading`      | `boolean`                           | Sí        | Si es `true`, muestra un mensaje de carga.                                                                       |
| `className`      | `TableClassNameProps<T>`            | No        | Objeto con clases CSS para personalizar la apariencia de la tabla y sus elementos.                               |
| `emptyMessage`   | `React.ReactNode`                   | No        | Mensaje o componente a mostrar cuando `data` está vacío. **Default:** "No hay datos disponibles".                |
| `loadingMessage` | `React.ReactNode`                   | No        | Mensaje o componente a mostrar mientras `isLoading` es `true`. **Default:** "Cargando...".                       |
| `expandOptions`  | `object`                            | No        | Opciones para configurar el comportamiento de las filas expandibles.                                             |
| `expandedRows`   | `Record<string \| number, boolean>` | No        | Objeto para controlar el estado de las filas expandidas desde un componente padre (modo controlado).             |
| `onToggleRow`    | `(id: string \| number) => void`    | No        | Función callback que se ejecuta al expandir o contraer una fila. Requerido si se usa `expandedRows`.             |
| `rowActions`     | `(row: T) => React.ReactNode`       | No        | Función que devuelve un `ReactNode` (ej. botones) para mostrar en una columna de acciones al final de cada fila. |

---

## Configuración de Columnas (`TableColumn<T>`)

La prop `columns` es un array de objetos, donde cada objeto define una columna.

| Prop           | Tipo                                             | Descripción                                                                                                                             |
| -------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `key`          | `string`                                         | Identificador único de la columna, generalmente corresponde a una clave en el objeto de datos `T`.                                      |
| `label`        | `string`                                         | Texto que se mostrará en el encabezado (`<th>`) de la columna.                                                                          |
| `render`       | `(data: T, rowIndex: number) => React.ReactNode` | Función opcional para personalizar el renderizado del contenido de la celda (`<td>`).                                                   |
| `renderHeader` | `() => React.ReactNode`                          | Función opcional para personalizar el renderizado del encabezado de la columna.                                                         |
| `condition`    | `(data: T) => boolean`                           | Función opcional que determina si la columna debe ser visible. Útil para tablas con estructuras de datos variables.                     |
| `className`    | `object`                                         | Objeto con clases para `th` y `td`. La clase `td` puede ser una función que recibe la fila y la columna para aplicar estilos dinámicos. |

---

## Ejemplos de Uso

### 1. Ejemplo Básico

Muestra una lista simple de usuarios con ID, nombre y email.

```tsx
import { Table } from "./Table";

const MyComponent = () => {
  const data = [
    { id: 1, name: "Juan Pérez", email: "juan.perez@example.com" },
    { id: 2, name: "Ana Gómez", email: "ana.gomez@example.com" },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nombre" },
    { key: "email", label: "Correo Electrónico" },
  ];

  return <Table columns={columns} data={data} isLoading={false} />;
};
```

### 2. Ejemplo Avanzado

Este ejemplo demuestra características más complejas:

- **Renderizado personalizado:** Para la columna de "Estado".
- **Acciones por fila:** Botones para "Editar" y "Eliminar".
- **Filas expandibles:** La columna "Fecha de Creación" se oculta en pantallas pequeñas y se muestra al expandir la fila.
- **Clases personalizadas:** Para estilizar la tabla y la columna de estado.

```tsx
import { Table } from "./Table";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdvancedTable = () => {
  const data = [
    {
      id: 1,
      product: "Laptop Pro",
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: 2,
      product: "Teclado Mecánico",
      status: "inactive",
      createdAt: "2023-02-20",
    },
  ];

  const columns = [
    { key: "product", label: "Producto" },
    {
      key: "status",
      label: "Estado",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 text-white ${
            row.status === "active" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {row.status === "active" ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Fecha de Creación",
      // Se oculta en vistas móviles y aparece en la fila expandible
      className: { td: "hidden md:table-cell" },
    },
  ];

  const tableClassName = {
    table: "min-w-full divide-y divide-gray-200",
    thead: "bg-gray-50",
    trHead: "text-left text-xs font-medium text-gray-500 uppercase",
    tbody: "bg-white divide-y divide-gray-200",
    trBody: "hover:bg-gray-50",
  };

  const handleEdit = (id) => alert(`Editando fila ${id}`);
  const handleDelete = (id) => alert(`Eliminando fila ${id}`);

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={false}
      className={tableClassName}
      rowActions={(row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row.id)}>
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(row.id)}>
            <FaTrash />
          </button>
        </div>
      )}
    />
  );
};
```

## Características Especiales

### Filas Expandibles (Columnas Ocultas)

Para que una columna se mueva a la sección expandible en ciertos tamaños de pantalla, simplemente aplica una clase CSS que la oculte, como `hidden`. El componente detectará automáticamente las columnas ocultas y mostrará un botón para expandir la fila y ver esos datos.

**Ejemplo con Tailwind CSS:**

```ts
const columns = [
  {
    key: "details",
    label: "Detalles",
    // Esta columna estará oculta en pantallas pequeñas (< 768px)
    className: {
      th: "hidden md:table-cell",
      td: "hidden md:table-cell",
    },
  },
];
```

Al hacer clic en el botón de expansión (`<FaChevronDown />`), se mostrará una sección adicional debajo de la fila con el `label` y el valor de todas las columnas ocultas.
