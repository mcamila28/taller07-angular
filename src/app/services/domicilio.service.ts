import { Injectable, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Domicilio } from '../models/domicilio';

/** Quita tildes y pasa a minúsculas (condición 3). */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

@Injectable({ providedIn: 'root' })
export class DomicilioService {
  // 1. Semilla: 12 registros, 3 estados (tabla A del informe)
  private readonly _domicilios = signal<Domicilio[]>([
    { codigo: 'D01', barrio: 'Villa Country',  producto: 'Acetaminofén', estado: 'Pendiente' },
    { codigo: 'D02', barrio: 'Boston',         producto: 'Losartán',     estado: 'En ruta' },
    { codigo: 'D03', barrio: 'Villa Carolina', producto: 'Insulina',     estado: 'Entregado' },
    { codigo: 'D04', barrio: 'El Prado',       producto: 'Acetaminofén', estado: 'Entregado' },
    { codigo: 'D05', barrio: 'Villa Santos',   producto: 'Metformina',   estado: 'Pendiente' },
    { codigo: 'D06', barrio: 'Centro',         producto: 'Insulina',     estado: 'En ruta' },
    { codigo: 'D07', barrio: 'Villa Country',  producto: 'Losartán',     estado: 'Pendiente' },
    { codigo: 'D08', barrio: 'Boston',         producto: 'Metformina',   estado: 'En ruta' },
    { codigo: 'D09', barrio: 'Villa Carolina', producto: 'Ibuprofeno',   estado: 'Entregado' },
    { codigo: 'D10', barrio: 'Centro',         producto: 'Acetaminofén', estado: 'En ruta' },
    { codigo: 'D11', barrio: 'El Prado',       producto: 'Losartán',     estado: 'Pendiente' },
    { codigo: 'D12', barrio: 'Villa Santos',   producto: 'Ibuprofeno',   estado: 'En ruta' },
  ]);
  readonly domicilios = this._domicilios.asReadonly();

  // Contador de consultas: privado y expuesto de solo lectura
  private readonly _llamadas = signal(0);
  readonly llamadas = this._llamadas.asReadonly();

  /** 2. Busca en barrio y producto. Retardo: max(150, 1500 − 300 × longitud). */
  buscar(texto: string): Observable<Domicilio[]> {
    this._llamadas.update((n) => n + 1);
    const t = normalizar(texto.trim());
    const retardo = Math.max(150, 1500 - 300 * t.length);
    const resultado = this._domicilios().filter(
      (d) => normalizar(d.barrio).includes(t) || normalizar(d.producto).includes(t),
    );
    return of(resultado).pipe(delay(retardo));
  }
}
