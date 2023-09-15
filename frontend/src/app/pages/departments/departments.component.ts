import { Component } from '@angular/core';
import { UserService } from 'src/app/core';
import {
  Department,
  DepartmentCreate,
  DepartmentDelete,
  DepartmentEdit,
  DepartmentResponse,
} from 'src/app/core/interfaces/department.interface';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import { DepartmentsService } from 'src/app/core/services/departments.service';
import { PrimeIcons } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
})
export class DepartmentsComponent {
  private departments: Department[] = [];
  get getDepartments(): Department[] {
    return [...this.departments];
  }
  visibleModal: boolean = false;
  deleteModal: boolean = false;
  label: string = 'Crear';
  header: string = '';
  action: string = '';
  message: string = '';
  messageResponse: string = '';
  rowCreate: DepartmentCreate = {
    nombreDepartamento: '',
    descripcion: '',
  };
  rowSelectedEdit: DepartmentEdit = {
    _id: '',
    nombreDepartamento: '',
    descripcion: '',
    creador_id: '',
    modificador_id: '',
    actualizado_a: new Date(),
  };
  rowSelectedDelete: DepartmentDelete = { _id: ''};
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
      key: 'nombreDepartamento',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Descripcion',
      key: 'descripcion',
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
      edit: (row: DepartmentEdit) => {
        this.rowSelectedEdit = row;
        this.visibleModal = true;
        this.label = 'Guardar Cambios';
        this.header = 'Editar departamento';
        this.action = 'edit';
      },
      remove: (row: DepartmentDelete) => {
        this.rowSelectedDelete = row;
        this.label = 'Eliminar';
        this.header = 'Eliminar departamento';
        this.action = 'delete';
        this.message = `¿Está seguro que desea eliminar el departamento: ${row._id}?`;
        this.deleteModal = true;
      },
      create: () => {
        this.action = 'create';
        this.visibleModal = true;
        this.header = 'Crear departamento';
        this.label = 'Crear';
      },
      createIcon: PrimeIcons.PLUS,
      editIcon: PrimeIcons.PENCIL,
      removeIcon: PrimeIcons.TRASH,
    },
  ];
  

  constructor(
    private userService: UserService,
    private departmentService: DepartmentsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.populate();
    this.fetchGroups();
  }

  fetchGroups(): void {
    this.departmentService.obtenerDepartamento().subscribe({
      next: (response) => {
        this.departments = this.materializeDepartments(response);
      },
      error: (error) => console.error(error),
    });
  }

  createNewRecord(): void {
    this.action = 'create';
    this.visibleModal = true;
    this.header = 'Crear grupo';
    this.label = 'Crear';
  }

  filteredColums(): ColumnTable[] {
    let filteredColumns = this.columns.filter((column: ColumnTable) => column.show === true);

    return filteredColumns
  };

  materializeDepartments(department: DepartmentResponse[]): Department[] {
    const departmentsMaterialized: Department[] = [];
    department.forEach((dept) => {
      departmentsMaterialized.push({
        _id: dept._id,
        nombreDepartamento: dept.nombreDepartamento,
        descripcion: dept.descripcion,
        creador_id: dept.creador_id,
        modificador_id: dept.modificador_id,
        creado_a: new Date(dept.creado_a).toLocaleDateString('es-ES'),
        actualizado_a: new Date(dept.actualizado_a).toLocaleDateString('es-ES'),
        esta_eliminado: dept.esta_eliminado
      });
    }
    );
    return departmentsMaterialized;
  }

  onSubmitGroup(): void {
    this.visibleModal = false;
    this.deleteModal = false;
    if (this.action === 'edit') {
      this.departmentService.editDepartment(this.rowSelectedEdit).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedEdit = {} as DepartmentEdit;
    }
    if (this.action === 'create') {
      this.departmentService.createDepartment(this.rowCreate).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
          this.fetchGroups();
        },
      });
      this.rowCreate = {} as DepartmentCreate;
    }
    if(this.action === 'delete'){
      this.departmentService.deleteDepartment(this.rowSelectedDelete._id).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedDelete = {} as DepartmentDelete;
    }
    this.fetchGroups();
  }

  getObjectByAction(): DepartmentEdit | DepartmentCreate {
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
