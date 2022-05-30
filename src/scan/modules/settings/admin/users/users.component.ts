import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { forkJoin } from 'rxjs';

import { SelectItem } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { MultiSelect } from 'primeng/multiselect';
import { Table } from 'primeng/table';

import { clone, toISODateString } from '@helpers/js.helper';
import { Person, UserProfile } from '@models/admin';
import { PRIME_LOCALE_PT } from '@models/common';
import { AdministrationService } from '@services/administration.service';

@Component({
  selector: 'scan-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChildren('filter') filters: QueryList<ElementRef | Calendar | MultiSelect>;

  profiles: UserProfile[];
  users: Person[];
  dataIsLoaded = false;

  clonedUsers: { [uid: string]: Person } = {};

  readonly today = new Date;
  readonly primeLocalePt = PRIME_LOCALE_PT;
  readonly headers = ['Usuário', 'Tipo', 'Lotação', 'Último Acesso'];
  readonly columns = [
    { field: 'usuario', header: 'Usuário' },
    { field: 'tipoFunc', header: 'Tipo' },
    { field: 'lotacao', header: 'Lotação' },
    { field: 'ultimoAcesso', header: 'Último Acesso' },
    { field: 'nomesPerfis', header: 'Perfis' }
  ];
  readonly fields = this.columns.map(column => column.field);
  readonly pageSizeValues = [10, 20, 30, 40, 50, null];

  pageSizes: SelectItem[] = [];
  rowsPerPage = this.pageSizeValues[0];
  dateFilter: Date;
  minimumDate: Date;
  newUser: Person;

  constructor(
    private administrationService: AdministrationService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    forkJoin([
      this.administrationService.getProfiles(),
      this.administrationService.getUsers()
    ]).subscribe(([profiles, users]) => {
      this.profiles = profiles;
      this.users = users;
      this.buildPageSizeItems();
      this.findMinimumDate();
      this.dataIsLoaded = true;
    });
  }

  private buildPageSizeItems() {
    this.pageSizes = this.pageSizeValues.map(value => ({
      label: value ? value.toString() : 'Todos',
      value: value ? value : this.users.length
    }));
  }

  private findMinimumDate() {
    this.minimumDate = this.users
      .filter(user => !!user.ultimoAcesso)
      .map(user => user.ultimoAcesso.toDate())
      .sort((a, b) => a.getTime() - b.getTime())[0];
  }

  getAvailableProfiles(user: Person): UserProfile[] {
    if (!!user) {
      return this.profiles.filter(profile => !user.perfis
        .map(userProfile => userProfile.id)
        .includes(profile.id));
    } else {
      return this.profiles;
    }
  }

  getProfileNames(user: Person): string[] {
    if (!!user) {
      return user.perfis.map(profile => profile.nome);
    }
    return [];
  }

  onRowEditInit(user: Person) {
    this.clonedUsers[user.matricula] = clone(user);
  }

  onRowEditSave(user: Person, index: number) {
    this.administrationService.saveUser(user).subscribe(success => {
      if (success) {
        this.users[index] = clone(user);
      } else {
        this.users[index] = this.clonedUsers[user.matricula];
        alert(`Não foi possível salvar o usuário com a matrícula "${user.matricula}"`);
      }
      delete this.clonedUsers[user.matricula];
    });
  }

  onRowEditCancel(user: Person, index: number) {
    this.users[index] = this.clonedUsers[user.matricula];
    delete this.clonedUsers[user.matricula];
  }

  onCalendarClose(usersTable: Table) {
    const value = !!this.dateFilter ? toISODateString(this.dateFilter) : '';
    usersTable.filter(value, 'ultimoAcesso', 'contains');
  }

  onResetTable($event: any, usersTable: Table) {
    this.filters.forEach(filter => {
      if (filter instanceof Calendar) {
        filter.onClearButtonClick($event);
      } else if (filter instanceof MultiSelect) {
        filter.value = null;
        filter.updateLabel();
      } else {
        filter.nativeElement.value = '';
      }
    });
    usersTable.reset();
  }

}
