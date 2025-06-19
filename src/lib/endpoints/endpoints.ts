// export const API_BASE_URL = 'http://150.95.82.174:5005';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// export const API_BASE_URL = 'http://apis.elitestars.net';

export const apiEndPoints = {
  user: {
    registration: 'api/v1/user/register',
    updateLatLong: 'api/v1/user/update-latlong',
    profileUpdate: 'api/v1/user/profile/update',
    uploadImage: 'api/v1/user/profile/uploadimage',
    getUserById: 'api/v1/user',
  },
  auth: {
    login: 'api/v1/user/login',
    logout: 'api/v1/user/logout',
    forgotPassword: 'api/v1/forgot-password',
    resetPassword: 'api/v1/reset-password',
    verifyOtp: 'api/v1/verify-otp',
    resendOtp: 'api/v1/resend-otp',
  },
  common: {
    shopList: 'api/v1/shoptype',
    contactInfo: 'api/v1/contactinfo',
    eventList: 'api/v1/event',
    eventDetail: 'api/v1/event',
  },
  shop: {
    registerShop: 'api/v1/shop/merchantShopRegister',
    getShopList: 'api/v1/shop/getall',
    getShopDetail: 'api/v1/shop/show',
  },
  category: {
    categoryList: 'api/v1/categories/getall',
  },
  promotion: {
    promotionList: 'api/v1/promotion',
  },
  product: {
    getCategoryList: 'api/v1/product/categories',
    getProductListByCategory: 'api/v1/product',
    getProductListByMerchantId: 'api/v1/productbymerchant',
    getProductbyId: 'api/v1/product',
    getAllProduct: 'api/v1/product',
    createProduct: 'api/v1/product/store',
    getTrendingProductList: 'api/v1/trending-product',
    getDealOfTheDay: 'api/v1/dealofday-product',
    getNewArrival: 'api/v1/new-arrival-product',
    getProductDetailByMerchant: 'api/v1/productdetailbymerchant',
  },
  merchant: {
    register: 'api/v1/merchant/register',
    registerDriver: 'api/v1/driver/register',
    getDriverListByMerchantId: 'api/v1/driver/getdriverbymerchant',
    assignDriverToOrder: 'api/v1/order/assignDriver',
    getWeeklyChartData: 'api/v1/merchant/getWeeklyOrderDataAmt',
    getMerchantWithdrawHistory: 'api/v1/merchant/withdraw',
  },
  discount: {
    createDiscount: 'api/v1/discount/store',
  },
  payment: {
    addPayment: 'api/v1/payment/store',
    updatePayment: 'api/v1/payment/update',
    getPaymentListByMerchantId: 'api/v1/paymentbymerchant',
    getWalletBalance: 'api/v1/getwalletamount',
    refillWallet: 'api/v1/transactionlog/store',
    getAvailablePaymentList: 'api/v1/paymentbywallet',
    getTransactionList: 'api/v1/transactionlog',
  },
  order: {
    createOrder: 'api/v1/order/createOrder',
    confirmOrder: 'api/v1/order/confirmMerchantOrderItem',
    getOrderList: '',
    getMerchantOrderList: 'api/v1/order/orderbymerchant',
    getOrderNotificationList: 'api/v1/order/notifyorderbymerchant',
    getOrderItemById: 'api/v1/orderitem',
    getOrderListCount: 'api/v1/merchant/home',
    getOrderListbyCustomerId: 'api/v1/order/getorderbystatus',
    getOrderById: 'api/v1/order',
    updateOrderStatus: 'api/v1/orderitem/updatebystatus',
    getOrderItemListByVoucherNo: 'api/v1/getmerchantorderitems',
    getDriverOrderListCount: 'api/v1/driver/driverordercount',
    getDriverOrderList: 'api/v1/driver/home',
    getDriverOrderDetail: 'api/v1/driver/orderdetail',
    updateDeliveryStatus: 'api/v1/orderitem/updatedeliverystatus',
    getDailyCompletedOrderCountByDriverId: 'api/v1/driver/dailyordercount',
    cancelOrderByMerchant: 'api/v1/order/cancelbyuser',
    cancelOrderByDriver: 'api/v1/cancelbydriver',
  },
  coupon: {
    getCouponList: 'api/v1/coupon',
    applyCoupon: 'api/v1/applycoupon',
  },
  exchangeRate: {
    getAllExchangeRate: 'api/v1/exchange-rate',
    getExchangeRateByCurrencyCode: 'api/v1/exchangeratebycurrencycode',
  },
};
