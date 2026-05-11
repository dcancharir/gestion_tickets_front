export interface ArticuloListItem {
  publicId:      string;
  titulo:        string;
  categoria:     string | null;
  creadoPor:     string;
  fechaCreacion: string;
  activo:        boolean;
}

export interface ArticuloDetalle {
  publicId:      string;
  titulo:        string;
  problema:      string;
  solucion:      string;
  categoria:     string | null;
  categoriaId:   number | null;
  creadoPor:     string;
  fechaCreacion: string;
  activo:        boolean;
}

export interface CrearArticuloDto {
  titulo:      string;
  problema:    string;
  solucion:    string;
  categoriaId: number | null;
}

export interface ActualizarArticuloDto {
  titulo:      string;
  problema:    string;
  solucion:    string;
  categoriaId: number | null;
  activo:      boolean;
}
