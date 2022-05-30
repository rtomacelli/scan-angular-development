import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';
import { MapsDetailsModule } from '@modules/maps/details/maps-details.module';
import { DiskStorageModule } from '@modules/maps/disk-storage/disk-storage.module';
import { HighEndModule } from '@modules/maps/high-end/high-end.module';
import { MainframeModule } from '@modules/maps/mainframe/mainframe.module';
import { MapsRoutingModule } from '@modules/maps/maps-routing.module';
import { MatrixModule } from '@modules/maps/matrix/matrix.module';
import { TapeLibraryModule } from '@modules/maps/tape-library/tape-library.module';

import { DiskStorageDialogComponent } from '@modules/maps/disk-storage';
import { HighEndClusterComponent, HighEndDialogComponent } from '@modules/maps/high-end';
import { MainframeDialogComponent } from '@modules/maps/mainframe';
import { TapeLibraryDialogComponent } from '@modules/maps/tape-library';

import * as mapsDetails from './details';

const dialogComponents: any[] = [...mapsDetails.components, DiskStorageDialogComponent,
  HighEndClusterComponent, HighEndDialogComponent, MainframeDialogComponent, TapeLibraryDialogComponent];

@NgModule({
  imports: [ CommonModule, MapsRoutingModule, CoreModule, MapsDetailsModule, MatrixModule, DiskStorageModule, MainframeModule,
    HighEndModule, TapeLibraryModule ],
  entryComponents: [ ...dialogComponents ]
})
export class MapsModule { }
