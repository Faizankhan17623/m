import { createSlice } from "@reduxjs/toolkit";


const intinialState = {
    show:[],
    loading:false,
    allshows:[],
}

const showSlice = createSlice({
    name:"Show",
    initialState:intinialState,
    reducers:{
        setShow:(state,value)=>{
            state.show = value.payload
        },
        setlaoding:(state,value)=>{
            state.loading = value.payload
        },
        setallShow:(state,value)=>{
            state.allshows = value.payload
        },
    }
})


export const {setShow,setlaoding,setallShow} = showSlice.actions
export default showSlice.reducer