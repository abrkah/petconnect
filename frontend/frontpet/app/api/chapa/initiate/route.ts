// app/api/chapa/initiate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer CHASECK_TEST-0ecNKSDRVB6TgmqDV9JjIoXC9Dclo8mn`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Error contacting Chapa:", err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}
