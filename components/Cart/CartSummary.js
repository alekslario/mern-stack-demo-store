import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Button, Segment, Divider } from "semantic-ui-react";
import calculateCartTotal from "../../utils/calculateCartTotal";

const CartSummary = ({ products, handleCheckout, success }) => {
  const [{ cartTotal, stripeTotal, isCartEmpty }, setState] = React.useState({
    cartTotal: 0,
    stripeTotal: 0,
    isCartEmpty: false
  });

  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setState({ cartTotal, stripeTotal, isCartEmpty: products.length === 0 });
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub total:</strong> ${cartTotal}
        <StripeCheckout
          name="Mern-stack-demo-store"
          amount={stripeTotal}
          image={products.length > 0 ? products[0].product.mediaUrl.small : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
          token={handleCheckout}
          triggerEvent="onClick"
        >
          <Button
            icon="cart"
            disabled={isCartEmpty || success}
            color="teal"
            floated="right"
            content="Checkout"
          />
        </StripeCheckout>
      </Segment>
    </>
  );
};

export default CartSummary;
