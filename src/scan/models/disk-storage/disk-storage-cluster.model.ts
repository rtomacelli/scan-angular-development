import { DiskStorage } from './disk-storage.model';

export class DiskStorageCluster {
  'name': string;
  'applications': string[];
  'storages': DiskStorage[];
  'capacity': number;
  'appCount': number;
}
