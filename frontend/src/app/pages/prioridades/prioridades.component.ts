import { Component } from '@angular/core';
import { UserService } from 'src/app/core';
import {
  Priority,
  PriorityCreate,
  PriorityDelete,
  PriorityEdit,
  PriorityResponse,
} from 'src/app/core/interfaces/priority.interface';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import { PriorityService } from 'src/app/core/services/priority.service';
import { PrimeIcons } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prioridades',
  templateUrl: './prioridades.component.html',
})
export class PrioridadesComponent {
  private priorities: Priority[] = [];
  get getPriorities(): Priority[] {
    return [...this.priorities];
  }
  visibleModal: boolean = false;
  deleteModal: boolean = false;
  label: string = 'Crear';
  header: string = '';
  action: string = '';
  message: string = '';
  messageResponse: string = '';
  rowCreate: PriorityCreate = {
    nombre: '',
    color: '',
  };
  rowSelectedEdit: PriorityEdit = {
    _id: '',
    nombre: '',
    color: '',
    creador_id: '',
    modificador_id: '',
    esta_eliminado: false,
    actualizado_a: new Date(),
  };
  rowSelectedDelete: PriorityDelete = { _id: ''};
  
  columns: ColumnTable[] = [
    {
      name: 'Id',
      key: '_id',
      show: false,
      isAvailableOnCreation: false,
      isAvailableOnEdit: true
    },
    {
      name: 'Nombre',
      key: 'nombre',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true
    },
    {
      name: 'Color',
      key: 'color',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true
    },
    {
      name: 'Creador',
      key: 'creador_id',
      show: false,
      isAvailableOnCreation: false,
      isAvailableOnEdit: false
    },
    {
      name: 'modificador',
      key: 'modificador_id',
      show: false,
      isAvailableOnCreation: false,
      isAvailableOnEdit: false
    },
    {
      name: 'Creado',
      key: 'creado_a',
      show: true,
      isAvailableOnCreation: false,
      isAvailableOnEdit: false
    },
    {
      name: 'Actualizado',
      key: 'actualizado_a',
      show: true,
      isAvailableOnCreation: false,
      isAvailableOnEdit: false
    },{
      name: 'Elimado',
      key: 'esta_eliminado',
      show: false,
      isAvailableOnCreation: false,
      isAvailableOnEdit: false
    },
    {
      name: 'Acciones',
      key: 'acciones',
      isAvailableOnCreation: false,
      isAvailableOnEdit: false,
      show: true,
      hasEditButton: true,
      hasRemoveButton: true,
      hasCreateButton: true,
      edit: (row: PriorityEdit) => {
        this.rowSelectedEdit = row;
        this.visibleModal = true;
        this.label = 'Guardar Cambios';
        this.header = 'Editar prioridad';
        this.action = 'edit';
      },
      remove: (row: PriorityDelete) => {
        this.rowSelectedDelete = row;
        this.label = 'Eliminar';
        this.header = 'Eliminar prioridad';
        this.action = 'delete';
        this.message = `¿Está seguro que desea eliminar la prioridad: ${row._id}?`;
        this.deleteModal = true;
      },
      create: () => {
        this.action = 'create';
        this.visibleModal = true;
        this.header = 'Crear prioridad';
        this.label = 'Crear';
      },
      createIcon: PrimeIcons.PLUS,
      editIcon: PrimeIcons.PENCIL,
      removeIcon: PrimeIcons.TRASH,
    },
  ];

  constructor(
    private userService: UserService,
    private priorityService: PriorityService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.populate();
    this.fetchPriorities();
  }

  fetchPriorities(): void {
    this.priorityService.getPriorities().subscribe({
      next: (response) => {
        this.priorities = this.priorityService.materializePriorities(response);
      },
      error: (error) => console.error(error),
    });
  }

  filteredColumns(): ColumnTable[] {
    let filteredColumns = this.columns.filter((column: ColumnTable) => column.show === true);

    return filteredColumns
  };

  createNewRecord(): void {
    this.action = 'create';
    this.visibleModal = true;
    this.header = 'Crear prioridad';
    this.label = 'Crear';
  }

  onSubmitPriority(): void {
    this.visibleModal = false;
    this.deleteModal = false;
    if (this.action === 'edit') {
      this.priorityService.editPriority(this.rowSelectedEdit).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedEdit = {} as PriorityEdit;
    }
    if (this.action === 'create') {
      this.priorityService.createPriority(this.rowCreate).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
          this.fetchPriorities();
        },
      });
      this.rowCreate = {} as PriorityCreate;
    }
    if(this.action === 'delete'){
      this.priorityService.deletePriority(this.rowSelectedDelete._id).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedDelete = {} as PriorityDelete;
    }
    this.fetchPriorities();
  }

  getObjectByAction(): PriorityEdit | PriorityCreate {
    return this.action === 'edit'  ? this.rowSelectedEdit : this.rowCreate;
  }


  getColumnsByAction(): ColumnTable[] {
    if(this.action === 'edit'){

      return this.columns.filter((column: ColumnTable) => column.isAvailableOnEdit === true);
      
    }
      return this.columns.filter((column: ColumnTable) => column.isAvailableOnCreation === true);
  }

}
