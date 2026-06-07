import { CheckCircle2, Layers3, Palette, PanelTop, Ruler, Type, Workflow, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CustomCheckbox, CustomInput, CustomSelect } from "@shared/components/Form";
import { CustomTable } from "@shared/components/Table";
import type { TableColumnProps } from "@shared/components/Table";
import type { CSSProperties, ReactNode } from "react";

type TabId = "colors" | "typography" | "cards" | "tabs" | "forms" | "modals" | "tables" | "spacing";

type DesignTab = { id: TabId; label: string; icon: typeof Palette };

type TokenItem = { name: string; utility: string; value: string; note: string; constant?: string };

const tabs: readonly DesignTab[] = [
  { id: "colors", label: "Colores", icon: Palette },
  { id: "typography", label: "Tipografia", icon: Type },
  { id: "cards", label: "Cards", icon: Layers3 },
  { id: "tabs", label: "Tabs", icon: PanelTop },
  { id: "forms", label: "Formularios", icon: Workflow },
  { id: "tables", label: "Tablas", icon: Layers3 },
  { id: "modals", label: "Modales", icon: CheckCircle2 },
  { id: "spacing", label: "Bordes y margins", icon: Ruler },
] as const;

const colorTokens: readonly TokenItem[] = [
  { name: "primary", utility: "bg-primary / text-primary / border-primary", value: "#4f46e5", note: "Acciones principales, links activos y foco.", constant: "bg-primary / text-primary / border-primary" },
  { name: "primary-hover", utility: "hover:bg-primary-hover", value: "#4338ca", note: "Hover de acciones primarias.", constant: "hover:bg-primary-hover" },
  { name: "primary-soft", utility: "bg-primary-soft", value: "#eef2ff", note: "Fondos suaves para estados activos.", constant: "bg-primary-soft" },
  { name: "secondary", utility: "bg-secondary / text-secondary", value: "#0891b2", note: "Acento secundario para informacion y graficas.", constant: "bg-secondary / text-secondary" },
  { name: "secondary-soft", utility: "bg-secondary-soft", value: "#ecfeff", note: "Fondo secundario de baja intensidad.", constant: "bg-secondary-soft" },
  { name: "sidebar", utility: "bg-sidebar", value: "#0f172a", note: "Navegacion lateral y bloques oscuros.", constant: "bg-sidebar" },
  { name: "app-bg", utility: "bg-app-bg", value: "#f8fafc", note: "Fondo general de pantallas internas (slate-50 equiv).", constant: "bg-app-bg" },
  { name: "surface", utility: "bg-white", value: "#ffffff", note: "Cards, modales y superficies elevadas.", constant: "bg-white" },
  { name: "surface-muted", utility: "bg-surface-muted", value: "#f1f5f9", note: "Bloques de codigo y fondos neutros.", constant: "bg-surface-muted" },
  { name: "border-soft", utility: "border-border-soft", value: "#e2e8f0", note: "Bordes de inputs, cards y tablas.", constant: "border-border-soft" },
  { name: "app-text", utility: "text-app-text", value: "#1e293b", note: "Texto principal.", constant: "text-app-text" },
  { name: "muted-text", utility: "text-muted-text", value: "#64748b", note: "Texto auxiliar y metadatos.", constant: "text-muted-text" },
  { name: "danger", utility: "bg-danger / text-danger", value: "#dc2626", note: "Errores y acciones destructivas.", constant: "bg-danger / text-danger" },
  { name: "danger-soft", utility: "bg-danger-soft", value: "#fef2f2", note: "Fondo para mensajes de error.", constant: "bg-danger-soft" },
  { name: "modal-overlay", utility: "bg-modal-overlay", value: "rgba(15,23,42,0.58)", note: "Fondo de modales y overlays.", constant: "bg-modal-overlay" },
] as const;

