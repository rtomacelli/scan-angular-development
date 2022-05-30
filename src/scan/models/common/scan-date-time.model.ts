import { ScanDate } from '@models/common/scan-date.model';
import { ScanTime } from '@models/common/scan-time.model';

export class ScanDateTime {

  constructor(
    public date: ScanDate = new ScanDate(),
    public time: ScanTime = new ScanTime()
  ) { }

  static fromISODateTimeString(isoDateTimeString: string): ScanDateTime {
    if (isoDateTimeString) {
      const [date, time] = isoDateTimeString.split('T');
      const [year, month, day] = date.split('-').map(f => parseInt(f, 10));
      const [hours, minutes, seconds] = time.split(':').map(f => parseInt(f, 10));

      return new ScanDateTime(
        new ScanDate(year, month, day),
        new ScanTime(hours, minutes, seconds)
      );
    }
    return new ScanDateTime();
  }

  toDateString(): string { return this.date.toString(); }
  toTimeString(): string { return this.time.toString(); }
  toFullTimeString(): string { return this.time.toFullString(); }
  toString(): string { return [this.date.toString(), this.time.toString()].join(' '); }
  toFullString(): string { return [this.date.toString(), this.time.toFullString()].join(' '); }
  toDate(): Date { return new Date(this.toString()); }

}
