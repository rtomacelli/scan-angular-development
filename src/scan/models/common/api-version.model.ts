import { Deserializable } from './deserializable.model';

export class APIVersion implements Deserializable {
  'name': string;
  'version': string;
  'time': string;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
