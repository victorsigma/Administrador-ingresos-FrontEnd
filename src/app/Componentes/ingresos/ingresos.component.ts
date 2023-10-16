import { Component, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { IngresoService } from 'src/app/Servicios/ingreso.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent{
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | undefined;
  showSpinner = false;
  bsModalRef: BsModalRef | undefined;
  selectedFileName: string | undefined;
  reporteMensual: any;
  ocultarDatosMensuales = false;
  ocultarDatosDiarios = true;
  miFormulario: FormGroup;

  constructor(private ingresoService:IngresoService,private modalService: BsModalService, private fb: FormBuilder) {
    this.miFormulario = this.fb.group({
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const fechaInicioControl = group.get('fechaInicio');
    const fechaFinControl = group.get('fechaFin');

    if (fechaInicioControl && fechaFinControl) {
      const fechaInicio = fechaInicioControl.value;
      const fechaFin = fechaFinControl.value;

      if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
        return { dateRangeInvalid: true };
      }
    }

    return null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    // Actualizar el label del archivo seleccionado
    if (this.selectedFile) {
      this.selectedFileName = this.selectedFile.name;
    } else {
      this.selectedFileName = undefined; 
    }
  }

  onSubmit(event: Event,template2: TemplateRef<any>) {
    event.preventDefault();
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('archivoExcel', this.selectedFile);
      setTimeout(() => {
        this.showSpinner = false;
        this.ingresoService.CargarReporteExel(formData).subscribe(
          data => {
            console.log('Archivo cargado con éxito', data);
            this.reporteMensual=data
            this.closeModal()
            setTimeout(() => { 
              this.openModal2(template2);
            },500);
          },
          err=> {
            this.closeModal();
            console.error('Error al cargar el archivo', err);
          }
        );
      }, 2000);
    } else {
      console.error('Debes seleccionar un archivo');
    }
  }

  openModal1(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template,{
      backdrop: 'static',
      keyboard: false
    });
  }

  openModal2(template2: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template2, {
      backdrop: 'static',
      keyboard: false
    }); // Abre el segundo modal
  }
  
  closeModal() {
    this.clearFileInput(); 
    this.bsModalRef?.hide();
  }


  clearFileInput() {
      this.selectedFile = undefined; // Limpia la variable selectedFile
      this.selectedFileName = undefined; // Limpia el nombre del archivo seleccionado
  }
  
}