import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReportRequest, ReportResponse } from 'src/app/core/interfaces/report.interface';
import { HistoryTicketsService } from 'src/app/core/services/history.tickets.service';
import { Subscription, forkJoin } from 'rxjs';
import { LoadingService } from 'src/app/shared/loading';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
})
export class ReportingComponent {
  private destroySubscription$: Subscription;
  dateStart: Date;
  dateEnd: Date;
  data: ReportResponse[] = [];
  dataByDepto: ReportResponse[] = [];
  constructor(
    private historyService: HistoryTicketsService,
    private toastrt: ToastrService,
    private loadingService: LoadingService,

  ) {}

  exportToCsv(data: any[], fileName: string) {
    const separator = ',';
    const keys = Object.keys(data[0]);
    const csvContent = keys.join(separator) + '\n' + data.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
        cell = cell.replace(/"/g, '""');
        return '"' + cell + '"';
      }).join(separator);
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName + '.csv');
  }

  exportTicketReport(){
    if(this.data.length === 0){
      this.toastrt.error('Debe de generar un reporte para poder descargar los reportes.', 'Error'); 
    }
    this.exportToCsv(this.data, `tickets-reporte_${(new Date()).toLocaleString()}`);
  }

  exportTicketByDepartmentReport(){
    if(this.dataByDepto.length === 0){
      this.toastrt.error('Debe de generar un reporte para poder descargar los reportes.', 'Error'); 
    }
    this.exportToCsv(this.dataByDepto, `tickets-por-departamento_${(new Date()).toLocaleString()}`);
  }

  onGenerateReport(event: any) {
    event.preventDefault();
    this.loadingService.setLoading(true);
    const reportRequest: ReportRequest = {
      dateStart: this.dateStart,
      dateEnd: this.dateEnd,
    };

    if(this.dateStart == undefined || this.dateEnd == undefined) {
      this.loadingService.setLoading(false); 
      this.toastrt.error('Debe de ingresar la fecha de inicio y fin.', 'Error'); 

      return;
    } 
    const reportTickets$ = this.historyService.getReportTickets(reportRequest);
    const reportTicketsByDepto$ = this.historyService.getReportTicketsByDepto(reportRequest);

    this.destroySubscription$ = forkJoin([
      reportTickets$,
      reportTicketsByDepto$,
    ]).subscribe(
      {
        next: ([reportTicketsResponse, reportTicketsByDeptoResponse]) => {
          this.data = reportTicketsResponse;
          this.dataByDepto = reportTicketsByDeptoResponse;
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this.toastrt.error('No se pudieron cagar los datos', 'Error'); 
          this.loadingService.setLoading(false); 
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.destroySubscription$) {
      this.destroySubscription$.unsubscribe();
    }
  }


}
