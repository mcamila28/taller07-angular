import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  debounceTime, defer, distinctUntilChanged, filter, finalize, map, of, share, switchMap,
} from 'rxjs';
import { DomicilioService } from '../services/domicilio.service';
import { EstadoDomicilio } from '../models/domicilio';

type Filtro = 'Todos' | EstadoDomicilio;

@Component({
  selector: 'app-busqueda',
  imports: [ReactiveFormsModule],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda {
  private readonly servicio = inject(DomicilioService);

  readonly llamadas = this.servicio.llamadas;
  readonly estados: Filtro[] = ['Todos', 'Pendiente', 'En ruta', 'Entregado'];

  // 3. Campo de búsqueda
  readonly busqueda = new FormControl('', { nonNullable: true });

  // Texto recortado al instante (para el mensaje de mínimo 2 caracteres)
  readonly textoActual = toSignal(
    this.busqueda.valueChanges.pipe(map((t) => t.trim())),
    { initialValue: '' },
  );

  readonly buscando = signal(false);

  // 4. Tubería: trim → debounceTime(300) → distinctUntilChanged
  private readonly termino$ = this.busqueda.valueChanges.pipe(
    map((t) => t.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    share(),
  );

  // switchMap: descarta la respuesta anterior; < 2 caracteres no consulta
  private readonly resultado$ = this.termino$.pipe(
    switchMap((t) =>
      t.length < 2
        ? of([])
        : defer(() => {
            this.buscando.set(true);
            return this.servicio.buscar(t);
          }).pipe(finalize(() => this.buscando.set(false))),
    ),
  );

  // 5. Resultado con toSignal y valor inicial; filtro por estado
  readonly registros = toSignal(this.resultado$, { initialValue: [] });
  readonly filtro = signal<Filtro>('Todos');

  // 6. computed: lo visible, total y conteo por estado (no consultan)
  readonly visibles = computed(() => {
    const f = this.filtro();
    return f === 'Todos' ? this.registros() : this.registros().filter((d) => d.estado === f);
  });

  readonly resumen = computed(() => {
    const lista = this.visibles();
    const porEstado: Record<EstadoDomicilio, number> = { Pendiente: 0, 'En ruta': 0, Entregado: 0 };
    for (const d of lista) porEstado[d.estado]++;
    return { total: lista.length, porEstado };
  });

  readonly conteoResultado = computed(() => {
    const c: Record<Filtro, number> = { Todos: 0, Pendiente: 0, 'En ruta': 0, Entregado: 0 };
    for (const d of this.registros()) {
      c.Todos++;
      c[d.estado]++;
    }
    return c;
  });

  // Historial de las 5 últimas consultas (la más reciente primero)
  readonly historial = signal<string[]>([]);

  constructor() {
    this.termino$
      .pipe(
        filter((t) => t.length >= 2),
        takeUntilDestroyed(),
      )
      .subscribe((t) => this.historial.update((h) => [t, ...h].slice(0, 5)));
  }

  usarHistorial(t: string): void {
    this.busqueda.setValue(t);
  }
}
