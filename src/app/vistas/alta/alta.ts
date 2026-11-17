// Alta - Taller 08
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomicilioService } from '../../services/domicilio.service';
import { EstadoDomicilio } from '../../models/domicilio';

@Component({
  selector: 'app-alta',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './alta.html',
  styleUrl: './alta.css',
})
export class Alta {
  private readonly servicio = inject(DomicilioService);
  private readonly router = inject(Router);
  readonly estados: EstadoDomicilio[] = ['Pendiente', 'En ruta', 'Entregado'];

  readonly form = new FormGroup({
    barrio: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    producto: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    estado: new FormControl<EstadoDomicilio>('Pendiente', { nonNullable: true, validators: Validators.required }),
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const codigo = this.servicio.agregar({
      barrio: v.barrio.trim(),
      producto: v.producto.trim(),
      estado: v.estado,
    });
    // T08: navegación programática al detalle del registro creado
    this.router.navigate(['/domicilios', codigo]);
  }
}
