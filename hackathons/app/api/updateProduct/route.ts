import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const filePath = path.join(process.cwd(), "app/dataBase/product.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const foundIndex = products.findIndex(
      (item: { id: number }) => item.id === +id
    );

    const editProduct = await req.json();

    if (foundIndex === -1) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm cần sửa" },
        { status: 404 }
      );
    }

    products[foundIndex] = { ...products[foundIndex], ...editProduct };

    console.log("Updated Products:", products);

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");

    return NextResponse.json({ message: "Sửa sản phẩm thành công" });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Lỗi không thể sửa sản phẩm" },
      { status: 500 }
    );
  }
};
