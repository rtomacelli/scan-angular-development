export class BarGraphCategory {

  constructor(
    public name: string,
    public description: string,
    public value?: number,
    public type?: 'bytes' | 'number',
    public suffix?: string
  ) {
    this.value = value || 0;
  }

}
