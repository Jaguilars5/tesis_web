import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useConductIncidentController } from "./hooks/useConductIncidentController";
import { useConductIncidentForm } from "./hooks/useConductIncidentForm";
import {
  useIncidentTypeOptions,
  useSeverityOptions,
  useEnrollmentOptions,
  useAcademicPeriodOptions,
} from "./hooks/useConductIncidentOptions";
import { ConductIncidentFormModal } from "./components/ConductIncidentFormModal";
import { ConductIncidentTable } from "./components/ConductIncidentTable";
import { ConductIncidentViewModal } from "./components/ConductIncidentViewModal";

import type { ConductIncidentT } from "./conduct-incident.types";
import { CONDUCT_INCIDENT_PERMISSIONS } from "./conduct-incident.constants";

export default function ConductIncidentsPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(
    permissions,
    CONDUCT_INCIDENT_PERMISSIONS.CREATE,
  );
  const canEdit = hasPermission(
    permissions,
    CONDUCT_INCIDENT_PERMISSIONS.UPDATE,
  );

  const { items, totalCount, isLoading, loadItems, createItem, updateItem } =
    useConductIncidentController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useConductIncidentForm({ create: createItem, update: updateItem });

  const { incidentTypeOptions } = useIncidentTypeOptions();
  const { severityOptions } = useSeverityOptions();
  const { enrollmentOptions } = useEnrollmentOptions();
  const { academicPeriodOptions } = useAcademicPeriodOptions();

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const openViewModal = useCallback((incident: ConductIncidentT) => {
    setViewingId(incident.id);
    setIsViewOpen(true);
  }, []);
  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Incidentes de Conducta
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Registro de incidentes de conducta de estudiantes
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nuevo Incidente
          </button>
        )}
      </div>

      <ConductIncidentTable
        conductIncidents={items}
        totalCount={totalCount}
        isLoading={isLoading}
        loadConductIncidents={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        canEdit={canEdit}
      />

      <ConductIncidentFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingIncident={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
        incidentTypeOptions={incidentTypeOptions}
        severityOptions={severityOptions}
        academicPeriodOptions={academicPeriodOptions}
        enrollmentOptions={enrollmentOptions}
      />

      <ConductIncidentViewModal
        isOpen={isViewOpen}
        incidentId={viewingId}
        onClose={closeViewModal}
      />
    </div>
  );
}
