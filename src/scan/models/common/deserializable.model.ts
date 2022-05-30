export interface Deserializable {
  deserialize(source: any): this;
}
