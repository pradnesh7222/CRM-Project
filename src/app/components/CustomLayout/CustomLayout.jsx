import React from 'react'

export const CustomLayout = ({children}) => {
  return (
    <div className='layout'>
        <div className='layout_header'>

        </div>
        <div className='layout_section'>
            <div className='layout_section_sidenav'>

            </div>
            <div className='layout_section_content'>
               <div className='layout_section_content_center'>
               {children}
               </div>
            </div>
        </div>
    </div>
  )
}

export default CustomLayout