const typeTokens: readonly TokenItem[] = [
  { name: "xs", utility: "text-xs", value: "0.75rem (12px)", note: "Labels, hints y mensajes de error.", constant: "text-xs" },
  { name: "sm", utility: "text-sm", value: "0.875rem (14px)", note: "Inputs, botones y texto de tabla.", constant: "text-sm" },
  { name: "base", utility: "text-base", value: "1rem (16px)", note: "Texto por defecto de la app.", constant: "text-base" },
  { name: "lg", utility: "text-lg", value: "1.125rem (18px)", note: "Subtitulos o headers compactos.", constant: "text-lg" },
  { name: "xl", utility: "text-xl", value: "1.25rem (20px)", note: "Titulos internos.", constant: "text-xl" },
  { name: "2xl", utility: "text-2xl", value: "1.5rem (24px)", note: "Titulos de seccion.", constant: "text-2xl" },
  { name: "3xl", utility: "text-3xl", value: "1.875rem (30px)", note: "Indicadores y metricas.", constant: "text-3xl" },
  { name: "medium", utility: "font-medium", value: "500", note: "Texto enfatico leve.", constant: "font-medium" },
  { name: "semibold", utility: "font-semibold", value: "600", note: "Labels y metadata importante.", constant: "font-semibold" },
  { name: "bold", utility: "font-bold", value: "700", note: "Botones, tabs y titulos.", constant: "font-bold" },
] as const;

const spacingTokens: readonly TokenItem[] = [
  { name: "1", utility: "p-1 / gap-1", value: "0.25rem (4px)", note: "Micro separacion entre label y error.", constant: "p-1 / gap-1" },
  { name: "2", utility: "p-2 / gap-2", value: "0.5rem (8px)", note: "Separacion de iconos y campos.", constant: "p-2 / gap-2" },
  { name: "3", utility: "p-3 / gap-3", value: "0.75rem (12px)", note: "Padding compacto de controles.", constant: "p-3 / gap-3" },
  { name: "4", utility: "p-4 / gap-4", value: "1rem (16px)", note: "Gap base entre elementos.", constant: "p-4 / gap-4" },
  { name: "5", utility: "p-5 / gap-5", value: "1.25rem (20px)", note: "Padding de cards pequenas.", constant: "p-5 / gap-5" },
  { name: "6", utility: "p-6 / gap-6", value: "1.5rem (24px)", note: "Padding de cards y modales.", constant: "p-6 / gap-6" },
  { name: "8", utility: "p-8 / gap-8", value: "2rem (32px)", note: "Separacion de secciones.", constant: "p-8 / gap-8" },
  { name: "sm", utility: "rounded-sm", value: "0.375rem", note: "Badges y elementos pequenos.", constant: "rounded-sm" },
  { name: "md", utility: "rounded-md", value: "0.5rem", note: "Bloques de codigo.", constant: "rounded-md" },
  { name: "lg", utility: "rounded-lg", value: "0.75rem", note: "Inputs, tabs y botones.", constant: "rounded-lg" },
  { name: "xl", utility: "rounded-xl", value: "1rem", note: "Cards y modales.", constant: "rounded-xl" },
  { name: "2xl", utility: "rounded-2xl", value: "1rem", note: "Metric cards.", constant: "rounded-2xl" },
] as const;

const shadowTokens: readonly TokenItem[] = [
  { name: "card", utility: "shadow-card", value: "0 10px 30px -18px rgba(15,23,42,0.35)", note: "Sombra estandar para cards.", constant: "shadow-card" },
  { name: "modal", utility: "shadow-modal", value: "0 24px 70px -24px rgba(15,23,42,0.55)", note: "Sombra elevada para modales.", constant: "shadow-modal" },
  { name: "field-height", utility: "min-h-[2.75rem]", value: "2.75rem", note: "Altura minima de inputs.", constant: "min-h-[2.75rem]" },
] as const;

function tokenStyle(name: string): CSSProperties {
  return { "--swatch-color": `var(--color-${name})` } as CSSProperties;
}

