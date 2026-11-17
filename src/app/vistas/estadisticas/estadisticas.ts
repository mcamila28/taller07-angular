import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomicilioService } from '../../services/domicilio.service';

// T08: esta vista se carga con loadComponent (chunk aparte)
@Component({
  selector: 'app-estadisticas',
  imports: [RouterLink],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas {
  private readonly servicio = inject(DomicilioService);
  readonly total = computed(() => this.servicio.domicilios().length);

  readonly porEstado = computed(() => this.contar((d) => d.estado));
  readonly porBarrio = computed(() => this.contar((d) => d.barrio));

  private contar(clave: (d: { estado: string; barrio: string }) => string) {
    const mapa = new Map<string, number>();
    for (const d of this.servicio.domicilios()) mapa.set(clave(d), (mapa.get(clave(d)) ?? 0) + 1);
    return [...mapa.entries()].map(([nombre, cantidad]) => ({ nombre, cantidad }));
  }
}
