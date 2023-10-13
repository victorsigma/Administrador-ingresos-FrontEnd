import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { IngresoService } from 'src/app/Servicios/ingreso.service';

var bootstrap : any;
@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | undefined;
  showSpinner = false;
  showSecondModal = false;

  constructor(private ingresoService:IngresoService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.selectedFile) {
      this.showSpinner = true; // Muestra el spinner
      const formData = new FormData();
      formData.append('archivoExcel', this.selectedFile);
      setTimeout(() => {
        this.showSpinner = false;
        this.ingresoService.CargarReporteExel(formData).subscribe(
          data => {
            this.showSecondModal = true;
            console.log('Archivo cargado con éxito', data);
          },
          err=> {
            console.error('Error al cargar el archivo', err);
          }
        );
      },2000);
    } else {
      console.error('Debes seleccionar un archivo');
    }
  }

  ngAfterViewInit(): void {
    if (this.fileInput) {	
      this.fileInput.nativeElement.addEventListener('change', () => {
        const label = document.querySelector('label[for="customFile"]');
        if (label){
          if (this.fileInput?.nativeElement.files.length > 0) {
            label.textContent = this.fileInput?.nativeElement.files[0].name;
          } else {
            label.textContent = "Seleccionar Archivo";
          }
        }
      });
    }
  }
  
}