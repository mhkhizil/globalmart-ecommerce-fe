export function debounce<T extends (...arguments_: any[]) => void>(
  function_: T,
  wait: number
) {
  let timeout: NodeJS.Timeout;
  return function (...arguments_: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => function_(...arguments_), wait);
  };
}
