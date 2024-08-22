"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios"; // Đảm bảo đã import axios

interface Product {
  id: number;
  productName: string;
  price: number;
  img: string;
  quantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({
    id: 0,
    productName: "",
    price: 0,
    img: "",
    quantity: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/allProduct");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" ? parseFloat(value) : value,
    }));
  };

  const handleAddOrUpdate = async () => {
    const productData = {
      ...formData,
      quantity: +formData.quantity,
      price: +formData.price,
    };
    if (selectedProduct) {
      const updatedProduct = {
        ...formData,
        id: formData.id,
        quantity: +formData.quantity,
        price: +formData.price,
      };

      setProducts((prev) =>
        prev.map((item) => (item.id === formData.id ? updatedProduct : item))
      );
      console.log(updatedProduct);
      try {
        await axios.put(`/api/updateProduct/${selectedProduct.id}`, formData);
        fetchProducts();
        resetForm();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      try {
        await axios.post("/api/products", formData);
        setProducts((prev) => [
          ...prev,
          { ...productData, id: prev.length + 1 },
        ]);
        resetForm();
      } catch (error) {
        console.error("Error adding product:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data);
        }
      }
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await axios.delete(`/api/deleteProduct?id=${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({ id: 0, productName: "", price: 0, img: "", quantity: 0 });
  };

  return (
    <main>
      <h1 className="text-2xl mb-4">
        {selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
      </h1>
      <div className="mb-4">
        <input
          type="text"
          name="productName"
          placeholder="Tên sản phẩm"
          value={formData.productName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Giá"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="img"
          placeholder="URL Hình ảnh"
          value={formData.img}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Số lượng"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <Button onClick={handleAddOrUpdate}>
          {selectedProduct ? "Cập nhật" : "Thêm"}
        </Button>
        <Button variant="destructive" onClick={resetForm}>
          Hủy
        </Button>
      </div>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">STT</TableHead>
            <TableHead className="w-[100px]">Tên sản phẩm</TableHead>
            <TableHead>Hình ảnh</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Chức năng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{product.productName}</TableCell>
              <TableCell>
                <img
                  className="h-[60px] rounded-[5px]"
                  src={product.img}
                  alt={product.productName}
                />
              </TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(product)}>Chỉnh sửa</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
