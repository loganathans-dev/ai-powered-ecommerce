const formatProduct = (doc) => {
  const p = doc.toObject ? doc.toObject() : { ...doc };
  const { _id, __v, productId, ...rest } = p;
  return { id: productId, ...rest };
};

const formatOrder = (doc) => {
  const o = doc.toObject ? doc.toObject() : { ...doc };
  const items = o.items || [];
  return {
    id: o.orderId,
    date: o.date,
    status: o.status,
    total: o.total,
    customer: o.customer,
    customerEmail: o.customerEmail,
    address: o.address,
    paymentStatus: o.paymentStatus,
    items,
    productName: items.map((item) => item.name).join(', '),
  };
};

const formatUser = (user) => ({
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  addresses: user.addresses || [],
  role: user.role,
});

module.exports = { formatProduct, formatOrder, formatUser };
