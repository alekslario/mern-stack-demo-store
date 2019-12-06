import React from "react";
import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon,
  Item
} from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  mediaL: "",
  mediaM: "",
  mediaS: "",
  description: ""
};

function CreateProduct() {
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState({
    mediaL: "",
    mediaM: "",
    mediaS: ""
  });
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const isProduct = Object.values(product).every(el => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  function handleChange(event) {
    const { name, value, files } = event.target;
    if (name.includes("media")) {
      setProduct(prevState => ({ ...prevState, [name]: files[0] || "" }));
      setMediaPreview(prevState => ({
        ...prevState,
        [name]:
          files.length > 0
            ? window.URL.createObjectURL(files[0])
            : "./static/image.png"
      }));
    } else {
      setProduct(prevState => ({ ...prevState, [name]: value }));
    }
  }

  async function handleImageUpload(media) {
    const data = new FormData();
    data.append("upload_preset", "mern-stack-demo-store");
    data.append("file", media);
    data.append("cloud_name", "alekslario-dzki4zu2h");
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  async function uploadImages() {
    const { mediaL, mediaM, mediaS } = product;
    let [large, medium, small] = await Promise.all([
      handleImageUpload(mediaL),
      handleImageUpload(mediaM),
      handleImageUpload(mediaS)
    ]);
    return { large, medium, small };
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      setError("");
      const mediaUrl = await uploadImages();
      const url = `${baseUrl}/api/product`;
      const { name, price, description } = product;
      const payload = { name, price, description, mediaUrl };
      await axios.post(url, payload);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        <Message error header="Oops!" content={error} />
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
        </Form.Group>
        <Header as="h4" block>
          <Icon name="file image" />
          Media
        </Header>
        <Form.Group widths="equal">
          <Image
            src={mediaPreview.mediaL || "./static/image.png"}
            rounded
            centered
            size="small"
          />
          <Form.Field
            hidden
            control={Input}
            name="mediaL"
            type="file"
            label="XL"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Image
            src={mediaPreview.mediaM || "./static/image.png"}
            rounded
            centered
            size="small"
          />
          <Form.Field
            hidden
            control={Input}
            name="mediaM"
            type="file"
            label="M"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Image
            src={mediaPreview.mediaS || "./static/image.png"}
            rounded
            centered
            size="small"
          />
          <Form.Field
            hidden
            control={Input}
            name="mediaS"
            type="file"
            label="S"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          onChange={handleChange}
          value={product.description}
        />
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
