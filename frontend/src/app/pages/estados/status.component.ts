import { Component } from '@angular/core';
import { UserService } from 'src/app/core';
import {
  Status,
  StatusCreate,
  StatusDelete,
  StatusEdit,
  StatusResponse,
} from 'src/app/core/interfaces/status.interface';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import { StatusService } from 'src/app/core/services/status.service';
import { PrimeIcons } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent {
  private statuses: Status[] = [];
  get getStatus(): Status[] {
    return [...this.statuses];
  }
  visibleModal: boolean = false;
  deleteModal: boolean = false;
  label: string = 'Crear';
  header: string = '';
  action: string = '';
  message: string = '';
  messageResponse: string = '';
  rowCreate: StatusCreate = {
    nombre: '',
    color: '',
  };
  rowSelectedEdit: StatusEdit = {
    _id: '',
    nombre: '',
    color: '',
    creador_id: '',
    modificador_id: '',
    esta_eliminado: false,
    actualizado_a: new Date(),
  };
  rowSelectedDelete: StatusDelete = { _id: ''};
  columns: ColumnTable[] = [
    {
      name: 'Id',
      key: '_id',
      show: false,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Nombre',
      key: 'nombre',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Color',
      key: 'color',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Creador',
      key: 'creador_id',
      show: false,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'modificador',
      key: 'modificador_id',
      show: false,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Creado',
      key: 'creado_a',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Actualizado',
      key: 'actualizado_a',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Acciones',
      key: 'acciones',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
      hasEditButton: true,
      hasRemoveButton: true,
      hasCreateButton: true,
      edit: (row: StatusEdit) => {
        this.rowSelectedEdit = row;
        this.visibleModal = true;
        this.label = 'Guardar Cambios';
        this.header = 'Editar grupo';
        this.action = 'edit';
      },
      remove: (row: StatusDelete) => {
        this.rowSelectedDelete = row;
        this.label = 'Eliminar';
        this.header = 'Eliminar grupo';
        this.action = 'delete';
        this.message = `¿Está seguro que desea eliminar el grupo: ${row._id}?`;
        this.deleteModal = true;
      },
      create: () => {
        this.action = 'create';
        this.visibleModal = true;
        this.header = 'Crear grupo';
        this.label = 'Crear';
      },
      createIcon: PrimeIcons.PLUS,
      editIcon: PrimeIcons.PENCIL,
      removeIcon: PrimeIcons.TRASH,
    },
  ];
  

  constructor(
    private userService: UserService,
    private statusService: StatusService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.populate();
    this.fetchGroups();
  }

  fetchGroups(): void {
    this.statusService.getStatuses().subscribe({
      next: (response) => {
        this.statuses = this.statusService.materializeStatus(response);

      },
      error: (error) => console.error(error),
    });
  }

  filteredColums(): ColumnTable[] {
    let filteredColumns = this.columns.filter((column: ColumnTable) => column.show === true);

    return filteredColumns
  };

  onSubmitStatus(): void {
    this.visibleModal = false;
    this.deleteModal = false;
    if (this.action === 'edit') {
      this.statusService.editStatus(this.rowSelectedEdit).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => {
          this.toastr.error(error?.message, 'Error');
        },
      });
      this.rowSelectedEdit = {} as StatusEdit;
    }
    if (this.action === 'create') {
      this.statusService.createStatus(this.rowCreate).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
          this.fetchGroups();
        },
      });
      this.rowCreate = {} as StatusCreate;
    }
    if(this.action === 'delete'){
      this.statusService.deleteStatus(this.rowSelectedDelete._id).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedDelete = {} as StatusDelete;
    }
    this.fetchGroups();
  }

  createNewRecord(): void {
    this.action = 'create';
    this.visibleModal = true;
    this.header = 'Crear estado';
    this.label = 'Crear';
  }

  getObjectByAction(): StatusEdit | StatusCreate {
    return this.action === 'edit'  ? this.rowSelectedEdit : this.rowCreate;
  }

  columnsToDeleteByEdit: string[] = ['acciones', 'creado_a', 'actualizado_a', 'creador_id', 'modificador_id'];
  columnsToDeleteByCreate: string[] = ['acciones', 'creado_a', 'actualizado_a', 'creador_id', 'modificador_id', '_id'];
  getColumnsByAction(): ColumnTable[] {
    if(this.action === 'edit'){
      return this.columns.filter((column: ColumnTable) => !this.columnsToDeleteByEdit.includes(column.key));
    }
    return this.columns.filter((column: ColumnTable) => !this.columnsToDeleteByCreate.includes(column.key));
  }

}
