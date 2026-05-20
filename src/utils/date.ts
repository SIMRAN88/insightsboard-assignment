import {
  formatDistanceToNow,
} from 'date-fns';

export function formatRelativeTime(
  date?: string
) {

  const safeDate =
    date
      ? new Date(date)
      : null;

  return (
    safeDate &&
    !isNaN(
      safeDate.getTime()
    )
  )
    ? formatDistanceToNow(
        safeDate,
        {
          addSuffix: true,
        }
      )
    : 'Unknown';

}

export function formatActivityTime(
  value?: string
) {

  if (!value) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  ).format(
    new Date(String(value))
  );

}