import { Eye, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import { RISK_BAR_COLORS, RISK_LABEL_CONFIG, formatDate, formatRiskScore, getModelVersionLabel } from "../analytics.utils";

import type { TableColumnProps } from "@shared/components/Table";
import type { RiskLabelT, StudentRiskScoreT } from "../analytics.types";
import type { RiskScoreListParamsT } from "../analytics.types";

type RiskScoreTableProps = {
  scores: StudentRiskScoreT[];
  totalCount: number;
  isLoading: boolean;
  loadScores: (params?: RiskScoreListParamsT) => void;
  academicPeriodId?: number;
  onViewDetail: (id: number) => void;
  onRecalculate: () => void;
  isCalculating: boolean;
};

export const RiskScoreTable = ({
  scores,
  totalCount,
  isLoading,
  loadScores,
  academicPeriodId,
  onViewDetail,
  onRecalculate,
  isCalculating,
}: RiskScoreTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [riskLabelFilter, setRiskLabelFilter] = useState<RiskLabelT | "">("");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      risk_label?: RiskLabelT | "";
    }) => {
      loadScores({
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search:
          overrides?.search !== undefined
            ? overrides.search || undefined
            : search || undefined,
        risk_label:
          overrides?.risk_label !== undefined
            ? (overrides.risk_label || undefined) as RiskLabelT | undefined
            : (riskLabelFilter || undefined) as RiskLabelT | undefined,
        academic_period: academicPeriodId,
      });
    },
    [loadScores, page, pageSize, search, riskLabelFilter, academicPeriodId],
  );

  useEffect(() => {
    fetchData();
  }, [academicPeriodId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({ page: 1, search: value || undefined });
      }, 400);
    },
    [fetchData],
  );

  const handleRiskLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as RiskLabelT | "";
      setRiskLabelFilter(value);
      setPage(1);
      fetchData({ page: 1, risk_label: value });
    },
    [fetchData],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<StudentRiskScoreT>[] = [
    {
      key: "enrollment_name",
      label: "Estudiante",
      className: tableFirstColumnClassname,
    },
    {
      key: "academic_period_name",
      label: "Período",
      className: tableColumnsClassname,
    },
    {
      key: "risk_score",
      label: "Puntaje",
      className: tableColumnsClassname,
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${RISK_BAR_COLORS[s.risk_label]}`}
              style={{ width: `${Math.min(s.risk_score, 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600">
            {formatRiskScore(s.risk_score)}
          </span>
        </div>
      ),
    },
    {
      key: "risk_label",
      label: "Nivel",
      className: tableColumnsClassname,
      render: (s) => {
        const config = RISK_LABEL_CONFIG[s.risk_label];
        return <Badge variant={config.badgeVariant}>{config.label}</Badge>;
      },
    },
    {
      key: "model_version",
      label: "Modelo",
      className: tableColumnsClassname,
      render: (s) => (
        <span className="text-xs text-slate-500">
          {getModelVersionLabel(s.model_version)}
        </span>
      ),
    },
    {
      key: "calculated_at",
      label: "Fecha",
      className: tableColumnsClassname,
      render: (s) => (
        <span className="text-xs text-slate-500">
          {formatDate(s.calculated_at)}
        </span>
      ),
    },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput
          name="search"
          type="text"
          onChange={handleSearchChange}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Buscar estudiante..."
        />

        <select
          value={riskLabelFilter}
          onChange={handleRiskLabelChange}
          className="block w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Filtrar por nivel de riesgo"
        >
          <option value="">Todos los niveles</option>
          <option value="rojo">Alto Riesgo</option>
          <option value="amarillo">Riesgo Moderado</option>
          <option value="verde">Bajo Riesgo</option>
        </select>

        <button
          type="button"
          onClick={onRecalculate}
          disabled={isCalculating}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className={`size-4 ${isCalculating ? "animate-spin" : ""}`} />
          {isCalculating ? "Calculando..." : "Recalcular"}
        </button>
      </div>

      <CustomTable<StudentRiskScoreT>
        data={scores}
        columns={columns}
        isLoading={isLoading && scores.length === 0}
        emptyMessage="No se encontraron puntajes de riesgo"
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando puntajes de riesgo..."
        rowActions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onViewDetail(s.id)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
          </div>
        )}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalCount}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchData({ page: newPage });
        }}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
          fetchData({ page: 1, pageSize: newSize });
        }}
      />
    </div>
  );
};
