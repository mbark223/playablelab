// Minimal API endpoint for the static Replit/Vercel deployment
const channels = [
  {
    id: "meta-1",
    name: "Meta Ads",
    slug: "meta",
    description: "Facebook and Instagram ads",
    specs: {
      fileSize: { max: 2, unit: "MB" },
      dimensions: [
        { width: 1080, height: 1920, aspectRatio: "9:16" },
        { width: 1080, height: 1080, aspectRatio: "1:1" }
      ],
      format: ["HTML5", "Single Index.html"],
      requirements: ["No external resources", "All assets embedded", "Click-through URL support"]
    },
    icon: "facebook",
    color: "bg-blue-600",
    createdAt: new Date().toISOString()
  },
  {
    id: "snapchat-1",
    name: "Snapchat",
    slug: "snapchat",
    description: "Snapchat playable ads",
    specs: {
      fileSize: { max: 4, unit: "MB" },
      dimensions: [{ width: 1080, height: 1920, aspectRatio: "9:16" }],
      format: ["MRAID 2.0", "Playable Ad"],
      requirements: ["MRAID compliant", "Portrait orientation only", "Auto-play support"]
    },
    icon: "ghost",
    color: "bg-yellow-400",
    createdAt: new Date().toISOString()
  },
  {
    id: "dsp-1",
    name: "DSP / Ad Networks",
    slug: "dsp",
    description: "Programmatic ad networks",
    specs: {
      fileSize: { max: 5, unit: "MB" },
      dimensions: [
        { width: 320, height: 480 },
        { width: 768, height: 1024 },
        { width: 1080, height: 1920 }
      ],
      format: ["MRAID 2.0"],
      requirements: ["Multiple size support", "MRAID 2.0 compliance", "Responsive design"]
    },
    icon: "globe",
    color: "bg-purple-600",
    createdAt: new Date().toISOString()
  },
  {
    id: "unity-1",
    name: "Unity / AppLovin",
    slug: "unity",
    description: "Unity Ads and AppLovin",
    specs: {
      fileSize: { max: 5, unit: "MB" },
      dimensions: [
        { width: 1080, height: 1920, aspectRatio: "9:16" },
        { width: 1920, height: 1080, aspectRatio: "16:9" }
      ],
      format: ["MRAID", "Custom Events"],
      requirements: ["Custom event tracking", "Both orientations", "End card support"]
    },
    icon: "smartphone",
    color: "bg-zinc-800",
    createdAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json(channels);
}
