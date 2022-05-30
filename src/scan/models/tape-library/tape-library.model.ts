import { arraySum, deduplicate } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { Deserializable } from '@models/common';
import { TapeLibraryApplicationData } from './tape-library-application-data.model';
import { TapeLibraryApplication } from './tape-library-application.model';
import { TapeLibraryCluster } from './tape-library-cluster.model';

export class TapeLibrary implements Deserializable {
  'id': number;
  'origemInformacao': string;
  'dataInformacao': string;
  'numero': string;
  'nome': string;
  'qtdCartuchosLivres': number;
  'qtdCartuchosDadosLimpeza': number;
  'qtdCartuchosDadosLivres': number;
  'qtdCartuchosDadosUso': number;
  'capInstalada': number;
  'percCapacidadeFracionada': number;
  'percCapacidadeUtilizada': number;
  'listaDadosAplicacaoFitoteca': TapeLibraryApplicationData[];
  'applications'?: TapeLibraryApplication[] = [];
  'clusters'?: TapeLibraryCluster[] = [];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaDadosAplicacaoFitoteca = deserializeArray(source, 'listaDadosAplicacaoFitoteca', TapeLibraryApplicationData);
    this.fillClusters();
    this.fillApplications();
    return this;
  }

  get usedCapacity(): number {
    return this.capInstalada * this.percCapacidadeUtilizada / 100;
  }

  get partialCapacity(): number {
    return this.capInstalada * this.percCapacidadeFracionada / 100;
  }

  get freeCapacity(): number {
    return this.capInstalada - (this.usedCapacity + this.partialCapacity);
  }

  get applicationNames(): string[] {
    return deduplicate(this.listaDadosAplicacaoFitoteca.map(data => data.origemNomeAplicacao));
  }

  get clusterNames(): string[] {
    return deduplicate(this.listaDadosAplicacaoFitoteca.map(data => data.origemCluster));
  }

  private fillClusters() {
    for (const clusterName of this.clusterNames) {
      const clusterData = this.listaDadosAplicacaoFitoteca.filter(data => data.origemCluster === clusterName);
      this.clusters.push({
        id: this.clusters.length,
        nome: clusterName,
        cartuchos: arraySum(clusterData.map(data => data.qtdCartDados)),
        capacidade: arraySum(clusterData.map(data => data.qtdDadosGb)),
        deserialize: null
      });
    }
  }

  private fillApplications() {
    for (const applicationName of this.applicationNames) {
      const applicationData = this.listaDadosAplicacaoFitoteca.filter(data => data.origemNomeAplicacao === applicationName);
      this.applications.push({
        nome: applicationName,
        cartuchos: arraySum(applicationData.map(data => data.qtdCartDados)),
        capacidade: arraySum(applicationData.map(data => data.qtdDadosGb))
      });
    }
  }
}
