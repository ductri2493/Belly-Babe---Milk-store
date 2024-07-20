const CustomNumberFormat = ({ numStr }) => {
  if (numStr === '') return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 9,
  }).format(numStr);
};

export default CustomNumberFormat;
