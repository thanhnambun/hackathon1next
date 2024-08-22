import { NextResponse, NextRequest } from "next/server";
import { promises as fs } from "fs"; 
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "app/data/products.json");

    const data = await fs.readFile(filePath, "utf8");
    const products = JSON.parse(data);

    const newProduct = await req.json();

    const newId =
      products.length > 0 ? Math.max(...products.map((p:any) => p.id)) + 1 : 1;
    const productToAdd = { id: newId, ...newProduct };

    products.push(productToAdd);

    await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf8");

    return NextResponse.json({
      message: "Product added successfully",
      product: productToAdd,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