function TokenGrid({ tokens, showSwatch = false }: { tokens: readonly TokenItem[]; showSwatch?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tokens.map((token) => (
        <article key={token.name} className="rounded-xl border border-border-soft bg-white p-5 shadow-card">
          {showSwatch ? (
            <div className="mb-3 size-10 rounded-lg border border-border-soft" style={tokenStyle(token.name)} />
          ) : null}
          <code className="text-xs font-bold text-primary">{token.utility}</code>
          {token.constant && (
            <code className="mt-1 block text-xs text-muted-text">{token.constant}</code>
          )}
          <p className="mt-2 text-sm font-semibold text-slate-800">{token.value}</p>
          <p className="mt-1 text-sm text-slate-500">{token.note}</p>
        </article>
      ))}
    </div>
  );
}

function ColorsSection() {
  return (
    <section className="space-y-6">
      <TokenGrid tokens={colorTokens} showSwatch />
      <code className="block overflow-x-auto rounded-lg bg-surface-muted p-4 font-mono text-xs leading-relaxed">{`<button className="bg-primary text-white rounded-lg p-4 font-bold text-sm">
  Accion principal
</button>

<span className="bg-secondary-soft text-secondary text-xs font-bold p-1 rounded-sm">
  Info
</span>`}</code>
    </section>
  );
}

const samples = [
  { label: "Titulo de seccion", className: "text-2xl font-bold" },
  { label: "Titulo interno", className: "text-xl font-bold" },
  { label: "Subtitulo operativo", className: "text-lg font-semibold" },
  { label: "Texto base para contenido y tablas", className: "text-base font-medium" },
  { label: "Texto compacto de formulario", className: "text-sm font-medium" },
  { label: "Hint, label o microcopy", className: "text-xs font-semibold" },
  { label: "Metrica destacada 1,245", className: "text-3xl font-bold" },
];

function TypographySection() {
  return (
    <section className="space-y-6">
      <TokenGrid tokens={typeTokens} />
      <div className="space-y-4 rounded-xl border border-border-soft bg-white p-5 shadow-card">
        {samples.map((sample) => (
          <p key={sample.label} className={sample.className}>
            {sample.label}
          </p>
        ))}
      </div>
    </section>
  );
}

function CardsSection() {
  return (
    <section className="flex flex-wrap gap-4">
      <article className="flex min-w-65 flex-1 flex-col rounded-xl border border-border-soft bg-white p-5 shadow-card">
        <p className="text-sm font-bold text-muted-text">Card metrica</p>
        <p className="mt-3 text-3xl font-extrabold text-slate-900 md:text-3xl">94.2%</p>
        <p className="mt-1 text-sm text-muted-text">Usa shadow-card, rounded-xl, p-5 y border-border-soft.</p>
      </article>

      <article className="flex min-w-65 flex-1 flex-col rounded-xl border border-border-soft bg-white p-5 shadow-card">
        <span className="inline-flex w-fit items-center rounded-full bg-secondary-soft px-3 py-0.5 text-xs font-semibold text-secondary">
          Badge secundario
        </span>
        <p className="text-lg font-extrabold text-slate-900">Card editorial</p>
        <p className="mt-2 text-sm text-muted-text">
          Para modulos informativos, tablas pequenas o resumenes que necesitan mas aire visual.
        </p>
        <code className="mt-4 block overflow-x-auto rounded-lg bg-surface-muted p-4 font-mono text-xs leading-relaxed">{`<article className="bg-white border-border-soft rounded-xl shadow-card p-6">
  Contenido de la card
</article>`}</code>
      </article>
    </section>
  );
}

function TabsSection() {
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-border-soft bg-white p-5 shadow-card">
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg border border-primary bg-primary-soft px-4 py-2.5 text-sm font-bold text-primary" type="button">
            Activo
          </button>
          <button className="rounded-lg border border-border-soft bg-white px-4 py-2.5 text-sm font-bold text-muted-text transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary" type="button">
            Inactivo
          </button>
          <button className="rounded-lg border border-border-soft bg-white px-4 py-2.5 text-sm font-bold text-muted-text transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary" type="button">
            Deshabilitado visual
          </button>
        </div>
      </div>
      <code className="block overflow-x-auto rounded-lg bg-surface-muted p-4 font-mono text-xs leading-relaxed">{`<button className="bg-white border-border-soft rounded-lg text-muted-text text-sm font-bold p-4 transition-colors hover:bg-primary-soft hover:border-primary hover:text-primary">
  Tab
</button>

<button className="bg-primary-soft border-primary text-primary">
  Tab activo
</button>`}</code>
    </section>
  );
}

