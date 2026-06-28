export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

export function getDaysUntilDue(dueDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dueDateStr);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isDueSoon(dueDateStr: string, days: number = 3): boolean {
  const daysUntilDue = getDaysUntilDue(dueDateStr);
  return daysUntilDue >= 0 && daysUntilDue <= days;
}

export function isOverdue(dueDateStr: string): boolean {
  return getDaysUntilDue(dueDateStr) < 0;
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    available: '可借',
    borrowed: '在借',
    returned: '已归还',
    reserved: '已预约'
  };
  return statusMap[status] || status;
}

export function getStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    available: 'tag-available',
    borrowed: 'tag-borrowed',
    returned: 'tag-available',
    reserved: 'tag-borrowed'
  };
  return classMap[status] || '';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
