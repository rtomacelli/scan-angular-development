export class ScanDate {

  constructor(
    public year: number = 0,
    public month: number = 0,
    public day: number = 0
  ) { }

  toString(): string {
    return [
      this.year,
      this.month.toString().padStart(2, '0'),
      this.day.toString().padStart(2, '0')
    ].join('-');
  }

}
