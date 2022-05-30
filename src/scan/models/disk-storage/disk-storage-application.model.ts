import { DiskStorage } from '@models/disk-storage/disk-storage.model';

export class DiskStorageApplication {
  'name': string;
  'storages': DiskStorage[];
  'capacity': number;
  'sysplexes': string[];
  'apps': string[];
}
