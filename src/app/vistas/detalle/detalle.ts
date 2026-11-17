// Vista de detalle por código
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomicilioService } from '../../services/domicilio.service';

@Component({
  selector: 'app-detalle',
  imports: [RouterLink],
  templateUrl: './detalle.html',
})
export class Detalle {
  private readonly servicio = inject(DomicilioService);

  // T08: /domicilios/:id → input() del mismo nombre
  readonly id = input.required<string>();

  readonly domicilio = computed(() =>
    this.servicio.domicilios().find((d) => d.codigo === this.id()),
  );
}
