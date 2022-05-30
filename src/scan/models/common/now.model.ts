import { ScanDate } from '@models/common/scan-date.model';
import { ScanDateTime } from '@models/common/scan-date-time.model';
import { ScanTime } from '@models/common/scan-time.model';

export const NOW = (): ScanDateTime => {
  const date = new Date;
  return new ScanDateTime(
    new ScanDate(date.getFullYear(), date.getMonth() + 1, date.getDate()),
    new ScanTime(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds() * 1000)
  );
};
