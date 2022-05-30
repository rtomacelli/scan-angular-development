export class ScanTime {

  constructor(
    public hour: number = 0,
    public minute: number = 0,
    public second: number = 0,
    public nano: number = 0
  ) { }

  toString(): string {
    return [
      this.hour.toString().padStart(2, '0'),
      this.minute.toString().padStart(2, '0'),
      this.second.toString().padStart(2, '0')
    ].join(':');
  }

  toFullString(): string { return [this.toString(), this.nano].join('.'); }

}
