import { Item, Label, Modal, Image } from "semantic-ui-react";
import AddProductToCart from "./AddProductToCart";

const ProductSummary = ({ name, mediaUrl, _id, price, sku, user }) => {
  return (
    <Item.Group>
      <Item>
        <Modal trigger={<Image size="medium" src={mediaUrl.medium} />}>
          <Modal.Content image>
            <Image wrapped src={mediaUrl.large} />
          </Modal.Content>
        </Modal>

        <Item.Content>
          <Item.Header>{name}</Item.Header>
          <Item.Description>
            <p>${price}</p>
            <Label>SKU: {sku}</Label>
          </Item.Description>
          <Item.Extra>
            <AddProductToCart user={user} productId={_id} />
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};

export default ProductSummary;
