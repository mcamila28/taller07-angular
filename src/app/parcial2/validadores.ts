import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Validador de control: el valor debe ser múltiplo de m. */
export function multiplo(m: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = Number(control.value);
    return valor % m === 0 ? null : { multiplo: { m, actual: valor } };
  };
}

export function hastaMayor(campoDesde = 'desde', campoHasta = 'hasta'): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const desde = Number(grupo.get(campoDesde)?.value);
    const hasta = Number(grupo.get(campoHasta)?.value);
    return hasta > desde ? null : { hastaMayor: { desde, hasta } };
  };
}