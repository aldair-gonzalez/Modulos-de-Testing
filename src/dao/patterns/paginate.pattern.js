export class Paginate {
  constructor (docs, hasPrevPage, hasNextPage, limit, page, pagingCounter, prevPage, nextPage, totalDocs, totalPages) {
    this.docs = docs // array
    this.hasPrevPage = hasPrevPage // boolean
    this.hasNextPage = hasNextPage // boolean
    this.limit = limit // number
    this.page = page // number
    this.pagingCounter = pagingCounter // number
    this.prevPage = prevPage // null
    this.nextPage = nextPage // null
    this.totalDocs = totalDocs // number
    this.totalPages = totalPages // number
  }
}
