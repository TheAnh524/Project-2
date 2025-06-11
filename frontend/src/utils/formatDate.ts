import { format } from 'date-fns'

export const dateFormatted = (dateStr: string) => {
  const formattedDate = format(dateStr, 'dd/MM/yyyy HH:mm:ss')

  return formattedDate
}
