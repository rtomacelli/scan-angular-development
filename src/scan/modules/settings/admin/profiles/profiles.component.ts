import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { forkJoin } from 'rxjs';

import { SelectItem } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';
import { Table } from 'primeng/table';

import { clone } from '@helpers/js.helper';
import { BLANK_USER_PROFILE, Feature, UserProfile } from '@models/admin';
import { NOW } from '@models/common';
import { AdministrationService } from '@services/administration.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'scan-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {

  @ViewChildren('filter') filters: QueryList<ElementRef | MultiSelect>;

  features: Feature[];
  profiles: UserProfile[];
  dataIsLoaded = false;

  clonedProfiles: { [id: number]: UserProfile } = {};

  readonly columns = [
    { field: 'ativo', header: 'Status' },
    { field: 'nome', header: 'Nome' },
    { field: 'nomesFuncionalidades', header: 'Funcionalidades' },
    { field: 'podeSerAlterado', header: 'Editar' }
  ];
  readonly fields = this.columns.map(column => column.field);
  readonly pageSizeValues = [6, 12, 18, 24, 30, 36, null];

  pageSizes: SelectItem[] = [];
  statuses: SelectItem[] = [{ label: 'Ativo', value: 'S' }, { label: 'Inativo', value: 'N' }];
  editOptions: SelectItem[] = [{ label: 'Editável', value: 'S' }, { label: 'Não Editável', value: 'N' }];
  rowsPerPage = this.pageSizeValues[0];
  displayDialog = false;
  savingProfile = false;
  newProfile: UserProfile;

  constructor(
    private administrationService: AdministrationService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    forkJoin([
      this.administrationService.getFeatures(),
      this.administrationService.getProfiles()
    ]).subscribe(([features, profiles]) => {
      this.features = features;
      this.profiles = profiles;
      this.buildPageSizeItems();
      this.dataIsLoaded = true;
    });
  }

  private buildPageSizeItems() {
    this.pageSizes = this.pageSizeValues.map(value => ({
      label: value ? value.toString() : 'Todos',
      value: value ? value : this.profiles.length
    }));
  }

  getAvailableFeatures(profile: UserProfile): Feature[] {
    if (!!profile) {
      return this.features.filter(feature => !profile.funcionalidades
        .map(profileFeature => profileFeature.id)
        .includes(feature.id));
    } else {
      return this.features;
    }
  }

  getFeatureNames(profile: UserProfile): string[] {
    if (!!profile) {
      return profile.funcionalidades.map(feature => feature.nome);
    }
    return [];
  }

  formattedFeatureRoute(route: string): string {
    return route
      .replace(/(\/)/g, '$1<wbr>')
      .replace(/([a-z])([A-Z])/g, '$1<wbr>$2');
  }

  onRowEditInit(profile: UserProfile) {
    this.clonedProfiles[profile.id] = clone(profile);
  }

  onRowEditSave(profile: UserProfile, index: number) {
    if (this.isProfileNameUnique(profile)) {
      this.authenticationService.getUser().subscribe(user => {
        const features = !!profile.funcionalidades ? profile.funcionalidades : [];
        profile.nomesFuncionalidades = features.map(feature => feature.nome).join('|');
        profile.matriculaAlterador = user.uid;
        profile.nomeAlterador = user.name;
        profile.dataUltimaAlteracao = NOW();

        this.administrationService.saveProfile(profile, false).subscribe(success => {
          if (success) {
            this.profiles[index] = clone(profile);
          } else {
            this.profiles[index] = this.clonedProfiles[profile.id];
            alert(`Não foi possível salvar o perfil "${profile.nome}".`);
          }
          delete this.clonedProfiles[profile.id];
        });
      });
    } else {
      alert('O perfil precisa ter um nome único.');
    }
  }

  onRowEditCancel(profile: UserProfile, index: number) {
    this.profiles[index] = this.clonedProfiles[profile.id];
    delete this.clonedProfiles[profile.id];
  }

  showNewProfileDialog() {
    this.newProfile = clone(BLANK_USER_PROFILE);
    this.displayDialog = true;
  }

  cancelNewProfile() {
    this.newProfile = null;
    this.displayDialog = false;
  }

  saveNewProfile() {
    if (this.isProfileNameUnique()) {
      this.savingProfile = true;

      this.authenticationService.getUser().subscribe(user => {
        this.newProfile.nomeCadastrante = user.name;
        this.newProfile.matriculaCadastrante = user.uid;
        this.newProfile.dataCadastro = NOW();

        this.administrationService.saveProfile(this.newProfile, true).subscribe(success => {
          if (success) {
            const profiles = clone(this.profiles);
            this.newProfile.id = this.getNextProfileId();
            profiles.push(this.newProfile);
            this.profiles = profiles;
          } else {
            alert(`Não foi possível salvar o perfil "${this.newProfile.nome}".`);
          }
          this.newProfile = null;
          this.displayDialog = false;
          this.savingProfile = false;
        });
      });
    } else {
      alert('O perfil precisa ter um nome único.');
    }
  }

  private isProfileNameUnique(profile?: UserProfile): boolean {
    const target = profile || this.newProfile;
    return target.nome.length > 0
      && !this.profiles.filter(_profile => _profile !== target)
        .map(_profile => _profile.nome).includes(target.nome);
  }

  private getNextProfileId(): number {
    const profileIds = this.profiles.map(profile => profile.id);
    return Math.max(...profileIds) + 1;
  }

  onResetTable($event: any, profilesTable: Table) {
    this.filters.forEach(filter => {
      if (filter instanceof MultiSelect) {
        filter.value = null;
        filter.updateLabel();
      } else {
        filter.nativeElement.value = '';
      }
    });
    profilesTable.reset();
  }

}
