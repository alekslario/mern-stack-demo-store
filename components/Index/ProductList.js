import { Card } from "semantic-ui-react";
///c_fill,h_250,w_250/
function ProductList({ products }) {
  function mapProductsToItems(products) {
    return products.map(({ _id, price, mediaUrl, name }) => ({
      header: name,
      image: mediaUrl.small,
      meta: `$${price}`,
      color: "teal",
      fluid: true,
      childKey: _id,
      href: `/product?_id=${_id}`
    }));
  }

  return (
    <Card.Group
      stackable
      itemsPerRow="3"
      centered
      items={mapProductsToItems(products)}
    />
  );
}

export default ProductList;
