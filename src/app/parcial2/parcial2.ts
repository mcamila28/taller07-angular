import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, scan, switchMap } from 'rxjs';
import { Domicilio } from '../models/domicilio';
import { DomicilioService } from '../services/domicilio.service';
import { DESDE, M, PATRON_CODIGO, TOPE } from './parametros';
import { hastaMayor, multiplo } from './validadores';

interface Emision {
  valor: string;
  n: number;
}

@Component({
  selector: 'app-parcial2',
  imports: [ReactiveFormsModule],
  templateUrl: './parcial2.html',
})
export class Parcial2 {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly servicio = inject(DomicilioService);

  readonly M = M;
  readonly TOPE = TOPE;
  readonly enviado = signal(false);

 
  readonly form = this.fb.group({
    codigo: ['', [Validators.required, Validators.pattern(PATRON_CODIGO)]],
    cantidad: [M, [Validators.required, Validators.min(1), Validators.max(TOPE), multiplo(M)]],
    rango: this.fb.group(
      { desde: [DESDE], hasta: [DESDE + 1] },
      { validators: hastaMayor() },
    ),
  });

  mostrar(control: AbstractControl): boolean {
    return this.enviado() || control.touched || control.dirty;
  }

  enviar(): void {
    this.enviado.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { codigo, cantidad } = this.form.getRawValue();
    this.router.navigate(['/parcial2/detalle', codigo], { queryParams: { cantidad } });
  }

  readonly buscar = this.fb.control('');

  private readonly emisiones$ = this.buscar.valueChanges.pipe(
    map((texto) => texto.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    scan((acc: Emision, valor: string): Emision => ({ valor, n: acc.n + 1 }), { valor: '', n: 0 }),
  );


  readonly busqueda = toSignal(this.emisiones$, { initialValue: { valor: '', n: 0 } });

  readonly resultados = toSignal(
    toObservable(this.busqueda).pipe(switchMap((b) => this.servicio.buscar(b.valor))),
    { initialValue: [] as Domicilio[] },
  );
}