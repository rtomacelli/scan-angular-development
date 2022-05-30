import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { MatrixElement, MATRIX_LEVELS, MATRIX_PATHS } from '@models/reference-matrix';
import { MatrixLayer } from '@models/reference-matrix/matrix-layer.model';
import { ReferenceMatrix } from '@models/reference-matrix/reference-matrix.model';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { ReferenceDateService } from '@services/reference-date.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ReferenceMatrixService {


  private referenceMatrix: Observable<ReferenceMatrix>;

  constructor(
    private referenceDateService: ReferenceDateService,
    private restService: RestService
  ) {
    this.initialize();
  }

  /**
   * Subscribes to the reference date service to clear the caches when the date
   * changes.
   *
   * @private
   * @memberof ReferenceMatrixService
   */
  private initialize() {
    this.referenceDateService.getReferenceDate().subscribe(() => this.clearCache());
  }

  /**
   * Clears the cached Reference Matrix data.
   *
   * @private
   * @memberof ReferenceMatrixService
   */
  private clearCache() {
    this.referenceMatrix = null;
  }

  /**
   * Gets and caches the Reference Matrix topology with all its layers, for an
   * optionally given date.
   *
   * @param {string} [date] The optional date.
   * @returns {Observable<OldReferenceMatrix>} An Observable of the
   * `ReferenceMatrix`, or of an undefined reference in case of error.
   *
   * @memberOf ReferenceMatrixService
   */
  getReferenceMatrix(date?: string): Observable<ReferenceMatrix> {
    if (!this.referenceMatrix) {
      this.referenceMatrix = this.restService.datedBackendGetRequest(REMOTE_ROUTES.referenceMatrix, date).pipe(
        map(response => (!!response ? response : []) as MatrixLayer[]),
        map(layers => new ReferenceMatrix(
          layers.map(layer => new MatrixLayer().deserialize(layer)),
          date
        )),
        publishReplay(1),
        refCount()
      );
    }
    return this.referenceMatrix;
  }

  /**
   * Gets a Reference Matrix layer by name, for an optionally given date.
   *
   * @param {string} name The name of the desired Reference Matrix layer.
   * @param {string} [date] The optional date.
   * @returns {Observable<OldMatrixLayer>} An `Observable` of the desired
   * Reference Matrix Layer, or an undefined reference in case of error.
   *
   * @memberof ReferenceMatrixService
   */
  getLayer(name: string, date?: string): Observable<MatrixLayer> {
    return this.getReferenceMatrix(date).pipe(
      map(matrix => matrix.layers.find(layer => layer.nomeCamada === name))
    );
  }

  /**
   * Gets the Element components of the designated Reference Matrix layer and
   * perspective, for an optionally given date.
   *
   * @param {string} layerName The name of the appropriate Reference Matrix
   * layer.
   * @param {string} perspectiveName The name of the desired layer perspective.
   * @param {string} [date] The optional date.
   * @returns {Observable<MatrixElement[]>} An `Observable` of an array of the
   * Element components contained in the designated layer and perspective,
   * or an empty array in case of error.
   *
   * @memberof ReferenceMatrixService
   */
  getElementsByLayerAndPerspective(layerName: string, perspectiveName: string, date: string): Observable<MatrixElement[]> {
    return this.getReferenceMatrix(date).pipe(
      map(matrix => matrix.elements
        .filter(element => element.path.layer.name === layerName
          && element.path.perspective.name === perspectiveName))
    );
  }

  /**
   * Gets the Element components contained in the Application Interface
   * perspective of the Logical Infrastructure layer of the Reference Matrix,
   * for an optionally given date.
   *
   * @param {string} [date] The optional date.
   * @returns {Observable<MatrixElement[]>} An `Observable` of the Application
   * Interface elements.
   *
   * @memberof ReferenceMatrixService
   */
  getApplicationInterfaces(date?: string): Observable<MatrixElement[]> {
    return this.getElementsByLayerAndPerspective(
      MATRIX_PATHS.LOGICAL_INTERFACE[MATRIX_LEVELS.LAYER],
      MATRIX_PATHS.LOGICAL_INTERFACE[MATRIX_LEVELS.PERSPECTIVE],
      date
    );
  }

  /**
   * Gets an Element component corresponding to a given Application Interface
   * name, for an optionally given date.
   *
   * @param {string} interfaceName The name of the desired Application
   * Interface.
   * @param {string} [date] The optional date.
   * @returns {Observable<MatrixElement>} An `Observable` of the desired
   * Application Interface element, or an undefined reference in case of
   * error.
   *
   * @memberof ReferenceMatrixService
   */
  getInterface(interfaceName: string, date?: string): Observable<MatrixElement> {
    return this.getApplicationInterfaces(date).pipe(
      map(interfaces => interfaces.find(interfaceElement => interfaceElement.nome === interfaceName))
    );
  }
}
