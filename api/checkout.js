
import ShopifyBuy from '@shopify/buy-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = ShopifyBuy.buildClient({
      domain: process.env.SHOP_DOMAIN,
      storefrontAccessToken: process.env.storefront_ACCESS_TOKEN
    });

    try {
      const checkout = await client.checkout.create();
      const lineItemsToAdd = req.body.products.map(product => ({
        variantId: btoa(`gid://shopify/ProductVariant/${product.id}`),
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
