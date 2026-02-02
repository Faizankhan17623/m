// This is the orgainezer personal route the Things that the org will do will come here
const express = require('express')
const route = express.Router()
const {CreateOrgainezer,OrgaineserLogin,OrgData,DirectorFresher,DirectorExperience,ProducerFresher,ProducerExperience} = require('../controllers/Orgainezer/CreateOrg')
const {auth,IsOrganizer,DF,DE,PF,PE} = require('../middlewares/verification')
const {AllShows} = require('../controllers/common/Showlist')
const {AllotTheatre} = require('../controllers/Orgainezer/Allotment')
const {CreateTicket} = require('../controllers/Orgainezer/CreateTicket')
const {GetAllTheatreDetails} = require("../controllers/Dashboard/OrgainezerDashboard")
// DONE

route.post('/Create-Orgainezer',CreateOrgainezer)
route.post('/Orgainezer-login',OrgaineserLogin)
// DONE

// DONE
route.put("/Create-Ticket",auth,IsOrganizer,CreateTicket)
route.put("/Allot-Theatre",auth,IsOrganizer,AllotTheatre)
route.get("/All-Shows",auth,IsOrganizer,AllShows)
// DONE

// new 
route.get("/Get-All-Theatre-Details",auth,IsOrganizer,GetAllTheatreDetails)
route.post("/Org-Data", auth, IsOrganizer ,OrgData)
route.post("/Dir-Fresh", auth, IsOrganizer, DF, DirectorFresher)
route.post("/Dir-Experience", auth, IsOrganizer, DE, DirectorExperience)
route.post("/Pro-Fresh", auth, IsOrganizer, PF, ProducerFresher)
route.post("/Pro-Expe", auth, IsOrganizer, PE, ProducerExperience)

module.exports = route