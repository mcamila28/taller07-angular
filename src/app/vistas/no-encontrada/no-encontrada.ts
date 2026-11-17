import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  template: `
    <section class="tarjeta">
      <h1>404 · Página no encontrada</h1>
      <p>La dirección <code>{{ direccion }}</code> no existe en la aplicación.</p>
      <a class="boton" routerLink="/domicilios">Ir al listado de domicilios</a>
    </section>
  `,
})
export class NoEncontrada {
  readonly direccion = inject(Router).url;
}