function FormsSection() {
  return (
    <section className="flex flex-wrap gap-4">
      <div className="flex min-w-70 flex-1 flex-col gap-5 rounded-xl border border-border-soft bg-white p-5 shadow-card">
        <CustomInput label="Nombre completo" name="sampleName" placeholder="Ingresa tu nombre" type="text" onChange={() => null} value={""} />
        <CustomSelect
          label="Rol"
          name="sampleRole"
          onChange={() => null}
          value={""}
          options={[
            { label: "Administrador", value: "admin" },
            { label: "Docente", value: "teacher" },
            { label: "Inspector", value: "inspector" },
          ]}
        />
        <CustomCheckbox label="Recibir notificaciones academicas" name="sampleNotifications" onChange={() => null} checked={false} />
        <CustomInput label="Campo con error" name="sampleError" onChange={() => null} value={""} type="text" error="Este campo requiere revision" />
      </div>

      <code className="flex min-w-70 flex-1 overflow-x-auto rounded-lg bg-surface-muted p-4 font-mono text-xs leading-relaxed">{`<input className="bg-white border-border-soft rounded-lg text-app-text text-sm mt-2 p-3 w-full min-h-[2.75rem] transition-colors focus:border-primary focus:outline-none" />

<span className="text-danger text-xs font-semibold mt-1">
  Mensaje de error
</span>`}</code>
    </section>
  );
}

function ModalsSection() {
  return (
    <section className="flex flex-wrap gap-4">
      <div className="flex min-w-70 flex-1 rounded-xl border border-border-soft bg-modal-overlay p-6">
        <div className="flex w-full flex-col rounded-xl border border-border-soft bg-white p-6 shadow-modal">
          <div className="flex items-start justify-between gap-4 transition-colors">
            <div>
              <p className="text-lg font-extrabold text-slate-900">Confirmar registro</p>
              <p className="mt-2 text-sm text-muted-text">Ejemplo de modal con overlay y sombra definidos por tokens.</p>
            </div>
            <button className="rounded-lg p-2 text-muted-text hover:bg-slate-100" type="button">
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:justify-end">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-primary hover:bg-indigo-50 hover:text-primary" type="button">
              Cancelar
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60" type="button">
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <code className="flex min-w-70 flex-1 overflow-x-auto rounded-lg bg-surface-muted p-4 font-mono text-xs leading-relaxed">{`<div className="bg-modal-overlay rounded-xl p-6">
  <div className="bg-white rounded-xl shadow-modal mx-auto p-6 max-w-105">
    Contenido del modal
  </div>
</div>`}</code>
    </section>
  );
}

