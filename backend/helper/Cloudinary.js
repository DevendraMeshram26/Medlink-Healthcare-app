const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

async function uploadToCloudinary(filePath){
    try {
        if(!filePath) return null

        const response= await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        })
    
        console.log("File uploaded successfully", response.url);
        return response.url;   
    } catch (error) {
        console.log("error while uploading file",error);

        
    }

}

module.exports = {uploadToCloudinary}