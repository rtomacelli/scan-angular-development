import { flatten } from '@helpers/js.helper';
import { HighEndCluster, HighEndHost, HighEndDataCenter } from '@models/high-end';

export class HighEndEnvironment {
  constructor(
    public dataCenters: HighEndDataCenter[],
    public date: string
  ) {
    this.sortMembers();
  }

  get clusters(): HighEndCluster[] {
    const clusters = flatten(this.dataCenters.map(dataCenter => dataCenter.listaClusterDistribuido));
    return clusters;
  }

  get hosts(): HighEndHost[] {
    const hosts = flatten(this.dataCenters.map(dataCenter => dataCenter.hosts));
    return hosts;
  }

  private sortMembers() {
    if (!!this.dataCenters && this.dataCenters.length > 0) {
      this.dataCenters.sort((a, b) => a.codigoEnum - b.codigoEnum);
      this.dataCenters.forEach(dataCenter => {
        dataCenter.listaClusterDistribuido.sort((a, b) => a.nome.localeCompare(b.nome));
        dataCenter.listaClusterDistribuido.forEach(cluster => {
          cluster.listaServidorFisico.sort((a, b) => a.nome.localeCompare(b.nome));
        });
      });
    }
  }
}
