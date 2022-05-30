import { deserializeArray } from '@helpers/ts.helper';
import { Deserializable } from '@models/common';
import { HighEndGuest } from '@models/high-end/high-end-guest.model';
import { IPAddress, Vlan } from '@models/map-common';

export class HighEndHost implements Deserializable {
  'id': number;
  'nome': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'dataCenter': string;
  'memoria': number;
  'qtdCores': number;
  'serial': string;
  'sistemaOperacional': string;
  'versao': string;
  'build': string;
  'connectionStatus': string;
  'powerStatus': string;
  'vendor': string;
  'modelo': string;
  'qtdServidoresVirtuais': number;
  'listaServidorVirtual': HighEndGuest[];
  'listaVlan': Vlan[];
  'listaEnderecoIP': IPAddress[];

  deserialize(source: any): this {
    Object.assign(this, source);

    const listTypes: Record<string, new() => Deserializable> = {
      'listaServidorVirtual': HighEndGuest,
      'listaVlan': Vlan,
      'listaEnderecoIP': IPAddress
    };

    for (const key of Object.keys(listTypes)) {
      this[key] = deserializeArray(source, key, listTypes[key]);
    }

    return this;
  }
}
