import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
declare var pdfjsLib: any;

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements AfterViewInit {
  @ViewChild('pdfFileInput') pdfFileInput: ElementRef | undefined;
  @ViewChild('pdfText') pdfText: ElementRef | undefined;

  ngAfterViewInit(): void {
    if (this.pdfFileInput) {
      this.pdfFileInput.nativeElement.addEventListener('change', (event: any) => {
        const file = event.target.files[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = (loadEvent: any) => {
            const result = loadEvent.target.result;
            if (result instanceof ArrayBuffer) {
              const typedarray = new Uint8Array(result);
              pdfjsLib.getDocument({ data: typedarray }).promise.then((pdf: any) => {
                let pdfText = '';

                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                  pdf.getPage(pageNumber).then((page: any) => {
                    return page.getTextContent();
                  }).then((textContent: any) => {
                    for (let item of textContent.items) {
                      pdfText += item.str + ' ';
                    }

                    if (pageNumber === pdf.numPages) {
                      if (this.pdfText) {
                        this.pdfText.nativeElement.textContent = pdfText;

                        const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/; 
                        const subTotalRegex = /SUB-TOTAL:\s+([\d,]+\.\d{2})/;
                        const referenciaRegex = /BBVA BANCOMER.*? (\d{20})/;
                        const cfdiRegex = /FACTURA\s+([a-fA-F\d-]+)/;
                        const m3Regex = /REAL ([\d,]+\.\d{2})/;

                        const dateMatch = pdfText.match(dateRegex);
                        const amountMatch = pdfText.match(subTotalRegex);
                        const referneceMach = pdfText.match(referenciaRegex);
                        const cfdiMatch = pdfText.match(cfdiRegex);
                        const m3Match = pdfText.match(m3Regex);

                        if ( amountMatch && referneceMach && dateMatch && m3Match && cfdiMatch) {
                            const fecha = dateMatch[0];
                            const recepcion = amountMatch[1];
                            const referencia = referneceMach[1];
                            const cfdi = cfdiMatch[1];
                            const m3corregidos = m3Match[1];
                            console.log(`CFDI : ${cfdi}`);
                            console.log(`Referencia : ${referencia}`);
                            console.log(`Fecha: ${fecha}`);
                            console.log(`M3Corregidos: ${m3corregidos}`);
                            console.log(`Sub-Total: ${recepcion}`);
                        } else {
                            console.log("No se encontró la información del cfdi");
                        }
                      }
                    }
                  });
                }
              });
            } else {
              console.error('No se pudo leer el archivo como ArrayBuffer.');
            }
          };

          reader.readAsArrayBuffer(file);
        }
      });
    }
  }

}

  

