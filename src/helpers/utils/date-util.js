import { format as fnsFormat, parseISO as fnsParseISO } from 'date-fns';

export function parseAndFormat(date, format) {
  try {
    const parseDate = fnsParseISO(date);
    return fnsFormat(parseDate, format);
  } catch (err) {
    return date;
  }
}

export function format(date, format) {
  return fnsFormat(date, format);
}

export function parseISO(isoDate) {
  return fnsParseISO(isoDate);
}
