import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // ES 2015
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // ES 2015
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isSameOrAfter);

dayjs.extend(isSameOrBefore);

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);
dayjs.extend(minMax);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(dayOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

export const datetime = dayjs;
