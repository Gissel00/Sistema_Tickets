import { Component } from '@angular/core';
import { UserService } from 'src/app/core';
import {
  Horario,
  HorarioCreate,
  HorarioDelete,
  HorarioEdit,
  HorarioResponse,
} from 'src/app/core/interfaces/horario.interface';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import { HorarioService } from 'src/app/core/services/horario.service';
import { PrimeIcons } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
})
export class HorariosComponent {
  private horarios: Horario[] = [];
  get getHorarios(): Horario[] {
    return [...this.horarios];
  }
  visibleModal: boolean = false;
  deleteModal: boolean = false;
  label: string = 'Crear';
  header: string = '';
  action: string = '';
  message: string = '';
  messageResponse: string = '';
  rowCreate: HorarioCreate = {
    horaFinal: 0,
    horaInicio: 0,
    incluyeFinesDeSemana: false
  };
  rowSelectedEdit: HorarioEdit = {
    _id: '',
    horaInicio: 0,
    horaFinal: 0,
    incluyeFinesDeSemana: false,
    creado_a: '',
    actualizado_a : ''
  };
  rowSelectedDelete: HorarioDelete = { _id: ''};
  columns: ColumnTable[] = [
    {
      name: 'Id',
      key: '_id',
      show: false,
      isAvailableOnCreation: false,
      isAvailableOnEdit: true,
    },
    {
      name: 'Hora Inicio',
      key: 'horaInicio',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Hora Final',
      key: 'horaFinal',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Incluye Fin de Semana',
      key: 'incluyeFinesDeSemana',
      show: true,
      isAvailableOnCreation: true,
      isAvailableOnEdit: true,
    },
    {
      name: 'Creado',
      key: 'creado_a',
      show: true,
      isAvailableOnCreation: false,
      isAvailableOnEdit: false,
    },
    {
      name: 'Actualizado',
      key: 'actualizado_a',
      show: true,
      isAvailableOnCreation: false,
      isAvailableOnEdit: false,
    },
    {
      name: 'Acciones',
      key: 'acciones',
      show: true,
      isAvailableOnCreation: false,
      isAvailableOnEdit: false,
      hasEditButton: true,
      hasRemoveButton: true,
      hasCreateButton: true,
      edit: (row: HorarioEdit) => {
        this.rowSelectedEdit = row;
        this.visibleModal = true;
        this.label = 'Guardar Cambios';
        this.header = 'Editar horario';
        this.action = 'edit';
      },
      remove: (row: HorarioDelete) => {
        this.rowSelectedDelete = row;
        this.label = 'Eliminar';
        this.header = 'Eliminar horario';
        this.action = 'delete';
        this.message = `¿Está seguro que desea eliminar el horario: ${row._id}?`;
        this.deleteModal = true;
      },
      create: () => {
        this.action = 'create';
        this.visibleModal = true;
        this.header = 'Crear Horario';
        this.label = 'Crear';
      },
      createIcon: PrimeIcons.PLUS,
      editIcon: PrimeIcons.PENCIL,
      removeIcon: PrimeIcons.TRASH,
    },
  ];
  

  constructor(
    private userService: UserService,
    private horarioService: HorarioService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.populate();
    this.fetchHorarios();
  }

  fetchHorarios(): void {
    this.horarioService.getHorarios().subscribe({
      next: (response) => {
        this.horarios = this.materializeHorarios(response);

      },
      error: (error) => console.error(error),
    });
  }

  createNewRecord(): void {
    this.action = 'create';
    this.visibleModal = true;
    this.header = 'Crear horario';
    this.label = 'Crear';
  }

  filteredColums(): ColumnTable[] {
    let filteredColumns = this.columns.filter((column: ColumnTable) => column.show === true);
    return filteredColumns
  };

  materializeHorarios(horarios: HorarioResponse[]): Horario[] {
    const horarioMaterialized: Horario[] = [];
    horarios.forEach((horario: HorarioResponse) => {
      horarioMaterialized.push({
        _id: horario._id,
        horaInicio: horario.horaInicio,
        horaFinal: horario.horaFinal,
        incluyeFinesDeSemana: horario.incluyeFinesDeSemana,
        creado_a: new Date(horario.creado_a).toLocaleDateString('es-ES'),
        actualizado_a: new Date(horario.actualizado_a).toLocaleDateString('es-ES'),
      });
    }
    );
    return horarioMaterialized;
  }

  onSubmitHorario(): void {
    this.visibleModal = false;
    this.deleteModal = false;
    if (this.action === 'edit') {
      this.horarioService.editHorario(this.rowSelectedEdit).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedEdit = {} as HorarioEdit;
    }
    if (this.action === 'create') {
      this.horarioService.createHorario(this.rowCreate).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
          this.fetchHorarios();
        },
      });
      this.rowCreate = {} as HorarioCreate;
    }
    if(this.action === 'delete'){
      this.horarioService.deleteHorario(this.rowSelectedDelete._id).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
        },
        error: (error) => this.toastr.error(error?.error?.message, 'Error'),
      });
      this.rowSelectedDelete = {} as HorarioDelete;
    }
    this.fetchHorarios();
  }

  getObjectByAction(): HorarioEdit | HorarioCreate {
    return this.action === 'edit'  ? this.rowSelectedEdit : this.rowCreate;
  }

  getColumnsByAction(): ColumnTable[] {
    if(this.action === 'edit'){
      return this.columns.filter((column: ColumnTable) => column.isAvailableOnEdit === true);
    }
    return this.columns.filter((column: ColumnTable) => column.isAvailableOnCreation === true);
  }

}
