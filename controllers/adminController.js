const User = require("../models/User");
const Url = require("../models/Url");
const Clicks = require("../models/Clicks");

const handleGetUsers = async (req, res) => {
    try {
      // Fetch only required fields & exclude password
      const users = await User.find().select("_id name email role status isVerified createdAt");
  
      if (users.length === 0) {
        return res.status(404).json({ error: "No users found" });
      }
  
      return res.status(200).json({
        message: "Users retrieved successfully",
        users, // Sends the filtered user data
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
const handleUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!userId || !role) return res.status(400).json({ message: "Invalid credintial" });

        const user = await User.findOne({ _id: userId });

        if (!user) return res.status(404).json({ messsage: "User not found" });

        user.role = role;

        await user.save();
        return res.status(201).json({ message: "Role change successfully" });
    }
    catch (err) {
        console.log("Error : "+err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
const handleGetUrlByUser = async (req, res) =>{
  try{
    const {user} = req.params;
    const urls = await Url.find({ userID: user , isDeleted : false }).select("_id originalUrl slug clicks createdAt");
    if(!urls.length) return res.status(404).json({message : "No urls found"});

    return res.status(200).json({message: 'Urls retrieved successfully', urls});

  }catch(err){
    console.log("Error :"+err);
    return res.status(500).json({message: "Internal Server Error"});
  }
}

const handleGetDeletedUrl = async(req,res) => {
  try{
    const users = {}
    const urls = await Url.find({isDeleted : true}).select("_id userID originalUrl slug clicks createdAt");
    if(!urls.length) return res.status(404).json({message: "No urls found"});
    for(let url of urls) {
      if(!users[url.userID]) {
        const user = await User.findById(url.userID).select("name email");
        users[url.userID] = user;
      }      
    }
    const data = []
    for (let userID of Object.keys(users)) {
      console.log(userID); // This will log actual user IDs
      data.push({
        user: users[userID], // Correctly fetch user object
        urls: urls.filter(url => url.userID == userID) // Match userID correctly
      });
    }
    return res.status(204).json({message: 'Urls retrieved successfully',data : data});
  }
  catch(err){
    console.log("Error :"+err);
    return res.status(500).json({message: "Internal Server Error"});
  }
}

const handleUserBan = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.status = user.status === "banned" ? "active" : "banned";
        await user.save();

        res.status(202).json({ message: `User ${user.name} is now ${user.status}.` });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const handleUserDelete = async(req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const urls = await Url.find({ userID: user._id });
        if (urls.length) { 
            await Url.deleteMany({ userID: user._id });
            await Clicks.deleteMany({ urlId: { $in: urls.map((url) => url._id) } });
        }
    
        res.status(204).json({ message: `User ${user.name} has been deleted.` });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error"});
      }
}

const handleRestoreUrl = async(req,res) => {
    try{
    const {slug} = req.body;
    const url = await Url.findOne({slug : slug});
    
    if(!url) return res.status(404).json({message : "url not found"});

    url.isDeleted = false;

    await url.save();
    console.log(url)
    res.status(202).json({message : "Restore successfully"});
    }
    catch(err){
        console.log("Error : "+err);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

const handleUrlDelete = async(req,res) => {
    try {
        const {slug} = req.body;
        
        if(!slug.length) return res.status(400).json({message : "Invaid slug"});

        const url = await Url.findOne({slug : slug});

        if(!url) return res.status(404).json({message : "Url not found"});
      console.log(url);
      
        await Clicks.deleteMany({urlId : url._id});
        await Url.deleteMany({slug : slug});

        return res.status(204).json({message: "Url delete successfully"});
    } catch (error) {
        console.log("Error : " +error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

// ✅ Get All Click Data (Admin Access)
const handleGetAllClicks = async (req, res) => {
    try {
      // Fetch all click events & populate URL info
      const clicks = await Clicks.find().populate("urlId", "originalUrl slug");
  
      if (!clicks.length) {
        return res.status(404).json({ message: "No click data available." });
      }
  
      res.status(200).json({ totalClicks: clicks.length, clicks });
    } catch (error) {
      console.error("Error fetching all clicks:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

module.exports = {
    handleGetUsers,
    handleGetAllClicks,
    handleGetUrlByUser,
    handleGetDeletedUrl,
    handleUserBan,
    handleUserRole,
    handleUserDelete,
    handleRestoreUrl,
    handleUrlDelete
}