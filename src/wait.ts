export async function wait(deplay: number) {
  return new Promise((resolve) => setTimeout(() => resolve('timeout'), deplay));
}
