import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

import { SelectItem } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { MultiSelect } from 'primeng/multiselect';
import { Table } from 'primeng/table';

import { toISODateString } from '@helpers/js.helper';
import { Job, JOB_STATUS_DESCRIPTORS } from '@models/admin';
import { PRIME_LOCALE_PT } from '@models/common';
import { AdministrationService } from '@services/administration.service';

@Component({
  selector: 'scan-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  @ViewChildren('filter') filters: QueryList<ElementRef | Calendar | MultiSelect>;

  jobs: Job[];
  dataIsLoaded = false;

  readonly today = new Date;
  readonly primeLocalePt = PRIME_LOCALE_PT;
  readonly pageSizeValues = [6, 12, 18, 24, 30, 36, null];
  readonly columns = [
    { field: 'rotinaExecutora', header: 'Rotina Executora' },
    { field: 'job', header: 'Job' },
    { field: 'dataExecucao', header: 'Execução' },
    { field: 'ultimaMensagem', header: 'Mensagem' },
    { field: 'jobStatus', header: 'Status' },
  ];
  readonly fields = this.columns.map(column => column.field);
  readonly statusDescriptors = JOB_STATUS_DESCRIPTORS;
  readonly messageRegex = '/(_|;|\\.)/g';

  statuses: SelectItem[] = [];
  pageSizes: SelectItem[] = [];
  rowsPerPage = this.pageSizeValues[0];
  dateFilter: Date;
  minimumDate: Date;

  constructor(
    private administrationService: AdministrationService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.administrationService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
      this.buildStatusFilterItems();
      this.buildPageSizeItems();
      this.findMinimumDate();
      this.dataIsLoaded = true;
    });
  }

  private buildPageSizeItems() {
    this.pageSizes = this.pageSizeValues.map(size => ({
      label: size ? size.toString() : 'Todos',
      value: size ? size : this.jobs.length
    }));
  }

  private findMinimumDate() {
    this.minimumDate = this.jobs
      .map(job => job.inicioExecucao.toDate())
      .sort((a, b) => a.getTime() - b.getTime())[0];
  }

  private buildStatusFilterItems() {
    for (const status in this.statusDescriptors) {
      if (this.statusDescriptors.hasOwnProperty(status)) {
        this.statuses.push({
          label: this.statusDescriptors[status].description,
          value: status
        });
      }
    }
  }

  getJobName(job: Job) {
    return job.job.replace(/^.* *\(([^)]*).*$/, '$1');
  }

  getJobDescription(job: Job) {
    return job.job.replace(/^(.*) *\(.*$/, '$1');
  }

  isDone(job: Job): boolean {
    return job.jobStatus !== 'EM_EXECUCAO';
  }

  isMessageAvailable(message: string): boolean {
    return !!message && message !== 'SEM MENSAGENS';
  }

  onCalendarClose(jobsTable: Table) {
    const value = !!this.dateFilter ? toISODateString(this.dateFilter) : '';
    jobsTable.filter(value, 'dataExecucao', 'contains');
  }

  onResetTable($event: any, jobsTable: Table) {
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
    jobsTable.reset();
  }

}
