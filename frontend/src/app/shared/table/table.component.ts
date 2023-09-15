import { Component, Input } from '@angular/core';
import { ColumnTable } from 'src/app/core/interfaces/sidebar.links.interface';
import * as helpers from '../../core/helpers';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
    `    
      td:nth-child(3) p {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      td:nth-child(2) p {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class TableComponent {
  @Input('columns') columns: ColumnTable[] = [];
  @Input('data') data: any[] = [];
  @Input('classes') classes: string = '';
  buttons: number = 3;

  actionsContainer = {
    'display': 'grid',
      'place-items': 'center',
      'gap': '0.45rem',
      'grid-template-columns': `repeat(${this.buttons}, 1fr)`,
  };

  evaluateIsUndefined(value: any): boolean {
    return helpers.isNullOrUndefined(value);
  }

  evaluateArray(value: any): boolean {
    return helpers.isFullArray(value);
  }

  constructor() {}
}

function removeKeys(
  obj: { [key: string]: any },
  keys: string[]
): { [key: string]: any } {
  const newObj = { ...obj };
  keys.forEach((key) => delete newObj[key]);
  return newObj;
}
