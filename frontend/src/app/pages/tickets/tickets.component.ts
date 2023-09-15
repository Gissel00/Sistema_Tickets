import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TicketService, UserService } from 'src/app/core';
import {
  CommentCreate,
  CommentResponse,
} from 'src/app/core/interfaces/comment.interface';
import {
  HistoryResponse,
  Ticket,
  TicketPostResponse, 
  UpdateTicketStatus,
  historyRequest,
  HistoryTable
} from 'src/app/core/interfaces/ticket.interface';
import { CommentService } from 'src/app/core/services/comment.service';
import { FlujoService } from 'src/app/core/services/flujo.service';
import { HistoryTicketsService } from 'src/app/core/services/history.tickets.service';
import { Flujo } from 'src/app/core/interfaces/flujo.interface';
import { DepartmentsService } from 'src/app/core/services/departments.service';
import { Department } from 'src/app/core/interfaces/department.interface';
import { GetAllUserResponse } from 'src/app/core/interfaces/user.interface';
import * as helper from '../../core/helpers';
import { Status } from 'src/app/core/interfaces/status.interface';
import { StatusService } from 'src/app/core/services/status.service';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import { FileStorageServices } from 'src/app/core/services/file.storage.service';
import { ViewChild, ElementRef } from "@angular/core";
import { FileMetadata } from 'src/app/core/interfaces/files.storage.interfaces';
import { saveAs } from 'file-saver';
import { LoadingService } from 'src/app/shared/loading/index';
import { Subscription, forkJoin, take } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent implements OnInit {
  private servicesSubcription$: Subscription[] = [];
  @ViewChild("inputFile", {static: false})
  inputFile: ElementRef

  ticket: Ticket = {} as Ticket;
  comments: CommentResponse[] = [];
  comment: string = '';
  showReasignModal: boolean = false;
  showHistoryModal: boolean = false;
  showChangeStatusModal: boolean = false;
  history: HistoryResponse[] = [];
  historyTable: HistoryTable[] = []
  flujos: Flujo[] = [];
  Departments: Department[]= [];
  attachments: FileMetadata[] = [];
  selectedDepartment: Department;

  selectedStatus: Status = {} as Status;

  selectedFlujo: Flujo = {} as Flujo;
  selectedHistory: HistoryResponse = {} as HistoryResponse;
  Users: GetAllUserResponse[] = []

  statuses: Status[] = [];
  totalTimeResolution: string = '';
  expectedResolutionTime: string = '';

  selectedUser: GetAllUserResponse = {} as GetAllUserResponse;

  ticketPadded: string = '';
  ticketResponse: TicketPostResponse = {} as TicketPostResponse;
  ticketStatusColor: string = '';

  fileToUpload: File;

  shortLink: string = "";
  userProfileImage: any;

  columns: ColumnTable[] = [
    {
      name: 'Ticket Id',
      key: 'ticket_id',
      show: true,
    },
    {
      name: 'Departamento',
      key: 'departamento_id',
      show: true,
    },
    {
      name: 'Creador',
      key: 'creador_id',
      show: false,
    },
    {
      name: 'Asignado',
      key: 'asignado_id',
      show: true,
    },
    {
      name: 'Modificador',
      key: 'modificador_id',
      show: false,
    },
    {
      name: 'Creado',
      key: 'creado_a',
      show: true,
    },
    {
      name: 'Completado',
      key: 'compleado_a',
      show: true,
    },
    {
      name: 'Actualizado',
      key: 'actualizado_a',
      show: false,
    },
    {
      name: 'Tiempo Estimado Resolucion',
      key: 'tiempoEstimadoResolucion',
      show: false,
    },
    {
      name: 'Tiempo Real Resolucion',
      key: 'tiempoRealResolucion',
      show: true,
    }
  ];

  get getHistory(): HistoryTable[] {
    return [...this.historyTable];
  }

  constructor(
    private ticketService: TicketService,
    private commentService: CommentService,
    private flujoService: FlujoService,
    private historyService: HistoryTicketsService,
    private departmentServices: DepartmentsService,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private statusService: StatusService,
    private storageService: FileStorageServices,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.servicesSubcription$.push(
      this.activeRoute.params.subscribe((params) => {
        this.servicesSubcription$.push(
          this.ticketService.getTicketById(params['id']).subscribe((ticket) => {
            this.ticketStatusColor = ticket.estado_id.color || '';
            this.ticket = this.ticketService.materializeResponseToTicketById(ticket);
            this.ticketPadded = (this.ticket._id.toString()).padStart(5,"0");
            this.getTicketAttachements();

            this.storageService.downloadProfileImg(this.ticket.foto_perfil).subscribe(img =>{
              const blob_data: Blob = new Blob([img], {
                type: "image/jpeg"
              });
              const reader = new FileReader();
              reader.readAsDataURL(blob_data);
              reader.onloadend = () => {
                const base64data = reader.result?.toString();
                this.userProfileImage = base64data;
                };
              });
          })
        )
        this.servicesSubcription$.push(
          this.commentService
          .getCommentsByTicketId(params['id'])
          .subscribe((comments) => {
            this.comments = comments;
            this.comments.forEach(data => {
              this.storageService.downloadProfileImg(data.creador.foto_perfil).subscribe(img =>{
                const blob_data: Blob = new Blob([img], {
                  type: "image/jpeg"
                });
                const reader = new FileReader();
                reader.readAsDataURL(blob_data);
                reader.onloadend = () => {
                  const base64data = reader.result?.toString();
                  data.img_url = base64data;
                };
              });
            });
          })
        )
        this.servicesSubcription$.push(
          this.historyService.getHistoryByTicket(parseInt(params['id'])).subscribe((history) => {
            this.history = history;
          })
        )
      })
    )

    const flujos$ = this.flujoService.getFlujos();
    const departments$ = this.departmentServices.getDepartments();
    const users$ = this.userService.getAllUsers(); 
    const statuses$ = this.statusService.getStatuses();

    this.servicesSubcription$.push(
      forkJoin([flujos$, departments$, users$, statuses$]).subscribe({
        next: ([flujosResponse, departmentsResponse, usersResponse, statusesResponse]) => {
          this.flujos = this.flujoService.materializeFlujos(flujosResponse);
          this.Departments = this.departmentServices.materializeResponseToDepartments(departmentsResponse);
          this.Users = (usersResponse);
          this.statuses = this.statusService.materializeStatus(statusesResponse);
        },
        error: error => this.toastr.error('Error al cargar los datos', 'Error')
      
      })
    );
    this.loadingService.setLoading(false);
  }

  ngOnDestroy(): void {
    this.servicesSubcription$.forEach(sub => sub.unsubscribe());
  }

  getLatestComments(){
    this.commentService
          .getCommentsByTicketId(this.ticket._id.toString())
          .subscribe((comments) => {
            this.comments = comments;
            this.comments.forEach(data => {
              this.storageService.downloadProfileImg(data.creador.foto_perfil).subscribe(img =>{
                const blob_data: Blob = new Blob([img], {
                  type: "image/jpeg"
                });
                const reader = new FileReader();
                reader.readAsDataURL(blob_data);
                reader.onloadend = () => {
                  const base64data = reader.result?.toString();
                  data.img_url = base64data;
                };
              });
            });
          })
  }
  showHistoryTicket() {
    this.servicesSubcription$.push(
      this.historyService.getHistoryByTicket(this.ticket._id).subscribe((history) => {
        this.historyTable = this.historyService.assignTimeResolution(history, this.flujos, this.ticket);
        this.expectedResolutionTime = this.historyTable[0].tiempoEstimadoResolucion || '';
        this.totalTimeResolution = this.historyTable.map(h => {
          if(h.tiempoRealResolucion){
            return parseFloat(h.tiempoRealResolucion);
          }
          return 0;
        }).reduce((a,b) => a + b, 0).toFixed(2);
        this.showHistoryModal = true;
      })
    )
  }

  filteredColums(){
    return this.columns.filter((column: ColumnTable) => column.show);
  }

  onSubmitComment(event: any) {
    event.preventDefault();
    const request: CommentCreate = {
      asunto: this.ticket.asunto,
      contenido: this.comment,
      ticket: this.ticket._id,
      img_url: this.userProfileImage
    };
    this.servicesSubcription$.push(
      this.commentService.createComment(request).subscribe((comment) => {
        this.toastr.success(comment.message, 'Exito');
        this.getLatestComments();
        this.comment = '';
      })
    )
  }

  onShowReasignModal():void{
    this.showReasignModal = true;
  }

  async onReasignTicket() {

    const isSelectedDepartment = this.selectedDepartment != undefined;

    const request: historyRequest = {
      ticket_id: this.ticket._id,
      departamento_id: this.getDepartmentId(isSelectedDepartment),
      asignado_id: this.selectedUser._id,
    };

    if (!isSelectedDepartment) {
      this.servicesSubcription$.push(
        this.historyService.reasignTicketToUser(request).subscribe((response) => {
          this.toastr.success(response.message, 'Exito');
          this.showReasignModal = false;
        })
      )
      return;
    }

    if (!helper.isFullObjectAndValue(request)) return;
    this.servicesSubcription$.push(
      this.historyService.completeTicketActivity(this.ticket._id).subscribe((res) => {
        this.showReasignModal = false;
  
        this.servicesSubcription$.push(
          this.historyService.crearNuevaActividad(request).subscribe((response) => {
            this.toastr.success(response.message, 'Exito');
            this.showReasignModal = false;
          })
        )
      })
    )
  }

  getDepartmentId(isSelectedDepartment: boolean):string{
    if(!isSelectedDepartment){
      const historyCopy = [...this.history];
      const getDepartmentDefault = historyCopy.filter(h => h.ticket_id._id === this.ticket._id)
        .sort((a,b) => a.actualizado_a > b.actualizado_a ? -1 : 1)
        .reverse()[0]?.departamento_id._id;

      return getDepartmentDefault;
    }
    return this.selectedDepartment._id;
  }


onStatusChangeTicket():void{
  let update: UpdateTicketStatus = {
    estado_id: this.selectedStatus._id
  }
  if(this.selectedStatus.nombre === 'Completado' ){
    this.servicesSubcription$.push(
      this.historyService.completeTicketActivity(this.ticket._id).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Ticket cerrado'); 
        },
        error: (err) => this.toastr.error(err?.message, 'Error al cerrar ticket')
      })
    )
  }
  this.servicesSubcription$.push(
    this.ticketService.updateTicket(this.ticket._id, update)
    .subscribe({
      next: (response) => {
        this.ticketResponse = response;
        this.toastr.success(this.ticketResponse?.message, 'Ticket creado');
        this.ticket.estado = this.selectedStatus.nombre;
        this.ticketStatusColor = this.selectedStatus.color;
        this.showChangeStatusModal = false;
      },
      error: (err) => {
        this.toastr.error(err?.message, 'Error al crear ticket');
        this.showChangeStatusModal = false;
      },
    })
  )
}

