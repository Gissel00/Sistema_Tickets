import { Component, OnInit } from '@angular/core';
import { TicketService, UserService } from 'src/app/core';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import { Status } from 'src/app/core/interfaces/status.interface';
import { Ticket } from 'src/app/core/interfaces/ticket.interface';
import { StatusService } from 'src/app/core/services/status.service';
import { Subject, takeUntil } from 'rxjs';
import * as helper from '../../core/helpers';
import { LoadingService } from 'src/app/shared/loading';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styles: [`
    .table-container::-webkit-scrollbar {
        -webkit-appearance: none;
    }
    
    .table-container::-webkit-scrollbar:vertical {
        width:10px;
    }

    .table-container::-webkit-scrollbar-button:increment,.table-container::-webkit-scrollbar-button {
        display: none;
    } 
    
    .table-container::-webkit-scrollbar:horizontal {
        height: 10px;
    }
    
    .table-container::-webkit-scrollbar-thumb {
        background-color: #797979;
        border-radius: 20px;
        border: 2px solid #f1f2f3;
    }
    
    .table-container::-webkit-scrollbar-track {
        border-radius: 10px;  
    }
  `],
})
export class MyTicketsComponent implements OnInit {
  private tickets: Ticket[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  get getTickets(): Ticket[] {
    return [...this.tickets];
  }

  statuses: Status[] = [];
  selectedStatus: Status = {} as Status;

  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private status: StatusService,
    private loadingService: LoadingService,

  ) {}
  columns: ColumnTable[] = [
    {
      name: 'Id',
      key: '_id',
      show: true,
      routeLink: ['/tickets'],
    },
    {
      name: 'Asunto',
      key: 'asunto',
      show: true,
    },
    {
      name: 'Estado',
      key: 'estado',
      show: true,
    },
    {
      name: 'Prioridad',
      key: 'prioridad',
      show: true,
    },
    {
      name: 'Creador',
      key: 'creador',
      show: true,
    },
    {
      name: 'Categoria',
      key: 'categoria',
      show: true,
    },
    {
      name: 'Flujo',
      key: 'flujo',
      show: true,
    },
    {
      name: 'Creado',
      key: 'creado_a',
      show: true,
    },
  ];

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.userService.populate();
    this.fetchTickets();
    this.status
      .getStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.statuses = this.status.materializeStatus(response);
          this.loadingService.setLoading(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchTickets(): void {
    this.ticketService
      .getTickets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.tickets =
            this.ticketService.materializeResponseToTicket(response);
        },
      });
  }

  filterByStatus(): Ticket[] {
    if (
      !helper.isFullObjectAndValue(this.selectedStatus) ||
      helper.isNullOrUndefined(this.selectedStatus)
    ) {
      return [...this.getTickets];
    }
    return [
      ...this.getTickets.filter(
        (ticket) => ticket.estado === this.selectedStatus.nombre
      ),
    ];
  }
}
