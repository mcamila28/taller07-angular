# Taller 07 · Búsqueda reactiva de domicilios de medicamentos

COM30 · Programación con Frameworks para Web · 2026-III · Maria Rodriguez

## Escenario
Seguimiento de domicilios de medicamentos (ampliación del Taller 06). Cada registro tiene
código, barrio, producto y estado (Pendiente, En ruta, Entregado). La búsqueda mira los campos
**barrio** y **producto**, sin tildes ni mayúsculas, sobre el texto recortado con `trim()`.
Con menos de 2 caracteres no se consulta.

## Técnica
- `DomicilioService.buscar(texto)`: `Observable<Domicilio[]>` con `of(...).pipe(delay(...))`,
  retardo `max(150, 1500 − 300 × longitud)` ms; contador `llamadas` con `asReadonly()`.
- Componente `Busqueda`: `valueChanges → map(trim) → debounceTime(300) → distinctUntilChanged → switchMap`,
  `of([])` bajo 2 caracteres, `toSignal` con `initialValue: []`, filtro por estado con `signal` + `computed`,
  historial de 5 consultas con `takeUntilDestroyed()`, `@for` con `track` y `@empty`.
- Sin rutas, sin HttpClient, sin NgModule ni `*ngIf`.

## Ejecutar
```bash
npm install
npx ng serve      # http://localhost:4200
npx ng build      # compila sin errores
```

## Archivos del taller
- `src/app/models/domicilio.ts`
- `src/app/services/domicilio.service.ts`
- `src/app/busqueda/` (componente, plantilla y estilos)
- Repositorio: https://github.com/mcamila28/taller07-angular 
