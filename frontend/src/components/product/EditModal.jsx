import axios from 'axios'


function EditModal({handleCloseModal, editProduct, setEditProduct, fetchProductData }) {


  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    const sanitizedValue = value.replace(/\s/g, '');
  
    setEditProduct((prevEditProduct) => ({
      ...prevEditProduct,
      [name]: sanitizedValue,
    }));
  };
  


  const handleUpdateProduct = async (id) => {
    try {
      const response = await axios.put(`https://savdo2026.onrender.com/api/products/${id}`, editProduct);
      if (response.status === 200) {
        handleCloseModal()
        fetchProductData()
        console.log('Product updated successfully');
      } else {
        
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error.message);
    }
  };

    return (
     <div className="container">
      <main className='main-content'>
      <div className="modal_container">
        <form >
          <div className="modal_content p-4">
            <div className="row">
              <div className="col-md-6 col-12">
                <h1>
                  <span style={{ fontSize: "1.2rem" }}> Mahsulotni tahrirlash</span>
                </h1>
              </div>
              <div className="col-md-6 col-12">
                <div className="float-right">
                  <button 
                   onClick={() => handleUpdateProduct(editProduct.id)}
                  type="button" className="btn shadow-sm btn-orange mr-5">
                    O'zgartirish
                  </button>
                  <span 
                  onClick={handleCloseModal}
                  onChange={handleInputChange}
                  className="close">
                    &times;
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
            <div className="col-md-8 col-12">
              <h6 className="text-orange">Mahsulot nomi</h6>
              <div className="card shadow p-5 mt-1 mb-3">
                <div className="mb-3">
                  <label className="form-label w-100">
                    Mahsulot nomi <span className="text-orange">*</span>
                    <input
                      name="productName"
                      type="text"
                      className="form-control"
                      required
                      value={editProduct?.productName || ''}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
  
                <div className="mb-3">
                  <label className="form-label w-100">
                    Turkum
                    <input
                      name="turkum"
                      className="form-control"
                      list="datalistOptions"
                      value={editProduct?.turkum || ''}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>
  
              <h6 className="text-orange">O'lchov birligi</h6>
              <div className="card shadow p-5 mt-1">
                <div className="mb-3">
                  <label className="form-label w-100">
                    O'lchov birligi <span className="text-orange">*</span>
                    <input
                      name="olchovBirligi"
                      value={editProduct?.olchovBirligi || ''}
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      required
                    />
                  </label>
                </div>
  
                <div className="mb-3">
                  <label className="form-label w-100">
                    O'ramlar nomi
                    <input
                      name="oramlarNomi"
                      value={editProduct?.oramlarNomi || ''}
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                    />
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label w-100">
                    O'ramlar soni
                    <input
                      name="oramlarSoni"
                      value={editProduct?.oramlarSoni || ''}
                      onChange={handleInputChange}
                      type="number"
                      className="form-control"
                    />
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label w-100">
                    1 o'ramdagi dona soni
                    <input
                      name="donaPerOram"
                      value={editProduct?.donaPerOram || 1}
                      onChange={handleInputChange}
                      type="number"
                      min="1"
                      className="form-control"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <h6 className="text-orange">Narxi</h6>
              <div className="card shadow p-5 mt-1">
                <div className="mb-3">
                  <label className="form-label w-100">
                    Sotish narxi <span className="text-orange">*</span>
                    <input
                      name="sotishNarxi"
                      value={editProduct?.sotishNarxi || ''}
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      required
                    />
                  </label>
                </div>
  
                <div className="mb-3">
                  <label className="form-label w-100">
                    Ulgurji narxi
                    <input
                      name="ulgurjiNarxi"
                      value={editProduct?.ulgurjiNarxi || ''}
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                    />
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label w-100">
                    Sotib olingan narxi
                    <input
                      name="sotibOlinganNarxi"
                      value={editProduct?.sotibOlinganNarxi || ''}
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                    />
                  </label>
                </div>
              </div>
            </div>
            </div>
          </div>
        </form>
      </div>
      </main>
     </div>
    );
  }
  
  export default EditModal;
  