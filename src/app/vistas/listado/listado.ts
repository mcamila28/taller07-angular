import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomicilioService } from '../../services/domicilio.service';

@Component({
  selector: 'app-listado',
  imports: [RouterLink],
  templateUrl: './listado.html',
  styleUrl: './listado.css',
})
export class Listado {
  private readonly servicio = inject(DomicilioService);
  readonly estados = ['Pendiente', 'En ruta', 'Entregado'];

  // T08: ?estado=… llega como input() (withComponentInputBinding)
  readonly estado = input<string>();

  readonly visibles = computed(() => {
    const e = this.estado();
    const todos = this.servicio.domicilios();
    return e ? todos.filter((d) => d.estado === e) : todos;
  });
}
