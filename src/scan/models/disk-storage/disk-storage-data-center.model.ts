import { deduplicate, flatten } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { Deserializable } from '@models/common';
import { DataCenter, CLUSTER_ORDER } from '@models/map-common';
import { DiskStorageCluster } from './disk-storage-cluster.model';
import { DiskStorage } from './disk-storage.model';

export class DiskStorageDataCenter extends DataCenter implements Deserializable {
  'listaStorageDiscos': DiskStorage[];
  'clusters'?: DiskStorageCluster[] = [];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaStorageDiscos = deserializeArray(source, 'listaStorageDiscos', DiskStorage);
    this.fillClusters();
    return this;
  }

  get diskStorages(): DiskStorage[] {
    return this.listaStorageDiscos;
  }

  get clusterNames(): string[] {
    return deduplicate(this.diskStorages.map(storage => storage.nomeCluster));
  }

  private fillClusters() {
    for (const clusterName of this.clusterNames) {
      const clusterStorages = this.diskStorages.filter(storage => storage.nomeCluster === clusterName)
        .sort(this.storageSorter);
      const clusterApps = deduplicate(flatten(clusterStorages.map(storage => storage.listaSiglasArmazenadas)));
      this.clusters.push({
        name: clusterName,
        capacity: clusterStorages.map(storage => storage.capacidade).reduce((sum, value) => sum + value, 0),
        applications: deduplicate(clusterStorages.map(storage => storage.codigoAplicacao)),
        storages: clusterStorages,
        appCount: clusterApps.length
      });
    }
    this.clusters.sort((a, b) => CLUSTER_ORDER.indexOf(a.name) - CLUSTER_ORDER.indexOf(b.name));
  }

  private storageSorter(a: DiskStorage, b: DiskStorage): number {
    if (a.codigoSerial !== b.codigoSerial) {
      return a.codigoSerial.localeCompare(b.codigoSerial);
    } else {
      return a.rangeMemoria.localeCompare(b.rangeMemoria);
    }
  }
}
