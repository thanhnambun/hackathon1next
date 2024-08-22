import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "ID sản phẩm không được cung cấp" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "app/database/product.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const updatedProducts = products.filter(
      (product: { id: number }) => product.id !== parseInt(productId)
    );

    fs.writeFileSync(filePath, JSON.stringify(updatedProducts), "utf8");

    return NextResponse.json(updatedProducts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
