import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const BACKEND_URL =
    process.env.BACKEND_URL ||
    "https://fraudshield-api-293460116750.us-west4.run.app";

  try {
    const { searchParams } = new URL(request.url);
    const msg = searchParams.get("msg");
    const idagente = searchParams.get("idagente");

    if (!msg) {
      return NextResponse.json(
        { error: "Parámetro 'msg' requerido" },
        { status: 400 }
      );
    }

    const url = `${BACKEND_URL}/agent?msg=${encodeURIComponent(
      msg
    )}&idagente=${encodeURIComponent(idagente || "default")}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error conectando con el backend", details: message },
      { status: 500 }
    );
  }
}
