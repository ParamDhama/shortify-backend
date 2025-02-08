

const isValidPassword = async(password) =>{
    passwordRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  






const handleCreateUser = async(req,res) => {
    try{
        const {name,email,password} = req.body;

        // Check Credintials 
        if(!name || !email || !password) return res.status(400).json({error : "Invalid Credintial"});

        //Check validity of password
        if(!isValidPassword(password)){
            return res.status(400).json({message: "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character." });
        }

        // Check is user already exist or not 
        if(await User.findOne({email})) return res.status(400).json({message: "Email already in use"});

        // Hash the password
        const salt = await bcrypt.genSalt(20);
        const hashedPassoword = await bcrypt.hash(passowrd,salt);

        // Generate Verification token
        const verificationToken = createRandomString(6);



        // create and save user 
        const newUser = new User({
            name,
            email,
            password : hashedPassoword,
            verificationToken:"123"
        });
        await newUser.save();

        // 6️⃣ Send Verification Email
    const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
    await sendEmail(email, "Verify Your Email", 
      `<h3>Click the link below to verify your email:</h3>
       <a href="${verificationLink}">${verificationLink}</a>`
    );

    res.status(201).json({ message: "User registered! Check your email to verify your account." });

    }
    catch(error){
        console.log("Error : "+error);
        res.status(500).json({message : "Internal server error"});
    }

}

const handleVerification = async(req,res) => {
    try{
        const user = await User.findOne({verificationToken : req.params.token});
        
        if(!user) return res.status(400).json({message: "Invalid or expire verification token"});

        user.isverified = true;
        user.verificationToken = null;

        await user.save();

        res.json({ message: "Email verified successfully! You can now log in." });

    }catch( err ){
        console.log("Error "+err);
        res.status(500).json({message: "Internal server error"});
    }
}


