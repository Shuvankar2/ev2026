// CSV export utility
export default function downloadCSV(id, history) {
  if (!history?.length) return
  const headers = Object.keys(history[0]).join(',')
  const rows = history.map(t => Object.values(t).join(',')).join('\n')
  const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `mpc_acc_${id}.csv`
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
