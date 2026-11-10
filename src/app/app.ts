import { Component } from '@angular/core';
import { Busqueda } from './busqueda/busqueda';

@Component({
  selector: 'app-root',
  imports: [Busqueda],
  template: `<app-busqueda />`,
})
export class App {}