onShowStatusChangeModal():void{
  this.showChangeStatusModal = true;
}

getDateCreatorJoined(): string {
    const names = this.ticket?.creador?.split(' ');
    if(helper.isNullOrWhitespace(names)) return ''; 
    const users = this.Users?.find(user => names.includes(user.nombres) || names.includes(user.apellidos));
    return new Date(users?.creado_a!).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric'});
}

onFileUpload(): void {
  
  const hasFile = this.inputFile.nativeElement.value != "";

  if(!hasFile){
    this.toastr.error('Debe seleccionar un archivo.');
    return;
  };

  this.loadingService.setLoading(true);

  this.servicesSubcription$.push(
    this.storageService.uploadFile(this.ticket._id, this.fileToUpload).subscribe({
      next: (response)=>{
        this.loadingService.setLoading(false);
        this.toastr.success(response?.message, 'Se subio el archivo!');
        this.inputFile.nativeElement.value = "";
        this.fileToUpload = this.inputFile.nativeElement;
        this.getTicketAttachements();
      },
      error: (err) =>{
        this.loadingService.setLoading(false);
        this.toastr.error(err?.message, 'Error al subir el archivo.');
      }
    })
  )
}

onFileDownload(file: any){
  this.loadingService.setLoading(true);
  this.servicesSubcription$.push(
    this.storageService.downloadFile(file._id).subscribe({
      next: (response)=>{
        const data: Blob = new Blob([response], {
          type: file.fileContentType
        });
        saveAs(data, file.fileNameAndExtension);
        this.loadingService.setLoading(false);
        this.toastr.success(response?.message, 'Se descargo el archivo exitosamente.!');
      },
      error: (err) =>{
        this.loadingService.setLoading(false);
        this.toastr.error(err?.message, 'Error al descargar el archivo.');
      }
    })
  )
}

onFileFormChange(event: any) {
  this.fileToUpload = event.target.files[0];
}

getTicketAttachements(){
  this.loadingService.setLoading(true);
  this.servicesSubcription$.push(
    this.storageService.getListOfFiles(this.ticket._id).subscribe({
      next: (response) => {
        this.attachments = this.storageService.materilizeFileReponse(response);
        this.loadingService.setLoading(false);
      },
      error: (err) =>{
        this.toastr.error(err?.message, 'Error al subir el archivo.');
        this.loadingService.setLoading(false);
      }
    })
  )
}

}
