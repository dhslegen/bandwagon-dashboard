export const useApi: typeof useFetch = (request, opts?) => {
  return useFetch(request, {
    ...opts,
    onResponseError(ctx) {
      // 如果调用方传递了 onResponseError，也执行它
      if (opts?.onResponseError) {
        if (Array.isArray(opts.onResponseError)) {
          opts.onResponseError.forEach((fn) => fn(ctx))
        } else if (typeof opts.onResponseError === 'function') {
          opts.onResponseError(ctx)
        }
      }
    },
  })
}
