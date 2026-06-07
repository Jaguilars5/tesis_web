import { useState } from "react";
import { AcademicSubnivelTable } from "../components/form/AcademicSubnivelTable";
import { AcademicSubnivelFormModal } from "../components/form/AcademicSubnivelFormModal";
import type { AcademicSubnivelT } from "../domain/entities/academic-subnivel.types";

const AcademicSubnivelPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubnivel, setEditingSubnivel] = useState<AcademicSubnivelT | null>(null);

  const handleEdit = (subnivel: AcademicSubnivelT) => {
    setEditingSubnivel(subnivel);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingSubnivel(null);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Institución
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900">
            Subniveles Académicos
          </h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          Nuevo Subnivel
        </button>
      </div>
      <AcademicSubnivelTable onEdit={handleEdit} />
      <AcademicSubnivelFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editingSubnivel={editingSubnivel}
      />
    </div>
  );
};

export default AcademicSubnivelPage;
