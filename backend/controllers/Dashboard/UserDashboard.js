const USER = require('../../models/user')
const Payment = require('../../models/payment')
const CreateShow = require('../../models/CreateShow')
const Theatre = require('../../models/Theatres');

exports.TicketPurchased = async(req,res)=>{
    try {
        const userId = req.USER.id;

        if(!userId){
            return res.status(400).json({message:"User ID not found"});
        }

        const user = await USER.findOne({_id:userId}).populate('Casttaken')

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const paymentId = await Promise.all(
            user.PaymentId.map(async (payment) => {
                    const datas = await Payment.findOne({ _id: payment });
                    
                    if(!datas){
                        return res.status(404).json({message:"Payment not found"});
                    }
    
                    return datas
                })
        )

            if(!paymentId){
                return res.status(404).json({message:"Payment not found"});
            }
            

            const validTickets = paymentId.filter(ticket => ticket !== null);

        if(validTickets.length === 0){
            return res.status(404).json({
                success: false,
                message:"No ticket details found"
            });
        }

            return res.status(200).json({
                message:"Payments found",
                success:true,
                count: validTickets.length,
                data: validTickets
            });

    } catch (error) {
        console.log(error);
        console.log("Error in UserDashboard controller",error.message);
        res.status(500).json({message:"Internal Server Error"});        
    }
}

exports.TicketPurchasedFullDetails = async(req,res)=>{
    try {
        const userId = req.USER.id;

        if(!userId){
            return res.status(400).json({
                success: false,
                message:"User ID not found"
            });
        }

        const user = await USER.findOne({_id:userId}).populate('Casttaken');

        if(!user){
            return res.status(404).json({
                success: false,
                message:"User not found"
            });
        }

        // Use Promise.all to handle async operations
        const ticketDetails = await Promise.all(
            user.PaymentId.map(async (payment) => {
                try {
                    const datas = await Payment.findOne({ _id: payment });
                    if(!datas) return null;

                    const [showDetails, TheatreDetails] = await Promise.all([
                        CreateShow.findOne({_id: datas.showid}),
                        Theatre.findOne({_id: datas.theatreid})
                    ]);

                    if(!showDetails || !TheatreDetails) return null;

                    // Transform ticket categories for better readability
                    const transformedTickets = datas.ticketCategorey.map(ticket => ({
                        category: ticket.categoryName,
                        quantity: ticket.ticketsPurchased,
                        price: ticket.price,
                        totalAmount: parseInt(ticket.price) * parseInt(ticket.ticketsPurchased)
                    }));

                    return {
                        paymentDetails: {
                            ...datas.toObject(),
                            ticketCategorey: transformedTickets
                        },
                        showDetails: showDetails.toObject(),
                        theatreDetails: TheatreDetails.toObject()
                    };
                } catch (error) {
                    console.log("Error processing payment:", payment, error);
                    return null;
                }
            })
        );

        // Filter out null values
        const validTickets = ticketDetails.filter(ticket => ticket !== null);

        if(validTickets.length === 0){
            return res.status(404).json({
                success: false,
                message:"No ticket details found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket details found successfully",
            count: validTickets.length,
            data: validTickets
        });

    } catch (error) {
        console.log("Error in UserDashboard controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });        
    }
}
