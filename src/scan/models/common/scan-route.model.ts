import { ScanRoutes } from '@models/common';

export interface ScanRoute {
  path: string;
  label: string;
  title: string;
  icon?: string;
  children?: ScanRoutes;
}
