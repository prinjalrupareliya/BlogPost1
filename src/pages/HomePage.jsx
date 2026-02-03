 import { useEffect } from "react";
import React, { useContext, useState } from "react";
import  Card  from "../component/Card";
import ConfirmationModal from "../component/ConfirmationModel";
import { useNavigate } from "react-router-dom";
import Snowfall from 'react-snowfall'
import { BiArrowFromBottom } from "react-icons/bi";
import ModeContext from "../Context/ModeContext";


export function HomePage() {
  const [allPostData,setAllPostData] = useState(JSON.parse(localStorage.getItem("postData")) || []);
  const [showModal,setShowModal] = useState(false);
  const [selectedIndex,setSelectedIndex] = useState(null);
  const navigate = useNavigate();
  const ctx = useContext(ModeContext) 

  const openDeleteModel=(index)=>{
    console.log(index,"Index")
    setSelectedIndex(index);
    setShowModal(true);
  };
  const clickHandler =(id) =>{
    navigate(`/posts/${id}`);
  };
  const scrolltosection = (id)=>{
    const element = document.getElementById(id);
  if(element){
    element.scrollIntoView({behavior:'smooth'})
  }
};
  const confirmDelete=()=>{
    const updatePostData=allPostData.filter((_, i) => i !== selectedIndex);
    console.log(updatePostData,"UpdatedData")
    setAllPostData(updatePostData);
    localStorage.setItem("postData",JSON.stringify(updatePostData));
    setShowModal(false);
  };
  
   const handleEdit =(id) =>{
    console.log({id});
    //pass data from one page to another page
    navigate("/new-post", {state: {id}});
   }
 
  return (
    <>
    <div className = {`container-home ${ctx.mode}`}>
    <span id="top"></span>
      <h1>Created Post</h1>
      <div className = {`container ${ctx.mode}`}>
        {allPostData.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          allPostData.map((item, index) => (
              console.log("item",item),
              <Card 
                key={index} 
                title={item.title} 
                desc={item.body} 
                image={item.image}
                onDelete={() => openDeleteModel(index)}
                onRedirect={() => clickHandler(item.id)}
                onEdit={()=>handleEdit(item.id)}
              />
          ))
        )}
      <BiArrowFromBottom />  
      </div>
      </div>
      {showModal && (
        <ConfirmationModal
          title="Delete Post"
          desc="Are you sure you want to delete this post? This action cannot be done."
          onConfirm={confirmDelete}
          onClose={() => setShowModal(false)}
          confirmBtnText="Delete"
        />
      )}
      <Snowfall color="#7e6fa3" snowflakeCount={700} speed={[0.12,0.6]}/>
    </>
  );
}
