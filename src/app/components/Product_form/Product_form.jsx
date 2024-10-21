import React, { useState } from 'react';
import './Product_form.scss';

const Product_form = ({isProductFormVisible, setIsProductFormVisible}) => {

  const closeForm = () => {
    setIsProductFormVisible(false); 
    
  };

  return (
    <>
    {isProductFormVisible && ( 
    <div className="Product">
         
        <div className="Product_form">
          <div className="Product_form_container">
            <div className="Product_form_container_title">
              <h1>Product Complaint Form</h1>
              <button id="close_btn" onClick={closeForm}>
                <i className="ri-close-line"></i>
              </button>
              <label htmlFor="">Product Name</label>
              <input type="text" placeholder="Enter Product Name" />
              <div className="Product_form_container_dropdown">
                <label htmlFor="productType">Product Type</label>
                <select id="productType" name="productType">
                  <option value="">Select Product Type</option>
                  <option value="laptop">Laptop</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>
              <label htmlFor="">Product Description</label>
              <textarea placeholder="Enter Product Description" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
      )}
  
    </>
  );
};

export default Product_form;
