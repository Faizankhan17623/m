const mongoose = require('mongoose')
const date = require('date-and-time');
const CreateShow = require('../../models/CreateShow');
const Theatre = require('../../models/Theatres');
const Ticket = require('../../models/ticket');
const Theatrestickets = require('../../models/TheatresTicket')
const USER = require('../../models/user')

// THis is the function that is been created on the route of orgainezer on line no 14
exports.AllotTheatre = async (req, res) => {
    try {
        const ShowId = req.query.ShowId;
        const TheatreId = req.query.TheatreId;
        const userId = req.USER.id;
        const  {TotalTicketsToAllot}  = req.body;

        // console.log("This is the show id",ShowId)
        // console.log("This is the theatre id ",TheatreId)
        // console.log("This is the user id",userId)
        if (!ShowId || !TheatreId || !TotalTicketsToAllot) {
            return res.status(400).json({
                message: "All input fields are required",
                success: false,
            });
        }

        // Check if the show exists
        const ShowFinding = await CreateShow.findOne({_id:ShowId});
        // console.log("This is the show Finding",ShowFinding)
        if (!ShowFinding) {
            return res.status(404).json({
                message: "Show not found. Please check your input.",
                success: false,
            });
        }

        // here we will also check if the ticketts are created for this show 
        const TicketsCheckers = await Ticket.findOne({showid:ShowId})
        if(!TicketsCheckers){
            return res.status(404).json({
                message: "Tickets are not created for this show please go and create ticket",
                success: false,
            });
        }
        // Check if the theatre exists
        const TheatreFinding = await Theatre.findOne({_id:TheatreId});
        // console.log("This is the Theatre Finding",TheatreFinding)
        // const {priceoftheTicket} =TheatreFinding 
        if (!TheatreFinding) {
            return res.status(404).json({
                message: "Theatre not found. Please check your input.",
                success: false,
            });
        }

        // Check if the theatre is already allotted to this show
        // console.log("This is the show id ",ShowId)
        // showAlloted: ShowId,
        const ShowAllottingFinding = await Theatre.findOne({showAlloted: ShowId, _id:TheatreId});
        // console.log("This is the show allotment Finding",ShowAllottingFinding)
        if (ShowAllottingFinding) {
            return res.status(400).json({
                message: "This theatre has already been allotted the show",
                success: false,
            });
        }

        // Fetch the ticket details
        const ticketDetails = await Ticket.findOne({ showid :ShowId });
        // console.log("This is the ticket Detaiald",ticketDetails)
        const {priceoftheticket} = ticketDetails 
        if(ticketDetails.TicketsRemaining === '0'){
            return res.status(404).json({
                message: "The tickets for this show are over to allot to the theatre",
                success: false,
            });
        }
        if (!ticketDetails) {
            return res.status(404).json({
                message: "No ticket details found for the given show",
                success: false,
            });
        }


        // const {TicketsRemaining} = ticketDetails
        // // console.log(TicketsRemaining)
        const TotalRemaining = ticketDetails.TicketsRemaining - TotalTicketsToAllot;
        // console.log(typeof ticketDetails.TicketsRemaining)
        // console.log("we will print all the details of the ticket",ticketDetails)
        // console.log("These are all the tickets that are remaining",ticketDetails.TicketsRemaining)

        if( ShowFinding.VerifiedByTheAdmin === false && ShowFinding.uploaded === true){
            return res.status(400).json({
                message:"you cannot proceed forward because you show is not verified by the user and alos not uploaded",
                success:false
            })
        }


        if(ticketDetails.TicketsRemaining  <  TotalTicketsToAllot  ){
            return res.status(400).json({
                message: "you cannot allote more tickets then created",
                success: false,
            });
        }

        if(ticketDetails.TicketsRemaining === '0' ){
            TotalRemaining += '0'
        }
        if(ticketDetails.TicketsRemaining === '0' ){
            return res.status(400).json({
                message:"The tickets are over",
                success:false
            })
        }
        // Get current timestamp
        const now = new Date();
        const pattern = date.compile('DD/MM/YYYY HH:mm:ss');
        let AllotmentTime = date.format(now, pattern);
        // Update ticket collection
        await Ticket.updateOne(
            { showid: ShowId ,},
            {
                timeofAllotmentofTicket: AllotmentTime,TicketsRemaining: TotalRemaining,
                $push: { allotedToTheatres: TheatreId ,totalTicketsAlloted: TotalTicketsToAllot},
            }
        );
        // Update theatre collection
        await Theatre.updateOne(
            { _id: TheatreId },
            { $push: { showAlloted: ShowId ,ticketsReceived:TotalTicketsToAllot} }
        );
        
        await CreateShow.updateOne({_id:ShowId},{$push:{AllotedToTheNumberOfTheatres:TheatreId}})
        await Theatre.updateOne({_id:TheatreId},{$push:{ticketsReceivedTime:AllotmentTime}});
        await Theatre.updateOne({_id:TheatreId},{$push:{priceoftheTicket:priceoftheticket}})
        await USER.updateOne({_id:TheatreId},{$push:{AllotedNumber:TheatreId}})
        
        console.log("Allotted tickets successfully");

        return res.status(200).json({
            message: "Tickets successfully allotted to the theatre",
            success: true,
            data: {
                TheatreId,
                ShowId,
                TotalTicketsToAllot,
                RemainingTickets: TotalRemaining,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while allotting tickets to the theatre",
            success: false,
        });
    }
};
