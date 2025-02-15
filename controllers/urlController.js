const Url = require('../models/Url');
const Click = require('../models/Clicks');
const qrcode = require('qrcode');
// const { nanoid } = require('nanoid');

// Function to generate a unique short URL
const generateUniqueSlug = async () => {
  const { nanoid } = await import('nanoid'); // Dynamically import nanoid
  let slug;
  let existingUrl;

  do {
    slug = nanoid(6);
    existingUrl = await Url.findOne({ slug });
  } while (existingUrl);

  return slug;
};


// Function to get location data from IP
const getLocationFromIP = async (ip) => {
  try {
    if (ip === "127.0.0.1" || ip === "::1") {
      return "Localhost"; // Handle local requests
    }
    
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    
    return data.status === "success" ? `${data.city}, ${data.country}` : "Unknown";
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Unknown";
  }
};

// Function to create a short URL and QR code
exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const {userId} = req.user; // Extract user ID from token

    // Generate a unique slug
    const slug = await generateUniqueSlug();
    const customUrl = `${process.env.CLIENT_URI}/${slug}`;

    // Generate QR code
    const qrCode = await qrcode.toDataURL(customUrl);

    // Save URL to database
    const newUrl = new Url({ userID: userId, originalUrl, slug, qrCode });
    await newUrl.save();

    res.status(201).json({ slug, qrCode });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to redirect to the original URL and track analytics
exports.redirectToOriginalUrl = async (req, res) => {
  try {
    const slug = req.params.shortUrl;
    const url = await Url.findOne({ slug });

    if (!url || url.isDeleted) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Extract user information
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Simple device and browser detection (better method: use `ua-parser-js`)
    let device = "Unknown";
    let browser = "Unknown";

    if (userAgent.includes("Mobile")) device = "Mobile";
    else if (userAgent.includes("Tablet")) device = "Tablet";
    else device = "Desktop";

    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";

    // Get user location from IP
    const location = await getLocationFromIP(ipAddress);

    // Save click event to the database
    const click = new Click({
      urlId: url._id,
      ipAddress,
      location,
      device,
      browser
    });

    await click.save();

    // Increment click count
    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const {userId} = req.user; // Extract user ID from token
    const urls = await Url.find({ userID: userId , isDeleted : false }).select("_id originalUrl slug clicks createdAt");

    if (!urls.length) {
      return res.status(404).json({ message: "No URLs found for this user." });
    }

    res.status(200).json({ urls });
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUserUrl = async (req,res) => {
  try{
    const slug = req.params.shortUrl;
    const url = await Url.findOne({ slug });;
    console.log(url)
    if(!url) return res.status(404).json({messsage: "Url not found"});

    url.isDeleted = true;
    await url.save();

    return res.status(201).json({message: "Url delete successfully"});
  }catch(err){
    return res.status(500).json({message : "Internal Server Error"});
  }
}