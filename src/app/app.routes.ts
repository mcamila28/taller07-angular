import { Routes } from '@angular/router';
import { Listado } from './vistas/listado/listado';
import { Detalle } from './vistas/detalle/detalle';
import { Alta } from './vistas/alta/alta';
import { NoEncontrada } from './vistas/no-encontrada/no-encontrada';
import { Busqueda } from './busqueda/busqueda';

export const routes: Routes = [
  { path: '', redirectTo: 'domicilios', pathMatch: 'full' },
  { path: 'domicilios', component: Listado, title: 'Domicilios' },
  // «nuevo» y «buscar» van antes de :id; si no, se leerían como un código
  { path: 'domicilios/nuevo', component: Alta, title: 'Nuevo domicilio' },
  { path: 'domicilios/buscar', component: Busqueda, title: 'Buscar domicilios' },
  { path: 'domicilios/:id', component: Detalle, title: 'Detalle del domicilio' },
  {
    path: 'estadisticas',
    loadComponent: () => import('./vistas/estadisticas/estadisticas').then((m) => m.Estadisticas),
    title: 'Estadísticas',
  },
  { path: '**', component: NoEncontrada, title: 'Página no encontrada' },
];
