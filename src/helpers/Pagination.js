
export const Pagination = {
    currentPage: 1,
    itemsPerPage: 3,
    itemCount: 0,
    totalPages: 1,
    getCurrentStartIndex,
    getCurrentEndIndex,
    goToNextPage,
    goToPrevPage,
    setItemCount,
    setTotalPages

}
function setItemCount(itemCount) {
    Pagination.itemCount = itemCount;
}
function setTotalPages() {
    if(Pagination.itemCount === 0) Pagination.totalPages = 1;
    else Pagination.totalPages = Math.ceil(Pagination.itemCount/ Pagination.itemsPerPage);
}
function getCurrentStartIndex() {
    return Pagination.itemsPerPage * (Pagination.currentPage - 1)
}

function getCurrentEndIndex() {
    return (Pagination.itemsPerPage * Pagination.currentPage) - 1
}

function goToNextPage() {
    if(Pagination.currentPage < Pagination.totalPages) Pagination.currentPage++;
}

function goToPrevPage() {
    if(Pagination.currentPage > 1) Pagination.currentPage--;
}