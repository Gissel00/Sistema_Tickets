import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PrimeIcons } from 'primeng/api';
import { UserService } from 'src/app/core';
import {
  CategoriesResponse,
  Category,
  CategoryCreate,
  CategoryDelete,
  CategoryEdit,
} from 'src/app/core/interfaces/categories.interface';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styles: [],
})
export class CategoriesComponent {
  private categories: Category[] = [];
  get getCategories(): Category[] {
    return [...this.categories];
  }
  visibleModal: boolean = false;
  deleteModal: boolean = false;
  label: string = 'Crear';
  header: string = '';
  action: string = '';
  message: string = '';
  messageResponse: string = '';
  rowCreate: CategoryCreate = {} as CategoryCreate;
  rowSelectedEdit: CategoryEdit = {} as CategoryEdit;
  rowSelectedDelete: CategoryDelete = { _id: '' };
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
      name: 'Grupo',
      key: 'grupo_id',
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
      edit: (row: CategoryEdit) => {
        this.rowSelectedEdit = row;
        this.visibleModal = true;
        this.label = 'Guardar Cambios';
        this.header = 'Editar grupo';
        this.action = 'edit';
      },
      remove: (row: CategoryDelete) => {
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
    private categoryService: CategoriesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.populate();
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = this.categoryService.materializeCategories(response);
      },
      error: (error) => console.error(error),
    });
  }

  filteredColums(): ColumnTable[] {
    let filteredColumns = this.columns.filter(
      (column: ColumnTable) => column.show === true
    );

    return filteredColumns;
  }

  onSubmitCategory(): void {
    this.visibleModal = false;
    this.deleteModal = false;
    if (this.action === 'edit') {
      this.categoryService.editCategory(this.rowSelectedEdit).subscribe({
        next: (response) => {
          this.toastr.success('Se modifico el registro', 'Éxito');
          this.categories = this.categories.map(category => {
            if (category._id === response._id) {
              return {
                _id: response._id,
                nombre: response.nombre,
                color: response.color,
                grupo_id: response.grupo_id,
                creador_id: response.creador_id,
                modificador_id: response.modificador_id,
                creado_a: new Date(response.creado_a).toLocaleDateString('es-ES'),
                actualizado_a: new Date(response.actualizado_a).toLocaleDateString(
                  'es-ES'
                ),
              };
            }
            return category;
          });
        },
        error: (error) => {
          this.toastr.error(error?.message, 'Error');
        },
      });
      this.rowSelectedEdit = {} as CategoryEdit;
    }
    if (this.action === 'create') {
      this.categoryService.createCategory(this.rowCreate).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
          this.fetchCategories();
        },
      });
      this.rowCreate = {} as CategoryCreate;
    }
    if (this.action === 'delete') {
      this.categoryService
        .deleteCategory(this.rowSelectedDelete._id)
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message, 'Éxito');
            this.fetchCategories();
          },
          error: (error) => this.toastr.error(error?.error?.message, 'Error'),
        });
      this.rowSelectedDelete = {} as CategoryDelete;
    }
  }

  createNewRecord(): void {
    this.action = 'create';
    this.visibleModal = true;
    this.header = 'Crear estado';
    this.label = 'Crear';
  }

  getObjectByAction(): CategoryEdit | CategoryCreate {
    return this.action === 'edit' ? this.rowSelectedEdit : this.rowCreate;
  }

  columnsToDeleteByEdit: string[] = [
    'acciones',
    'creado_a',
    'actualizado_a',
    'creador_id',
    'modificador_id',
  ];
  columnsToDeleteByCreate: string[] = [
    'acciones',
    'creado_a',
    'actualizado_a',
    'creador_id',
    'modificador_id',
    '_id',
  ];
  getColumnsByAction(): ColumnTable[] {
    if (this.action === 'edit') {
      return this.columns.filter(
        (column: ColumnTable) =>
          !this.columnsToDeleteByEdit.includes(column.key)
      );
    }
    return this.columns.filter(
      (column: ColumnTable) =>
        !this.columnsToDeleteByCreate.includes(column.key)
    );
  }
}
