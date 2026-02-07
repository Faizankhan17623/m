const USER = require('../../models/user')
const Theatres = require('../../models/Theatres')
exports.GetAllTheatreDetails = async(req,res)=>{
    try {
       const Finding = await USER.find({usertype:'Theatrer',verified:true});

if(!Finding || Finding.length === 0) {  // Check if array is empty
    return res.status(404).json({ message: "No theatres created" });
}

// Get all theatre IDs from the array of users
const theatreIds = Finding.map(user => user.theatresCreated).flat(); // .flat() in case it's an array of arrays

const TheatreFinding = await Theatres.find({
    _id: {$in: theatreIds},  // Use $in operator with array
    Verified: true,
    status: "Approved"
})

        return res.status(200).json({message:"All theatres",success:true,data:TheatreFinding})
    } catch (error) {
        console.log(error)
        console.log("Error in GetAllTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error"});
    }
}

