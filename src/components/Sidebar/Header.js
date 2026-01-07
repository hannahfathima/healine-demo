import { AnimatePresence } from 'framer-motion';
import React from 'react'
import { BiAnalyse, BiSearch } from "react-icons/bi";
import { motion } from "framer-motion";

const Header = () => {
    const inputAnimation = {
        hidden: {
          width: 0,
          padding: 0,
          transition: {
            duration: 0.2,
          },
        },
        show: {
          width: "140px",
          padding: "5px 15px",
          transition: {
            duration: 0.2,
          },
        },
      };
  return (
    <div style={{width:"100%", background:"#ffffff", height:"60px", borderBottom:"1px solid lightgray", marginBottom:"7px", display:"flex", justifyContent:"space-between"}}>
        <div className="search">
            <div className="search_icon">
              <BiSearch />
            </div>
            <AnimatePresence>
              {/* {isOpen && ( */}
                <motion.input
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={inputAnimation}
                  type="text"
                  placeholder="Search"
                />
              {/* )} */}
            </AnimatePresence>
        </div>
        <div>
            <img style={{width:"50px", height:"50px", borderRadius:"50%"}} src={"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}/>
        </div>
    </div>
  )
}

export default Header