function TablesSection() {
  type DemoItem = { id: number; name: string; status: "active" | "inactive" };

  const data: DemoItem[] = [
    { id: 1, name: "Aula 101", status: "active" },
    { id: 2, name: "Aula 102", status: "inactive" },
    { id: 3, name: "Laboratorio A", status: "active" },
  ];

  const columns: TableColumnProps<DemoItem>[] = [
    { key: "id", label: "#" },
    { key: "name", label: "Nombre" },
    {
      key: "status",
      label: "Estado",
      render: (item) =>
        item.status === "active" ? (
          <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">Activo</span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-muted-text">Inactivo</span>
        ),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-xl border border-border-soft bg-white p-5 shadow-card">
        <p className="mb-4 text-sm font-bold text-muted-text">Tabla con CustomTable</p>
        <CustomTable<DemoItem>
          data={data}
          columns={columns}
          isLoading={false}
          rowActions={() => (
            <>
              <button type="button" className="inline-flex items-center justify-center rounded-lg bg-primary-soft p-1.5 text-primary transition hover:bg-primary hover:text-white" title="Editar">
                <span className="size-3.5">E</span>
              </button>
              <button type="button" className="inline-flex items-center justify-center rounded-lg bg-danger-soft p-1.5 text-danger transition hover:bg-danger hover:text-white" title="Eliminar">
                <span className="size-3.5">X</span>
              </button>
            </>
          )}
        />
      </div>

      <div className="rounded-xl border border-border-soft bg-white p-5 shadow-card">
        <p className="mb-4 text-sm font-bold text-muted-text">Estados de tabla</p>
        <div className="flex flex-col gap-4">
          <CustomTable data={[]} columns={[]} isLoading={true} />
          <CustomTable data={[]} columns={[]} isLoading={true} emptyMessage="No se encontraron registros" />
        </div>
      </div>

      <code className="block overflow-x-auto rounded-lg bg-surface-muted p-4 font-mono text-xs leading-relaxed">{`import { CustomTable, type ColumnDef } from '@shared/components/Table'

const columns: ColumnDef<Item>[] = [
  { header: 'Nombre', accessor: 'name' },
  { header: 'Estado', accessor: (item) => <Badge>{item.status}</Badge> },
]

<CustomTable
  data={data}
  columns={columns}
  keyExtractor={(item) => item.id}
  loading={isLoading}
  error={error}
  searchable
  searchValue={search}
  onSearchChange={setSearch}
  showRowNumbers
  renderRowActions={(item) => (
    <>
      <button className="inline-flex items-center justify-center rounded-lg bg-primary-soft p-1.5 text-primary transition hover:bg-primary hover:text-white">Editar</button>
      <button className="inline-flex items-center justify-center rounded-lg bg-danger-soft p-1.5 text-danger transition hover:bg-danger hover:text-white">Eliminar</button>
    </>
  )}
  classNames={{ row: 'hover:bg-slate-50' }}
/>`}</code>
    </section>
  );
}

function SpacingSection() {
  return (
    <section className="flex flex-col gap-6">
      <TokenGrid tokens={spacingTokens} />
      <div className="flex flex-col gap-4 rounded-xl border border-border-soft bg-white p-5 shadow-card">
        <p className="text-sm font-bold text-muted-text">Sombras y alturas</p>
        <TokenGrid tokens={shadowTokens} />
      </div>
      <div className="rounded-xl border border-border-soft bg-white p-5 shadow-card">
        <div className="flex flex-wrap gap-4">
          <div className="flex min-w-35 flex-1 rounded-md border border-dashed border-secondary p-3">rounded-md + p-3</div>
          <div className="flex min-w-35 flex-1 rounded-lg border border-dashed border-secondary p-4">rounded-lg + p-4</div>
          <div className="flex min-w-35 flex-1 rounded-xl border border-dashed border-secondary p-6">rounded-xl + p-6</div>
        </div>
      </div>
    </section>
  );
}

function renderSection(activeTab: TabId) {
  const sections: Record<TabId, ReactNode> = {
    colors: <ColorsSection />,
    typography: <TypographySection />,
    cards: <CardsSection />,
    tabs: <TabsSection />,
    forms: <FormsSection />,
    modals: <ModalsSection />,
    tables: <TablesSection />,
    spacing: <SpacingSection />,
  };

  return sections[activeTab];
}

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<TabId>("colors");

  return (
    <main className="min-h-screen bg-app-bg">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 md:space-y-8">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Sistema de diseno</p>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-950 md:text-3xl">Guia de estilos EduManage</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Esta pagina documenta los tokens de estilo del diseno sistema. Usa las clases de{" "}
              <code className="text-xs font-mono">Tailwind CSS</code> para mantener consistencia en toda la aplicacion.
            </p>
          </div>
          <Link className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-primary hover:bg-indigo-50 hover:text-primary" to="/login">
            Volver a login
          </Link>
        </header>

        <nav className="flex flex-wrap gap-3" aria-label="Categorias del sistema de diseno">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors ${
                activeTab === id
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-soft bg-white text-muted-text hover:border-primary hover:bg-primary-soft hover:text-primary"
              }`}
              type="button"
              onClick={() => setActiveTab(id)}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>

        {renderSection(activeTab)}
      </div>
    </main>
  );
}
