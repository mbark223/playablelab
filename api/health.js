export default function handler(_req, res) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    platform: process.env.VERCEL ? "vercel" : "replit"
  });
}
