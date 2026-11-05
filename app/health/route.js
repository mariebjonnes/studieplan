export function GET() {
    const environment = process.env.APP_ENV || "development";
    console.info("INFO: Health check ok");
    return Response.json({ status: "ok", environment });
}