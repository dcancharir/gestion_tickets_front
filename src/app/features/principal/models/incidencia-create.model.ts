export interface IncidenciaCreate{
    titulo : string;
    descripcion : string;
    categoriaId : number;
    canalReporte : string;
    impacto : number;
    urgencia : number;
    prioridad : number;
}