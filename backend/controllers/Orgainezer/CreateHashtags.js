const hashtags = require('../../models/CreateHashtags')

// Done
// THis is the function that is present in the create show route on line no 12
exports.Createtags = async(req,res)=>{
    try {
        const {tagname} = req.body
        const Finding = await hashtags.findOne({name:tagname})
        if(Finding){
            return res.status(400).json({
                message:"This name is already been taken please take another one",
                success:false
            })
        }
        const Creation = await hashtags.create({name:tagname})
        return res.status(200).json({
            message:"The tag is benn created",
            success:true,
            data:Creation
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create hashtags code ",
            success:false
        })
    }
}
// This is the function that is present in the create show route on line no 13
exports.updateTagsname = async(req,res)=>{
    try{
        const {id,newName} = req.body
        if(!oldname || !newName){
            return res.status(400).json({
                message:"The inputs are been required",
                success:false
            })
        }

        const Finding  = await hashtags.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"There is an error in the update tag name code",
                success:false
            })
        }

        const updating = hashtags.findByIdAndUpdate(id,{name:newName},{new:true})
        return res.status(200).json({
            message:'The hashtags is been updated',
            success:true,
            data:updating
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update tags name code",
            success:false
        })
    }
}
// This is the function that is present in the create show route on line no 14
exports.DeleteTagsname = async(req,res)=>{
    try{
        const id = req.body

        const Finding = await hashtags.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"The hashtags is not been found",
                success:false
            })
        }


        const deletion = await hashtags.findByIdAndDelete(id,{new:true})
        return res.status(200).json({
            message:"The hashtags is been deleted",
            success:true,
            data:deletion
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the Delete tags name code",
            success:false
        })
    }
}
// This is the function that is present in the create show route on line no 15
exports.getAlltags = async (req,res)=>{
    try{
         const data = await hashtags.find()
                if(!data){
                    return res.status(400).json({
                        message:"no cast is been created till now",
                        success:false
                    })
                }
                return res.status(200).json({
                    message:"This is the whole cast data",
                    success:true,
                    data:data
                })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the get all tags code",
            success:false
        })
    }
}

// THis is the function that is present in the create show route on line no 16
exports.SearchTags = async (req,res)=>{
    try {
        const name = req.body
        if(!name){
            return res.status(400).json({
                message:"The input name is been required",
                success:false
            })
        }
        const Finding = await hashtags.find({name:name})
        if(!Finding){
            return res.status(400).json({
                message:"The tag is not been found",
                success:false
            })
        }

        return res.status(200).json({
            message:"The tag name is been found",
            success:true,
            data:Finding
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the search tags code",
            success:false
        })
    }
}