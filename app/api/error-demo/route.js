export function GET() {
    console.error("ERROR: Something went wrong");
    return Response.json({ error: "Demonstrationsfel"}, { status: 500 });
}