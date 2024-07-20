export const formatDate = (date) => {
    if (!date) return '';
    const orderDate = new Date(date);
    return orderDate.toLocaleString('vi-VN');
};

