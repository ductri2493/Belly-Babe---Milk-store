const generateMerchantAndDestinationId = (customerInfo) => {
  // Logic to generate merchantId and paymentDestinationId
  const merchantId = `MERCHANT_${customerInfo.id}`;
  const paymentDestinationId = `DEST_${customerInfo.id}`;

  return { merchantId, paymentDestinationId };
};

const callPaymentAPI = async (paymentData) => {
  try {
    const response = await fetch('https://api.bellybabe.site/api/Payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const contentType = response.headers.get('content-type');
    let responseData;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Payment API call failed');
      }
    } else {
      responseData = await response.text();
      if (!response.ok) {
        throw new Error(responseData || 'Payment API call failed');
      }
      // Nếu phản hồi không phải JSON, ta giả định nó là URL
      return { paymentUrl: responseData };
    }

    return responseData;
  } catch (error) {
    console.error('Error during payment processing:', error);
    throw error;
  }
};


export { callPaymentAPI, generateMerchantAndDestinationId };