import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "app/dataBase/product.json");
    const data = fs.readFileSync(filePath, "utf8");
    const product = JSON.parse(data);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(error);
  }
}
