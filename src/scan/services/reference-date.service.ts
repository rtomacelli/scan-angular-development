import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { toISODateString } from '@helpers/js.helper';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDateService {

  readonly minimumDate = this.getOffsetDate(environment.minimumDateOffset);
  readonly defaultDate = this.getOffsetDate(environment.defaultDateOffset);
  readonly maximumDate = this.getOffsetDate(environment.maximumDateOffset);

  readonly minimumDateString = toISODateString(this.minimumDate);
  readonly defaultDateString = toISODateString(this.defaultDate);
  readonly maximumDateString = toISODateString(this.maximumDate);

  private referenceDate = new BehaviorSubject<Date>(this.defaultDate);

  get referenceDateString(): string {
    return toISODateString(this.referenceDate.getValue());
  }

  constructor() { }

  /**
   * Sets the new reference date.
   *
   * @param {Date} date The new reference date.
   * @memberof ReferenceDateService
   */
  setReferenceDate(date: Date) {
    this.referenceDate.next(date);
  }

  /**
   * Resets the reference date to the default date.
   *
   * @memberof ReferenceDateService
   */
  resetReferenceDate() {
    this.referenceDate.next(this.defaultDate);
  }

  /**
   * Retrieves the current reference date.
   *
   * @returns {Observable<Date>} An `Observable` of the current reference date.
   * @memberof ReferenceDateService
   */
  getReferenceDate(): Observable<Date> {
    return this.referenceDate.asObservable();
  }

  /**
   * Calculates a date based on an offset to the current date.
   *
   * @private
   * @param {number} offset A relative offset in days.
   * @returns {Date} The calculated `Date`.
   * @memberof ReferenceDateService
   */
  private getOffsetDate(offset: number): Date {
    return new Date(new Date().setDate(new Date().getDate() - offset));
  }

}
