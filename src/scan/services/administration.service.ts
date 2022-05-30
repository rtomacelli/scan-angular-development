import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { clone, extend } from '@helpers/js.helper';
import { Feature, Job, Person, UserProfile } from '@models/admin';
import { ScanDate, ScanDateTime, ScanTime } from '@models/common';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { ErrorService } from '@services/error.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  private features: Feature[];
  private profiles: UserProfile[];
  private users: Person[];
  private jobs: Job[];

  constructor(
    private restService: RestService,
    private errorService: ErrorService
  ) { }

  /**
   * Retrieves the full list of available features and returns them in an
   * `Observable`.
   *
   * @returns {Observable<Feature[]>} An `Observable` with the full list of
   * `Feature`s, or an empty array in case of error.
   *
   * @memberOf AdministrationService
   */
  // tslint:disable: max-line-length
  getFeatures(): Observable<Feature[]> {
    if (!!this.features && this.features.length > 0) {
      return of(this.features);
    } else {
      return this.restService.backendRequest<Feature[]>(REMOTE_ROUTES.adminFeatures).pipe(
        map(features => {
          features.forEach(feature => {
            const creationDate = !!feature.dataCadastro ? feature.dataCadastro : new ScanDateTime;
            const modificationDate = !!feature.dataUltimaAlteracao ? feature.dataUltimaAlteracao : new ScanDateTime;
            feature.dataCadastro = new ScanDateTime(extend(new ScanDate, creationDate.date), extend(new ScanTime, creationDate.time));
            feature.dataUltimaAlteracao = new ScanDateTime(extend(new ScanDate, modificationDate.date), extend(new ScanTime, modificationDate.time));
            feature.usuarioAlterador = `${feature.matriculaAlterador}:${feature.nomeAlterador}`;
          });
          return features.sort((a, b) => a.rota.localeCompare(b.rota));
        }),
        tap(features => this.features = features),
        catchError(this.errorService.handleError<Feature[]>(`getFeatures()`, []))
      );
    }
  }
  // tslint:enable: max-line-length

  saveFeature(feature: Feature): Observable<boolean> {
    const foundFeature = this.features.find(thisFeature => thisFeature.id === feature.id);
    if (!!feature && !!foundFeature) {
      return this.restService.backendRequest(REMOTE_ROUTES.adminSaveFeature, feature).pipe(
        map(response => {
          if (response !== null) {
            const features = clone(this.features) as Feature[];
            features[this.features.indexOf(foundFeature)] = feature;
            this.features = features.sort((a, b) => a.rota.localeCompare(b.rota));
            return true;
          } else {
            throw new Error('save feature request error');
          }
        }),
        catchError(this.errorService.handleError<boolean>(`saveFeature(${JSON.stringify([feature])})`, false))
      );
    }
    return of(false);
  }

  /**
   * Retrieves the full list of available user profiles and returns them in an
   * `Observable`.
   *
   * @returns {Observable<UserProfile[]>} An `Observable` with the full list of
   * `UserProfile`s, or an empty array in case of error.
   *
   * @memberOf AdministrationService
   */
  getProfiles(): Observable<UserProfile[]> {
    if (!!this.profiles && this.profiles.length > 0) {
      return of(this.profiles);
    } else {
      return this.restService.backendRequest<UserProfile[]>(REMOTE_ROUTES.adminProfiles).pipe(
        map(profiles => {
          profiles.forEach(profile => {
            const features = !!profile.funcionalidades ? profile.funcionalidades : [];
            profile.nomesFuncionalidades = features.map(feature => feature.nome).join('|');
          });
          return profiles.sort((a, b) => a.nome.localeCompare(b.nome));
        }),
        tap(profiles => this.profiles = profiles),
        catchError(this.errorService.handleError<UserProfile[]>(`getProfiles()`, []))
      );
    }
  }

  saveProfile(profile: UserProfile, newProfile: boolean): Observable<boolean> {
    if (!!profile) {
      profile = clone(profile);
      delete profile.nomesFuncionalidades;
      return this.restService.backendRequest(REMOTE_ROUTES.adminSaveProfile, profile).pipe(
        map(response => {
          if (response !== null) {
            const profiles = clone(this.profiles) as UserProfile[];
            if (newProfile) {
              profiles.push(profile);
            } else {
              const foundProfile = this.profiles.find(thisProfile => thisProfile.id === profile.id);
              if (!!foundProfile) {
                profiles[this.profiles.indexOf(foundProfile)] = profile;
              } else {
                return false;
              }
            }
            this.profiles = profiles.sort((a, b) => a.nome.localeCompare(b.nome));
            return true;
          } else {
            throw new Error('save profile request error');
          }
        }),
        catchError(this.errorService.handleError<boolean>(`savePrpfile(${JSON.stringify([profile])})`, false))
      );
    }
    return of(false);
  }

  /**
   * Retrieves the full list of available users and returns them in an
   * `Observable`.
   *
   * @returns {Observable<Person[]>} An `Observable` with the full list of
   * `Person`s, or an empty array in case of error.
   *
   * @memberOf AdministrationService
   */
  getUsers(): Observable<Person[]> {
    if (!!this.users && this.users.length > 0) {
      return of(this.users);
    } else {
      return this.restService.backendRequest<Person[]>(REMOTE_ROUTES.adminUsers).pipe(
        map(users => {
          users.forEach(user => {
            const profiles = !!user.perfis ? user.perfis : [];
            user.nomesPerfis = profiles.map(profile => profile.nome).join('|');
            user.usuario = `${user.nomePessoa}:${user.matricula}`;
            if (!!user.dataUltimoLoginSucedido) {
              user.ultimoAcesso = ScanDateTime.fromISODateTimeString(user.dataUltimoLoginSucedido);
            }
          });
          return users.sort((a, b) => a.matricula.localeCompare(b.matricula));
        }),
        tap(users => this.users = users),
        catchError(this.errorService.handleError<Person[]>(`getUsers()`, []))
      );
    }
  }

  saveUser(user: Person): Observable<boolean> {
    const foundUser = this.users.find(thisUser => thisUser.matricula === user.matricula);
    if (!!user && !!foundUser) {
      return this.restService.backendRequest(REMOTE_ROUTES.adminSaveUser, user).pipe(
        map(response => {
          if (response !== null) {
            const users = clone(this.users) as Person[];
            users[this.users.indexOf(foundUser)] = user;
            this.users = users.sort((a, b) => a.matricula.localeCompare(b.matricula));
            return true;
          } else {
            throw new Error('save user request error');
          }
        }),
        catchError(this.errorService.handleError<boolean>(`saveUser(${JSON.stringify([user])})`, false))
      );
    }
    return of(false);
  }

  // tslint:disable: max-line-length
  getJobs(): Observable<Job[]> {
    if (!!this.jobs && this.jobs.length > 0) {
      return of(this.jobs);
    } else {
      return this.restService.backendRequest<Job[]>(REMOTE_ROUTES.adminJobs).pipe(
        map(jobs => {
          jobs.forEach(job => {
            job.inicioExecucao = new ScanDateTime(extend(new ScanDate, job.inicioExecucao.date), extend(new ScanTime, job.inicioExecucao.time));
            job.finalExecucao = new ScanDateTime(extend(new ScanDate, job.finalExecucao.date), extend(new ScanTime, job.finalExecucao.time));
            job.dataExecucao = job.inicioExecucao.date.toString();
            job.ultimaMensagem = `${job.ultimaMensagemErro}|${job.ultimaMensagemObservacao}`.replace(/SEM_MENSAGENS/g, '');
          });
          return jobs.sort((a, b) => b.inicioExecucao.toString().localeCompare(a.finalExecucao.toString()));
        }),
        tap(jobs => this.jobs = jobs),
        catchError(this.errorService.handleError<Job[]>(`getJobs()`, []))
      );
    }
  }
  // tslint:enable: max-line-length

}
