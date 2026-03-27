export interface OverallMetrics {
    total_boletos_vendidos: number;
    total_ingresos: number;
    total_comisiones_rp: number;
    boletos_activos: number;
    boletos_usados: number;
}

export interface RpMetrics {
    rp_id: number;
    username: string;
    boletos_vendidos: number;
    ingresos_totales: number;
    comisiones_totales: number;
}

export interface EventRpMetrics extends RpMetrics {}

export interface EventMetrics {
    evento_id: number;
    nombre: string;
    boletos_vendidos: number;
    ingresos_totales: number;
    comisiones_rp: number;
    boletos_activos: number;
    boletos_usados: number;
}

export interface PhaseMetrics {
    fase_id: number;
    nombre: string;
    precio: number;
    boletos_vendidos: number;
    ingresos_totales: number;
}
