/**
 * Example component demonstrating API usage patterns
 * This file serves as a reference for how to use the API layer
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../hooks/useStore';
import { vendorAPI } from '../api/vendor.api';
import { productAPI } from '../api/product.api';
import { orderAPI } from '../api/order.api';

// Example: Fetching vendor data
export const VendorExample = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isVendor, vendor: authVendor } = useAuth();

  useEffect(() => {
    if (isVendor() && authVendor?.id) {
      fetchVendorData();
    }
  }, [authVendor]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const vendorData = await vendorAPI.getById(authVendor.id);
      setVendor(vendorData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!vendor) return <div>No vendor data</div>;

  return (
    <div>
      <h2>{vendor.name}</h2>
      <p>{vendor.email}</p>
    </div>
  );
};

// Example: Fetching and displaying products
export const ProductsExample = () => {
  const { currentStore, storeProducts, fetchProducts, isLoading, error } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (currentStore?.id) {
      fetchProducts(currentStore.id);
    }
  }, [currentStore]);

  const handleCategoryFilter = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      await getProductsByCategory(categoryId);
    } else {
      await fetchProducts(currentStore.id);
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <div className="grid grid-cols-3 gap-4">
        {storeProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example: Creating a new product
export const CreateProductExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    storeId: '',
  });
  const [loading, setLoading] = useState(false);
  const { currentStore } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For file uploads, use FormData
      if (e.target.image.files.length > 0) {
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('description', formData.description);
        formDataObj.append('price', formData.price);
        formDataObj.append('storeId', currentStore.id);
        formDataObj.append('image', e.target.image.files[0]);

        await productAPI.add(formDataObj);
      } else {
        // For JSON data
        await productAPI.add({
          ...formData,
          storeId: currentStore.id,
        });
      }

      alert('Product created successfully!');
      // Reset form or redirect
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />
      <input type="file" name="image" />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
};

// Example: Checkout flow
export const CheckoutExample = () => {
  const { items, totalPrice, clearCart, syncWithCheckout } = useCart();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const checkoutData = {
        customerId: user?.id,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice,
        // Add shipping/billing info
      };

      const order = await orderAPI.checkout(checkoutData);
      
      // Sync cart with checkout response
      syncWithCheckout({ clearCart: true });
      
      // Redirect to order confirmation
      alert(`Order #${order.id} created successfully!`);
    } catch (error) {
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div>Total: ${totalPrice}</div>
      <button onClick={handleCheckout} disabled={loading || items.length === 0}>
        {loading ? 'Processing...' : 'Complete Order'}
      </button>
    </div>
  );
};
