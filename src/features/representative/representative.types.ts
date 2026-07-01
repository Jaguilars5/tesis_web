export interface RepresentadoT {
  studentId: number;
  name: string;
  sectionName: string | null;
}

/**
 * Forma flexible de la fila cruda devuelta por el backend. Como el endpoint
 * definitivo aún no está fijado, aceptamos los nombres de campo más probables
 * y los normalizamos en el servicio.
 */
export interface RepresentadoRawT {
  student?: number;
  student_id?: number;
  id?: number;
  student_name?: string;
  full_name?: string;
  name?: string;
  names?: string;
  last_names?: string;
  section_name?: string | null;
}

export interface RepresentativeSelfServiceT {
  getRepresentados(): Promise<RepresentadoT[]>;
}
