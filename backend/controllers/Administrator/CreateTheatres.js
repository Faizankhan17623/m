const Theatre  = require('../../models/Theatres')
const {uploadDatatoCloudinary} = require('../../utils/imageUploader')
const lanuages = require('../../models/CreateLanguage')
const date = require('date-and-time')
const USER  = require('../../models/user')
const TheatreCreation = require('../../models/TheatrerRequest')
const Theatres = require('../../models/Theatres')
const Theatrestickets = require('../../models/TheatresTicket')


// Theare is a warning to the theatre that he cannot edit any of his details and he cannot change anything without the authorization of the administrator 
// ya wala jo hain wo admin ko dena hain data input ka leya  hour wo he theatre create karenga y data use kar ke 
// THis is the function which is present in the admin route on line no 49
exports.CreateTheatres = async(req,res)=>{

    try {
        const {name,locationname,locationurl,languagename,theatreformat,TheatreOwner,parking} = req.body
        let theatreImage = req.files.theatreImage
        // console.log("This is the theatre images",theatreImage)

        if(!name || !locationname || !locationurl || !languagename || !theatreformat || !TheatreOwner ||   !parking ){
            return res.status(400).json({
                message:"the input fields are been required",
                success:false
            })
        }

        const OwnerFinding = await USER.findOne({_id:TheatreOwner})

        // console.log(OwnerFinding.theatreCreated)

        if(!OwnerFinding){
            return res.status(400).json({
                message:"The user is not been found or check your inputs",
                success:false
            })
        }


        if(OwnerFinding.theatreCreated){
            return res.status(400).json({
                message:"The user has already created a theatre and cannot create another oneplease check your inputs or youe email id ",
                success:false
            })
        }

        // if(OwnerFinding.)
        if(!req.files || !req.files.theatreImage){
            return res.status(400).json({
                message:"no images uploaded",
                success:false
            })
        }
        const finding = await Theatre.findOne({Theatrename:name})
        if(finding){
            return res.status(400).json({
                message:"The theatre is aready been present pleas take another one",
                success:false
            })
        }

        const locationFinding = await Theatre.findOne({locationname:locationname})


        if(locationFinding){
            return res.status(400).json({
                message:"This location theatre is lalready beeen present",
                successs:false
            })
        }

                        const now = new Date()
                        const pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
                        let ps = date.format(now, pattern);
                        
                                    // const uploadingImage = await uploadDatatoCloudinary(theatreImage,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
                                    const uploadingImage = await Promise.all(
                                        theatreImage.map(async(file)=>{
                                            let ats = await uploadDatatoCloudinary(file,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
                                            // console.log("This is the multiple",ats)
                                            return ats.secure_url
                                        })
                                    )
                                    // console.log("This is th thestre image",theatreImage)

                                    // console.log("This is the uploaded image",uploadingImage)

        const CreateTheatre =  await Theatre.create({
            Theatrename:name,
            locationname:locationname,
            locationurl:locationurl,
            languagesavailable:languagename,
            theatreformat:theatreformat,
            CreationDate:ps,
            locationimagesurl:uploadingImage,
            TheatreOwner:TheatreOwner,
            parking:parking
        }) 


        await USER.updateOne({_id:TheatreOwner},{theatreCreated:CreateTheatre._id})
        // console.log("THis is the theatre that has been creatd",CreateTheatre)
        return res.status(200).json({
            message:"The theatre is been created",
            success:true,
            data:CreateTheatre
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create theatre code",
            success:false
        })
    }
}

// THis is the function which is present in the admin route on line no 46 
// THis is the function which is present in the and also present in the theatrer route on line no 19
exports.GetAllTheatres = async(req,res)=>{
    try {
        const Finding = await Theatre.find()
        if(!Finding){
            return res.status(400),json({
                message:"no theatre are created"
            })
        }

        // console.log(Finding)

        return res.status(200).json({
            message:"These are all the theatres that are been created",
            success:true,
            data:Finding
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the get all theatres code",
            success:false
        })
    }
}

// THis is the function which is present in the admin route on line no 44
// THis is the function which is present in the theatrer route on line no 2
// This will be the route where the person that want to create the theatre on our platform will enter 
exports.TheatreCreationRequest = async(req,res)=>{
    try{
        // Get All the request that have come to create a theatre
        const Finding = await TheatreCreation.find()

        if(!Finding || Finding.length === 0){
            return res.status(400).json({
                message:"There are no request availbe to create Theatre",
                success:false
            })
        }


        return res.status(200).json({
            message:"This is the list that is been availabe to create Theatres",
            success:true,
            data:Finding
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create TheatreCreationRequest code",
            success:false
        })
    }
}

// using this route we will get all the details that the use has provided to us
// /And THis is the only function that will be going to be used as the form input
// This is the function that is going to be used in the route of the theatreer on line no 16
exports.TheatreCreationRequestPassing = async(req,res)=>{
    try{
        const {email,name,locationname,locationurl,typesofseats,Screentypes,languageAvailable,parking} = req.body
        const TheareImages = req.files.TheareImages
        const userid = req.USER.id
        if(!email || !name || !locationname || !locationurl || !typesofseats || !Screentypes||!parking || !languageAvailable ){
            return res.status(404).json({
                message:"The input are been required",
                success:false
            })
        }


        if(!TheareImages || !req.files.TheareImages){
            return res.status({
                message:"The images are been required",
                success:false
            })
        }


        const EmailFinding = await USER.findOne({email:email})

        if(!EmailFinding){
            return res.status(400).json({
                message:"This email is not found please enter the email that you have given to us while careating the theatre account",
                success:false
            })
        }

        const NameFinding = await USER.findOne({userName:name})
        if(NameFinding){
            return res.status(400).json({
                message:"The name is already been taken please take another one",
                success:false
            })
        }



        const TheatreFinding = await Theatre.findOne({Theatrename:locationname})

        if(TheatreFinding){
            return res.status(400).json({
                message:"The theatre in this location is already been taken please choose another one",
                success:false
            })
        }


        let ImageUpload = await Promise.all(
            TheareImages.map(async(data)=>{
                let uploadingImages = await uploadDatatoCloudinary(data,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
                return uploadingImages.secure_url
            })
        )
        const Creation = await TheatreCreation.create({
            email:email,
            username:name,
            locationName:locationname,
            locationurl:locationurl,
            Theatreimages:ImageUpload,
            typesofseatsAvailable:typesofseats,
            movieScreeningType:Screentypes,
            parkingAvailable:parking,
            languagesAvailable:languageAvailable
        })

        await USER.updateOne({_id:userid},{TheatreDataSend:Creation._id})
        
                await Theatres.updateOne({_id:userid},{Owner:Creation._id})
                await Theatrestickets.updateOne({_id:userid},{Owner:Creation._id})
        return res.status(200).json({
            message:"The data is send to the admin to create your theatre",
            success:true,
            data:Creation
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create TheatreCreationRequestPassing code",
            success:false
        })
    }
}