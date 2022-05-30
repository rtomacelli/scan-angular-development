import { arraySum, flatten, deduplicate } from '@helpers/js.helper';
import { TapeLibraryCartridgeCategory } from './tape-library-cartridge-category.model';
import { TapeLibraryCluster } from './tape-library-cluster.model';
import { TapeLibraryDataCenter } from './tape-library-data-center.model';
import { TapeLibrary } from './tape-library.model';
import { TapeLibraryApplication } from './tape-library-application.model';

export class TapeLibrarySystem {
  'categories': TapeLibraryCartridgeCategory[];
  'clusters': TapeLibraryCluster[] = [];
  'applications': TapeLibraryApplication[] = [];
  'totals' = { cartuchos: 0, capacidade: 0 };
  'used' = { cartuchos: 0, capacidade: 0 };

  constructor(
    public dataCenters: TapeLibraryDataCenter[],
    public date: string
  ) {
    this.fillCategories();
    this.fillClusters();
    this.fillApplications();
    this.fillTotals();
  }

  get tapeLibraries(): TapeLibrary[] {
    return flatten(this.dataCenters.map(dataCenter => dataCenter.tapeLibraries));
  }

  get clusterNames(): string[] {
    return deduplicate(flatten(this.tapeLibraries.map(library => library.clusterNames)));
  }

  get applicationNames(): string[] {
    return deduplicate(flatten(this.tapeLibraries.map(library => library.applicationNames)));
  }

  private fillCategories() {
    const usedCartridgeCount = arraySum(this.tapeLibraries.map(library => library.qtdCartuchosDadosUso));
    const cleaningCartridgeCount = arraySum(this.tapeLibraries.map(library => library.qtdCartuchosDadosLimpeza));
    const freeCartridgeCount = arraySum(this.tapeLibraries.map(library => library.qtdCartuchosDadosLivres));

    const usedCapacity = arraySum(this.tapeLibraries.map(library => library.capInstalada * (library.percCapacidadeUtilizada / 100)));
    const partialCapacity = arraySum(this.tapeLibraries.map(library => library.capInstalada * (library.percCapacidadeFracionada / 100)));
    const totalCapacity = arraySum(this.tapeLibraries.map(library => library.capInstalada));
    const freeCapacity = totalCapacity - (usedCapacity + partialCapacity);

    this.categories = [
      new TapeLibraryCartridgeCategory('Utilizados', usedCartridgeCount, usedCapacity),
      new TapeLibraryCartridgeCategory('Fracionados', 0, partialCapacity),
      new TapeLibraryCartridgeCategory('Limpeza', cleaningCartridgeCount, 0),
      new TapeLibraryCartridgeCategory('Livres', freeCartridgeCount, freeCapacity)
    ];
  }

  private fillClusters() {
    for (const clusterName of this.clusterNames) {
      this.clusters.push({
        id: this.clusters.length,
        nome: clusterName,
        cartuchos: arraySum(this.tapeLibraries
          .map(library => library.clusters.find(cluster => cluster.nome === clusterName).cartuchos)),
        capacidade: arraySum(this.tapeLibraries
          .map(library => library.clusters.find(cluster => cluster.nome === clusterName).capacidade)),
        deserialize: null
      });
    }
  }

  private fillApplications() {
    for (const applicationName of this.applicationNames) {
      this.applications.push({
        nome: applicationName,
        cartuchos: arraySum(this.tapeLibraries
          .map(library => library.applications.find(application => application.nome === applicationName).cartuchos)),
        capacidade: arraySum(this.tapeLibraries
          .map(library => library.applications.find(application => application.nome === applicationName).capacidade)),
      });
    }
  }

  private fillTotals() {
    this.totals.cartuchos = arraySum(this.categories.map(category => category.cartuchos));
    this.totals.capacidade = arraySum(this.categories.map(category => category.capacidade));
    this.used.cartuchos = arraySum(this.clusters.map(category => category.cartuchos));
    this.used.capacidade = arraySum(this.clusters.map(category => category.capacidade));
  }
}
