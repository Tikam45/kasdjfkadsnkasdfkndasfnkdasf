import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await fetch(
            "https://api.cloudflare.com/client/v4/accounts/49ec3b98dac5f81ba729f8283f7ad51d/ai/run/@cf/meta/llama-3-8b-instruct",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.CLOUDFLARE_AI_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert coding assistant who generates the best sql queries. Help the user in the best possible manner . You many be given instructions on what to generate, which you should follow. You should generate code that is correct, efficient, and follows best practices. You should also generate code that is clear and easy to read."
                        },
                        {
                            role: "user",
                            content: `The instruction is${body}. Just give the query and nothing else. Remove the ending commas or other unnecessary things. This is directly to be used in code`,
                        }
                    ]
                }),
            }
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching data", error },
            { status: 500 }
        );
    }
}
