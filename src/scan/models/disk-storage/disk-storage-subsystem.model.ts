import { deduplicate, flatten } from '@helpers/js.helper';
import { DiskStorageApplication } from './disk-storage-application.model';
import { DiskStorageDataCenter } from './disk-storage-data-center.model';
import { DiskStorage } from './disk-storage.model';

export class DiskStorageSubsystem {
  applications: DiskStorageApplication[] = [];

  constructor(
    public dataCenters: DiskStorageDataCenter[],
    public date: string
  ) {
    this.fillApplications();
    this.linkDiskStoragePairs();
  }

  get diskStorages(): DiskStorage[] {
    return flatten(this.dataCenters.map(dataCenter => dataCenter.diskStorages));
  }

  get applicationNames(): string[] {
    return deduplicate(this.diskStorages.map(storage => storage.codigoAplicacao));
  }

  get clusterNames(): string[] {
    return deduplicate(this.diskStorages.map(storage => storage.nomeCluster));
  }

  private fillApplications() {
    for (const applicationName of this.applicationNames) {
      const applicationStorages = this.diskStorages.filter(storage => storage.codigoAplicacao === applicationName);
      const applicationApps = deduplicate(flatten(applicationStorages.map(storage => storage.listaSiglasArmazenadas)));
      this.applications.push({
        name: applicationName,
        capacity: applicationStorages.map(storage => storage.capacidade).reduce((sum, value) => sum + value, 0),
        sysplexes: deduplicate(applicationStorages.map(storage => storage.nomeCluster)),
        storages: applicationStorages,
        apps: applicationApps
      });
    }
  }

  private linkDiskStoragePairs() {
    this.diskStorages.filter(storage => !!storage.codStorDiscPrimario)
      .forEach(secondaryStorage => {
        const primaryStorage = this.diskStorages.find(storage => storage.id === secondaryStorage.codStorDiscPrimario);
        secondaryStorage.pair = primaryStorage;
        primaryStorage.pair = secondaryStorage;
        primaryStorage.category = 'Primária';
        secondaryStorage.category = 'Secundária';
      });
  }

}
