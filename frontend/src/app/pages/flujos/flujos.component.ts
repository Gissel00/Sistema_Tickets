import { Component } from '@angular/core';
import { UserService } from 'src/app/core';
import {
  Flujo,
  FlujoCreate,
  FlujoDelete,
  FlujoEdit,
  FlujoResponse,
} from 'src/app/core/interfaces/flujo.interface';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import { FlujoService } from 'src/app/core/services/flujo.service';
import { PrimeIcons } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-flujos',
  templateUrl: './flujos.component.html',
})
export class FlujosComponent {
  private flujos: Flujo[] = [];
  get getFlujos(): Flujo[] {
    return [...this.flujos];
  }
  visibleModal: boolean = false;
  deleteModal: boolean = false;
  label: string = 'Crear';
  header: string = '';
  action: string = '';
  message: string = '';
  messageResponse: string = '';
  rowCreate: FlujoCreate = {
    nombre: '',
    tiempo_resolucion: 0,
    departamento: ''
  };
  rowSelectedEdit: FlujoEdit = {
    _id: '',
    nombre: '',
    tiempo_resolucion: 0,
    departamento: '',
    creador_id: '',
    modificador_id: '',
    actualizado_a: new Date(),
  };
  rowSelectedDelete: FlujoDelete = { _id: ''};
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
      name: 'Tiempo de Resolucion',
      key: 'tiempo_resolucion',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Departamento',
      key: 'departamento',
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
      edit: (row: FlujoEdit) => {
        this.rowSelectedEdit = row;
        this.visibleModal = true;
        this.label = 'Guardar Cambios';
        this.header = 'Editar grupo';
        this.action = 'edit';
      },
      remove: (row: FlujoDelete) => {
        this.rowSelectedDelete = row;
        this.label = 'Eliminar';
        this.header = 'Eliminar grupo';
        this.action = 'delete';
        this.message = `¿Está seguro que desea eliminar el flujo: ${row._id}?`;
        this.deleteModal = true;
      },
      create: () => {
        this.action = 'create';
        this.visibleModal = true;
        this.header = 'Crear Flujo';
        this.label = 'Crear';
      },
      createIcon: PrimeIcons.PLUS,
      editIcon: PrimeIcons.PENCIL,
      removeIcon: PrimeIcons.TRASH,
    },
  ];
  

  constructor(
    private userService: UserService,
    private flujoService: FlujoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.populate();
    this.fetchFlujos();
  }

  fetchFlujos(): void {
    this.flujoService.getFlujos().subscribe({
      next: (response) => {
        this.flujos = this.materializeFlujos(response);

      },
      error: (error) => console.error(error),
    });
  }

  createNewRecord(): void {
    this.action = 'create';
    this.visibleModal = true;
    this.header = 'Crear flujo';
    this.label = 'Crear';
  }

  filteredColums(): ColumnTable[] {
    let filteredColumns = this.columns.filter((column: ColumnTable) => column.show === true);
    return filteredColumns
  };

  materializeFlujos(flujos: FlujoResponse[]): Flujo[] {
    const flujoMaterialized: Flujo[] = [];
    flujos.forEach((flujo: FlujoResponse) => {
      flujoMaterialized.push({
        _id: flujo._id,
        nombre: flujo.nombre,
        tiempo_resolucion: flujo.tiempo_resolucion,
        departamento: flujo.departamento.nombreDepartamento,
        creador_id: flujo.creador_id,
        modificador_id: flujo.modificador_id,
        creado_a: new Date(flujo.creado_a).toLocaleDateString('es-ES'),
        actualizado_a: new Date(flujo.actualizado_a).toLocaleDateString('es-ES'),
      });
    }
    );
    return flujoMaterialized;
  }

  onSubmitFlujo(): void {
    this.visibleModal = false;
    this.deleteModal = false;
    if (this.action === 'edit') {
      this.flujoService.editFlujo(this.rowSelectedEdit).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedEdit = {} as FlujoEdit;
    }
    if (this.action === 'create') {
      this.flujoService.createFlujo(this.rowCreate).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
          this.fetchFlujos();
        },
      });
      this.rowCreate = {} as FlujoCreate;
    }
    if(this.action === 'delete'){
      this.flujoService.deleteFlujo(this.rowSelectedDelete._id).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedDelete = {} as FlujoDelete;
    }
    this.fetchFlujos();
  }

  getObjectByAction(): FlujoEdit | FlujoCreate {
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
