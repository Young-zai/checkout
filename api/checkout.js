
const ShopifyBuy = require('./index.umd.min.js')
export default async function handler(req, res) {
  // 添加 CORS 头信息
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const client = ShopifyBuy.buildClient({
      domain: process.env.SHOP_DOMAIN,
      storefrontAccessToken: process.env.storefront_ACCESS_TOKEN
    });

    try {
      const checkout = await client.checkout.create();
      const lineItemsToAdd = req.body.products.map(product => ({
        variantId: Buffer.from(`gid://shopify/ProductVariant/${product.id}`).toString('base64'),
        quantity: product.quantity
      }));

      await client.checkout.addLineItems(checkout.id, lineItemsToAdd);
      res.status(200).json({ checkoutUrl: checkout.webUrl });
    } catch (error) {
      res.status(500).json({ error: 'Checkout creation failed.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
