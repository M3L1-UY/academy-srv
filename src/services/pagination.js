const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: coursesImgs } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return {
      totalItems,
      coursesImgs,
      totalPages,
      currentPage,
    };
  };
  
  module.exports = {
    getPagingData,
  };
  