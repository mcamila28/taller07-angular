import { Component, computed, input, numberAttribute } from '@angular/core';
import { M, PATRON_CODIGO, TOPE } from '../parametros';

@Component({
  selector: 'app-detalle-parcial',
  templateUrl: './detalle-parcial.html',
})
export class DetalleParcial {
 
  readonly codigo = input.required<string>();
  readonly cantidad = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });

  readonly valido = computed(() => PATRON_CODIGO.test(this.codigo()));
  readonly bloques = computed(() => this.cantidad() / M);
  readonly margen = computed(() => TOPE - this.cantidad());
}